import React, { useState, useEffect } from 'react';
import { Menu, X, Printer } from 'lucide-react';
import { trackEvent } from '../services/tracker';

interface HeaderProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  isPrintMode: boolean;
  setIsPrintMode: (mode: boolean) => void;
}

export default function Header({ activeSection, setActiveSection, isPrintMode, setIsPrintMode }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'inicio', label: 'Início' },
    { id: 'sobre', label: 'Sobre' },
    { id: 'experiencia', label: 'Experiência' },
    { id: 'habilidades', label: 'Habilidades' },
    { id: 'projetos', label: 'Projetos' },
    { id: 'certificacoes', label: 'Formação' },
    { id: 'objetivos', label: 'Objetivos' },
    { id: 'contato', label: 'Contato' },
  ];

  const handleNavClick = (id: string) => {
    setActiveSection(id);
    setIsMenuOpen(false);
    
    if (isPrintMode) {
      setIsPrintMode(false);
    }

    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <header 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-150 no-print border-b ${
        isScrolled 
          ? 'bg-[#FFFFFF]/95 backdrop-blur-none border-[#E6E1D6] shadow-sm' 
          : 'bg-[#FFFBF2] border-[#E6E1D6]'
      }`}
    >
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 flex justify-between items-center py-3 sm:py-3.5 min-h-[68px] sm:min-h-[72px]">
        
        {/* Monogram & Name */}
        <button 
          onClick={() => handleNavClick('inicio')}
          className="flex items-center gap-3 text-left focus:outline-none cursor-pointer group py-1"
        >
          <span className="w-10 h-10 rounded-[10px] bg-[#0F766E] text-white flex items-center justify-center transition-transform group-hover:scale-105 shrink-0 shadow-sm p-2" aria-hidden="true">
            <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" fill="white" fillOpacity="0.2" />
              <polyline points="14 2 14 8 20 8" />
              <circle cx="9.5" cy="11" r="1.5" fill="currentColor" />
              <line x1="13" y1="11" x2="16" y2="11" />
              <line x1="8" y1="15" x2="16" y2="15" />
              <line x1="8" y1="18" x2="13" y2="18" />
            </svg>
          </span>
          <div className="flex flex-col justify-center">
            <span className="block text-sm sm:text-base font-extrabold font-display text-[#1B2430] leading-none mb-1">
              Samuel Victor
            </span>
            <span className="block text-[11px] sm:text-xs font-medium text-[#4A5565] leading-none whitespace-nowrap tracking-normal">
              Suporte N1/N2 & Infraestrutura
            </span>
          </div>
        </button>

        {/* Desktop Navigation in Rounded Pills */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Navegação principal">
          {navItems.map((item) => {
            const isActive = activeSection === item.id && !isPrintMode;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`text-xs sm:text-sm font-semibold px-3 py-1.5 rounded-full transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-[#0F766E] text-white shadow-sm'
                    : 'text-[#4A5565] hover:text-[#0F766E] hover:bg-[#F1EEE6]'
                }`}
              >
                {item.label}
              </button>
            );
          })}

          <div className="flex items-center gap-2 pl-3 ml-2 border-l border-[#E6E1D6]">
            <button
              onClick={() => {
                if (isPrintMode) {
                  setIsPrintMode(false);
                } else {
                  trackEvent('imprimir_curriculo', 'Botão Versão PDF no Header (Desktop)');
                  setIsPrintMode(true);
                  window.scrollTo({ top: 0, behavior: 'instant' });
                  setTimeout(() => {
                    window.print();
                  }, 250);
                }
              }}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-full border border-[#E6E1D6] flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                isPrintMode
                  ? 'bg-[#0F766E] text-white border-[#0F766E]'
                  : 'bg-[#FFFFFF] text-[#1B2430] hover:text-[#0F766E] hover:border-[#0F766E] hover:bg-[#F1EEE6]'
              }`}
              title="Abrir versão de impressão e salvar em PDF"
            >
              <Printer className="w-3.5 h-3.5 text-current" strokeWidth={2} aria-hidden="true" />
              <span>{isPrintMode ? 'Ver Site' : 'Versão PDF'}</span>
            </button>

          </div>
        </nav>

        {/* Mobile menu toggle & print button */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={() => {
              if (isPrintMode) {
                setIsPrintMode(false);
              } else {
                trackEvent('imprimir_curriculo', 'Botão Versão PDF no Header (Mobile)');
                setIsPrintMode(true);
                window.scrollTo({ top: 0, behavior: 'instant' });
                setTimeout(() => {
                  window.print();
                }, 250);
              }
            }}
            aria-label={isPrintMode ? "Ver Site Completo" : "Alternar para Versão Impressa"}
            className={`p-2 rounded-full border border-[#E6E1D6] transition-colors cursor-pointer ${
              isPrintMode
                ? 'bg-[#0F766E] text-white border-[#0F766E]'
                : 'bg-[#FFFFFF] text-[#1B2430] hover:bg-[#F1EEE6]'
            }`}
          >
            <Printer className="w-4 h-4 text-current" strokeWidth={2} aria-hidden="true" />
          </button>
          
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Fechar menu de navegação" : "Abrir menu de navegação"}
            aria-expanded={isMenuOpen}
            className="p-2 rounded-full border border-[#E6E1D6] bg-[#FFFFFF] text-[#1B2430] hover:bg-[#F1EEE6] transition-colors cursor-pointer"
          >
            {isMenuOpen ? <X className="w-4 h-4" strokeWidth={2} aria-hidden="true" /> : <Menu className="w-4 h-4" strokeWidth={2} aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-[#E6E1D6] bg-[#FFFFFF] px-4 py-4 flex flex-col gap-1.5 shadow-md">
          {navItems.map((item) => {
            const isActive = activeSection === item.id && !isPrintMode;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-left px-4 py-2.5 text-sm font-bold rounded-full transition-colors cursor-pointer flex justify-between items-center ${
                  isActive
                    ? 'bg-[#0F766E] text-white'
                    : 'text-[#1B2430] hover:bg-[#F1EEE6]'
                }`}
              >
                <span>{item.label}</span>
                {isActive && <span className="w-1.5 h-1.5 rounded-full bg-white" aria-hidden="true" />}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}
