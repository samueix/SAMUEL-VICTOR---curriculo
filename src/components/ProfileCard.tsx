import React, { useState, useEffect } from 'react';
import { Phone, MapPin, Briefcase, Calendar, Download, Bike } from 'lucide-react';
import { PersonalInfo } from '../types';

interface ProfileCardProps {
  personalInfo: PersonalInfo;
  onDownloadClick?: () => void;
}

const getFormattedWhatsappUrl = (url: string) => {
  if (!url) return '';
  if (url.includes('text=')) return url;
  const message = "Olá Samuel, peguei seu contato pelo seu portfólio e gostaria de conversar!";
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}text=${encodeURIComponent(message)}`;
};

// Animated counter component respecting prefers-reduced-motion
function AnimatedCounter({ end, duration = 1200, suffix = "" }: { end: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      setCount(end);
      return;
    }

    let startTimestamp: number | null = null;
    let animationFrameId: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easedProgress * end));

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        setCount(end);
      }
    };

    animationFrameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrameId);
  }, [end, duration]);

  return (
    <span className="tabular-nums">
      {count}{suffix}
    </span>
  );
}

export default function ProfileCard({ personalInfo, onDownloadClick }: ProfileCardProps) {
  const [imageError, setImageError] = useState(false);

  const renderFallbackAvatar = () => (
    <div className="w-full h-full bg-[#F1EEE6] flex flex-col items-center justify-center p-6 text-center">
      <span className="font-display text-4xl font-extrabold text-[#0F766E]">
        SV
      </span>
      <span className="text-xs font-semibold text-[#4A5565] mt-1">
        Samuel Victor
      </span>
    </div>
  );

  return (
    <div className="bg-[#FFFFFF] border border-[#E6E1D6] rounded-[20px] p-6 sm:p-10 md:p-12 shadow-[4px_4px_0px_#0F766E] relative overflow-hidden transition-all">
      
      {/* 2-Column Responsive Layout: Content Left, Photo Right */}
      <div className="flex flex-col-reverse lg:flex-row gap-10 lg:gap-14 items-center justify-between">
        
        {/* Left Column: Bio, Titles, Metrics & Actions */}
        <div className="flex-1 min-w-0 w-full">
          
          {/* Header Badges: Title & Availability Pill */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#F1EEE6] text-[#0F766E] font-bold text-xs sm:text-sm border border-[#E6E1D6]">
              {personalInfo.title}
            </span>

            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFFFFF] text-[#1B2430] text-xs sm:text-sm font-semibold border border-[#E6E1D6]">
              <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0F766E] opacity-75 duration-1000" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#0F766E]" />
              </span>
              Aberto a novas oportunidades
            </span>
          </div>

          {/* Large Bold Heading with Sunlight Yellow Highlighter under "Victor" */}
          <h1 className="text-[clamp(2.75rem,5.5vw,4.75rem)] font-extrabold font-display text-[#1B2430] leading-[1.05] tracking-tight mb-3">
            Olá, sou Samuel{' '}
            <span className="relative inline-block z-10">
              <span 
                className="absolute left-[-6px] right-[-6px] bottom-1 sm:bottom-2 h-4 sm:h-7 bg-[#FFC940] -z-10 -rotate-1 transform origin-left rounded-sm" 
                aria-hidden="true"
              />
              Victor
            </span>
          </h1>

          {/* Subtitle / Specialization */}
          <p className="text-base sm:text-lg font-medium text-[#4A5565] leading-snug">
            {personalInfo.subtitle} • {personalInfo.location}
          </p>

          {/* Welcoming Bio in comfortable reading width: 2 frases curtas no topo; texto completo na seção Sobre */}
          <p className="text-base sm:text-lg text-[#1B2430] mt-4 leading-relaxed max-w-[65ch]">
            {personalInfo.bio ? (
              personalInfo.bio.split(/(?<=[.!?])\s+/).slice(0, 2).join(' ')
            ) : (
              'Profissional de Tecnologia da Informação com sólida experiência em suporte técnico N1/N2, redes de computadores e telecomunicações. Atuo no diagnóstico e resolução de incidentes, manutenção de equipamentos críticos, configuração de redes corporativas e automação de processos.'
            )}
          </p>

          {/* 2) AS 4 CAIXAS DE NÚMEROS: fundo branco, borda 1px #E6E1D6, padronizadas com padding 16px (p-4), altura uniforme e alinhamento impecável */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mt-8 pt-6 border-t border-[#E6E1D6]">
            
            {/* 1. Experiência */}
            <div className="bg-[#FFFFFF] border border-[#E6E1D6] p-4 rounded-[12px] h-full min-h-[116px] flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 hover:shadow-[4px_4px_0px_#0F766E]">
              <span className="text-[11px] sm:text-xs font-bold text-[#4A5565] block uppercase tracking-wide">Experiência</span>
              <div className="mt-2">
                <span className="text-2xl sm:text-3xl font-extrabold font-display text-[#0F766E] leading-none block whitespace-nowrap">
                  <AnimatedCounter end={personalInfo.experienceYears} suffix="+" />
                  <span className="text-xs font-normal font-sans ml-1 text-[#4A5565]">anos</span>
                </span>
                <span className="text-[11px] font-normal font-sans block text-[#4A5565] mt-1.5 leading-tight">
                  atuação comprovada
                </span>
              </div>
            </div>

            {/* 2. Atuação (Substitui Início / 100%) */}
            <div className="bg-[#FFFFFF] border border-[#E6E1D6] p-4 rounded-[12px] h-full min-h-[116px] flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 hover:shadow-[4px_4px_0px_#0F766E]">
              <span className="text-[11px] sm:text-xs font-bold text-[#4A5565] block uppercase tracking-wide">Atuação</span>
              <div className="mt-2">
                <span className="text-xs sm:text-[13px] font-bold font-display text-[#0F766E] leading-snug block">
                  Presencial / Híbrido / Remoto
                </span>
                <span className="text-[11px] font-normal font-sans block text-[#4A5565] mt-1.5 leading-tight">
                  disponibilidade total
                </span>
              </div>
            </div>

            {/* 3. Nível de Suporte */}
            <div className="bg-[#FFFFFF] border border-[#E6E1D6] p-4 rounded-[12px] h-full min-h-[116px] flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 hover:shadow-[4px_4px_0px_#0F766E]">
              <span className="text-[11px] sm:text-xs font-bold text-[#4A5565] block uppercase tracking-wide">Nível de Suporte</span>
              <div className="mt-2">
                <span className="text-2xl sm:text-3xl font-extrabold font-display text-[#0F766E] leading-none block whitespace-nowrap">
                  N1/N2
                </span>
                <span className="text-[11px] font-normal font-sans block text-[#4A5565] mt-1.5 leading-tight">
                  atendimento e infraestrutura
                </span>
              </div>
            </div>

            {/* 4. Mobilidade */}
            <div className="bg-[#FFFFFF] border border-[#E6E1D6] p-4 rounded-[12px] h-full min-h-[116px] flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 hover:shadow-[4px_4px_0px_#0F766E]">
              <span className="text-[11px] sm:text-xs font-bold text-[#4A5565] block uppercase tracking-wide">Mobilidade</span>
              <div className="mt-2">
                <span className="text-2xl sm:text-3xl font-extrabold font-display text-[#0F766E] leading-none block whitespace-nowrap">
                  CNH A & B
                </span>
                <span className="text-[11px] font-normal font-sans block text-[#4A5565] mt-1.5 leading-tight">
                  possui moto própria
                </span>
              </div>
            </div>

          </div>

          {/* Key practical info pills */}
          <div className="mt-5 flex flex-wrap gap-2 text-xs sm:text-sm font-medium text-[#4A5565]">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FFFFFF] border border-[#E6E1D6] rounded-full text-[#1B2430]">
              <MapPin className="w-3.5 h-3.5 text-[#0F766E]" strokeWidth={2} aria-hidden="true" />
              {personalInfo.location}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FFFFFF] border border-[#E6E1D6] rounded-full text-[#1B2430]">
              <Bike className="w-3.5 h-3.5 text-[#0F766E]" strokeWidth={2} aria-hidden="true" />
              {personalInfo.cnh}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FFFFFF] border border-[#E6E1D6] rounded-full text-[#1B2430]">
              <Briefcase className="w-3.5 h-3.5 text-[#0F766E]" strokeWidth={2} aria-hidden="true" />
              Presencial / Híbrido / Remoto
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FFFFFF] border border-[#E6E1D6] rounded-full text-[#1B2430]">
              <Calendar className="w-3.5 h-3.5 text-[#0F766E]" strokeWidth={2} aria-hidden="true" />
              {personalInfo.english}
            </span>
          </div>

          {/* Action Buttons: WhatsApp in Coral #E8590C & PDF in White with Border */}
          <div className="flex flex-wrap items-center gap-4 mt-8 no-print">
            <a 
              href={getFormattedWhatsappUrl(personalInfo.whatsappUrl)}
              target="_blank"
              rel="noopener noreferrer"
              className="px-7 py-3.5 bg-[#E8590C] hover:bg-[#D34F0A] text-white font-bold text-base rounded-full inline-flex items-center gap-2.5 transition-transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer shadow-[2px_2px_0px_#1B2430]"
            >
              <Phone className="w-4 h-4 text-white" strokeWidth={2.2} aria-hidden="true" />
              <span>Chamar no WhatsApp</span>
            </a>

            <button 
              onClick={onDownloadClick}
              className="px-7 py-3.5 bg-[#FFFFFF] hover:bg-[#F1EEE6] text-[#1B2430] border border-[#E6E1D6] hover:border-[#0F766E] font-bold text-base rounded-full inline-flex items-center gap-2.5 transition-all hover:-translate-y-0.5 active:translate-y-0 cursor-pointer shadow-[2px_2px_0px_#1B2430]"
            >
              <Download className="w-4 h-4 text-[#1B2430]" strokeWidth={2} aria-hidden="true" />
              <span>Baixar Currículo PDF</span>
            </button>
          </div>

        </div>

        {/* Right Column: Colorful Photo with 24px Radius & Solid Offset Teal Block (#0F766E, 12px) */}
        <div className="relative shrink-0 pr-3 pb-3 select-none">
          {/* Green solid offset block behind (12px, without blur) */}
          <div 
            className="absolute inset-0 translate-x-[12px] translate-y-[12px] bg-[#0F766E] rounded-[24px]" 
            aria-hidden="true"
          />

          {/* Photo container */}
          <div className="relative z-10 w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 rounded-[24px] overflow-hidden border border-[#E6E1D6] bg-white shadow-sm">
            {!imageError ? (
              <img 
                src={personalInfo.imageUrl || "/foto_perfil/samuel.png"} 
                alt={personalInfo.fullName}
                className="w-full h-full object-cover object-top contrast-[1.03] saturate-[1.08] transition-transform duration-300 hover:scale-105"
                onError={() => setImageError(true)}
              />
            ) : (
              renderFallbackAvatar()
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
