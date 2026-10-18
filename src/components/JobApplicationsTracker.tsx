import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  Building2, 
  User, 
  ExternalLink, 
  Edit2, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  FileText,
  X,
  Send,
  Sparkles
} from 'lucide-react';

export type ApplicationStatus = 'Enviado' | 'Entrevista' | 'Teste técnico' | 'Proposta' | 'Recusado' | 'Sem resposta';

export interface JobApplication {
  id: string;
  company: string;
  role: string;
  jobUrl?: string;
  sentDate: string; // YYYY-MM-DD
  status: ApplicationStatus;
  recruiterName?: string;
  notes?: string;
  lastFollowUpDate?: string;
  createdAt: number;
}

const STORAGE_KEY = 'jobtracker_applications';

const STATUS_OPTIONS: ApplicationStatus[] = [
  'Enviado',
  'Entrevista',
  'Teste técnico',
  'Proposta',
  'Recusado',
  'Sem resposta'
];

const getStatusBadgeStyle = (status: ApplicationStatus) => {
  switch (status) {
    case 'Proposta':
      return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    case 'Entrevista':
      return 'bg-amber-100 text-amber-800 border-amber-300';
    case 'Teste técnico':
      return 'bg-purple-100 text-purple-800 border-purple-300';
    case 'Enviado':
      return 'bg-teal-50 text-[#0F766E] border-[#0F766E]/30';
    case 'Recusado':
      return 'bg-rose-50 text-rose-700 border-rose-200';
    case 'Sem resposta':
    default:
      return 'bg-zinc-100 text-zinc-700 border-zinc-200';
  }
};

export default function JobApplicationsTracker() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [storageError, setStorageError] = useState<string | null>(null);

  // Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [jobUrl, setJobUrl] = useState('');
  const [sentDate, setSentDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [status, setStatus] = useState<ApplicationStatus>('Enviado');
  const [recruiterName, setRecruiterName] = useState('');
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState('');

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('Todos');

  // Deletion modal
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Load from localStorage safely
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setApplications(parsed);
        }
      }
    } catch (err) {
      console.warn('Erro ao carregar candidaturas do localStorage:', err);
      setStorageError('O armazenamento local está indisponível ou em modo restrito. Suas alterações poderão não persistir.');
    }
  }, []);

  // Save to localStorage safely
  const saveApplications = (updatedList: JobApplication[]) => {
    setApplications(updatedList);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
      setStorageError(null);
    } catch (err) {
      console.warn('Erro ao salvar no localStorage:', err);
      setStorageError('Não foi possível gravar no armazenamento do navegador (cota excedida ou navegação restrita).');
    }
  };

  const handleOpenAddForm = () => {
    setEditingId(null);
    setCompany('');
    setRole('');
    setJobUrl('');
    setSentDate(new Date().toISOString().split('T')[0]);
    setStatus('Enviado');
    setRecruiterName('');
    setNotes('');
    setFormError('');
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (app: JobApplication) => {
    setEditingId(app.id);
    setCompany(app.company);
    setRole(app.role);
    setJobUrl(app.jobUrl || '');
    setSentDate(app.sentDate);
    setStatus(app.status);
    setRecruiterName(app.recruiterName || '');
    setNotes(app.notes || '');
    setFormError('');
    setIsFormOpen(true);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.trim() || !role.trim()) {
      setFormError('Por favor, informe a empresa e a vaga.');
      return;
    }

    if (editingId) {
      const updated = applications.map(app => {
        if (app.id === editingId) {
          return {
            ...app,
            company: company.trim(),
            role: role.trim(),
            jobUrl: jobUrl.trim() || undefined,
            sentDate,
            status,
            recruiterName: recruiterName.trim() || undefined,
            notes: notes.trim() || undefined
          };
        }
        return app;
      });
      saveApplications(updated);
    } else {
      const newApp: JobApplication = {
        id: 'app-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
        company: company.trim(),
        role: role.trim(),
        jobUrl: jobUrl.trim() || undefined,
        sentDate,
        status,
        recruiterName: recruiterName.trim() || undefined,
        notes: notes.trim() || undefined,
        createdAt: Date.now()
      };
      saveApplications([newApp, ...applications]);
    }

    setIsFormOpen(false);
  };

  const handleQuickStatusChange = (id: string, newStatus: ApplicationStatus) => {
    const updated = applications.map(app => {
      if (app.id === id) {
        return { ...app, status: newStatus };
      }
      return app;
    });
    saveApplications(updated);
  };

  const handleDelete = (id: string) => {
    const filtered = applications.filter(app => app.id !== id);
    saveApplications(filtered);
    setConfirmDeleteId(null);
  };

  // Metrics
  const totalSent = applications.filter(a => a.status === 'Enviado').length;
  const inInterview = applications.filter(a => a.status === 'Entrevista' || a.status === 'Teste técnico').length;
  const proposals = applications.filter(a => a.status === 'Proposta').length;
  const totalCount = applications.length;

  // Filtered List
  const filteredApps = applications.filter(app => {
    const matchSearch = app.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        app.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        (app.recruiterName && app.recruiterName.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchStatus = statusFilter === 'Todos' || app.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* Storage Warning if unavailable */}
      {storageError && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-[10px] flex items-center gap-2.5 text-xs text-amber-800">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
          <span>{storageError}</span>
        </div>
      )}

      {/* Metric Counters on Top */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 bg-[#FFFBF2] border border-[#E6E1D6] rounded-[12px] flex flex-col justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#4A5565]">Total Enviado</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-extrabold font-display text-[#0F766E]">{totalSent}</span>
            <span className="text-[11px] text-[#5B5E62]">candidaturas</span>
          </div>
        </div>

        <div className="p-3.5 bg-[#FFFBF2] border border-[#E6E1D6] rounded-[12px] flex flex-col justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#4A5565]">Em Entrevista</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-extrabold font-display text-amber-600">{inInterview}</span>
            <span className="text-[11px] text-[#5B5E62]">processos</span>
          </div>
        </div>

        <div className="p-3.5 bg-[#FFFBF2] border border-[#E6E1D6] rounded-[12px] flex flex-col justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#4A5565]">Propostas</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-extrabold font-display text-emerald-600">{proposals}</span>
            <span className="text-[11px] text-[#5B5E62]">recebidas</span>
          </div>
        </div>

        <div className="p-3.5 bg-[#FFFBF2] border border-[#E6E1D6] rounded-[12px] flex flex-col justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#4A5565]">Total Geral</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-extrabold font-display text-[#1B2430]">{totalCount}</span>
            <span className="text-[11px] text-[#5B5E62]">registradas</span>
          </div>
        </div>
      </div>

      {/* Actions & Filters Bar */}
      <div className="bg-[#FFFBF2] border border-[#E6E1D6] p-4 rounded-[12px] flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-2.5 flex-1">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#4A5565]" />
            <input
              type="text"
              placeholder="Buscar por empresa, vaga ou recrutador..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white border border-[#E6E1D6] rounded-full text-xs text-[#1B2430] focus:outline-none focus:border-[#0F766E] transition-colors"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 shrink-0">
            <Filter className="w-3.5 h-3.5 text-[#4A5565] hidden sm:block" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              aria-label="Filtrar por status"
              className="bg-white border border-[#E6E1D6] rounded-full px-3 py-2 text-xs font-semibold text-[#1B2430] focus:outline-none focus:border-[#0F766E] transition-colors"
            >
              <option value="Todos">Todos os Status</option>
              {STATUS_OPTIONS.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Add Application Button */}
        <button
          onClick={handleOpenAddForm}
          className="px-4 py-2 bg-[#0F766E] hover:bg-[#0C5F58] text-white rounded-full text-xs font-bold inline-flex items-center justify-center gap-1.5 transition-transform hover:-translate-y-0.5 cursor-pointer shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Nova Candidatura</span>
        </button>
      </div>

      {/* Modal / Form: Add or Edit */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 bg-[#1B2430]/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-white border border-[#E6E1D6] rounded-[16px] w-full max-w-lg shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 sm:p-5 bg-[#FFFBF2] border-b border-[#E6E1D6] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#0F766E] text-white flex items-center justify-center">
                  <Briefcase className="w-4 h-4" />
                </div>
                <h4 className="font-display font-bold text-base text-[#1B2430]">
                  {editingId ? 'Editar Candidatura' : 'Registrar Nova Candidatura'}
                </h4>
              </div>
              <button
                onClick={() => setIsFormOpen(false)}
                className="p-1.5 text-[#4A5565] hover:text-[#1B2430] hover:bg-[#F1EEE6] rounded-full transition-colors cursor-pointer"
                aria-label="Fechar formulário"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="p-4 sm:p-5 space-y-3.5">
              {formError && (
                <p className="text-xs text-rose-600 bg-rose-50 p-2 rounded-[6px] border border-rose-200 font-medium">
                  {formError}
                </p>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#1B2430] mb-1">
                    Empresa <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Empresa Telecom / Provedor"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-[8px] bg-[#FFFBF2] border border-[#E6E1D6] text-[#1B2430] focus:outline-none focus:border-[#0F766E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1B2430] mb-1">
                    Vaga / Cargo <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Suporte N1/N2, Analista de Redes"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-[8px] bg-[#FFFBF2] border border-[#E6E1D6] text-[#1B2430] focus:outline-none focus:border-[#0F766E]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#1B2430] mb-1">
                    Data de Envio
                  </label>
                  <input
                    type="date"
                    required
                    value={sentDate}
                    onChange={(e) => setSentDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-[8px] bg-[#FFFBF2] border border-[#E6E1D6] text-[#1B2430] focus:outline-none focus:border-[#0F766E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1B2430] mb-1">
                    Status Atual
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as ApplicationStatus)}
                    className="w-full px-3 py-2 text-xs rounded-[8px] bg-[#FFFBF2] border border-[#E6E1D6] text-[#1B2430] focus:outline-none focus:border-[#0F766E]"
                  >
                    {STATUS_OPTIONS.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#1B2430] mb-1">
                    Nome do Contato / Recrutador
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Mariana (Tech Recruiter)"
                    value={recruiterName}
                    onChange={(e) => setRecruiterName(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-[8px] bg-[#FFFBF2] border border-[#E6E1D6] text-[#1B2430] focus:outline-none focus:border-[#0F766E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1B2430] mb-1">
                    Link da Vaga / Anúncio
                  </label>
                  <input
                    type="url"
                    placeholder="https://linkedin.com/jobs/..."
                    value={jobUrl}
                    onChange={(e) => setJobUrl(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-[8px] bg-[#FFFBF2] border border-[#E6E1D6] text-[#1B2430] focus:outline-none focus:border-[#0F766E]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1B2430] mb-1">
                  Observações & Anotações
                </label>
                <textarea
                  rows={2}
                  placeholder="Ex: Pediram foco em OTDR e vivência em chamados de campo..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-[8px] bg-[#FFFBF2] border border-[#E6E1D6] text-[#1B2430] focus:outline-none focus:border-[#0F766E] resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#E6E1D6]">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 rounded-full text-xs font-bold text-[#4A5565] hover:bg-[#F1EEE6] transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0F766E] hover:bg-[#0C5F58] text-white rounded-full text-xs font-bold transition-transform hover:-translate-y-0.5 cursor-pointer shadow-sm"
                >
                  {editingId ? 'Salvar Alterações' : 'Adicionar Candidatura'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 bg-[#1B2430]/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
          <div className="bg-white border border-[#E6E1D6] rounded-[16px] p-5 w-full max-w-sm shadow-xl space-y-4">
            <h5 className="font-display font-bold text-base text-[#1B2430]">
              Confirmar exclusão?
            </h5>
            <p className="text-xs text-[#4A5565] leading-relaxed">
              Tem certeza de que deseja remover esta candidatura da sua lista? Esta ação não pode ser desfeita.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="px-4 py-1.5 text-xs font-bold text-[#4A5565] hover:bg-[#F1EEE6] rounded-full transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(confirmDeleteId)}
                className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-full transition-colors cursor-pointer shadow-xs"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Application Cards List */}
      {filteredApps.length === 0 ? (
        <div className="p-8 text-center bg-[#FFFBF2] border border-[#E6E1D6] rounded-[12px] space-y-3">
          <div className="w-10 h-10 rounded-full bg-white border border-[#E6E1D6] mx-auto flex items-center justify-center text-[#0F766E]">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-bold text-[#1B2430]">Nenhuma candidatura encontrada</p>
            <p className="text-xs text-[#4A5565] mt-0.5">
              {searchQuery || statusFilter !== 'Todos'
                ? 'Tente ajustar sua busca ou filtro de status.'
                : 'Cadastre sua primeira vaga para gerenciar envios e acompanhamentos.'}
            </p>
          </div>
          {!searchQuery && statusFilter === 'Todos' && (
            <button
              onClick={handleOpenAddForm}
              className="px-4 py-2 bg-[#0F766E] text-white rounded-full text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer shadow-sm hover:bg-[#0C5F58]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Registrar Candidatura</span>
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredApps.map((app) => (
            <div
              key={app.id}
              className="bg-white border border-[#E6E1D6] p-4 rounded-[12px] shadow-xs hover:border-[#0F766E] transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3.5"
            >
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h5 className="font-display font-bold text-sm text-[#1B2430] truncate">
                    {app.role}
                  </h5>
                  <span className="text-[#0F766E] font-bold text-xs select-none">•</span>
                  <span className="font-semibold text-xs text-[#1B2430] flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-[#4A5565]" />
                    {app.company}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-[#4A5565]">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#0F766E]" />
                    Enviado em {app.sentDate.split('-').reverse().join('/')}
                  </span>
                  {app.recruiterName && (
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-[#0F766E]" />
                      Contato: {app.recruiterName}
                    </span>
                  )}
                  {app.jobUrl && (
                    <a
                      href={app.jobUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#0F766E] hover:underline inline-flex items-center gap-0.5 font-medium"
                    >
                      <span>Ver Anúncio</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>

                {app.notes && (
                  <p className="text-[11px] text-[#5B5E62] bg-[#FAF9F5] p-2 rounded-[6px] border border-[#E6E1D6] font-mono leading-relaxed mt-1">
                    {app.notes}
                  </p>
                )}
              </div>

              {/* Status and Actions */}
              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-between sm:justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-[#E6E1D6]">
                {/* Fast Status Selector */}
                <select
                  value={app.status}
                  onChange={(e) => handleQuickStatusChange(app.id, e.target.value as ApplicationStatus)}
                  aria-label={`Alterar status de ${app.company}`}
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-full border cursor-pointer focus:outline-none ${getStatusBadgeStyle(app.status)}`}
                >
                  {STATUS_OPTIONS.map(opt => (
                    <option key={opt} value={opt} className="bg-white text-[#1B2430]">{opt}</option>
                  ))}
                </select>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEditForm(app)}
                    aria-label={`Editar candidatura de ${app.company}`}
                    className="p-1.5 text-[#4A5565] hover:text-[#0F766E] hover:bg-[#F1EEE6] rounded-full transition-colors cursor-pointer"
                    title="Editar candidatura"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => setConfirmDeleteId(app.id)}
                    aria-label={`Excluir candidatura de ${app.company}`}
                    className="p-1.5 text-[#4A5565] hover:text-rose-600 hover:bg-rose-50 rounded-full transition-colors cursor-pointer"
                    title="Excluir candidatura"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
