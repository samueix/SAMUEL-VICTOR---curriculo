import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Calendar, 
  Copy, 
  Check, 
  Building2, 
  AlertCircle, 
  Send, 
  CheckCircle2, 
  ExternalLink,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { JobApplication, ApplicationStatus } from './JobApplicationsTracker';
import { PersonalInfo } from '../types';

interface JobFollowUpsProps {
  personalInfo: PersonalInfo;
}

const STORAGE_KEY = 'jobtracker_applications';

export default function JobFollowUps({ personalInfo }: JobFollowUpsProps) {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [copiedAppId, setCopiedAppId] = useState<string | null>(null);
  const [successAppId, setSuccessAppId] = useState<string | null>(null);
  const [storageError, setStorageError] = useState<string | null>(null);

  const loadApplications = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setApplications(parsed);
        }
      }
    } catch (err) {
      console.warn('Erro ao carregar candidaturas no Follow-up:', err);
      setStorageError('Armazenamento local indisponível.');
    }
  };

  useEffect(() => {
    loadApplications();
    const handleStorageChange = () => loadApplications();
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const calculateDaysAgo = (dateStr: string): number => {
    if (!dateStr) return 0;
    const [year, month, day] = dateStr.split('-').map(Number);
    const targetDate = new Date(year, month - 1, day);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const diffTime = today.getTime() - targetDate.getTime();
    return Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));
  };

  const generateFollowUpMessage = (app: JobApplication): string => {
    const recruiterGreeting = app.recruiterName ? ` ${app.recruiterName}` : '';
    const formattedDate = app.sentDate.split('-').reverse().join('/');
    
    return `Olá${recruiterGreeting}! Espero que esteja tendo uma excelente semana.

Estou entrando em contato para acompanhar minha candidatura para a vaga de ${app.role} na ${app.company}, enviada em ${formattedDate}.

Gostaria de reiterar meu forte interesse na oportunidade e minha disponibilidade para contribuir com a equipe, trazendo minha experiência de 5 anos em suporte técnico N1/N2, redes e telecomunicações (equipamentos de rede, instrumentação óptica com OTDR/Power Meter e infraestrutura de fibra óptica).

Fico à inteira disposição para qualquer dúvida ou para o envio de referências complementares. Muito obrigado pela atenção!

Atenciosamente,
${personalInfo.fullName}
${personalInfo.phone} | ${personalInfo.email}
${personalInfo.linkedinUrl || ''}`;
  };

  const handleCopyFollowUp = (app: JobApplication) => {
    const message = generateFollowUpMessage(app);
    navigator.clipboard.writeText(message);
    setCopiedAppId(app.id);
    setTimeout(() => setCopiedAppId(null), 2500);
  };

  const handleMarkAsContacted = (id: string) => {
    const today = new Date().toISOString().split('T')[0];
    const updated = applications.map(app => {
      if (app.id === id) {
        return {
          ...app,
          lastFollowUpDate: today
        };
      }
      return app;
    });

    setApplications(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setSuccessAppId(id);
      setTimeout(() => setSuccessAppId(null), 3000);
    } catch (err) {
      console.warn('Erro ao salvar acompanhamento:', err);
    }
  };

  // Only consider active applications with status "Enviado"
  const sentApplications = applications.filter(a => a.status === 'Enviado');

  // Partition into:
  // 1) Due today (days >= 5)
  // 2) Pending (days < 5)
  const dueFollowUps = sentApplications.filter(app => {
    const referenceDate = app.lastFollowUpDate || app.sentDate;
    return calculateDaysAgo(referenceDate) >= 5;
  });

  const pendingFollowUps = sentApplications.filter(app => {
    const referenceDate = app.lastFollowUpDate || app.sentDate;
    return calculateDaysAgo(referenceDate) < 5;
  });

  return (
    <div className="space-y-6">
      {/* Informative Header Box */}
      <div className="bg-[#FFFBF2] border border-[#E6E1D6] p-5 rounded-[12px] space-y-2">
        <div className="flex items-center gap-2 text-[#0F766E]">
          <Clock className="w-5 h-5" strokeWidth={2.2} />
          <h4 className="font-display font-bold text-base text-[#1B2430]">
            Rastreamento de Acompanhamentos (Follow-up)
          </h4>
        </div>
        <p className="text-xs sm:text-sm text-[#4A5565] leading-relaxed">
          Recrutadores recomendam um contato de acompanhamento após <strong>5 dias úteis</strong> do envio da candidatura para demonstrar proatividade e interesse genuíno. As candidaturas abaixo alcançaram esse prazo e estão prontas para o contato.
        </p>
      </div>

      {storageError && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-[10px] flex items-center gap-2 text-xs text-amber-800">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
          <span>{storageError}</span>
        </div>
      )}

      {/* Due Follow-ups List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h5 className="font-mono text-xs font-bold uppercase tracking-wider text-[#1B2430] flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
            Candidaturas para Acompanhar Hoje ({dueFollowUps.length})
          </h5>
        </div>

        {dueFollowUps.length === 0 ? (
          <div className="p-6 bg-white border border-[#E6E1D6] rounded-[12px] text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-[#0F766E] mx-auto" />
            <p className="font-bold text-sm text-[#1B2430]">
              Tudo em dia!
            </p>
            <p className="text-xs text-[#4A5565] max-w-md mx-auto">
              Nenhuma candidatura com status "Enviado" atingiu 5 dias ou mais sem contato. Quando uma vaga alcançar o prazo, ela aparecerá aqui automaticamente com o modelo de mensagem pronto para copiar.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {dueFollowUps.map(app => {
              const referenceDate = app.lastFollowUpDate || app.sentDate;
              const daysAgo = calculateDaysAgo(referenceDate);
              const isCopied = copiedAppId === app.id;
              const isSuccess = successAppId === app.id;

              return (
                <div 
                  key={app.id}
                  className="bg-white border-2 border-amber-200 rounded-[12px] p-4.5 shadow-xs space-y-3 transition-all hover:border-amber-400"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E6E1D6] pb-2.5">
                    <div>
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-amber-100 text-amber-900 border border-amber-300 mb-1">
                        ⚠️ Acompanhar hoje ({daysAgo} dias sem resposta)
                      </span>
                      <h4 className="font-display font-bold text-base text-[#1B2430] flex items-center gap-1.5">
                        {app.role}
                        <span className="text-xs font-normal text-[#5B5E62]">• {app.company}</span>
                      </h4>
                    </div>

                    <div className="text-right text-[11px] text-[#4A5565] font-mono">
                      <span>Enviado em {app.sentDate.split('-').reverse().join('/')}</span>
                      {app.lastFollowUpDate && (
                        <p className="text-[10px] text-[#0F766E] font-sans">
                          Último contato em {app.lastFollowUpDate.split('-').reverse().join('/')}
                        </p>
                      )}
                    </div>
                  </div>

                  {app.recruiterName && (
                    <p className="text-xs text-[#4A5565]">
                      Recrutador / Contato: <strong className="text-[#1B2430]">{app.recruiterName}</strong>
                    </p>
                  )}

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <button
                      onClick={() => handleCopyFollowUp(app)}
                      aria-label="Copiar mensagem de acompanhamento"
                      className="px-4 py-2 bg-[#0F766E] hover:bg-[#0C5F58] text-white rounded-full text-xs font-bold inline-flex items-center gap-1.5 transition-transform hover:-translate-y-0.5 cursor-pointer shadow-xs"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{isCopied ? 'Mensagem Copiada!' : 'Copiar Mensagem de Acompanhamento'}</span>
                    </button>

                    <button
                      onClick={() => handleMarkAsContacted(app.id)}
                      aria-label="Marcar como acompanhado hoje"
                      className="px-4 py-2 bg-white hover:bg-[#F1EEE6] text-[#1B2430] border border-[#E6E1D6] hover:border-[#0F766E] rounded-full text-xs font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      {isSuccess ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <CheckCircle2 className="w-3.5 h-3.5 text-[#0F766E]" />}
                      <span>{isSuccess ? 'Registrado!' : 'Marcar como Acompanhado'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Pending Follow-ups */}
      {pendingFollowUps.length > 0 && (
        <div className="space-y-3 pt-3 border-t border-[#E6E1D6]">
          <h5 className="font-mono text-xs font-bold uppercase tracking-wider text-[#4A5565]">
            Aguardando Prazo de 5 Dias ({pendingFollowUps.length})
          </h5>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {pendingFollowUps.map(app => {
              const referenceDate = app.lastFollowUpDate || app.sentDate;
              const daysAgo = calculateDaysAgo(referenceDate);
              const daysRemaining = Math.max(1, 5 - daysAgo);

              return (
                <div 
                  key={app.id}
                  className="p-3 bg-[#FAF9F5] border border-[#E6E1D6] rounded-[10px] space-y-1.5 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#1B2430] truncate">{app.company}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white border border-[#E6E1D6] text-[#4A5565]">
                      {daysAgo} de 5 dias
                    </span>
                  </div>
                  <p className="text-[11px] text-[#4A5565] truncate">{app.role}</p>
                  <p className="text-[10px] font-mono text-[#5B5E62]">
                    Próximo follow-up em ~{daysRemaining} {daysRemaining === 1 ? 'dia' : 'dias'}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
