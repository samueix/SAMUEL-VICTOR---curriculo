import React, { useState } from 'react';
import { 
  X, 
  Lock, 
  Save, 
  Plus, 
  Trash2, 
  Edit2, 
  Briefcase, 
  Code, 
  GraduationCap, 
  Award, 
  User, 
  MessageSquare, 
  ArrowLeft,
  Settings,
  Eye,
  Info,
  Sparkles,
  FileText,
  Camera,
  Printer,
  Download,
  QrCode,
  Globe,
  Copy,
  Check,
  ExternalLink,
  Share2,
  Smartphone
} from 'lucide-react';
import { QRCodeCanvas, QRCodeSVG } from 'qrcode.react';
import { PersonalInfo, Experience, Skill, Certification, Education, Message } from '../types';
import CoverLetterGenerator from './CoverLetterGenerator';

interface AdminPanelProps {
  isOpen?: boolean;
  personalInfo: PersonalInfo;
  setPersonalInfo: React.Dispatch<React.SetStateAction<PersonalInfo>>;
  experiences: Experience[];
  setExperiences: React.Dispatch<React.SetStateAction<Experience[]>>;
  skills: Skill[];
  setSkills: React.Dispatch<React.SetStateAction<Skill[]>>;
  educations: Education[];
  setEducations: React.Dispatch<React.SetStateAction<Education[]>>;
  certifications: Certification[];
  setCertifications: React.Dispatch<React.SetStateAction<Certification[]>>;
  projects?: any;
  setProjects?: any;
  savedMessages: Message[];
  setSavedMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  onClose: () => void;
  onDownloadWithPhoto?: () => void;
}

export default function AdminPanel({
  personalInfo,
  setPersonalInfo,
  experiences,
  setExperiences,
  skills,
  setSkills,
  educations,
  setEducations,
  certifications,
  setCertifications,
  savedMessages,
  setSavedMessages,
  onClose,
  onDownloadWithPhoto
}: AdminPanelProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState(false);
  const [activeTab, setActiveTab] = useState<'dados' | 'experiencias' | 'habilidades' | 'educacao' | 'certificacoes' | 'cartas' | 'curriculo_foto' | 'qrcode'>('dados');
  const [copiedLink, setCopiedLink] = useState(false);
  
  // States for sub-form editors
  const [editingExp, setEditingExp] = useState<Experience | null>(null);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [editingSkillIndex, setEditingSkillIndex] = useState<number | null>(null);
  const [editingEdu, setEditingEdu] = useState<Education | null>(null);
  const [editingEduIndex, setEditingEduIndex] = useState<number | null>(null);
  const [editingCert, setEditingCert] = useState<Certification | null>(null);
  const [editingCertIndex, setEditingCertIndex] = useState<number | null>(null);

  // New item placeholders
  const [newDescBullet, setNewDescBullet] = useState('');
  const [newSkillTag, setNewSkillTag] = useState('');
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '075561@Sam') {
      setIsAuthenticated(true);
      setAuthError(false);
    } else {
      setAuthError(true);
    }
  };

  const handleSavePersonalInfo = (field: keyof PersonalInfo, value: any) => {
    const updated = { ...personalInfo, [field]: value };
    setPersonalInfo(updated);
    localStorage.setItem('personalInfo', JSON.stringify(updated));
  };

  const handleCopyLink = () => {
    const url = personalInfo.websiteUrl || 'https://samuel-victor-da-silva-nobre.vercel.app/';
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(url);
    } else {
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleDownloadQrCode = () => {
    const canvas = document.getElementById('admin-portfolio-qr-canvas') as HTMLCanvasElement;
    if (canvas) {
      const pngUrl = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = 'qrcode-samuel-portfolio.png';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  // EXPERIENCE OPERATIONS
  const handleSaveExperience = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingExp) return;

    let updatedList;
    if (experiences.some(exp => exp.id === editingExp.id)) {
      updatedList = experiences.map(exp => exp.id === editingExp.id ? editingExp : exp);
    } else {
      updatedList = [...experiences, editingExp];
    }
    setExperiences(updatedList);
    localStorage.setItem('experiences', JSON.stringify(updatedList));
    setEditingExp(null);
  };

  const handleDeleteExperience = (id: string) => {
    if (window.confirm('Deseja realmente excluir esta experiência?')) {
      const updatedList = experiences.filter(exp => exp.id !== id);
      setExperiences(updatedList);
      localStorage.setItem('experiences', JSON.stringify(updatedList));
    }
  };

  const startNewExperience = () => {
    setEditingExp({
      id: `exp-${Date.now()}`,
      role: '',
      company: '',
      period: '',
      location: '',
      description: [],
      skills: []
    });
  };

  // SKILL OPERATIONS
  const handleSaveSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSkill) return;

    let updatedList = [...skills];
    if (editingSkillIndex !== null) {
      updatedList[editingSkillIndex] = editingSkill;
    } else {
      updatedList.push(editingSkill);
    }
    setSkills(updatedList);
    localStorage.setItem('skills', JSON.stringify(updatedList));
    setEditingSkill(null);
    setEditingSkillIndex(null);
  };

  const handleDeleteSkill = (index: number) => {
    if (window.confirm('Deseja realmente excluir esta habilidade?')) {
      const updatedList = skills.filter((_, idx) => idx !== index);
      setSkills(updatedList);
      localStorage.setItem('skills', JSON.stringify(updatedList));
    }
  };

  const startNewSkill = () => {
    setEditingSkill({
      name: '',
      level: 100,
      category: 'suporte'
    });
    setEditingSkillIndex(null);
  };

  // EDUCATION OPERATIONS
  const handleSaveEducation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEdu) return;

    let updatedList = [...educations];
    if (editingEduIndex !== null) {
      updatedList[editingEduIndex] = editingEdu;
    } else {
      updatedList.push(editingEdu);
    }
    setEducations(updatedList);
    localStorage.setItem('educations', JSON.stringify(updatedList));
    setEditingEdu(null);
    setEditingEduIndex(null);
  };

  const handleDeleteEducation = (index: number) => {
    if (window.confirm('Deseja realmente excluir esta formação?')) {
      const updatedList = educations.filter((_, idx) => idx !== index);
      setEducations(updatedList);
      localStorage.setItem('educations', JSON.stringify(updatedList));
    }
  };

  const startNewEducation = () => {
    setEditingEdu({
      degree: '',
      institution: '',
      period: '',
      status: 'Em andamento',
      description: '',
      bullets: []
    });
    setEditingEduIndex(null);
  };

  // CERTIFICATION OPERATIONS
  const handleSaveCertification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCert) return;

    let updatedList = [...certifications];
    if (editingCertIndex !== null) {
      updatedList[editingCertIndex] = editingCert;
    } else {
      updatedList.push(editingCert);
    }
    setCertifications(updatedList);
    localStorage.setItem('certifications', JSON.stringify(updatedList));
    setEditingCert(null);
    setEditingCertIndex(null);
  };

  const handleDeleteCertification = (index: number) => {
    if (window.confirm('Deseja realmente excluir esta certificação?')) {
      const updatedList = certifications.filter((_, idx) => idx !== index);
      setCertifications(updatedList);
      localStorage.setItem('certifications', JSON.stringify(updatedList));
    }
  };

  const startNewCertification = () => {
    setEditingCert({
      name: '',
      institution: '',
      year: '',
      description: '',
      bullets: []
    });
    setEditingCertIndex(null);
  };

  // MESSAGE OPERATIONS
  const handleDeleteMessage = (id: string) => {
    if (window.confirm('Deseja realmente excluir esta mensagem permanentemente?')) {
      const updatedList = savedMessages.filter(msg => msg.id !== id);
      setSavedMessages(updatedList);
      localStorage.setItem('samuel_portfolio_messages', JSON.stringify(updatedList));
    }
  };

  // Screen 1: Unauthenticated Password Check
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FFFBF2] text-[#1B2430] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#FFFFFF] border border-[#E6E1D6] rounded-[16px] p-6 sm:p-8 relative shadow-md">
          <button 
            onClick={onClose}
            aria-label="Fechar"
            className="absolute top-4 right-4 text-[#4A5565] hover:text-[#1B2430] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" strokeWidth={2} aria-hidden="true" />
          </button>

          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-12 h-12 rounded-full bg-[#F1EEE6] flex items-center justify-center text-[#0F766E] mb-3">
              <Lock className="w-6 h-6 text-[#0F766E]" strokeWidth={2.2} aria-hidden="true" />
            </div>
            <h1 className="text-xl font-bold font-display text-[#1B2430]">Acesso Administrativo</h1>
            <p className="text-xs text-[#4A5565] mt-1 max-w-xs leading-relaxed font-medium">
              Insira a chave de acesso para gerenciar os dados do currículo e do portfólio.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1B2430] block">Senha de Administrador</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite a senha de acesso"
                className="w-full bg-[#FFFFFF] border border-[#E6E1D6] rounded-[8px] px-3.5 py-2.5 text-[#1B2430] placeholder-[#4A5565]/60 text-sm font-medium focus:outline-none focus:border-[#0F766E] transition-colors"
              />
            </div>

            {authError && (
              <p className="text-xs text-red-600 font-bold">
                ⚠️ Senha inválida.
              </p>
            )}

            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 bg-[#FFFFFF] hover:bg-[#F1EEE6] text-[#1B2430] border border-[#E6E1D6] text-xs font-bold rounded-full transition-all cursor-pointer"
              >
                Voltar
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 bg-[#0F766E] hover:bg-[#0C5F58] text-white text-xs font-bold rounded-full transition-all cursor-pointer shadow-sm"
              >
                Acessar Painel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Screen 2: Authenticated Dashboard
  return (
    <div className="min-h-screen bg-[#FFFBF2] text-[#1B2430] font-sans pb-24">
      {/* Admin Subheader Top-bar */}
      <div className="bg-[#FFFFFF] border-b border-[#E6E1D6] py-3.5 px-4 sm:px-6 lg:px-8 shadow-sm">
        <div className="max-w-[1100px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#0F766E] text-white flex items-center justify-center">
              <Settings className="w-4 h-4 text-current" strokeWidth={2} aria-hidden="true" />
            </div>
            <div>
              <span className="text-[11px] text-[#4A5565] block uppercase tracking-wider font-bold">Modo Administrador</span>
              <span className="text-sm font-bold font-display text-[#1B2430] block">Painel de Controle do Portfólio</span>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            {onDownloadWithPhoto && (
              <button
                onClick={onDownloadWithPhoto}
                className="px-4 py-2 bg-[#0F766E] hover:bg-[#0C5F58] text-white rounded-full text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-sm"
                title="Baixar ou Imprimir o Currículo em PDF com sua foto oficial"
              >
                <Camera className="w-4 h-4 text-white" strokeWidth={2.2} aria-hidden="true" />
                <span>Currículo com Foto (PDF)</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="px-4 py-2 bg-[#FFFFFF] hover:bg-[#F1EEE6] text-[#1B2430] rounded-full text-xs font-bold flex items-center gap-2 border border-[#E6E1D6] hover:border-[#0F766E] hover:text-[#0F766E] transition-all cursor-pointer"
            >
              <Eye className="w-4 h-4 text-[#1B2430]" strokeWidth={2.2} aria-hidden="true" />
              <span>Ver Portfólio</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Admin Content Grid */}
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 mt-6">
        
        {/* Statistics & Overview Section */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 mb-6">
          <div className="bg-[#FFFFFF] border border-[#E6E1D6] p-4 rounded-[12px] shadow-sm hover:shadow-[4px_4px_0px_#0F766E] transition-all duration-200">
            <span className="text-xs font-bold text-[#4A5565] uppercase tracking-wide block">Experiências</span>
            <span className="text-2xl font-bold font-display text-[#1B2430] mt-1 block flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-[#0F766E]" strokeWidth={2.2} aria-hidden="true" />
              {experiences.length}
            </span>
          </div>
          <div className="bg-[#FFFFFF] border border-[#E6E1D6] p-4 rounded-[12px] shadow-sm hover:shadow-[4px_4px_0px_#0F766E] transition-all duration-200">
            <span className="text-xs font-bold text-[#4A5565] uppercase tracking-wide block">Habilidades</span>
            <span className="text-2xl font-bold font-display text-[#1B2430] mt-1 block flex items-center gap-2">
              <Code className="w-5 h-5 text-[#0F766E]" strokeWidth={2.2} aria-hidden="true" />
              {skills.length}
            </span>
          </div>
          <div className="bg-[#FFFFFF] border border-[#E6E1D6] p-4 rounded-[12px] shadow-sm hover:shadow-[4px_4px_0px_#0F766E] transition-all duration-200">
            <span className="text-xs font-bold text-[#4A5565] uppercase tracking-wide block">Certificações</span>
            <span className="text-2xl font-bold font-display text-[#1B2430] mt-1 block flex items-center gap-2">
              <Award className="w-5 h-5 text-[#0F766E]" strokeWidth={2.2} aria-hidden="true" />
              {certifications.length}
            </span>
          </div>
          <div className="bg-[#FFFFFF] border border-[#E6E1D6] p-4 rounded-[12px] shadow-sm hover:shadow-[4px_4px_0px_#0F766E] transition-all duration-200">
            <span className="text-xs font-bold text-[#4A5565] uppercase tracking-wide block">Anos na Área</span>
            <span className="text-2xl font-bold font-display text-[#1B2430] mt-1 block flex items-center gap-2">
              {personalInfo.experienceYears} Anos
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Admin Tab Sidebar */}
          <div className="lg:col-span-3 bg-[#FFFFFF] border border-[#E6E1D6] p-3.5 rounded-[12px] shadow-sm space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-[#4A5565] px-2.5 pb-2 block border-b border-[#E6E1D6] mb-1">Módulos de Edição</span>
            
            <button
              onClick={() => { setActiveTab('dados'); setEditingExp(null); setEditingSkill(null); setEditingEdu(null); setEditingCert(null); }}
              className={`w-full text-left px-3.5 py-2 rounded-full text-xs font-bold flex items-center gap-2.5 transition-all cursor-pointer ${
                activeTab === 'dados' 
                  ? 'bg-[#0F766E] text-white shadow-sm' 
                  : 'text-[#4A5565] hover:bg-[#F1EEE6] hover:text-[#1B2430]'
              }`}
            >
              <User className="w-4 h-4" strokeWidth={2} aria-hidden="true" />
              <span>Dados Gerais</span>
            </button>

            <button
              onClick={() => { setActiveTab('experiencias'); setEditingExp(null); setEditingSkill(null); setEditingEdu(null); setEditingCert(null); }}
              className={`w-full text-left px-3.5 py-2 rounded-full text-xs font-bold flex items-center gap-2.5 transition-all cursor-pointer ${
                activeTab === 'experiencias' 
                  ? 'bg-[#0F766E] text-white shadow-sm' 
                  : 'text-[#4A5565] hover:bg-[#F1EEE6] hover:text-[#1B2430]'
              }`}
            >
              <Briefcase className="w-4 h-4" strokeWidth={2} aria-hidden="true" />
              <span>Experiências ({experiences.length})</span>
            </button>

            <button
              onClick={() => { setActiveTab('habilidades'); setEditingExp(null); setEditingSkill(null); setEditingEdu(null); setEditingCert(null); }}
              className={`w-full text-left px-3.5 py-2 rounded-full text-xs font-bold flex items-center gap-2.5 transition-all cursor-pointer ${
                activeTab === 'habilidades' 
                  ? 'bg-[#0F766E] text-white shadow-sm' 
                  : 'text-[#4A5565] hover:bg-[#F1EEE6] hover:text-[#1B2430]'
              }`}
            >
              <Code className="w-4 h-4" strokeWidth={2} aria-hidden="true" />
              <span>Habilidades ({skills.length})</span>
            </button>

            <button
              onClick={() => { setActiveTab('educacao'); setEditingExp(null); setEditingSkill(null); setEditingEdu(null); setEditingCert(null); }}
              className={`w-full text-left px-3.5 py-2 rounded-full text-xs font-bold flex items-center gap-2.5 transition-all cursor-pointer ${
                activeTab === 'educacao' 
                  ? 'bg-[#0F766E] text-white shadow-sm' 
                  : 'text-[#4A5565] hover:bg-[#F1EEE6] hover:text-[#1B2430]'
              }`}
            >
              <GraduationCap className="w-4 h-4" strokeWidth={2} aria-hidden="true" />
              <span>Educação ({educations.length})</span>
            </button>

            <button
              onClick={() => { setActiveTab('certificacoes'); setEditingExp(null); setEditingSkill(null); setEditingEdu(null); setEditingCert(null); }}
              className={`w-full text-left px-3.5 py-2 rounded-full text-xs font-bold flex items-center gap-2.5 transition-all cursor-pointer ${
                activeTab === 'certificacoes' 
                  ? 'bg-[#0F766E] text-white shadow-sm' 
                  : 'text-[#4A5565] hover:bg-[#F1EEE6] hover:text-[#1B2430]'
              }`}
            >
              <Award className="w-4 h-4" strokeWidth={2} aria-hidden="true" />
              <span>Certificações ({certifications.length})</span>
            </button>

            <button
              onClick={() => { setActiveTab('cartas'); setEditingExp(null); setEditingSkill(null); setEditingEdu(null); setEditingCert(null); }}
              className={`w-full text-left px-3.5 py-2 rounded-full text-xs font-bold flex items-center gap-2.5 transition-all cursor-pointer ${
                activeTab === 'cartas' 
                  ? 'bg-[#0F766E] text-white shadow-sm' 
                  : 'text-[#4A5565] hover:bg-[#F1EEE6] hover:text-[#1B2430]'
              }`}
            >
              <FileText className="w-4 h-4" strokeWidth={2} aria-hidden="true" />
              <span>Gerador de Cartas</span>
            </button>

            <div className="pt-2 border-t border-[#E6E1D6] mt-2 space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#0F766E] px-2.5 pb-1 block">
                Exportação & Acesso
              </span>
              <button
                onClick={() => { setActiveTab('curriculo_foto'); setEditingExp(null); setEditingSkill(null); setEditingEdu(null); setEditingCert(null); }}
                className={`w-full text-left px-3.5 py-2 rounded-full text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                  activeTab === 'curriculo_foto' 
                    ? 'bg-[#0F766E] text-white shadow-sm' 
                    : 'text-[#4A5565] hover:bg-[#F1EEE6] hover:text-[#1B2430]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Camera className="w-4 h-4" strokeWidth={2} aria-hidden="true" />
                  <span>Currículo com Foto</span>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full border border-current font-bold">
                  PDF
                </span>
              </button>

              <button
                onClick={() => { setActiveTab('qrcode'); setEditingExp(null); setEditingSkill(null); setEditingEdu(null); setEditingCert(null); }}
                className={`w-full text-left px-3.5 py-2 rounded-full text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                  activeTab === 'qrcode' 
                    ? 'bg-[#0F766E] text-white shadow-sm' 
                    : 'text-[#4A5565] hover:bg-[#F1EEE6] hover:text-[#1B2430]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <QrCode className="w-4 h-4" strokeWidth={2} aria-hidden="true" />
                  <span>QR Code do Site</span>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full border border-current font-bold">
                  Link
                </span>
              </button>
            </div>
          </div>

          {/* Editor Area */}
          <div className="lg:col-span-9 bg-[#FFFFFF] border border-[#E6E1D6] p-6 sm:p-8 rounded-[12px] shadow-sm">
            
            {/* TAB 1: DADOS GERAIS */}
            {activeTab === 'dados' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-semibold text-[#17181A] flex items-center gap-2">
                    <User className="w-4 h-4 text-[#0F766E]" strokeWidth={1.5} aria-hidden="true" />
                    <span>Dados Gerais do Perfil</span>
                  </h3>
                  <p className="text-xs font-mono text-[#5B5E62] mt-1 leading-relaxed">
                    Edite as informações pessoais e de cabeçalho que aparecem no currículo e no gerador de cartas.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-mono text-[#5B5E62] block">Nome Completo</label>
                    <input
                      type="text"
                      value={personalInfo.fullName}
                      onChange={(e) => handleSavePersonalInfo('fullName', e.target.value)}
                      className="w-full bg-[#F5F3EE] border border-[#D9D5CB] rounded-[4px] px-3 py-2 text-[#17181A] placeholder-[#5B5E62]/60 text-xs font-mono focus:outline-none focus:border-[#0F766E]:border-[#2DD4BF] transition-colors"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-mono text-[#5B5E62] block">Nome Curto (Exibição)</label>
                    <input
                      type="text"
                      value={personalInfo.shortName}
                      onChange={(e) => handleSavePersonalInfo('shortName', e.target.value)}
                      className="w-full bg-[#F5F3EE] border border-[#D9D5CB] rounded-[4px] px-3 py-2 text-[#17181A] placeholder-[#5B5E62]/60 text-xs font-mono focus:outline-none focus:border-[#0F766E]:border-[#2DD4BF] transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-mono text-[#5B5E62] block">Cargo / Título Profissional</label>
                    <input
                      type="text"
                      value={personalInfo.title}
                      onChange={(e) => handleSavePersonalInfo('title', e.target.value)}
                      className="w-full bg-[#F5F3EE] border border-[#D9D5CB] rounded-[4px] px-3 py-2 text-[#17181A] placeholder-[#5B5E62]/60 text-xs font-mono focus:outline-none focus:border-[#0F766E]:border-[#2DD4BF] transition-colors"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-mono text-[#5B5E62] block">Especialidades (Legenda)</label>
                    <input
                      type="text"
                      value={personalInfo.subtitle}
                      onChange={(e) => handleSavePersonalInfo('subtitle', e.target.value)}
                      className="w-full bg-[#F5F3EE] border border-[#D9D5CB] rounded-[4px] px-3 py-2 text-[#17181A] placeholder-[#5B5E62]/60 text-xs font-mono focus:outline-none focus:border-[#0F766E]:border-[#2DD4BF] transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-mono text-[#5B5E62] block">E-mail</label>
                    <input
                      type="email"
                      value={personalInfo.email}
                      onChange={(e) => handleSavePersonalInfo('email', e.target.value)}
                      className="w-full bg-[#F5F3EE] border border-[#D9D5CB] rounded-[4px] px-3 py-2 text-[#17181A] placeholder-[#5B5E62]/60 text-xs font-mono focus:outline-none focus:border-[#0F766E]:border-[#2DD4BF] transition-colors"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-mono text-[#5B5E62] block">Telefone</label>
                    <input
                      type="text"
                      value={personalInfo.phone}
                      onChange={(e) => handleSavePersonalInfo('phone', e.target.value)}
                      className="w-full bg-[#F5F3EE] border border-[#D9D5CB] rounded-[4px] px-3 py-2 text-[#17181A] placeholder-[#5B5E62]/60 text-xs font-mono focus:outline-none focus:border-[#0F766E]:border-[#2DD4BF] transition-colors"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-mono text-[#5B5E62] block">URL do WhatsApp</label>
                    <input
                      type="text"
                      value={personalInfo.whatsappUrl}
                      onChange={(e) => handleSavePersonalInfo('whatsappUrl', e.target.value)}
                      className="w-full bg-[#F5F3EE] border border-[#D9D5CB] rounded-[4px] px-3 py-2 text-[#17181A] placeholder-[#5B5E62]/60 text-xs font-mono focus:outline-none focus:border-[#0F766E]:border-[#2DD4BF] transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-mono text-[#5B5E62] block">LinkedIn URL</label>
                    <input
                      type="text"
                      value={personalInfo.linkedinUrl}
                      onChange={(e) => handleSavePersonalInfo('linkedinUrl', e.target.value)}
                      className="w-full bg-[#F5F3EE] border border-[#D9D5CB] rounded-[4px] px-3 py-2 text-[#17181A] placeholder-[#5B5E62]/60 text-xs font-mono focus:outline-none focus:border-[#0F766E]:border-[#2DD4BF] transition-colors"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-mono text-[#5B5E62] block">GitHub URL</label>
                    <input
                      type="text"
                      value={personalInfo.githubUrl}
                      onChange={(e) => handleSavePersonalInfo('githubUrl', e.target.value)}
                      className="w-full bg-[#F5F3EE] border border-[#D9D5CB] rounded-[4px] px-3 py-2 text-[#17181A] placeholder-[#5B5E62]/60 text-xs font-mono focus:outline-none focus:border-[#0F766E]:border-[#2DD4BF] transition-colors"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-mono text-[#5B5E62] block">Localização (Cidade/Estado)</label>
                    <input
                      type="text"
                      value={personalInfo.location}
                      onChange={(e) => handleSavePersonalInfo('location', e.target.value)}
                      className="w-full bg-[#F5F3EE] border border-[#D9D5CB] rounded-[4px] px-3 py-2 text-[#17181A] placeholder-[#5B5E62]/60 text-xs font-mono focus:outline-none focus:border-[#0F766E]:border-[#2DD4BF] transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-mono text-[#5B5E62] block">CNH & Veículo</label>
                    <input
                      type="text"
                      value={personalInfo.cnh}
                      onChange={(e) => handleSavePersonalInfo('cnh', e.target.value)}
                      className="w-full bg-[#F5F3EE] border border-[#D9D5CB] rounded-[4px] px-3 py-2 text-[#17181A] placeholder-[#5B5E62]/60 text-xs font-mono focus:outline-none focus:border-[#0F766E]:border-[#2DD4BF] transition-colors"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-mono text-[#5B5E62] block">Inglês</label>
                    <input
                      type="text"
                      value={personalInfo.english}
                      onChange={(e) => handleSavePersonalInfo('english', e.target.value)}
                      className="w-full bg-[#F5F3EE] border border-[#D9D5CB] rounded-[4px] px-3 py-2 text-[#17181A] placeholder-[#5B5E62]/60 text-xs font-mono focus:outline-none focus:border-[#0F766E]:border-[#2DD4BF] transition-colors"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-mono text-[#5B5E62] block">Anos de Experiência (Número)</label>
                    <input
                      type="number"
                      value={personalInfo.experienceYears}
                      onChange={(e) => handleSavePersonalInfo('experienceYears', parseInt(e.target.value) || 0)}
                      className="w-full bg-[#F5F3EE] border border-[#D9D5CB] rounded-[4px] px-3 py-2 text-[#17181A] placeholder-[#5B5E62]/60 text-xs font-mono focus:outline-none focus:border-[#0F766E]:border-[#2DD4BF] transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-2 p-4 rounded-[4px] bg-[#F5F3EE] border border-[#D9D5CB]">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <label className="text-xs font-mono font-medium text-[#17181A] flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-[#0F766E]" strokeWidth={1.5} aria-hidden="true" />
                      Link Oficial do Site / Portfólio
                    </label>
                    <button
                      type="button"
                      onClick={() => setActiveTab('qrcode')}
                      className="text-xs font-mono text-[#0F766E] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <QrCode className="w-3.5 h-3.5" strokeWidth={1.5} aria-hidden="true" />
                      Aba QR Code do Site →
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={personalInfo.websiteUrl || 'https://samuel-victor-da-silva-nobre.vercel.app/'}
                      onChange={(e) => handleSavePersonalInfo('websiteUrl', e.target.value)}
                      placeholder="https://samuel-victor-da-silva-nobre.vercel.app/"
                      className="w-full bg-[#FFFFFF] border border-[#D9D5CB] rounded-[4px] px-3 py-2 text-[#17181A] text-xs font-mono focus:outline-none focus:border-[#0F766E]:border-[#2DD4BF] transition-colors"
                    />
                    <button
                      type="button"
                      onClick={handleCopyLink}
                      className="px-3.5 py-2 bg-[#17181A] hover:opacity-90 text-[#F5F3EE] rounded-[4px] text-xs font-mono font-medium flex items-center gap-1.5 shrink-0 transition-opacity cursor-pointer"
                      title="Copiar link"
                      aria-label="Copiar link"
                    >
                      {copiedLink ? <Check className="w-3.5 h-3.5 text-[#0F766E]" strokeWidth={1.5} aria-hidden="true" /> : <Copy className="w-3.5 h-3.5" strokeWidth={1.5} aria-hidden="true" />}
                      <span>{copiedLink ? 'Copiado' : 'Copiar'}</span>
                    </button>
                  </div>
                  <span className="text-[10px] font-mono text-[#5B5E62] block leading-relaxed">
                    Este link é exibido diretamente no cabeçalho do seu currículo e gera o QR Code escaneável para celulares.
                  </span>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-[#5B5E62] block">
                    URL da Foto de Perfil (Opcional)
                  </label>
                  <input
                    type="text"
                    value={personalInfo.imageUrl || ''}
                    onChange={(e) => handleSavePersonalInfo('imageUrl', e.target.value)}
                    placeholder="Deixe vazio para usar a foto padrão /foto_perfil/samuel.png"
                    className="w-full bg-[#F5F3EE] border border-[#D9D5CB] rounded-[4px] px-3 py-2 text-[#17181A] placeholder-[#5B5E62]/60 text-xs font-mono focus:outline-none focus:border-[#0F766E]:border-[#2DD4BF] transition-colors"
                  />
                  <span className="text-[10px] font-mono text-[#5B5E62] block mt-0.5 leading-relaxed">
                    Você pode colar um link de imagem do LinkedIn, Imgur ou qualquer servidor web. Se vazio, o currículo carregará <code className="bg-[#FFFFFF] px-1 py-0.5 border border-[#D9D5CB] rounded-[2px]">/foto_perfil/samuel.png</code>.
                  </span>
                </div>

                {/* Callout to download resume with this photo */}
                <div className="bg-[#FFFFFF] border border-[#D9D5CB] p-3.5 rounded-[4px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-[4px] overflow-hidden border border-[#D9D5CB] bg-[#F5F3EE] shrink-0">
                      <img 
                        src={personalInfo.imageUrl || "/foto_perfil/samuel.png"} 
                        alt={personalInfo.fullName}
                        className="w-full h-full object-cover grayscale"
                      />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-[#17181A] flex items-center gap-1.5">
                        <Camera className="w-3.5 h-3.5 text-[#0F766E]" strokeWidth={1.5} aria-hidden="true" />
                        Baixar Currículo com esta Foto Oficial
                      </h4>
                      <p className="text-[11px] font-mono text-[#5B5E62] mt-0.5">
                        Exclusivo do Painel ADM. Gera o PDF A4 completo com sua foto no cabeçalho.
                      </p>
                    </div>
                  </div>
                  {onDownloadWithPhoto && (
                    <button
                      type="button"
                      onClick={onDownloadWithPhoto}
                      className="px-3 py-1.5 bg-[#0F766E] hover:bg-[#115E59] text-white rounded-[4px] text-xs font-mono font-medium flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
                    >
                      <Printer className="w-3.5 h-3.5" strokeWidth={1.5} aria-hidden="true" />
                      <span>Baixar CV com Foto (PDF)</span>
                    </button>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-[#5B5E62] block">Disponibilidade de Trabalho</label>
                  <input
                    type="text"
                    value={personalInfo.availability}
                    onChange={(e) => handleSavePersonalInfo('availability', e.target.value)}
                    className="w-full bg-[#F5F3EE] border border-[#D9D5CB] rounded-[4px] px-3 py-2 text-[#17181A] placeholder-[#5B5E62]/60 text-xs font-mono focus:outline-none focus:border-[#0F766E]:border-[#2DD4BF] transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-[#5B5E62] block">Biografia Resumida</label>
                  <textarea
                    rows={4}
                    value={personalInfo.bio}
                    onChange={(e) => handleSavePersonalInfo('bio', e.target.value)}
                    className="w-full bg-[#F5F3EE] border border-[#D9D5CB] rounded-[4px] px-3 py-2 text-[#17181A] placeholder-[#5B5E62]/60 text-xs font-mono focus:outline-none focus:border-[#0F766E]:border-[#2DD4BF] transition-colors resize-none"
                  />
                </div>

                <div className="bg-[#F5F3EE] border border-[#D9D5CB] p-3 rounded-[4px] flex items-start gap-2.5 text-xs text-[#5B5E62] font-mono leading-relaxed">
                  <Info className="w-4 h-4 text-[#0F766E] flex-shrink-0 mt-0.5" strokeWidth={1.5} aria-hidden="true" />
                  <div>
                    <strong className="text-[#17181A]">Persistência no Navegador:</strong> Qualquer alteração feita acima é instantaneamente salva no <code className="bg-[#FFFFFF] px-1 border border-[#D9D5CB] rounded-[2px] font-mono text-[11px]">localStorage</code> do seu navegador. Isso garante que suas edições personalizadas estarão totalmente preservadas e ativas!
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: EXPERIÊNCIAS */}
            {activeTab === 'experiencias' && (
              <div className="space-y-6">
                {!editingExp ? (
                  <>
                    <div className="flex items-center justify-between pb-3 border-b border-[#D9D5CB]">
                      <div>
                        <h3 className="text-base font-semibold text-[#17181A] flex items-center gap-2">
                          <Briefcase className="w-4 h-4 text-[#0F766E]" strokeWidth={1.5} aria-hidden="true" />
                          <span>Experiências Profissionais</span>
                        </h3>
                        <p className="text-xs font-mono text-[#5B5E62] mt-1">
                          Gerencie a linha do tempo de sua carreira técnica.
                        </p>
                      </div>
                      <button
                        onClick={startNewExperience}
                        className="px-3 py-1.5 bg-[#0F766E] hover:bg-[#115E59] text-white font-mono text-xs font-medium rounded-[4px] flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" strokeWidth={1.5} aria-hidden="true" />
                        <span>Nova Experiência</span>
                      </button>
                    </div>

                    <div className="space-y-2">
                      {experiences.map((exp) => (
                        <div key={exp.id} className="border border-[#D9D5CB] p-3 rounded-[4px] flex items-center justify-between hover:border-[#0F766E]/40 transition-colors bg-[#FFFFFF]">
                          <div>
                            <span className="font-semibold text-xs text-[#17181A] block">{exp.role}</span>
                            <span className="text-[11px] font-mono text-[#5B5E62] block mt-0.5">{exp.company} • {exp.period}</span>
                          </div>
                          
                          <div className="flex gap-1">
                            <button
                              onClick={() => setEditingExp(exp)}
                              className="p-1.5 text-[#5B5E62] hover:text-[#0F766E]:text-[#2DD4BF] rounded-[3px] hover:bg-[#F5F3EE]:bg-[#121413] transition-colors cursor-pointer"
                              title="Editar experiência"
                              aria-label="Editar experiência"
                            >
                              <Edit2 className="w-3.5 h-3.5" strokeWidth={1.5} aria-hidden="true" />
                            </button>
                            <button
                              onClick={() => handleDeleteExperience(exp.id)}
                              className="p-1.5 text-[#5B5E62] hover:text-red-600:text-red-400 rounded-[3px] hover:bg-red-50:bg-red-950/30 transition-colors cursor-pointer"
                              title="Deletar experiência"
                              aria-label="Deletar experiência"
                            >
                              <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} aria-hidden="true" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <form onSubmit={handleSaveExperience} className="space-y-4">
                    <div className="flex items-center justify-between border-b border-[#D9D5CB] pb-2">
                      <h4 className="text-xs font-mono font-semibold uppercase text-[#17181A]">
                        {experiences.some(e => e.id === editingExp.id) ? 'Editar Experiência' : 'Nova Experiência'}
                      </h4>
                      <button
                        type="button"
                        onClick={() => setEditingExp(null)}
                        className="text-xs font-mono text-[#5B5E62] hover:text-[#17181A]:text-[#ECEAE4] transition-colors cursor-pointer"
                      >
                        Cancelar
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-mono text-[#5B5E62] block">Cargo *</label>
                        <input
                          type="text"
                          required
                          value={editingExp.role}
                          onChange={(e) => setEditingExp({ ...editingExp, role: e.target.value })}
                          className="w-full bg-[#F5F3EE] border border-[#D9D5CB] rounded-[4px] px-3 py-2 text-[#17181A] text-xs font-mono focus:outline-none focus:border-[#0F766E]:border-[#2DD4BF] transition-colors"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-mono text-[#5B5E62] block">Empresa *</label>
                        <input
                          type="text"
                          required
                          value={editingExp.company}
                          onChange={(e) => setEditingExp({ ...editingExp, company: e.target.value })}
                          className="w-full bg-[#F5F3EE] border border-[#D9D5CB] rounded-[4px] px-3 py-2 text-[#17181A] text-xs font-mono focus:outline-none focus:border-[#0F766E]:border-[#2DD4BF] transition-colors"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-mono text-[#5B5E62] block">Período (Ex: Jan 2022 - Presente) *</label>
                        <input
                          type="text"
                          required
                          value={editingExp.period}
                          onChange={(e) => setEditingExp({ ...editingExp, period: e.target.value })}
                          className="w-full bg-[#F5F3EE] border border-[#D9D5CB] rounded-[4px] px-3 py-2 text-[#17181A] text-xs font-mono focus:outline-none focus:border-[#0F766E]:border-[#2DD4BF] transition-colors"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-mono text-[#5B5E62] block">Cidade / Estado (Ex: Fortaleza, CE) *</label>
                        <input
                          type="text"
                          required
                          value={editingExp.location}
                          onChange={(e) => setEditingExp({ ...editingExp, location: e.target.value })}
                          className="w-full bg-[#F5F3EE] border border-[#D9D5CB] rounded-[4px] px-3 py-2 text-[#17181A] text-xs font-mono focus:outline-none focus:border-[#0F766E]:border-[#2DD4BF] transition-colors"
                        />
                      </div>
                    </div>

                    {/* Descrições (Bullets) */}
                    <div className="space-y-2">
                      <label className="text-xs font-mono text-[#5B5E62] block">Atividades Realizadas (Bullet Points)</label>
                      <div className="space-y-1.5">
                        {editingExp.description.map((bullet, idx) => (
                          <div key={idx} className="flex gap-2 items-center bg-[#F5F3EE] p-2 rounded-[3px] border border-[#D9D5CB]">
                            <span className="text-xs font-mono text-[#17181A] flex-1">{bullet}</span>
                            <button
                              type="button"
                              onClick={() => {
                                const newDesc = editingExp.description.filter((_, i) => i !== idx);
                                setEditingExp({ ...editingExp, description: newDesc });
                              }}
                              className="text-red-600 hover:opacity-80 p-1 cursor-pointer"
                              aria-label="Excluir bullet"
                            >
                              <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} aria-hidden="true" />
                            </button>
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Adicionar nova atividade..."
                          value={newDescBullet}
                          onChange={(e) => setNewDescBullet(e.target.value)}
                          className="flex-1 bg-[#F5F3EE] border border-[#D9D5CB] rounded-[4px] px-3 py-1.5 text-[#17181A] text-xs font-mono focus:outline-none focus:border-[#0F766E]:border-[#2DD4BF] transition-colors"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (!newDescBullet.trim()) return;
                            setEditingExp({
                              ...editingExp,
                              description: [...editingExp.description, newDescBullet.trim()]
                            });
                            setNewDescBullet('');
                          }}
                          className="px-3 py-1.5 bg-[#17181A] hover:opacity-90 text-[#F5F3EE] font-mono text-xs font-medium rounded-[4px] flex-shrink-0 transition-opacity cursor-pointer"
                        >
                          Inserir
                        </button>
                      </div>
                    </div>

                    {/* Tags de Tecnologia / Habilidades */}
                    <div className="space-y-2">
                      <label className="text-xs font-mono text-[#5B5E62] block">Tags de Competências Associadas</label>
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {editingExp.skills.map((tag, idx) => (
                          <span key={idx} className="bg-[#F5F3EE] text-[#17181A] border border-[#D9D5CB] px-2 py-0.5 rounded-[3px] text-xs font-mono flex items-center gap-1.5">
                            <span>{tag}</span>
                            <button
                              type="button"
                              onClick={() => {
                                const newTags = editingExp.skills.filter((_, i) => i !== idx);
                                setEditingExp({ ...editingExp, skills: newTags });
                              }}
                              className="text-[#5B5E62] hover:text-red-600:text-red-400 cursor-pointer"
                              aria-label={`Remover tag ${tag}`}
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Ex: Suporte N1, Wi-Fi Corporativo, Zabbix..."
                          value={newSkillTag}
                          onChange={(e) => setNewSkillTag(e.target.value)}
                          className="flex-1 bg-[#F5F3EE] border border-[#D9D5CB] rounded-[4px] px-3 py-1.5 text-[#17181A] text-xs font-mono focus:outline-none focus:border-[#0F766E]:border-[#2DD4BF] transition-colors"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (!newSkillTag.trim()) return;
                            if (editingExp.skills.includes(newSkillTag.trim())) return;
                            setEditingExp({
                              ...editingExp,
                              skills: [...editingExp.skills, newSkillTag.trim()]
                            });
                            setNewSkillTag('');
                          }}
                          className="px-3 py-1.5 bg-[#17181A] hover:opacity-90 text-[#F5F3EE] font-mono text-xs font-medium rounded-[4px] flex-shrink-0 transition-opacity cursor-pointer"
                        >
                          Adicionar Tag
                        </button>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-3 border-t border-[#D9D5CB]">
                      <button
                        type="button"
                        onClick={() => setEditingExp(null)}
                        className="px-3 py-1.5 bg-[#FFFFFF] hover:bg-[#F5F3EE]:bg-[#121413] text-[#17181A] border border-[#D9D5CB] font-mono text-xs font-medium rounded-[4px] transition-colors cursor-pointer"
                      >
                        Descartar
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 bg-[#0F766E] hover:bg-[#115E59] text-white font-mono text-xs font-medium rounded-[4px] flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Save className="w-3.5 h-3.5" strokeWidth={1.5} aria-hidden="true" />
                        <span>Salvar Alterações</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* TAB 3: HABILIDADES */}
            {activeTab === 'habilidades' && (
              <div className="space-y-6">
                {!editingSkill ? (
                  <>
                    <div className="flex items-center justify-between pb-3 border-b border-[#D9D5CB]">
                      <div>
                        <h3 className="text-base font-semibold text-[#17181A] flex items-center gap-2">
                          <Code className="w-4 h-4 text-[#0F766E]" strokeWidth={1.5} aria-hidden="true" />
                          <span>Habilidades & Competências</span>
                        </h3>
                        <p className="text-xs font-mono text-[#5B5E62] mt-1">
                          Configure suas habilidades por níveis e categorias para a visualização dinâmica do site.
                        </p>
                      </div>
                      <button
                        onClick={startNewSkill}
                        className="px-3 py-1.5 bg-[#0F766E] hover:bg-[#115E59] text-white font-mono text-xs font-medium rounded-[4px] flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" strokeWidth={1.5} aria-hidden="true" />
                        <span>Nova Habilidade</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {skills.map((skill, idx) => (
                        <div key={idx} className="border border-[#D9D5CB] p-3 rounded-[4px] flex items-center justify-between hover:border-[#0F766E]/40 transition-colors bg-[#FFFFFF]">
                          <div>
                            <span className="font-semibold text-xs text-[#17181A] block">{skill.name}</span>
                            <span className="text-[10px] font-mono text-[#5B5E62] block mt-0.5">
                              Nível {skill.level}% • {skill.category === 'suporte' ? 'Suporte & Infra.' : skill.category === 'redes' ? 'Redes & Tel.' : skill.category === 'desenvolvimento' ? 'Vibe Coding & Aut.' : skill.category === 'ia' ? 'Inteligência Art.' : 'Habilidade Pess.'}
                            </span>
                          </div>
                          
                          <div className="flex gap-1">
                            <button
                              onClick={() => { setEditingSkill(skill); setEditingSkillIndex(idx); }}
                              className="p-1.5 text-[#5B5E62] hover:text-[#0F766E]:text-[#2DD4BF] rounded-[3px] hover:bg-[#F5F3EE]:bg-[#121413] transition-colors cursor-pointer"
                              title="Editar habilidade"
                              aria-label="Editar habilidade"
                            >
                              <Edit2 className="w-3.5 h-3.5" strokeWidth={1.5} aria-hidden="true" />
                            </button>
                            <button
                              onClick={() => handleDeleteSkill(idx)}
                              className="p-1.5 text-[#5B5E62] hover:text-red-600:text-red-400 rounded-[3px] hover:bg-red-50:bg-red-950/30 transition-colors cursor-pointer"
                              title="Deletar habilidade"
                              aria-label="Deletar habilidade"
                            >
                              <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} aria-hidden="true" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <form onSubmit={handleSaveSkill} className="space-y-4">
                    <div className="flex items-center justify-between border-b border-[#D9D5CB] pb-2">
                      <h4 className="text-xs font-mono font-semibold uppercase text-[#17181A]">
                        {editingSkillIndex !== null ? 'Editar Habilidade' : 'Nova Habilidade'}
                      </h4>
                      <button
                        type="button"
                        onClick={() => { setEditingSkill(null); setEditingSkillIndex(null); }}
                        className="text-xs font-mono text-[#5B5E62] hover:text-[#17181A]:text-[#ECEAE4] transition-colors cursor-pointer"
                      >
                        Cancelar
                      </button>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-mono text-[#5B5E62] block">Nome da Habilidade *</label>
                      <input
                        type="text"
                        required
                        value={editingSkill.name}
                        onChange={(e) => setEditingSkill({ ...editingSkill, name: e.target.value })}
                        placeholder="Ex: Monitoramento Zabbix / Fusão de Fibra Óptica"
                        className="w-full bg-[#F5F3EE] border border-[#D9D5CB] rounded-[4px] px-3 py-2 text-[#17181A] text-xs font-mono focus:outline-none focus:border-[#0F766E]:border-[#2DD4BF] transition-colors"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-mono text-[#5B5E62] block">Categoria *</label>
                        <select
                          value={editingSkill.category}
                          onChange={(e) => setEditingSkill({ ...editingSkill, category: e.target.value as any })}
                          className="w-full bg-[#F5F3EE] border border-[#D9D5CB] rounded-[4px] px-3 py-2 text-[#17181A] text-xs font-mono focus:outline-none focus:border-[#0F766E]:border-[#2DD4BF] transition-colors"
                        >
                          <option value="suporte">Suporte & Infraestrutura</option>
                          <option value="redes">Redes & Telecom</option>
                          <option value="desenvolvimento">Vibe Coding & Automação</option>
                          <option value="ia">Inteligência Artificial</option>
                          <option value="soft">Habilidade Pessoal</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <label className="text-xs font-mono text-[#5B5E62]">Nível de Domínio: {editingSkill.level}%</label>
                        </div>
                        <input
                          type="range"
                          min="30"
                          max="100"
                          value={editingSkill.level}
                          onChange={(e) => setEditingSkill({ ...editingSkill, level: parseInt(e.target.value) })}
                          className="w-full h-1.5 bg-[#D9D5CB] rounded-[2px] appearance-none cursor-pointer accent-[#0F766E] mt-2"
                        />
                      </div>
                    </div>

                    <div className="flex gap-2 pt-3 border-t border-[#D9D5CB]">
                      <button
                        type="button"
                        onClick={() => { setEditingSkill(null); setEditingSkillIndex(null); }}
                        className="px-3 py-1.5 bg-[#FFFFFF] hover:bg-[#F5F3EE]:bg-[#121413] text-[#17181A] border border-[#D9D5CB] font-mono text-xs font-medium rounded-[4px] transition-colors cursor-pointer"
                      >
                        Voltar
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 bg-[#0F766E] hover:bg-[#115E59] text-white font-mono text-xs font-medium rounded-[4px] flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Save className="w-3.5 h-3.5" strokeWidth={1.5} aria-hidden="true" />
                        <span>Salvar</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* TAB 4: FORMAÇÃO ACADÊMICA */}
            {activeTab === 'educacao' && (
              <div className="space-y-6">
                {!editingEdu ? (
                  <>
                    <div className="flex items-center justify-between pb-3 border-b border-[#D9D5CB]">
                      <div>
                        <h3 className="text-base font-semibold text-[#17181A] flex items-center gap-2">
                          <GraduationCap className="w-4 h-4 text-[#0F766E]" strokeWidth={1.5} aria-hidden="true" />
                          <span>Formação Acadêmica</span>
                        </h3>
                        <p className="text-xs font-mono text-[#5B5E62] mt-1">
                          Gerencie seus diplomas, cursos técnicos ou superiores.
                        </p>
                      </div>
                      <button
                        onClick={startNewEducation}
                        className="px-3 py-1.5 bg-[#0F766E] hover:bg-[#115E59] text-white font-mono text-xs font-medium rounded-[4px] flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" strokeWidth={1.5} aria-hidden="true" />
                        <span>Nova Formação</span>
                      </button>
                    </div>

                    <div className="space-y-2">
                      {educations.map((edu, idx) => (
                        <div key={idx} className="border border-[#D9D5CB] p-3 rounded-[4px] flex items-center justify-between hover:border-[#0F766E]/40 transition-colors bg-[#FFFFFF]">
                          <div>
                            <span className="font-semibold text-xs text-[#17181A] block">{edu.degree}</span>
                            <span className="text-[11px] font-mono text-[#5B5E62] block mt-0.5">{edu.institution} • {edu.period} ({edu.status})</span>
                          </div>
                          
                          <div className="flex gap-1">
                            <button
                              onClick={() => { setEditingEdu(edu); setEditingEduIndex(idx); }}
                              className="p-1.5 text-[#5B5E62] hover:text-[#0F766E]:text-[#2DD4BF] rounded-[3px] hover:bg-[#F5F3EE]:bg-[#121413] transition-colors cursor-pointer"
                              title="Editar formação"
                              aria-label="Editar formação"
                            >
                              <Edit2 className="w-3.5 h-3.5" strokeWidth={1.5} aria-hidden="true" />
                            </button>
                            <button
                              onClick={() => handleDeleteEducation(idx)}
                              className="p-1.5 text-[#5B5E62] hover:text-red-600:text-red-400 rounded-[3px] hover:bg-red-50:bg-red-950/30 transition-colors cursor-pointer"
                              title="Deletar formação"
                              aria-label="Deletar formação"
                            >
                              <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} aria-hidden="true" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <form onSubmit={handleSaveEducation} className="space-y-4">
                    <div className="flex items-center justify-between border-b border-[#D9D5CB] pb-2">
                      <h4 className="text-xs font-mono font-semibold uppercase text-[#17181A]">
                        {editingEduIndex !== null ? 'Editar Formação' : 'Nova Formação'}
                      </h4>
                      <button
                        type="button"
                        onClick={() => { setEditingEdu(null); setEditingEduIndex(null); }}
                        className="text-xs font-mono text-[#5B5E62] hover:text-[#17181A]:text-[#ECEAE4] transition-colors cursor-pointer"
                      >
                        Cancelar
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-mono text-[#5B5E62] block">Título / Curso *</label>
                        <input
                          type="text"
                          required
                          value={editingEdu.degree}
                          onChange={(e) => setEditingEdu({ ...editingEdu, degree: e.target.value })}
                          className="w-full bg-[#F5F3EE] border border-[#D9D5CB] rounded-[4px] px-3 py-2 text-[#17181A] text-xs font-mono focus:outline-none focus:border-[#0F766E]:border-[#2DD4BF] transition-colors"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-mono text-[#5B5E62] block">Instituição *</label>
                        <input
                          type="text"
                          required
                          value={editingEdu.institution}
                          onChange={(e) => setEditingEdu({ ...editingEdu, institution: e.target.value })}
                          className="w-full bg-[#F5F3EE] border border-[#D9D5CB] rounded-[4px] px-3 py-2 text-[#17181A] text-xs font-mono focus:outline-none focus:border-[#0F766E]:border-[#2DD4BF] transition-colors"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-mono text-[#5B5E62] block">Período *</label>
                        <input
                          type="text"
                          required
                          value={editingEdu.period}
                          onChange={(e) => setEditingEdu({ ...editingEdu, period: e.target.value })}
                          className="w-full bg-[#F5F3EE] border border-[#D9D5CB] rounded-[4px] px-3 py-2 text-[#17181A] text-xs font-mono focus:outline-none focus:border-[#0F766E]:border-[#2DD4BF] transition-colors"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-mono text-[#5B5E62] block">Status *</label>
                        <select
                          value={editingEdu.status}
                          onChange={(e) => setEditingEdu({ ...editingEdu, status: e.target.value as any })}
                          className="w-full bg-[#F5F3EE] border border-[#D9D5CB] rounded-[4px] px-3 py-2 text-[#17181A] text-xs font-mono focus:outline-none focus:border-[#0F766E]:border-[#2DD4BF] transition-colors"
                        >
                          <option value="Concluído">Concluído</option>
                          <option value="Em andamento">Em andamento</option>
                          <option value="Cursado parcialmente">Cursado parcialmente</option>
                          <option value="Incompleto">Incompleto / Trancado</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-mono text-[#5B5E62] block">Descrição do Curso</label>
                      <input
                        type="text"
                        value={editingEdu.description}
                        onChange={(e) => setEditingEdu({ ...editingEdu, description: e.target.value })}
                        className="w-full bg-[#F5F3EE] border border-[#D9D5CB] rounded-[4px] px-3 py-2 text-[#17181A] text-xs font-mono focus:outline-none focus:border-[#0F766E]:border-[#2DD4BF] transition-colors"
                      />
                    </div>

                    <div className="flex gap-2 pt-3 border-t border-[#D9D5CB]">
                      <button
                        type="button"
                        onClick={() => { setEditingEdu(null); setEditingEduIndex(null); }}
                        className="px-3 py-1.5 bg-[#FFFFFF] hover:bg-[#F5F3EE]:bg-[#121413] text-[#17181A] border border-[#D9D5CB] font-mono text-xs font-medium rounded-[4px] transition-colors cursor-pointer"
                      >
                        Voltar
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 bg-[#0F766E] hover:bg-[#115E59] text-white font-mono text-xs font-medium rounded-[4px] flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Save className="w-3.5 h-3.5" strokeWidth={1.5} aria-hidden="true" />
                        <span>Salvar</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* TAB 5: CERTIFICAÇÕES */}
            {activeTab === 'certificacoes' && (
              <div className="space-y-6">
                {!editingCert ? (
                  <>
                    <div className="flex items-center justify-between pb-3 border-b border-[#D9D5CB]">
                      <div>
                        <h3 className="text-base font-semibold text-[#17181A] flex items-center gap-2">
                          <Award className="w-4 h-4 text-[#0F766E]" strokeWidth={1.5} aria-hidden="true" />
                          <span>Certificações & Cursos Livres</span>
                        </h3>
                        <p className="text-xs font-mono text-[#5B5E62] mt-1">
                          Adicione suas credenciais técnicas do mercado (ITIL, Ubiquiti, etc.).
                        </p>
                      </div>
                      <button
                        onClick={startNewCertification}
                        className="px-3 py-1.5 bg-[#0F766E] hover:bg-[#115E59] text-white font-mono text-xs font-medium rounded-[4px] flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" strokeWidth={1.5} aria-hidden="true" />
                        <span>Nova Certificação</span>
                      </button>
                    </div>

                    <div className="space-y-2">
                      {certifications.map((cert, idx) => (
                        <div key={idx} className="border border-[#D9D5CB] p-3 rounded-[4px] flex items-center justify-between hover:border-[#0F766E]/40 transition-colors bg-[#FFFFFF]">
                          <div>
                            <span className="font-semibold text-xs text-[#17181A] block">{cert.name}</span>
                            <span className="text-[11px] font-mono text-[#5B5E62] block mt-0.5">{cert.institution} • {cert.year}</span>
                          </div>
                          
                          <div className="flex gap-1">
                            <button
                              onClick={() => { setEditingCert(cert); setEditingCertIndex(idx); }}
                              className="p-1.5 text-[#5B5E62] hover:text-[#0F766E]:text-[#2DD4BF] rounded-[3px] hover:bg-[#F5F3EE]:bg-[#121413] transition-colors cursor-pointer"
                              title="Editar certificação"
                              aria-label="Editar certificação"
                            >
                              <Edit2 className="w-3.5 h-3.5" strokeWidth={1.5} aria-hidden="true" />
                            </button>
                            <button
                              onClick={() => handleDeleteCertification(idx)}
                              className="p-1.5 text-[#5B5E62] hover:text-red-600:text-red-400 rounded-[3px] hover:bg-red-50:bg-red-950/30 transition-colors cursor-pointer"
                              title="Deletar certificação"
                              aria-label="Deletar certificação"
                            >
                              <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} aria-hidden="true" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <form onSubmit={handleSaveCertification} className="space-y-4">
                    <div className="flex items-center justify-between border-b border-[#D9D5CB] pb-2">
                      <h4 className="text-xs font-mono font-semibold uppercase text-[#17181A]">
                        {editingCertIndex !== null ? 'Editar Certificação' : 'Nova Certificação'}
                      </h4>
                      <button
                        type="button"
                        onClick={() => { setEditingCert(null); setEditingCertIndex(null); }}
                        className="text-xs font-mono text-[#5B5E62] hover:text-[#17181A]:text-[#ECEAE4] transition-colors cursor-pointer"
                      >
                        Cancelar
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-mono text-[#5B5E62] block">Nome da Certificação *</label>
                        <input
                          type="text"
                          required
                          value={editingCert.name}
                          onChange={(e) => setEditingCert({ ...editingCert, name: e.target.value })}
                          className="w-full bg-[#F5F3EE] border border-[#D9D5CB] rounded-[4px] px-3 py-2 text-[#17181A] text-xs font-mono focus:outline-none focus:border-[#0F766E]:border-[#2DD4BF] transition-colors"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-mono text-[#5B5E62] block">Emissor / Instituição *</label>
                        <input
                          type="text"
                          required
                          value={editingCert.institution}
                          onChange={(e) => setEditingCert({ ...editingCert, institution: e.target.value })}
                          className="w-full bg-[#F5F3EE] border border-[#D9D5CB] rounded-[4px] px-3 py-2 text-[#17181A] text-xs font-mono focus:outline-none focus:border-[#0F766E]:border-[#2DD4BF] transition-colors"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-mono text-[#5B5E62] block">Ano de Emissão *</label>
                        <input
                          type="text"
                          required
                          value={editingCert.year}
                          onChange={(e) => setEditingCert({ ...editingCert, year: e.target.value })}
                          className="w-full bg-[#F5F3EE] border border-[#D9D5CB] rounded-[4px] px-3 py-2 text-[#17181A] text-xs font-mono focus:outline-none focus:border-[#0F766E]:border-[#2DD4BF] transition-colors"
                        />
                      </div>
                      <div className="space-y-1 sm:col-span-2">
                        <label className="text-xs font-mono text-[#5B5E62] block">Descrição Resumida</label>
                        <input
                          type="text"
                          value={editingCert.description}
                          onChange={(e) => setEditingCert({ ...editingCert, description: e.target.value })}
                          className="w-full bg-[#F5F3EE] border border-[#D9D5CB] rounded-[4px] px-3 py-2 text-[#17181A] text-xs font-mono focus:outline-none focus:border-[#0F766E]:border-[#2DD4BF] transition-colors"
                        />
                      </div>
                    </div>

                    <div className="flex gap-2 pt-3 border-t border-[#D9D5CB]">
                      <button
                        type="button"
                        onClick={() => { setEditingCert(null); setEditingCertIndex(null); }}
                        className="px-3 py-1.5 bg-[#FFFFFF] hover:bg-[#F5F3EE]:bg-[#121413] text-[#17181A] border border-[#D9D5CB] font-mono text-xs font-medium rounded-[4px] transition-colors cursor-pointer"
                      >
                        Voltar
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 bg-[#0F766E] hover:bg-[#115E59] text-white font-mono text-xs font-medium rounded-[4px] flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Save className="w-3.5 h-3.5" strokeWidth={1.5} aria-hidden="true" />
                        <span>Salvar</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* TAB 7: GERADOR DE CARTAS */}
            {activeTab === 'cartas' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-[#17181A] flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#0F766E]" strokeWidth={1.5} aria-hidden="true" />
                    <span>Gerador de Cartas de Apresentação</span>
                  </h3>
                  <p className="text-xs text-[#5B5E62] mt-1 leading-relaxed">
                    Gere cartas de apresentação personalizadas de forma rápida para cada vaga que você se candidatar, usando seus dados profissionais cadastrados.
                  </p>
                </div>

                <div className="bg-[#FFFFFF] border border-[#D9D5CB] rounded-[4px] p-4 sm:p-5">
                  <CoverLetterGenerator personalInfo={personalInfo} />
                </div>
              </div>
            )}

            {/* TAB 8: CURRICULO COM FOTO (EXCLUSIVO ADM) */}
            {activeTab === 'curriculo_foto' && (
              <div className="space-y-6">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#0F766E]/10 border border-[#0F766E]/30 text-[#0F766E] text-xs font-mono font-medium rounded-[3px] mb-2">
                    <Camera className="w-3.5 h-3.5" strokeWidth={1.5} aria-hidden="true" />
                    <span>Exclusivo do Painel Administrativo</span>
                  </div>
                  <h3 className="text-lg font-semibold text-[#17181A] flex items-center gap-2">
                    <Printer className="w-4 h-4 text-[#0F766E]" strokeWidth={1.5} aria-hidden="true" />
                    <span>Baixar Currículo com Foto (PDF)</span>
                  </h3>
                  <p className="text-xs text-[#5B5E62] mt-1 leading-relaxed">
                    Gere e imprima ou salve em PDF o seu currículo oficial contendo sua foto de perfil integrada no topo. Na aba pública, o currículo permanece sem foto, preservando seu padrão discreto para recrutadores gerais.
                  </p>
                </div>

                {/* Main Action & Preview Card */}
                <div className="bg-[#FFFFFF] text-[#17181A] rounded-[4px] p-5 sm:p-6 border border-[#D9D5CB]">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    
                    {/* Left: Photo & Candidate Info */}
                    <div className="flex items-center gap-4">
                      <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-[4px] overflow-hidden border border-[#D9D5CB] bg-[#F5F3EE] shrink-0">
                        <img 
                          src={personalInfo.imageUrl || "/foto_perfil/samuel.png"} 
                          alt={personalInfo.fullName}
                          className="w-full h-full object-cover object-top grayscale"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-[3px] bg-[#0F766E]/10 text-[#0F766E] border border-[#0F766E]/30 font-medium">
                            Foto Integrada
                          </span>
                          <span className="text-[11px] font-mono text-[#5B5E62]">
                            A4 Portrait
                          </span>
                        </div>
                        <h4 className="text-base font-semibold text-[#17181A] mt-1 uppercase tracking-tight">
                          {personalInfo.fullName}
                        </h4>
                        <p className="font-mono text-xs text-[#0F766E]">
                          {personalInfo.title}
                        </p>
                        <p className="font-mono text-[11px] text-[#5B5E62] mt-0.5">
                          {personalInfo.email} • {personalInfo.phone}
                        </p>
                      </div>
                    </div>

                    {/* Right: Primary Action Button */}
                    <div className="w-full md:w-auto shrink-0">
                      {onDownloadWithPhoto && (
                        <button
                          type="button"
                          onClick={onDownloadWithPhoto}
                          className="w-full md:w-auto px-4 py-2.5 bg-[#0F766E] hover:bg-[#115E59] text-white font-mono text-xs font-medium rounded-[4px] flex items-center justify-center gap-2 transition-colors cursor-pointer"
                        >
                          <Printer className="w-3.5 h-3.5" strokeWidth={1.5} aria-hidden="true" />
                          <Download className="w-3.5 h-3.5" strokeWidth={1.5} aria-hidden="true" />
                          <span>Imprimir / Salvar PDF com Foto</span>
                        </button>
                      )}
                    </div>

                  </div>

                  {/* Feature Highlights */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-[#D9D5CB] text-xs font-mono text-[#5B5E62]">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[#0F766E] font-bold">✓</span>
                      <span>Foto 3x4 integrada</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[#0F766E] font-bold">✓</span>
                      <span>Margens A4 calibradas</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[#0F766E] font-bold">✓</span>
                      <span>Sem propagandas</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[#0F766E] font-bold">✓</span>
                      <span>Padrão Corporativo</span>
                    </div>
                  </div>
                </div>

                {/* Instructions on how to save as PDF */}
                <div className="bg-[#F5F3EE] border border-[#D9D5CB] rounded-[4px] p-5 space-y-2.5">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-[#17181A] font-semibold flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-[#5B5E62]" strokeWidth={1.5} aria-hidden="true" />
                    Como Salvar o PDF no Navegador
                  </h4>
                  <ol className="list-decimal list-inside text-xs text-[#5B5E62] space-y-1.5 leading-relaxed font-mono">
                    <li>
                      Clique no botão <strong>"Imprimir / Salvar PDF com Foto"</strong> acima.
                    </li>
                    <li>
                      No campo <strong>Destino</strong> (ou Impressora), selecione a opção <strong>"Salvar como PDF"</strong>.
                    </li>
                    <li>
                      Defina o tamanho do papel como <strong>A4</strong> e a orientação como <strong>Retrato</strong>.
                    </li>
                    <li>
                      Em opções adicionais, certifique-se de marcar <strong>"Gráficos de segundo plano"</strong>.
                    </li>
                  </ol>
                </div>
              </div>
            )}

            {/* TAB 8: QR CODE & LINK DO SITE */}
            {activeTab === 'qrcode' && (
              <div className="space-y-6">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#0F766E]/10 border border-[#0F766E]/30 text-[#0F766E] text-xs font-mono font-medium rounded-[3px] mb-2">
                    <QrCode className="w-3.5 h-3.5" strokeWidth={1.5} aria-hidden="true" />
                    <span>Acesso Mobile & Compartilhamento</span>
                  </div>
                  <h3 className="text-lg font-semibold text-[#17181A] flex items-center gap-2">
                    <span>QR Code Oficial do Portfólio</span>
                  </h3>
                  <p className="text-xs text-[#5B5E62] mt-1 leading-relaxed">
                    Escaneie diretamente com a câmera do celular para acessar o site na Vercel ou baixe o QR Code em alta definição para estampar em currículos físicos e apresentações.
                  </p>
                </div>

                {/* Target URL Bar with copy and test link */}
                <div className="bg-[#FFFFFF] border border-[#D9D5CB] rounded-[4px] p-4 text-[#17181A]">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-0.5 min-w-0">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#5B5E62] block">
                        Link de Destino Oficial do Portfólio
                      </span>
                      <div className="flex items-center gap-2 font-mono text-xs font-semibold text-[#0F766E] break-all">
                        <Globe className="w-3.5 h-3.5 shrink-0 text-[#0F766E]" strokeWidth={1.5} aria-hidden="true" />
                        <span className="truncate">{personalInfo.websiteUrl || 'https://samuel-victor-da-silva-nobre.vercel.app/'}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={handleCopyLink}
                        className="px-3 py-1.5 bg-[#FFFFFF] hover:bg-[#F5F3EE]:bg-[#121413] text-[#17181A] rounded-[4px] text-xs font-mono font-medium flex items-center gap-1.5 border border-[#D9D5CB] transition-colors cursor-pointer"
                      >
                        {copiedLink ? <Check className="w-3.5 h-3.5 text-[#0F766E]" strokeWidth={1.5} aria-hidden="true" /> : <Copy className="w-3.5 h-3.5 text-[#5B5E62]" strokeWidth={1.5} aria-hidden="true" />}
                        <span>{copiedLink ? 'Link Copiado' : 'Copiar Link'}</span>
                      </button>

                      <a
                        href={personalInfo.websiteUrl || 'https://samuel-victor-da-silva-nobre.vercel.app/'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 bg-[#0F766E] hover:bg-[#115E59] text-white rounded-[4px] text-xs font-mono font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <ExternalLink className="w-3.5 h-3.5" strokeWidth={1.5} aria-hidden="true" />
                        <span>Abrir Site</span>
                      </a>
                    </div>
                  </div>
                </div>

                {/* QR Code Presentation Box */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
                  
                  {/* Left: Scannable QR Code Frame */}
                  <div className="md:col-span-6 bg-[#FFFFFF] border border-[#D9D5CB] rounded-[4px] p-6 flex flex-col items-center justify-center text-center">
                    
                    {/* White Card holding the crisp QR Code */}
                    <div className="bg-white p-3 rounded-[4px] border border-[#D9D5CB]">
                      <QRCodeSVG
                        value={personalInfo.websiteUrl || 'https://samuel-victor-da-silva-nobre.vercel.app/'}
                        size={190}
                        level="H"
                        includeMargin={false}
                        bgColor="#ffffff"
                        fgColor="#17181A"
                      />
                    </div>

                    {/* Hidden high-res canvas for 1024x1024 export */}
                    <div className="hidden">
                      <QRCodeCanvas
                        id="admin-portfolio-qr-canvas"
                        value={personalInfo.websiteUrl || 'https://samuel-victor-da-silva-nobre.vercel.app/'}
                        size={1024}
                        level="H"
                        includeMargin={true}
                        bgColor="#ffffff"
                        fgColor="#17181A"
                      />
                    </div>

                    <div className="mt-4 space-y-1">
                      <span className="font-mono text-[11px] text-[#0F766E] font-semibold uppercase tracking-wider">
                        ● Pronto para Leitura
                      </span>
                      <p className="text-xs text-[#5B5E62] font-mono">
                        Aponte a câmera do smartphone para testar
                      </p>
                    </div>

                    {/* Download HD Button */}
                    <button
                      type="button"
                      onClick={handleDownloadQrCode}
                      className="mt-4 w-full py-2 bg-[#17181A] hover:opacity-90 text-[#F5F3EE] rounded-[4px] text-xs font-mono font-medium flex items-center justify-center gap-2 transition-opacity cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" strokeWidth={1.5} aria-hidden="true" />
                      <span>Baixar QR Code (PNG HD)</span>
                    </button>
                  </div>

                  {/* Right: Settings and Curriculum Integration Card */}
                  <div className="md:col-span-6 space-y-4 flex flex-col justify-between">
                    
                    {/* URL Edit Form */}
                    <div className="bg-[#FFFFFF] border border-[#D9D5CB] rounded-[4px] p-4 space-y-2">
                      <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-[#17181A] flex items-center gap-1.5">
                        <Settings className="w-3.5 h-3.5 text-[#5B5E62]" strokeWidth={1.5} aria-hidden="true" />
                        <span>Configurar Link Oficial</span>
                      </h4>
                      <p className="text-xs text-[#5B5E62] leading-relaxed">
                        Se você atualizar o domínio, altere aqui. O QR Code e o currículo impresso serão sincronizados imediatamente.
                      </p>

                      <div className="space-y-1 pt-1">
                        <label className="text-xs font-mono text-[#5B5E62] block">URL do Portfólio</label>
                        <input
                          type="url"
                          value={personalInfo.websiteUrl || ''}
                          onChange={(e) => handleSavePersonalInfo('websiteUrl', e.target.value)}
                          placeholder="https://samuel-victor-da-silva-nobre.vercel.app/"
                          className="w-full bg-[#F5F3EE] border border-[#D9D5CB] rounded-[4px] px-3 py-2 text-[#17181A] text-xs font-mono focus:outline-none focus:border-[#0F766E]:border-[#2DD4BF] transition-colors"
                        />
                      </div>
                    </div>

                    {/* Resume Integration Callout */}
                    <div className="bg-[#F5F3EE] border border-[#D9D5CB] rounded-[4px] p-4 space-y-2">
                      <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-[#17181A] flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-[#5B5E62]" strokeWidth={1.5} aria-hidden="true" />
                        <span>Integração no Currículo</span>
                      </h4>
                      <p className="text-xs text-[#5B5E62] leading-relaxed">
                        Ao imprimir ou salvar o currículo em PDF, este QR Code é exibido no topo do cabeçalho ao lado do link curto textual.
                      </p>

                      <div className="flex flex-col sm:flex-row gap-2 pt-1">
                        <button
                          type="button"
                          onClick={onClose}
                          className="flex-1 py-1.5 bg-[#FFFFFF] hover:bg-[#F5F3EE]:bg-[#121413] text-[#17181A] rounded-[4px] text-xs font-mono font-medium flex items-center justify-center gap-1.5 border border-[#D9D5CB] transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5 text-[#5B5E62]" strokeWidth={1.5} aria-hidden="true" />
                          <span>Ver Portfólio</span>
                        </button>
                        {onDownloadWithPhoto && (
                          <button
                            type="button"
                            onClick={onDownloadWithPhoto}
                            className="flex-1 py-1.5 bg-[#0F766E] hover:bg-[#115E59] text-white rounded-[4px] text-xs font-mono font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <Printer className="w-3.5 h-3.5" strokeWidth={1.5} aria-hidden="true" />
                            <span>Imprimir com QR Code</span>
                          </button>
                        )}
                      </div>
                    </div>

                  </div>

                </div>

                {/* Practical Tips Grid */}
                <div className="bg-[#FFFFFF] border border-[#D9D5CB] rounded-[4px] p-4 sm:p-5 space-y-3">
                  <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-[#17181A]">
                    Aplicações do QR Code
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3 bg-[#F5F3EE] border border-[#D9D5CB] rounded-[4px] space-y-1">
                      <span className="font-mono text-xs font-semibold text-[#17181A] block">
                        01 — Entrevistas
                      </span>
                      <p className="text-[11px] text-[#5B5E62] leading-relaxed">
                        Apresente seu currículo impresso com QR Code para o recrutador navegar nos projetos ao vivo pelo celular.
                      </p>
                    </div>

                    <div className="p-3 bg-[#F5F3EE] border border-[#D9D5CB] rounded-[4px] space-y-1">
                      <span className="font-mono text-xs font-semibold text-[#17181A] block">
                        02 — Material Físico
                      </span>
                      <p className="text-[11px] text-[#5B5E62] leading-relaxed">
                        Exporte o PNG em alta resolução para cartões de visita profissionais e crachás de eventos técnicos.
                      </p>
                    </div>

                    <div className="p-3 bg-[#F5F3EE] border border-[#D9D5CB] rounded-[4px] space-y-1">
                      <span className="font-mono text-xs font-semibold text-[#17181A] block">
                        03 — Redes & Perfil
                      </span>
                      <p className="text-[11px] text-[#5B5E62] leading-relaxed">
                        Disponibilize o link direto no LinkedIn para permitir acesso rápido à sua documentação profissional.
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
