import React, { useState, useEffect } from 'react';
import { 
  X, 
  FileText, 
  Printer, 
  Download, 
  QrCode, 
  Copy, 
  Check, 
  ExternalLink, 
  Sparkles,
  MessageSquare,
  KeyRound,
  CheckSquare,
  Activity,
  Image,
  CheckCircle2
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { PersonalInfo } from '../types';
import { trackEvent } from '../services/tracker';
import CoverLetterGenerator from './CoverLetterGenerator';
import InterviewPrep from './InterviewPrep';
import AdminAccessLog from './AdminAccessLog';

interface AdminPanelProps {
  isOpen?: boolean;
  personalInfo: PersonalInfo;
  onClose: () => void;
  onPrintResume?: (withPhoto: boolean) => void;
}

export default function AdminPanel({
  personalInfo,
  onClose,
  onPrintResume
}: AdminPanelProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState(false);
  const [activeTab, setActiveTab] = useState<
    'acessos' | 'cartas' | 'curriculo' | 'qrcode' | 'mensagens' | 'ats' | 'entrevistas'
  >('acessos');

  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedMsgIdx, setCopiedMsgIdx] = useState<number | null>(null);
  const [copiedAts, setCopiedAts] = useState(false);
  const [resumePhotoChoice, setResumePhotoChoice] = useState<'sem_foto' | 'com_foto'>('sem_foto');

  useEffect(() => {
    trackEvent('abrir_admin', 'Painel Administrativo exibido na tela');
    // Limpeza de chaves residuais de abas removidas
    try {
      localStorage.removeItem('jobtracker_applications');
      localStorage.removeItem('jobtracker_stories');
    } catch {
      // ignore
    }
  }, []);

  const websiteUrl = personalInfo.websiteUrl || 'https://samuel-victor-da-silva-nobre.vercel.app/';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '075561@Sam') {
      setIsAuthenticated(true);
      setAuthError(false);
      trackEvent('abrir_admin', 'Autenticação bem-sucedida no Painel Admin');
    } else {
      setAuthError(true);
      trackEvent('abrir_admin', 'Tentativa de login no Admin com senha inválida');
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(websiteUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const recruiterTemplates = [
    {
      title: 'WhatsApp: Apresentação Rápida para Recrutador',
      content: `Olá! Me chamo Samuel Victor e sou profissional de Suporte Técnico N1/N2, Infraestrutura de Redes e Telecomunicações, com 5 anos de experiência prática em atendimento a incidentes, equipamentos de telecom e fibra óptica.

Vi a oportunidade aberta e gostaria de compartilhar meu portfólio profissional e currículo completo:
${websiteUrl}

Estou aberto a novas oportunidades (Presencial, Híbrido ou Remoto) com disponibilidade imediata. Agradeço desde já pela atenção!`
    },
    {
      title: 'LinkedIn: Nota Personalizada para Conexão',
      content: `Olá! Acompanho as oportunidades da sua equipe e me identifico muito com o perfil técnico de vocês. Atuo há 5 anos com Suporte N1/N2, Redes TCP/IP, equipamentos de telecom e infraestrutura óptica. Gostaria de me conectar e compartilhar meu portfólio: ${websiteUrl}. Um abraço!`
    },
    {
      title: 'E-mail: Apresentação Formal de Candidatura',
      content: `Prezada equipe de Recrutamento e Seleção,

Gostaria de manifestar meu interesse em oportunidades nas áreas de Suporte Técnico de TI (N1/N2), Infraestrutura de Redes e Telecomunicações.

Com 5 anos de experiência comprovada no suporte a incidentes, operação de laboratório de redes, configuração de roteadores/switches, instrumentação óptica (OTDR, Power Meter) e cabeamento estruturado, busco somar com proatividade, resolução ágil de chamados e boas práticas de governança ITIL v4.

Meu portfólio completo com projetos, certificações e currículo para download está disponível no link:
${websiteUrl}

Fico à disposição para uma entrevista e agradeço pela consideração.

Atenciosamente,
${personalInfo.fullName}
${personalInfo.phone} | ${personalInfo.email}`
    }
  ];

  const handleCopyMessage = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedMsgIdx(index);
    setTimeout(() => setCopiedMsgIdx(null), 2000);
  };

  const atsKeywords = [
    'Suporte Técnico N1/N2', 'Service Desk', 'Help Desk', 'Gestão de Incidentes', 'ITIL v4',
    'Equipamentos de Rede', 'Switches Gerenciáveis L2/L3', 'Roteadores Corporativos', 'Modems',
    'Telecomunicações', 'FTTH', 'GPON', 'EPON', 'XGS-PON', 'OTDR (Reflectômetro Óptico)',
    'Medição de Potência (Power Meter)', 'VFL (Caneta Óptica)', 'Fusão de Fibra Óptica (Arco Voltaico)',
    'Configuração e Homologação de OLT e ONU', 'Infraestrutura Passiva Óptica', 'DIO e Caixas de Emenda (CTO)',
    'Wi-Fi Corporativo', 'Ubiquiti UniFi (UEWA)', 'Cabeamento Estruturado Cat6', 'Racks e Patch Panels',
    'Redes TCP/IP', 'Sub-redes', 'Protocolos DNS/DHCP/PPPoE', 'Diagnóstico de Incidentes Físicos e Lógicos',
    'Atendimento ao Usuário', 'Active Directory (Conhecimento Teórico)', 'Zabbix & pfSense (Conhecimento Teórico)',
    'Docker Containers (Fundamentos Teóricos)', 'Automação com Python', 'APIs REST', 'Vibe Coding', 'Inteligência Artificial', 'GitHub: samueix'
  ];

  const handleCopyAts = () => {
    navigator.clipboard.writeText(atsKeywords.join(', '));
    setCopiedAts(true);
    setTimeout(() => setCopiedAts(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1B2430]/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto no-print">
      <div className="bg-[#FFFFFF] border border-[#E6E1D6] rounded-[16px] w-full max-w-4xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh]">
        
        {/* Header do Kit do Candidato */}
        <div className="p-4 sm:p-6 bg-[#FFFBF2] border-b border-[#E6E1D6] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#0F766E] text-white flex items-center justify-center shadow-sm">
              <Sparkles className="w-5 h-5 text-white" strokeWidth={2.2} />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold font-display text-[#1B2430]">
                Kit do Candidato & Ferramentas de Carreira
              </h3>
              <p className="text-xs text-[#4A5565] font-medium">
                Recursos essenciais para processos seletivos e monitoramento
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-[#4A5565] hover:text-[#1B2430] hover:bg-[#F1EEE6] rounded-full transition-colors cursor-pointer"
            aria-label="Fechar painel"
          >
            <X className="w-5 h-5" strokeWidth={2.2} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-white">
          {!isAuthenticated ? (
            <div className="max-w-md mx-auto py-8 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#F1EEE6] text-[#0F766E] mx-auto flex items-center justify-center border border-[#E6E1D6]">
                <KeyRound className="w-6 h-6" strokeWidth={2} />
              </div>
              <div>
                <h4 className="text-lg font-bold font-display text-[#1B2430]">
                  Acesso aos Recursos de Carreira
                </h4>
                <p className="text-xs sm:text-sm text-[#4A5565] mt-1 font-medium">
                  Digite sua senha para acessar o monitoramento de acessos, geradores de cartas, modelos de abordagem e impressão de currículo.
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-3 pt-2 text-left">
                <div>
                  <input
                    type="password"
                    placeholder="Digite sua senha..."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-[8px] bg-[#FFFBF2] border border-[#E6E1D6] text-sm text-[#1B2430] focus:outline-none focus:border-[#0F766E] transition-colors"
                  />
                  {authError && (
                    <p className="text-xs text-[#C2410C] font-semibold mt-1.5">
                      Senha incorreta. Tente novamente.
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#0F766E] hover:bg-[#0C5F58] text-white font-bold text-sm rounded-[8px] transition-all cursor-pointer shadow-sm"
                >
                  Entrar no Painel Admin
                </button>
              </form>
            </div>
          ) : (
            <div className="space-y-6">
              
              {/* Navigation Tabs */}
              <div className="flex flex-wrap gap-2 border-b border-[#E6E1D6] pb-3">
                <button
                  onClick={() => setActiveTab('acessos')}
                  className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'acessos'
                      ? 'bg-[#0F766E] text-white shadow-sm'
                      : 'bg-[#FFFBF2] text-[#4A5565] hover:bg-[#F1EEE6] border border-[#E6E1D6]'
                  }`}
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span>Acessos & Mensagens</span>
                </button>

                <button
                  onClick={() => setActiveTab('cartas')}
                  className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'cartas'
                      ? 'bg-[#0F766E] text-white shadow-sm'
                      : 'bg-[#FFFBF2] text-[#4A5565] hover:bg-[#F1EEE6] border border-[#E6E1D6]'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Cartas de Apresentação</span>
                </button>

                <button
                  onClick={() => setActiveTab('curriculo')}
                  className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'curriculo'
                      ? 'bg-[#0F766E] text-white shadow-sm'
                      : 'bg-[#FFFBF2] text-[#4A5565] hover:bg-[#F1EEE6] border border-[#E6E1D6]'
                  }`}
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Currículo & Impressão</span>
                </button>

                <button
                  onClick={() => setActiveTab('qrcode')}
                  className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'qrcode'
                      ? 'bg-[#0F766E] text-white shadow-sm'
                      : 'bg-[#FFFBF2] text-[#4A5565] hover:bg-[#F1EEE6] border border-[#E6E1D6]'
                  }`}
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>QR Code</span>
                </button>

                <button
                  onClick={() => setActiveTab('mensagens')}
                  className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'mensagens'
                      ? 'bg-[#0F766E] text-white shadow-sm'
                      : 'bg-[#FFFBF2] text-[#4A5565] hover:bg-[#F1EEE6] border border-[#E6E1D6]'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Abordagem Recrutadores</span>
                </button>

                <button
                  onClick={() => setActiveTab('ats')}
                  className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'ats'
                      ? 'bg-[#0F766E] text-white shadow-sm'
                      : 'bg-[#FFFBF2] text-[#4A5565] hover:bg-[#F1EEE6] border border-[#E6E1D6]'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Palavras-chave ATS</span>
                </button>

                <button
                  onClick={() => setActiveTab('entrevistas')}
                  className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'entrevistas'
                      ? 'bg-[#0F766E] text-white shadow-sm'
                      : 'bg-[#FFFBF2] text-[#4A5565] hover:bg-[#F1EEE6] border border-[#E6E1D6]'
                  }`}
                >
                  <CheckSquare className="w-3.5 h-3.5" />
                  <span>Checklist Entrevistas</span>
                </button>
              </div>

              {/* Tab 1: Nova Aba Acessos & Mensagens */}
              {activeTab === 'acessos' && (
                <AdminAccessLog />
              )}

              {/* Tab 2: Gerador de Cartas de Apresentação */}
              {activeTab === 'cartas' && (
                <div>
                  <CoverLetterGenerator personalInfo={personalInfo} />
                </div>
              )}

              {/* Tab 3: Currículo & Impressão Rápida com escolha de foto */}
              {activeTab === 'curriculo' && (
                <div className="space-y-5">
                  <div className="bg-[#FFFBF2] border border-[#E6E1D6] p-5 rounded-[12px] space-y-4">
                    <h4 className="text-sm font-bold text-[#1B2430] uppercase tracking-wide">
                      Opções Rápidas de Impressão e Salvamento em PDF
                    </h4>
                    <p className="text-xs sm:text-sm text-[#4A5565] leading-relaxed font-medium">
                      Gere o currículo oficial de 2 páginas no padrão A4 com margens de 12mm, tipografia limpa sem palavras coladas e layout em largura total.
                    </p>

                    {/* Escolha do Formato com ou sem foto */}
                    <div className="space-y-2 pt-1">
                      <label className="text-xs font-bold uppercase tracking-wider text-[#1B2430] block">
                        Opção de Foto no Cabeçalho do Currículo:
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setResumePhotoChoice('sem_foto')}
                          className={`p-3.5 rounded-[8px] border text-left transition-all cursor-pointer flex flex-col justify-between ${
                            resumePhotoChoice === 'sem_foto'
                              ? 'bg-white border-[#0F766E] shadow-xs'
                              : 'bg-[#FAF9F5] border-[#E6E1D6] hover:bg-white'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                              resumePhotoChoice === 'sem_foto' ? 'border-[#0F766E]' : 'border-[#D9D5CB]'
                            }`}>
                              {resumePhotoChoice === 'sem_foto' && <div className="w-2 h-2 rounded-full bg-[#0F766E]" />}
                            </div>
                            <span className="font-bold text-xs sm:text-sm text-[#1B2430]">
                              Sem foto (padrão, melhor para ATS)
                            </span>
                          </div>
                          <p className="text-[11px] text-[#4A5565] mt-1.5 pl-6 leading-relaxed">
                            Formato limpo e universal para portais de vagas e sistemas automatizados de triagem ATS.
                          </p>
                        </button>

                        <button
                          type="button"
                          onClick={() => setResumePhotoChoice('com_foto')}
                          className={`p-3.5 rounded-[8px] border text-left transition-all cursor-pointer flex flex-col justify-between ${
                            resumePhotoChoice === 'com_foto'
                              ? 'bg-white border-[#0F766E] shadow-xs'
                              : 'bg-[#FAF9F5] border-[#E6E1D6] hover:bg-white'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                              resumePhotoChoice === 'com_foto' ? 'border-[#0F766E]' : 'border-[#D9D5CB]'
                            }`}>
                              {resumePhotoChoice === 'com_foto' && <div className="w-2 h-2 rounded-full bg-[#0F766E]" />}
                            </div>
                            <span className="font-bold text-xs sm:text-sm text-[#1B2430]">
                              Com foto (3x4 profissional)
                            </span>
                          </div>
                          <p className="text-[11px] text-[#4A5565] mt-1.5 pl-6 leading-relaxed">
                            Foto 3x4 (28x35mm) à esquerda do nome com cantos de 3px e QR Code à direita.
                          </p>
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3 pt-2">
                      <button
                        onClick={() => {
                          trackEvent('imprimir_curriculo', `Botão Imprimir dentro do Admin (${resumePhotoChoice})`);
                          if (onPrintResume) {
                            onPrintResume(resumePhotoChoice === 'com_foto');
                          } else {
                            onClose();
                            window.scrollTo({ top: 0, behavior: 'instant' });
                            setTimeout(() => {
                              window.print();
                            }, 300);
                          }
                        }}
                        className="px-5 py-3 bg-[#0F766E] hover:bg-[#0C5F58] text-white rounded-full text-xs sm:text-sm font-bold flex items-center gap-2 transition-transform hover:-translate-y-0.5 cursor-pointer shadow-sm"
                      >
                        <Printer className="w-4 h-4" />
                        <span>
                          {resumePhotoChoice === 'com_foto'
                            ? 'Imprimir / Salvar PDF (Com Foto 3x4)'
                            : 'Imprimir / Salvar PDF (A4 Oficial Sem Foto)'}
                        </span>
                      </button>

                      <a
                        href={websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-5 py-3 bg-[#FFFFFF] hover:bg-[#F1EEE6] text-[#1B2430] border border-[#E6E1D6] rounded-full text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>Abrir Portfólio Online</span>
                      </a>
                    </div>
                  </div>

                  <div className="p-4 bg-white border border-[#E6E1D6] rounded-[12px] text-xs font-mono text-[#5B5E62] space-y-1.5">
                    <p className="font-bold text-[#1B2430]">Dicas para envio em portais de vagas:</p>
                    <p>• Na janela de impressão do navegador, selecione <strong>"Salvar como PDF"</strong>.</p>
                    <p>• Marque <strong>"Gráficos de segundo plano"</strong> para manter os marcadores e a foto nítidos.</p>
                    <p>• O título sugerido do arquivo será <strong>"Samuel Victor da Silva Nobre - Currículo{resumePhotoChoice === 'com_foto' ? ' (com foto)' : ''}"</strong>.</p>
                    <p>• Tamanho do papel: <strong>A4</strong> | Margens: <strong>Padrão</strong>.</p>
                  </div>
                </div>
              )}

              {/* Tab 4: QR Code do Portfólio */}
              {activeTab === 'qrcode' && (
                <div className="space-y-6">
                  <div className="bg-[#FFFBF2] border border-[#E6E1D6] p-6 rounded-[12px] flex flex-col md:flex-row items-center gap-6">
                    <div className="p-3 bg-white border border-[#E6E1D6] rounded-[8px] shadow-sm shrink-0">
                      <QRCodeSVG 
                        value={websiteUrl}
                        size={160}
                        level="H"
                        bgColor="#ffffff"
                        fgColor="#1B2430"
                      />
                    </div>

                    <div className="space-y-3 flex-1 text-center md:text-left">
                      <h4 className="text-base font-bold font-display text-[#1B2430]">
                        QR Code Direto para o Portfólio
                      </h4>
                      <p className="text-xs sm:text-sm text-[#4A5565] leading-relaxed">
                        Coloque este QR Code no cabeçalho do seu currículo físico impresso, cartões de visita ou apresentações técnicas para que recrutadores acessem seu portfólio apontando a câmera do celular.
                      </p>

                      <div className="flex flex-wrap items-center gap-2 justify-center md:justify-start pt-1">
                        <button
                          onClick={handleCopyLink}
                          className="px-4 py-2 bg-white hover:bg-[#F1EEE6] text-[#0F766E] border border-[#0F766E] rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                        >
                          {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedLink ? 'Link Copiado!' : 'Copiar Link do Portfólio'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 5: Modelos de Abordagem para Recrutadores */}
              {activeTab === 'mensagens' && (
                <div className="space-y-4">
                  <p className="text-xs sm:text-sm text-[#4A5565] font-medium leading-relaxed">
                    Copie mensagens prontas e objetivas para enviar a recrutadores e gerentes de TI, já configuradas com seu nome e link do portfólio.
                  </p>

                  <div className="space-y-4">
                    {recruiterTemplates.map((template, idx) => (
                      <div key={idx} className="bg-[#FFFBF2] border border-[#E6E1D6] p-4 sm:p-5 rounded-[12px] space-y-3">
                        <div className="flex items-center justify-between gap-3 border-b border-[#E6E1D6] pb-2">
                          <span className="font-bold text-xs sm:text-sm text-[#1B2430]">
                            {template.title}
                          </span>
                          <button
                            onClick={() => handleCopyMessage(template.content, idx)}
                            className="px-3 py-1 bg-white hover:bg-[#F1EEE6] text-[#0F766E] border border-[#0F766E] rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                          >
                            {copiedMsgIdx === idx ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copiedMsgIdx === idx ? 'Copiado!' : 'Copiar'}</span>
                          </button>
                        </div>
                        <p className="text-xs sm:text-sm text-[#4A5565] font-mono leading-relaxed whitespace-pre-line bg-white p-3 rounded-[8px] border border-[#E6E1D6]">
                          {template.content}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 6: Palavras-chave ATS */}
              {activeTab === 'ats' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <p className="text-xs sm:text-sm text-[#4A5565] font-medium leading-relaxed">
                      Termos técnicos estratégicos mapeados para triagem automatizada (Applicant Tracking Systems):
                    </p>
                    <button
                      onClick={handleCopyAts}
                      className="shrink-0 px-4 py-2 bg-[#0F766E] hover:bg-[#0C5F58] text-white rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                    >
                      {copiedAts ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedAts ? 'Copiadas!' : 'Copiar Todas'}</span>
                    </button>
                  </div>

                  <div className="p-4 bg-[#FFFBF2] border border-[#E6E1D6] rounded-[12px] flex flex-wrap gap-2">
                    {atsKeywords.map((kw, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 bg-white border border-[#E6E1D6] rounded-full text-xs font-mono text-[#1B2430]"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 7: Checklist de Entrevistas Técnicas */}
              {activeTab === 'entrevistas' && (
                <InterviewPrep />
              )}

            </div>
          )}
        </div>

      </div>
    </div>
  );
}
