import React, { useState, useEffect } from 'react';
import { Printer, ArrowLeft, Camera, QrCode } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { PersonalInfo, Experience, Skill, Certification, Education, Project } from '../types';
import { trackEvent } from '../services/tracker';

interface PrintResumeProps {
  onBackClick: () => void;
  personalInfo: PersonalInfo;
  experiences: Experience[];
  skills: Skill[];
  certifications: Certification[];
  educations: Education[];
  projects: Project[];
  showPhoto?: boolean;
  isFromAdmin?: boolean;
}

export default function PrintResume({ 
  onBackClick, 
  personalInfo, 
  experiences, 
  skills, 
  certifications, 
  educations, 
  projects,
  showPhoto = false,
  isFromAdmin = false
}: PrintResumeProps) {
  const [localShowPhoto, setLocalShowPhoto] = useState(showPhoto);
  const [localShowQrCode, setLocalShowQrCode] = useState(true);

  useEffect(() => {
    setLocalShowPhoto(showPhoto);
  }, [showPhoto]);

  useEffect(() => {
    const originalTitle = document.title;
    const handleBefore = () => {
      document.title = localShowPhoto
        ? 'Samuel Victor da Silva Nobre - Currículo (com foto)'
        : 'Samuel Victor da Silva Nobre - Currículo';
    };
    const handleAfter = () => {
      document.title = originalTitle;
    };
    window.addEventListener('beforeprint', handleBefore);
    window.addEventListener('afterprint', handleAfter);
    return () => {
      window.removeEventListener('beforeprint', handleBefore);
      window.removeEventListener('afterprint', handleAfter);
    };
  }, [localShowPhoto]);

  const websiteUrl = personalInfo.websiteUrl || 'https://samuel-victor-da-silva-nobre.vercel.app/';
  const displayWebsite = websiteUrl.replace(/(https?:\/\/)?(www\.)?/, '').replace(/\/$/, '');

  const handlePrint = () => {
    trackEvent('imprimir_curriculo', 'Botão Imprimir Currículo em PrintResume');
    const originalTitle = document.title;
    const printTitle = localShowPhoto
      ? 'Samuel Victor da Silva Nobre - Currículo (com foto)'
      : 'Samuel Victor da Silva Nobre - Currículo';
    document.title = printTitle;

    const restore = () => {
      document.title = originalTitle;
      window.removeEventListener('afterprint', restore);
    };
    window.addEventListener('afterprint', restore);

    window.print();

    setTimeout(() => {
      if (document.title === printTitle) {
        document.title = originalTitle;
      }
    }, 1200);
  };

  return (
    <div className="bg-[#FFFBF2] text-[#1B2430] p-4 sm:p-6 min-h-screen print:min-h-0 print:h-auto print:p-0 print:m-0 print:bg-white print:text-black">
      {/* Dynamic Printing CSS style overrides to remove browser headers/footers, zero letter-spacing, remove screen card borders/shadows and ensure exact colors/margins */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          @page {
            size: A4 portrait;
            margin: 12mm !important;
          }
          *, *::before, *::after {
            letter-spacing: 0 !important;
            word-spacing: normal !important;
            box-shadow: none !important;
            text-shadow: none !important;
          }
          html, body {
            background-color: #ffffff !important;
            background: #ffffff !important;
            color: #17181A !important;
            padding: 0 !important;
            margin: 0 !important;
            min-height: 0 !important;
            height: auto !important;
            width: 100% !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          h1, h2, h3, h4, h5, h6 {
            letter-spacing: 0 !important;
            word-spacing: normal !important;
            font-family: Arial, Helvetica, sans-serif !important;
          }
          p, span, div, li, strong, a {
            letter-spacing: 0 !important;
            word-spacing: normal !important;
            font-family: Arial, Helvetica, sans-serif !important;
          }
          img {
            max-width: 100% !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .no-print {
            display: none !important;
          }
          .print-break-inside-avoid {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          .print-sheet {
            border: none !important;
            border-radius: 0 !important;
            box-shadow: none !important;
            background: #ffffff !important;
            padding: 0 !important;
            margin: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
          }
        }
      `}} />
      
      {/* Header tools for web view */}
      <div className="no-print max-w-4xl mx-auto mb-6 bg-[#FFFFFF] border border-[#E6E1D6] p-4 rounded-[12px] flex flex-wrap items-center justify-between gap-3 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onBackClick}
            className="px-4 py-2 bg-[#FFFFFF] hover:bg-[#F1EEE6] text-[#1B2430] rounded-full text-xs font-bold flex items-center gap-1.5 border border-[#E6E1D6] transition-transform hover:-translate-y-0.5 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-[#1B2430]" strokeWidth={2.2} aria-hidden="true" />
            <span>{isFromAdmin ? 'Voltar para o Painel ADM' : 'Voltar para o Portfólio'}</span>
          </button>

          {isFromAdmin && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#F1EEE6] border border-[#E6E1D6] text-[#0F766E] text-xs font-bold rounded-full">
              <Camera className="w-3.5 h-3.5" strokeWidth={2} aria-hidden="true" />
              Versão com Foto (ADM)
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setLocalShowQrCode(!localShowQrCode)}
            className={`px-3.5 py-2 rounded-full text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer ${
              localShowQrCode 
                ? 'bg-[#0F766E] text-white border-[#0F766E] shadow-sm' 
                : 'bg-[#FFFFFF] text-[#4A5565] border-[#E6E1D6] hover:bg-[#F1EEE6]'
            }`}
            title="Alternar inclusão do QR Code do Portfólio no currículo"
          >
            <QrCode className="w-3.5 h-3.5" strokeWidth={2} aria-hidden="true" />
            <span>{localShowQrCode ? 'QR Code: Ativado' : 'QR Code: Desativado'}</span>
          </button>

          {isFromAdmin && (
            <button
              onClick={() => setLocalShowPhoto(!localShowPhoto)}
              className={`px-3.5 py-2 rounded-full text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer ${
                localShowPhoto 
                  ? 'bg-[#0F766E] text-white border-[#0F766E] shadow-sm' 
                  : 'bg-[#FFFFFF] text-[#4A5565] border-[#E6E1D6] hover:bg-[#F1EEE6]'
              }`}
              title="Alternar inclusão da foto"
            >
              <Camera className="w-3.5 h-3.5" strokeWidth={2} aria-hidden="true" />
              <span>{localShowPhoto ? 'Foto: Ativada' : 'Foto: Desativada'}</span>
            </button>
          )}

          <button
            onClick={handlePrint}
            className="px-5 py-2 bg-[#0F766E] hover:bg-[#0C5F58] text-white rounded-full text-xs font-bold flex items-center gap-2 transition-transform hover:-translate-y-0.5 cursor-pointer shadow-sm"
          >
            <Printer className="w-4 h-4 text-white" strokeWidth={2.2} aria-hidden="true" />
            <span>Imprimir / Salvar PDF</span>
          </button>
        </div>
      </div>

      {/* Alert notice if running inside an iframe */}
      {typeof window !== 'undefined' && window.self !== window.top && (
        <div className="no-print max-w-4xl mx-auto mb-6 bg-[#FFFFFF] border border-[#E6E1D6] p-4 rounded-[12px] flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs shadow-sm">
          <div>
            <h4 className="font-bold text-[#1B2430] text-sm">Visualização em Moldura (iFrame)</h4>
            <p className="text-[#4A5565] mt-0.5 font-medium leading-relaxed">
              Para salvar ou imprimir em PDF com suporte nativo do navegador, clique em "Abrir em Nova Aba".
            </p>
          </div>
          <a
            href={window.location.href}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 px-4 py-2 bg-[#0F766E] hover:bg-[#0C5F58] text-white rounded-full text-xs font-bold transition-transform hover:-translate-y-0.5 cursor-pointer shadow-sm"
          >
            Abrir em Nova Aba
          </a>
        </div>
      )}

      {/* Printable Sheet (Pure white background, clean contrast for paper print, no borders or shadow in print) */}
      <div className="print-sheet max-w-4xl mx-auto border border-[#E6E1D6] p-8 sm:p-10 rounded-[12px] bg-white text-[#17181A] relative shadow-sm print:border-0 print:border-none print:p-0 print:m-0 print:rounded-none print:shadow-none print:bg-white print:text-black">
        
        {/* Top Header */}
        <div className="border-b border-[#17181A] pb-3 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left print:flex print:flex-row print:items-center print:justify-between print:gap-4 print:text-left print-break-inside-avoid">
          {localShowPhoto && (
            <div className="shrink-0 flex justify-center print:shrink-0 self-center sm:self-auto">
              <div 
                className="w-[28mm] h-[35mm] rounded-[3px] overflow-hidden border border-[#17181A] bg-[#F5F3EE] shrink-0"
                style={{ printColorAdjust: 'exact', WebkitPrintColorAdjust: 'exact' }}
              >
                <img 
                  src={personalInfo.imageUrl || "/foto_perfil/samuel.png"} 
                  alt={personalInfo.fullName}
                  className="w-full h-full object-cover object-top"
                  style={{ printColorAdjust: 'exact', WebkitPrintColorAdjust: 'exact' }}
                />
              </div>
            </div>
          )}

          <div className="flex-1 min-w-0 print:flex-1">
            <h1 className="text-2xl font-bold uppercase text-[#17181A]">
              {personalInfo.fullName}
            </h1>
            <p className="font-mono text-xs font-semibold text-[#0F766E] uppercase mt-0.5">
              {personalInfo.title}
            </p>
            <p className="font-mono text-[10px] text-[#5B5E62] uppercase mt-0.5">
              {personalInfo.subtitle}
            </p>
            
            {/* Quick Contacts: 2 linhas organizadas, sem nenhum separador "•" sobrando no final */}
            <div className="mt-2 space-y-0.5 text-[10.5px] font-mono text-[#5B5E62]">
              <div className="flex flex-wrap items-center gap-x-2.5 justify-center sm:justify-start print:justify-start">
                <a 
                  href={`mailto:${personalInfo.email}`}
                  onClick={() => trackEvent('clique_email', 'Cabeçalho PrintResume: E-mail')}
                  className="hover:text-[#0F766E] hover:underline cursor-pointer"
                >
                  {personalInfo.email}
                </a>
                <span className="text-[#0F766E] font-bold select-none">•</span>
                <a 
                  href={`tel:${personalInfo.phone.replace(/[^\d+]/g, '')}`}
                  onClick={() => trackEvent('clique_telefone', 'Cabeçalho PrintResume: Telefone')}
                  className="hover:text-[#0F766E] hover:underline cursor-pointer"
                >
                  {personalInfo.phone}
                </a>
                <span className="text-[#0F766E] font-bold select-none">•</span>
                <span>{personalInfo.location}</span>
              </div>
              <div className="flex flex-wrap items-center gap-x-2.5 justify-center sm:justify-start print:justify-start">
                <a 
                  href={personalInfo.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent('clique_linkedin', 'Cabeçalho PrintResume: LinkedIn')}
                  className="hover:text-[#0F766E] hover:underline cursor-pointer"
                >
                  {personalInfo.linkedinUrl ? personalInfo.linkedinUrl.replace(/(https?:\/\/)?(www\.)?/, '').replace(/\/$/, '') : 'linkedin.com'}
                </a>
                <span className="text-[#0F766E] font-bold select-none">•</span>
                <a 
                  href={personalInfo.githubUrl || 'https://github.com/samueix'}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent('clique_github', 'Cabeçalho PrintResume: GitHub')}
                  className="text-[#0F766E] font-medium hover:underline"
                >
                  github.com/samueix
                </a>
                <span className="text-[#0F766E] font-bold select-none">•</span>
                <a 
                  href={websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#0F766E] font-medium hover:underline"
                >
                  {displayWebsite}
                </a>
              </div>
            </div>
          </div>

          {/* QR Code Header Badge */}
          {localShowQrCode && (
            <div className="shrink-0 flex items-center gap-2 p-1.5 border border-[#D9D5CB] rounded-[3px] bg-white print:border print:border-[#17181A] print:rounded-[2px] print:p-1 self-center sm:self-auto">
              <div className="p-0.5">
                <QRCodeSVG 
                  value={websiteUrl} 
                  size={50} 
                  level="M" 
                  bgColor="#ffffff"
                  fgColor="#17181A"
                />
              </div>
              <div className="text-left leading-tight pr-1">
                <span className="text-[9px] uppercase font-mono font-bold text-[#0F766E] block whitespace-nowrap">
                  Portfólio online
                </span>
                <span className="text-[8px] font-mono text-[#5B5E62] block mt-0.5 whitespace-nowrap">
                  Acesse pelo celular
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Content Flow in Full Width: Ensures Page 2 and all sections occupy 100% width with no empty right column */}
        <div className="mt-4 space-y-4 print:space-y-3">
          
          {/* Section: Objetivo Profissional */}
          <div className="print-break-inside-avoid">
            <h2 className="font-mono text-xs font-bold text-[#17181A] uppercase border-b border-[#D9D5CB] pb-1 mb-1.5">
              Objetivo Profissional
            </h2>
            <p className="text-xs text-[#5B5E62] leading-relaxed text-justify">
              {personalInfo.bio}
            </p>
          </div>

          {/* Section: Experiência Profissional */}
          <div>
            <h2 className="font-mono text-xs font-bold text-[#17181A] uppercase border-b border-[#D9D5CB] pb-1 mb-2.5">
              Experiência Profissional
            </h2>
            
            <div className="space-y-3 print:space-y-2.5">
              {experiences.map((exp) => (
                <div key={exp.id} className="print-break-inside-avoid">
                  <div className="flex justify-between items-baseline gap-2">
                    <h3 className="text-xs font-semibold text-[#17181A]">
                      {exp.role}
                    </h3>
                    <span className="text-[10px] font-mono text-[#5B5E62] shrink-0">
                      {exp.period}
                    </span>
                  </div>
                  <div className="font-mono text-[11px] text-[#0F766E]">
                    {exp.company} <span className="text-[#5B5E62] font-normal">• {exp.location}</span>
                  </div>
                  
                  <ul className="mt-1 space-y-0.5">
                    {exp.description.map((bullet, bIdx) => (
                      <li key={bIdx} className="text-[10px] text-[#5B5E62] leading-relaxed flex gap-1.5">
                        <span className="text-[#0F766E] select-none font-bold">―</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Formação Acadêmica */}
          <div className="print-break-inside-avoid">
            <h2 className="font-mono text-xs font-bold text-[#17181A] uppercase border-b border-[#D9D5CB] pb-1 mb-2.5">
              Formação Acadêmica
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 print:grid-cols-3 print:gap-2.5">
              {educations.map((edu, idx) => {
                const degreeLower = edu.degree.toLowerCase();
                const isEmAndamentoInDegree = degreeLower.includes('em andamento') || degreeLower.includes('(em andamento)');
                
                let statusText = edu.status;
                if (statusText === 'Incompleto') {
                  statusText = 'Cursado parcialmente';
                }

                // Remove o [Em andamento] repetido ao lado de "Tecnólogo em Cibersegurança (em andamento)"
                const shouldShowStatus = statusText && (!isEmAndamentoInDegree || statusText !== 'Em andamento');

                return (
                  <div key={idx} className="print-break-inside-avoid p-2.5 bg-[#FAF9F5] border border-[#E6E1D6] rounded-[4px] print:bg-white print:border-[#D9D5CB] print:p-2">
                    <div className="flex justify-between items-start gap-1">
                      <h3 className="text-[11px] font-semibold text-[#17181A] leading-snug">
                        {edu.degree}
                      </h3>
                    </div>
                    <div className="font-mono text-[9.5px] text-[#0F766E] font-medium mt-1">
                      {edu.institution}
                      {shouldShowStatus && (
                        <span className="text-[#5B5E62] font-normal"> [{statusText}]</span>
                      )}
                    </div>
                    <span className="text-[9px] font-mono text-[#5B5E62] block mt-0.5">
                      {edu.period}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section: Projetos & Cases Técnicos (Todos os 6 projetos em grade 3x2, completando a página 2) */}
          <div className="print-break-inside-avoid">
            <h2 className="font-mono text-xs font-bold text-[#17181A] uppercase border-b border-[#D9D5CB] pb-1 mb-2.5">
              Projetos & Cases Técnicos
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 print:grid-cols-3 print:gap-2">
              {projects.slice(0, 6).map((proj, idx) => (
                <div key={idx} className="print-break-inside-avoid p-2 bg-[#FAF9F5] border border-[#E6E1D6] rounded-[4px] print:bg-white print:border-[#D9D5CB] print:p-2 flex flex-col justify-between">
                  <div>
                    <h3 className="text-[10.5px] font-semibold text-[#17181A] leading-tight">
                      {proj.title}
                    </h3>
                    <p className="text-[9px] text-[#5B5E62] mt-1 leading-snug">
                      {proj.description}
                    </p>
                  </div>
                  {proj.techStack && proj.techStack.length > 0 && (
                    <div className="text-[8.5px] font-mono text-[#0F766E] mt-1.5 pt-1 border-t border-[#E6E1D6] print:border-[#D9D5CB]">
                      {proj.techStack.join(', ')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Section: Certificações & Qualificações em Largura Total */}
          <div className="print-break-inside-avoid">
            <h2 className="font-mono text-xs font-bold text-[#17181A] uppercase border-b border-[#D9D5CB] pb-1 mb-2">
              Certificações & Qualificações
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 print:grid-cols-4 print:gap-2">
              {certifications.map((cert, idx) => (
                <div key={idx} className="print-break-inside-avoid p-2 bg-[#FAF9F5] border border-[#E6E1D6] rounded-[4px] print:bg-white print:border-[#D9D5CB]">
                  <strong className="text-[#17181A] block font-semibold text-[9.5px] leading-tight">{cert.name}</strong>
                  <span className="font-mono text-[8.5px] text-[#5B5E62] block mt-0.5">{cert.institution} ({cert.year})</span>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Habilidades Técnicas & Pessoais Completas */}
          <div className="print-break-inside-avoid">
            <h2 className="font-mono text-xs font-bold text-[#17181A] uppercase border-b border-[#D9D5CB] pb-1 mb-2">
              Habilidades Técnicas & Pessoais
            </h2>
            
            {/* Grade de 4 Categorias Técnicas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 print:grid-cols-4 print:gap-2 text-[9px] text-[#5B5E62]">
              <div className="p-2 bg-[#FAF9F5] border border-[#E6E1D6] rounded-[4px] print:bg-white print:border-[#D9D5CB]">
                <div className="font-mono font-bold text-[#17181A] text-[9.5px] uppercase border-b border-[#E6E1D6] pb-0.5 mb-1 text-[#0F766E]">
                  Suporte & Operações
                </div>
                <div className="leading-tight">
                  Suporte N1/N2, Service Desk, Atendimento ao Usuário, Gestão de Chamados (SLA), ITIL v4, Active Directory / Zabbix / pfSense / Docker (Fundamentos Teóricos), Windows.
                </div>
              </div>

              <div className="p-2 bg-[#FAF9F5] border border-[#E6E1D6] rounded-[4px] print:bg-white print:border-[#D9D5CB]">
                <div className="font-mono font-bold text-[#17181A] text-[9.5px] uppercase border-b border-[#E6E1D6] pb-0.5 mb-1 text-[#0F766E]">
                  Telecom & Redes Ópticas
                </div>
                <div className="leading-tight">
                  Equipamentos de Rede (Switches, Roteadores), OTDR, Power Meter, Fibra Óptica Avançada (FTTH/GPON), Máquina de Fusão de Fibra, OLT/ONU, DIO/CTO, Wi-Fi UniFi (UEWA), Cat6.
                </div>
              </div>

              <div className="p-2 bg-[#FAF9F5] border border-[#E6E1D6] rounded-[4px] print:bg-white print:border-[#D9D5CB]">
                <div className="font-mono font-bold text-[#17181A] text-[9.5px] uppercase border-b border-[#E6E1D6] pb-0.5 mb-1 text-[#0F766E]">
                  Vibe Coding & Automação
                </div>
                <div className="leading-tight">
                  Vibe Coding, Scripts Python via IA, Automação de Processos, APIs REST, Front-end com IA (HTML/CSS/JS), Git & GitHub: samueix.
                </div>
              </div>

              <div className="p-2 bg-[#FAF9F5] border border-[#E6E1D6] rounded-[4px] print:bg-white print:border-[#D9D5CB]">
                <div className="font-mono font-bold text-[#17181A] text-[9.5px] uppercase border-b border-[#E6E1D6] pb-0.5 mb-1 text-[#0F766E]">
                  Inteligência Artificial
                </div>
                <div className="leading-tight">
                  Engenharia de Prompt, Modelos LLM (ChatGPT, Claude, Gemini), Prototipação Ágil via IA, Otimização de fluxos de suporte, Depuração com IA.
                </div>
              </div>
            </div>

            {/* Habilidades Pessoais (Soft Skills) - Todas as 8 completas de data.ts */}
            <div className="mt-2 p-2 bg-[#FAF9F5] border border-[#E6E1D6] rounded-[4px] print:bg-white print:border-[#D9D5CB]">
              <div className="font-mono font-bold text-[#17181A] text-[9.5px] uppercase border-b border-[#E6E1D6] pb-0.5 mb-1 text-[#0F766E]">
                Habilidades Pessoais (Soft Skills)
              </div>
              <div className="text-[9px] font-mono text-[#4A5565] leading-relaxed flex flex-wrap gap-x-3 gap-y-1">
                <span>• Resolução de Problemas</span>
                <span>• Comunicação Eficiente</span>
                <span>• Organização & Documentação</span>
                <span>• Proatividade</span>
                <span>• Trabalho em Equipe</span>
                <span>• Adaptabilidade</span>
                <span>• Pensamento Analítico</span>
                <span>• Aprendizado Contínuo</span>
              </div>
            </div>
          </div>

          {/* Section: Dados Adicionais em Largura Total com Ferramentas Completas */}
          <div className="print-break-inside-avoid pt-0.5">
            <h2 className="font-mono text-xs font-bold text-[#17181A] uppercase border-b border-[#D9D5CB] pb-1 mb-1.5">
              Dados Adicionais
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[9px] font-mono text-[#5B5E62] print:grid-cols-4 print:gap-1.5">
              <div className="p-1.5 bg-[#FAF9F5] border border-[#E6E1D6] rounded-[4px] print:bg-white print:border-[#D9D5CB]">
                <strong className="text-[#17181A] block">CNH:</strong>
                <span>{personalInfo.cnh}</span>
              </div>
              <div className="p-1.5 bg-[#FAF9F5] border border-[#E6E1D6] rounded-[4px] print:bg-white print:border-[#D9D5CB]">
                <strong className="text-[#17181A] block">Disponibilidade:</strong>
                <span>Aberto a novas oportunidades</span>
              </div>
              <div className="p-1.5 bg-[#FAF9F5] border border-[#E6E1D6] rounded-[4px] print:bg-white print:border-[#D9D5CB]">
                <strong className="text-[#17181A] block">Atuação:</strong>
                <span>Presencial, Híbrido ou Remoto</span>
              </div>
              <div className="p-1.5 bg-[#FAF9F5] border border-[#E6E1D6] rounded-[4px] print:bg-white print:border-[#D9D5CB]">
                <strong className="text-[#17181A] block">Idiomas:</strong>
                <span>Português (Nativo), Inglês (Técnico)</span>
              </div>
            </div>

            {/* Linha de Ferramentas restaurada */}
            <div className="mt-2 p-1.5 bg-[#FAF9F5] border border-[#E6E1D6] rounded-[4px] print:bg-white print:border-[#D9D5CB] text-[9px] font-mono text-[#4A5565] leading-snug">
              <strong className="text-[#17181A]">Ferramentas: </strong>
              <span>
                {personalInfo.tools && personalInfo.tools.length > 0 
                  ? personalInfo.tools.join(', ') 
                  : 'Visual Studio Code, GitHub, Notion, Google Sheets com Google Apps Script, Telegram Bot API, PyQt6'}
              </span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
