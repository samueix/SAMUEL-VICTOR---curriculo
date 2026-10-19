import React, { useState, useEffect, useRef } from 'react';
import { 
  Briefcase, 
  GraduationCap, 
  Award, 
  Phone, 
  Sparkles, 
  ShieldCheck, 
  Code,
  ArrowUp,
  MessageSquare,
  FileText,
  FolderGit2,
  Compass,
  CheckCircle2,
  Zap
} from 'lucide-react';

import Header from './components/Header';
import ProfileCard from './components/ProfileCard';
import ExperienceTimeline from './components/ExperienceTimeline';
import SkillsGrid from './components/SkillsGrid';
import AcademicEducation from './components/AcademicEducation';
import FutureGoals from './components/FutureGoals';
import CoverLetterGenerator from './components/CoverLetterGenerator';
import InteractiveContact from './components/InteractiveContact';
import PrintResume from './components/PrintResume';
import AdminPanel from './components/AdminPanel';
import ProjectsSection from './components/ProjectsSection';
import { trackEvent, checkAndUpdateOwnerMode } from './services/tracker';

import { 
  personalInfo as defaultPersonalInfo,
  experiences as defaultExperiences,
  skills as defaultSkills,
  certifications as defaultCertifications,
  educations as defaultEducations,
  projects as defaultProjects
} from './data';

const getFormattedWhatsappUrl = (url: string) => {
  if (!url) return '';
  if (url.includes('text=')) return url;
  const message = "Olá Samuel, peguei seu contato pelo seu portfólio e gostaria de conversar!";
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}text=${encodeURIComponent(message)}`;
};

export default function App() {
  const [activeSection, setActiveSection] = useState('inicio');
  const [isPrintMode, setIsPrintMode] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Core dynamic states initialized from localStorage with static fallbacks
  const [personalInfo, setPersonalInfo] = useState(() => {
    const stored = localStorage.getItem('personalInfo');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const hasOldLinkedin = parsed.linkedinUrl && parsed.linkedinUrl.includes('samuel-nobre-40a220186');
        const hasOldTitle = parsed.title === 'Analista de Operações de TI';
        const hasOldLocation = parsed.location === 'Fortaleza – CE';
        const isMissingWebsite = !parsed.websiteUrl;
        const hasOldGithub = !parsed.githubUrl || parsed.githubUrl === '#' || !parsed.githubUrl.includes('samueix');
        if (!parsed.languages || !parsed.tools || parsed.bio.includes('dedicado e motivado') || hasOldLinkedin || hasOldTitle || hasOldLocation || isMissingWebsite || hasOldGithub) {
          const migrated = { 
            ...defaultPersonalInfo, 
            ...parsed, 
            title: defaultPersonalInfo.title,
            location: defaultPersonalInfo.location,
            bio: defaultPersonalInfo.bio, 
            languages: defaultPersonalInfo.languages, 
            tools: defaultPersonalInfo.tools, 
            english: defaultPersonalInfo.english,
            linkedinUrl: defaultPersonalInfo.linkedinUrl,
            githubUrl: defaultPersonalInfo.githubUrl || 'https://github.com/samueix',
            websiteUrl: defaultPersonalInfo.websiteUrl || 'https://samuel-victor-da-silva-nobre.vercel.app/'
          };
          localStorage.setItem('personalInfo', JSON.stringify(migrated));
          return migrated;
        }
        return { 
          ...defaultPersonalInfo, 
          ...parsed, 
          githubUrl: 'https://github.com/samueix',
          websiteUrl: parsed.websiteUrl || defaultPersonalInfo.websiteUrl || 'https://samuel-victor-da-silva-nobre.vercel.app/' 
        };
      } catch (e) {
        console.error('Error parsing personalInfo from localStorage:', e);
      }
    }
    return defaultPersonalInfo;
  });

  const [experiences, setExperiences] = useState(() => {
    const stored = localStorage.getItem('experiences');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const hasOldFreelancerLocation = parsed.some((e: any) => e.id === 'exp-3' && e.location.includes('Maracanaú'));
        if (hasOldFreelancerLocation) {
          const migrated = parsed.map((e: any) => {
            if (e.id === 'exp-3') {
              return { ...e, location: 'Fortaleza e Região – CE (Presencial / Híbrido)' };
            }
            return e;
          });
          localStorage.setItem('experiences', JSON.stringify(migrated));
          return migrated;
        }
        return parsed;
      } catch (e) {
        console.error('Error parsing experiences from localStorage:', e);
      }
    }
    return defaultExperiences;
  });

  const [skills, setSkills] = useState(() => {
    const stored = localStorage.getItem('skills');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const hasOldCategory = parsed.some((s: any) => s.category === 'sistemas');
        const hasIACategory = parsed.some((s: any) => s.category === 'ia');
        const hasVibeCoding = parsed.some((s: any) => s.name?.toLowerCase().includes('vibe cod'));
        const hasADTeorico = parsed.some((s: any) => s.name?.includes('Teórico'));
        const hasXGS = parsed.some((s: any) => s.name?.includes('XGS'));
        const hasNotAll100 = parsed.some((s: any) => s.level !== 100);
        if (hasOldCategory || !hasIACategory || !hasVibeCoding || !hasADTeorico || !hasXGS || hasNotAll100) {
          localStorage.setItem('skills', JSON.stringify(defaultSkills));
          return defaultSkills;
        }
        return parsed;
      } catch (e) {
        console.error('Error parsing skills from localStorage:', e);
      }
    }
    return defaultSkills;
  });

  const [projects, setProjects] = useState(() => {
    const stored = localStorage.getItem('projects');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const hasGasStationProject = parsed.some((p: any) => p.title.includes('Posto de Gasolina J e L'));
        if (!hasGasStationProject) {
          const gasStationProject = defaultProjects.find(p => p.title.includes('Posto de Gasolina J e L'));
          if (gasStationProject) {
            const migrated = [gasStationProject, ...parsed];
            localStorage.setItem('projects', JSON.stringify(migrated));
            return migrated;
          }
        }
        return parsed;
      } catch (e) {
        console.error('Error parsing projects from localStorage:', e);
      }
    }
    return defaultProjects;
  });

  const [certifications, setCertifications] = useState(() => {
    const stored = localStorage.getItem('certifications');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Error parsing certifications from localStorage:', e);
      }
    }
    return defaultCertifications;
  });

  const [educations, setEducations] = useState(() => {
    const stored = localStorage.getItem('educations');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const migrated = parsed.map((edu: any) => {
          let status = edu.status;
          if (status === 'Incompleto') status = 'Cursado parcialmente';
          let degree = edu.degree;
          if (degree.includes('Cibersegurança') && !degree.includes('(em andamento)')) {
            degree = 'Tecnólogo em Cibersegurança (em andamento)';
          }
          let institution = edu.institution;
          if (institution.includes('UniAteneu') || institution.includes('Centro Universitário')) {
            institution = 'Uniasselvi';
          }
          return { ...edu, status, degree, institution };
        });
        localStorage.setItem('educations', JSON.stringify(migrated));
        return migrated;
      } catch (e) {
        console.error('Error parsing educations from localStorage:', e);
      }
    }
    return defaultEducations;
  });

  const [savedMessages, setSavedMessages] = useState<any[]>(() => {
    const stored = localStorage.getItem('samuel_portfolio_messages');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Error parsing saved messages from localStorage:', e);
      }
    }
    return [];
  });

  // Track scroll position for active section & scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);

      const sections = ['inicio', 'sobre', 'experiencia', 'habilidades', 'projetos', 'certificacoes', 'objetivos', 'contato'];
      const scrollPosition = window.scrollY + 200;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Rastreamento silencioso de acesso e validação do Modo Dono (?owner=1 ativa / ?owner=0 desativa)
  useEffect(() => {
    checkAndUpdateOwnerMode();
    trackEvent('acesso', 'Acesso inicial ao portfólio');
  }, []);

  // Atalho oculto para o Kit do Candidato (#admin na URL ou Alt+A no teclado)
  useEffect(() => {
    const checkHash = () => {
      if (window.location.hash === '#admin' || window.location.search.includes('admin=true')) {
        setIsAdminMode(true);
        trackEvent('abrir_admin', 'Tentativa de abertura via hash #admin');
      }
    };
    checkHash();
    window.addEventListener('hashchange', checkHash);

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.altKey && (e.key === 'a' || e.key === 'A')) || (e.ctrlKey && e.shiftKey && (e.key === 'a' || e.key === 'A'))) {
        e.preventDefault();
        setIsAdminMode(prev => {
          const next = !prev;
          if (next) {
            trackEvent('abrir_admin', 'Tentativa de abertura via teclado Alt+A');
          }
          return next;
        });
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('hashchange', checkHash);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Atalho exclusivo para celular: Toque triplo rápido ou segurar por 1.2s no rodapé
  const tapTimeoutRef = useRef<number | null>(null);
  const [tapCount, setTapCount] = useState(0);
  const longPressTimeoutRef = useRef<number | null>(null);

  const handleMobileSecretTap = () => {
    setTapCount(prev => {
      const next = prev + 1;
      if (next >= 3) {
        setIsAdminMode(true);
        trackEvent('abrir_admin', 'Tentativa de abertura via toque triplo mobile');
        return 0;
      }
      if (tapTimeoutRef.current) window.clearTimeout(tapTimeoutRef.current);
      tapTimeoutRef.current = window.setTimeout(() => {
        setTapCount(0);
      }, 700);
      return next;
    });
  };

  const handleTouchStart = () => {
    longPressTimeoutRef.current = window.setTimeout(() => {
      setIsAdminMode(true);
      trackEvent('abrir_admin', 'Tentativa de abertura via toque longo mobile');
    }, 1200);
  };

  const handleTouchEnd = () => {
    if (longPressTimeoutRef.current) {
      window.clearTimeout(longPressTimeoutRef.current);
      longPressTimeoutRef.current = null;
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleDownloadPdf = () => {
    trackEvent('baixar_pdf', 'Download/Impressão via botão Baixar Currículo PDF');
    setIsPrintMode(true);
    window.scrollTo({ top: 0, behavior: 'instant' });
    setTimeout(() => {
      window.print();
    }, 250);
  };

  // If Print View is requested, render isolated Print Mode
  if (isPrintMode) {
    return (
      <PrintResume 
        onBackClick={() => setIsPrintMode(false)}
        personalInfo={personalInfo}
        experiences={experiences}
        skills={skills}
        certifications={certifications}
        educations={educations}
        projects={projects}
        showPhoto={false}
      />
    );
  }

  const techMarqueeList = [
    "Equipamentos de Rede",
    "Instrumentação Óptica (OTDR)",
    "Medição com Power Meter",
    "Fibra Óptica Avançada",
    "Fusão de Fibra Óptica (Arco Voltaico)",
    "FTTH / GPON / EPON",
    "Switches Gerenciáveis & Roteadores",
    "Configuração de OLT & ONU",
    "DIO, CTO & Caixas de Emenda",
    "Wi-Fi Corporativo (UniFi UEWA)",
    "Cabeamento Estruturado Cat6",
    "Redes TCP/IP & Sub-redes",
    "Service Desk & ITIL v4",
    "Suporte Técnico N1/N2",
    "Active Directory (Teórico)",
    "Zabbix & pfSense (Teórico)",
    "Docker (Teórico)",
    "Python & Automações",
    "Vibe Coding & GitHub: samueix"
  ];

  return (
    <div className="min-h-screen bg-[#FFFBF2] text-[#1B2430] font-sans selection:bg-[#0F766E] selection:text-white">
      
      {/* Kit do Candidato (Aba Admin Oculta - acesso via #admin ou atalho Alt+A) */}
      {isAdminMode && (
        <AdminPanel
          isOpen={isAdminMode}
          onClose={() => {
            setIsAdminMode(false);
            if (window.location.hash === '#admin') {
              history.replaceState(null, '', window.location.pathname + window.location.search);
            }
          }}
          personalInfo={personalInfo}
        />
      )}

      {/* Persistent Navigation Header */}
      <Header
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        isPrintMode={isPrintMode}
        setIsPrintMode={setIsPrintMode}
      />

      {/* Main Content Area */}
      <main className="relative z-10 print:hidden">
        
        {/* Hero & Profile Section */}
        <section id="inicio" className="pt-20 pb-4 sm:pt-24 md:pt-28 px-4 sm:px-6 max-w-[1100px] mx-auto">
          <ProfileCard personalInfo={personalInfo} onDownloadClick={handleDownloadPdf} />
        </section>

        {/* 2) FAIXA DE TECNOLOGIAS: fundo branco com borda superior e inferior 1px #E6E1D6, texto escuro e separadores em bolinha verde #0F766E */}
        <div className="w-full overflow-hidden border-y border-[#E6E1D6] bg-[#FFFFFF] py-3.5 my-6 no-print select-none">
          <div className="animate-marquee hover:[animation-play-state:paused] flex items-center gap-8 text-xs font-semibold whitespace-nowrap">
            {techMarqueeList.concat(techMarqueeList).map((tech, idx) => (
              <span key={idx} className="flex items-center gap-3 text-[#1B2430]">
                <span 
                  className="w-2 h-2 rounded-full bg-[#0F766E]" 
                  aria-hidden="true" 
                />
                <span className="font-display font-bold text-sm tracking-tight">{tech}</span>
                <span className="text-[#4A5565]/30 font-bold">•</span>
              </span>
            ))}
          </div>
        </div>

        {/* 01 — Executive Summary (Destaque Verde #0F766E) */}
        <section id="sobre" className="py-12 px-4 sm:px-6 max-w-[1100px] mx-auto">
          <div className="pb-4 mb-6">
            <div className="flex items-center gap-4">
              <span className="font-mono text-3xl sm:text-5xl font-black text-[#0F766E] select-none leading-none" aria-hidden="true">
                01
              </span>
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-[#1B2430] tracking-tight">
                  Sobre & Resumo Executivo
                </h2>
                <div className="w-16 h-1 bg-[#0F766E] mt-1.5 rounded-full" aria-hidden="true" />
              </div>
            </div>
            <p className="text-sm font-medium text-[#4A5565] mt-2.5">
              Visão profissional, posicionamento de mercado e compromisso operacional em TI.
            </p>
          </div>

          <div className="bg-[#FFFFFF] border border-[#E6E1D6] p-6 sm:p-8 rounded-[12px] hover:-translate-y-1 hover:shadow-[4px_4px_0px_#0F766E] transition-all duration-200">
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-full bg-[#F1EEE6] flex items-center justify-center shrink-0 text-[#0F766E]">
                <Zap className="w-5 h-5 text-[#0F766E]" strokeWidth={2.2} aria-hidden="true" />
              </div>
              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-[#F1EEE6] border border-[#E6E1D6] text-xs font-bold text-[#0F766E] mb-3">
                  Profissional Dedicado & Comunicativo
                </span>
                <p className="text-base sm:text-lg text-[#1B2430] leading-relaxed max-w-[85ch]">
                  {personalInfo.bio}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 02 — Experience Section (Destaque Verde #0F766E) */}
        <section id="experiencia" className="py-12 px-4 sm:px-6 max-w-[1100px] mx-auto">
          <div className="pb-4 mb-6">
            <div className="flex items-center gap-4">
              <span className="font-mono text-3xl sm:text-5xl font-black text-[#0F766E] select-none leading-none" aria-hidden="true">
                02
              </span>
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-[#1B2430] tracking-tight">
                  Experiência Profissional
                </h2>
                <div className="w-16 h-1 bg-[#0F766E] mt-1.5 rounded-full" aria-hidden="true" />
              </div>
            </div>
            <p className="text-sm font-medium text-[#4A5565] mt-2.5">
              Trajetória prática em infraestrutura de redes, suporte N1/N2 e atendimento a usuários.
            </p>
          </div>
          
          <ExperienceTimeline experiences={experiences} />
        </section>

        {/* 03 — Skills Section (Destaque Verde #0F766E) */}
        <section id="habilidades" className="py-12 px-4 sm:px-6 max-w-[1100px] mx-auto">
          <div className="pb-4 mb-6">
            <div className="flex items-center gap-4">
              <span className="font-mono text-3xl sm:text-5xl font-black text-[#0F766E] select-none leading-none" aria-hidden="true">
                03
              </span>
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-[#1B2430] tracking-tight">
                  Habilidades & Competências
                </h2>
                <div className="w-16 h-1 bg-[#0F766E] mt-1.5 rounded-full" aria-hidden="true" />
              </div>
            </div>
            <p className="text-sm font-medium text-[#4A5565] mt-2.5">
              Inventário técnico de tecnologias, protocolos de rede, ferramentas e metodologias.
            </p>
          </div>

          <SkillsGrid skills={skills} />
        </section>

        {/* 04 — Projects Section (Destaque Verde #0F766E) */}
        <section id="projetos" className="py-12 px-4 sm:px-6 max-w-[1100px] mx-auto">
          <div className="pb-4 mb-6">
            <div className="flex items-center gap-4">
              <span className="font-mono text-3xl sm:text-5xl font-black text-[#0F766E] select-none leading-none" aria-hidden="true">
                04
              </span>
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-[#1B2430] tracking-tight">
                  Projetos & Cases Técnicos
                </h2>
                <div className="w-16 h-1 bg-[#0F766E] mt-1.5 rounded-full" aria-hidden="true" />
              </div>
            </div>
            <p className="text-sm font-medium text-[#4A5565] mt-2.5">
              Soluções aplicadas para automação de rotinas, infraestrutura estruturada e monitoramento.
            </p>
          </div>

          <ProjectsSection projects={projects} />
        </section>

        {/* 05 — Education & Certifications (Destaque Verde #0F766E) */}
        <section id="certificacoes" className="py-12 px-4 sm:px-6 max-w-[1100px] mx-auto">
          <div className="pb-4 mb-6">
            <div className="flex items-center gap-4">
              <span className="font-mono text-3xl sm:text-5xl font-black text-[#0F766E] select-none leading-none" aria-hidden="true">
                05
              </span>
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-[#1B2430] tracking-tight">
                  Formação & Qualificações
                </h2>
                <div className="w-16 h-1 bg-[#0F766E] mt-1.5 rounded-full" aria-hidden="true" />
              </div>
            </div>
            <p className="text-sm font-medium text-[#4A5565] mt-2.5">
              Tecnólogo em Cibersegurança (em andamento), certificações profissionais ativas e ferramentas operacionais.
            </p>
          </div>

          <div id="formacao">
            <AcademicEducation 
              educations={educations} 
              certifications={certifications} 
              languages={personalInfo.languages}
              tools={personalInfo.tools}
            />
          </div>
        </section>

        {/* 06 — Future Goals Section (Destaque Verde #0F766E) */}
        <section id="objetivos" className="py-12 px-4 sm:px-6 max-w-[1100px] mx-auto">
          <div className="pb-4 mb-6">
            <div className="flex items-center gap-4">
              <span className="font-mono text-3xl sm:text-5xl font-black text-[#0F766E] select-none leading-none" aria-hidden="true">
                06
              </span>
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-[#1B2430] tracking-tight">
                  Futuros Objetivos & Roadmap
                </h2>
                <div className="w-16 h-1 bg-[#0F766E] mt-1.5 rounded-full" aria-hidden="true" />
              </div>
            </div>
            <p className="text-sm font-medium text-[#4A5565] mt-2.5">
              Planejamento de competências, especializações e visão de médio e longo prazo.
            </p>
          </div>

          <FutureGoals />
        </section>

        {/* 07 — Contact Section (Destaque Verde #0F766E) */}
        <section id="contato" className="py-12 px-4 sm:px-6 max-w-[1100px] mx-auto pb-20">
          <div className="pb-4 mb-6">
            <div className="flex items-center gap-4">
              <span className="font-mono text-3xl sm:text-5xl font-black text-[#0F766E] select-none leading-none" aria-hidden="true">
                07
              </span>
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-[#1B2430] tracking-tight">
                  Canais de Contato
                </h2>
                <div className="w-16 h-1 bg-[#0F766E] mt-1.5 rounded-full" aria-hidden="true" />
              </div>
            </div>
            <p className="text-sm font-medium text-[#4A5565] mt-2.5">
              Disponível para oportunidades presenciais em Fortaleza e região, ou em regime remoto.
            </p>
          </div>

          <InteractiveContact 
            personalInfo={personalInfo} 
            savedMessages={savedMessages} 
            setSavedMessages={setSavedMessages} 
          />
        </section>

      </main>

      {/* 8) RODAPÉ E CONTATO: rodapé em bloco escuro sólido (#1B2430) com texto claro, frase grande de chamada e botão do WhatsApp em coral #C2410C. Sem bloco verde-água grande. */}
      <footer className="bg-[#1B2430] text-[#FFFBF2] py-14 px-4 sm:px-6 relative z-10 no-print">
        <div className="max-w-[1100px] mx-auto">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 pb-10 border-b border-[#FFFBF2]/15">
            <div className="max-w-xl space-y-2.5">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0F766E] text-white text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" aria-hidden="true" />
                Aberto a novas oportunidades
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-display text-white tracking-tight leading-tight">
                Pronto para fortalecer a infraestrutura e o suporte da sua operação técnica.
              </h2>
              <p className="text-sm sm:text-base text-[#E6E1D6] leading-relaxed">
                Disponibilidade imediata para atuação Presencial ou Híbrida em Fortaleza/CE e Região, ou Remota para todo o Brasil.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <a
                href={getFormattedWhatsappUrl(personalInfo.whatsappUrl)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent('clique_whatsapp', 'Botão Rodapé: Iniciar Conversa no WhatsApp')}
                className="px-7 py-4 bg-[#C2410C] hover:bg-[#9A3412] text-white font-bold text-sm sm:text-base rounded-full inline-flex items-center gap-2.5 transition-transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer shadow-md"
              >
                <Phone className="w-5 h-5 text-white" strokeWidth={2.2} aria-hidden="true" />
                <span>Iniciar Conversa no WhatsApp</span>
              </a>

              <a
                href={`mailto:${personalInfo.email}`}
                onClick={() => trackEvent('clique_email', 'Botão Rodapé: Enviar E-mail Direto')}
                className="px-6 py-4 bg-[#FFFFFF] hover:bg-[#F1EEE6] text-[#1B2430] font-bold text-sm sm:text-base rounded-full inline-flex items-center gap-2 transition-transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer border border-[#E6E1D6]"
              >
                <FileText className="w-5 h-5 text-[#1B2430]" strokeWidth={2} aria-hidden="true" />
                <span>Enviar E-mail Direto</span>
              </a>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm font-medium text-[#E6E1D6]">
            <p 
              onClick={handleMobileSecretTap}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              className="cursor-pointer select-none transition-colors active:text-[#0F766E]"
              title="Samuel Victor da Silva Nobre"
            >
              © 2026 {personalInfo.fullName} • Infraestrutura, Redes & Operações de TI
            </p>
            <div className="flex items-center gap-4">
              <a 
                href={personalInfo.linkedinUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                onClick={() => trackEvent('clique_linkedin', 'Link Rodapé: LinkedIn')}
                className="hover:text-[#0F766E] transition-colors font-bold"
              >
                LinkedIn
              </a>
              <span>•</span>
              <a 
                href={personalInfo.githubUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                onClick={() => trackEvent('clique_github', 'Link Rodapé: GitHub')}
                className="hover:text-[#0F766E] transition-colors font-bold"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-5 right-5 flex flex-col gap-2.5 z-40 no-print">
        {/* Scroll To Top */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            aria-label="Voltar ao topo da página"
            className="w-12 h-12 bg-[#FFFFFF] hover:bg-[#F1EEE6] text-[#1B2430] border border-[#E6E1D6] rounded-full flex items-center justify-center transition-all hover:-translate-y-1 hover:border-[#0F766E] hover:text-[#0F766E] hover:shadow-[3px_3px_0px_#0F766E] cursor-pointer shadow-sm"
            title="Voltar ao Topo"
          >
            <ArrowUp className="w-5 h-5" strokeWidth={2.2} aria-hidden="true" />
          </button>
        )}

        {/* Floating WhatsApp Quick-Connect em Coral #C2410C */}
        <a
          href={getFormattedWhatsappUrl(personalInfo.whatsappUrl)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackEvent('clique_whatsapp', 'Botão Flutuante: WhatsApp')}
          aria-label="Entrar em contato via WhatsApp"
          className="w-13 h-13 bg-[#C2410C] hover:bg-[#9A3412] text-white rounded-full flex items-center justify-center transition-all hover:-translate-y-1 cursor-pointer shadow-lg"
          title="Falar pelo WhatsApp"
        >
          <Phone className="w-6 h-6 text-white" strokeWidth={2.2} aria-hidden="true" />
        </a>
      </div>

      {/* Fallback de impressão nativa: se o usuário pressionar Ctrl+P do navegador no site, sempre imprime o PrintResume */}
      <div className="hidden print:block">
        <PrintResume 
          onBackClick={() => setIsPrintMode(false)}
          personalInfo={personalInfo}
          experiences={experiences}
          skills={skills}
          certifications={certifications}
          educations={educations}
          projects={projects}
          showPhoto={false}
        />
      </div>

    </div>
  );
}
