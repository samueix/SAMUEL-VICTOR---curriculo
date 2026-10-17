import React, { useState, useRef } from 'react';
import { MapPin, Filter } from 'lucide-react';
import { motion, useScroll, useReducedMotion } from 'motion/react';
import { Experience } from '../types';

interface ExperienceTimelineProps {
  experiences: Experience[];
}

export default function ExperienceTimeline({ experiences }: ExperienceTimelineProps) {
  const [selectedTag, setSelectedTag] = useState<string>('Todos');
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 85%", "end 60%"]
  });

  const popularTags = [
    'Todos', 
    'Suporte Técnico N1/N2', 
    'Redes de Computadores', 
    'Gestão de Chamados', 
    'Cabeamento Estruturado', 
    'Equipamentos de Telecomunicações'
  ];

  const filteredExperiences = selectedTag === 'Todos'
    ? experiences
    : experiences.filter(exp => exp.skills.includes(selectedTag));

  const isCurrentRole = (exp: Experience, idx: number) => {
    const periodLower = exp.period.toLowerCase();
    return periodLower.includes('presente') || periodLower.includes('atual') || idx === 0;
  };

  return (
    <div className="space-y-6">
      {/* Filters - Clean Rounded Pills Bar */}
      <div className="no-print bg-[#FFFFFF] border border-[#E6E1D6] p-4 sm:p-5 rounded-[12px] shadow-sm">
        <div className="flex items-center gap-2 text-xs font-bold text-[#1B2430] mb-3">
          <Filter className="w-4 h-4 text-[#0F766E]" strokeWidth={2.2} aria-hidden="true" />
          <span>Filtrar experiências por competência:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {popularTags.map(tag => {
            const isSelected = selectedTag === tag;
            return (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-[#0F766E] text-white border-[#0F766E] shadow-sm'
                    : 'bg-[#F1EEE6] text-[#4A5565] hover:text-[#1B2430] hover:bg-[#E6E1D6] border-transparent'
                }`}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </div>

      {/* Timeline Layout with Dynamic Scroll Progress Line */}
      <div ref={containerRef} className="relative ml-2 sm:ml-4 pl-7 sm:pl-9 space-y-8 py-3">
        
        {/* Static Base Line */}
        <div className="absolute top-0 bottom-0 left-[8px] w-[2px] bg-[#E6E1D6] rounded-full" />

        {/* Dynamic Colored Progress Line in Brand Green #0F766E */}
        <motion.div 
          style={shouldReduceMotion ? { scaleY: 1 } : { scaleY: scrollYProgress, transformOrigin: 'top' }}
          className="absolute top-0 bottom-0 left-[8px] w-[2px] bg-[#0F766E] rounded-full z-10"
          aria-hidden="true"
        />

        {filteredExperiences.map((exp, idx) => {
          const current = isCurrentRole(exp, idx);

          return (
            <motion.div 
              key={exp.id} 
              initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
              whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={shouldReduceMotion ? undefined : { duration: 0.35, delay: idx * 0.08 }}
              className="relative group print-break-inside-avoid"
            >
              {/* Marker: Single brand color #0F766E with white center */}
              <div 
                className="absolute -left-[35px] sm:-left-[43px] top-2 w-4.5 h-4.5 rounded-full z-20 transition-transform group-hover:scale-125 border-2 border-white ring-2 ring-[#0F766E] bg-[#0F766E] flex items-center justify-center"
                aria-hidden="true"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-white" />
              </div>

              {/* Card content: white background, 1px border #E6E1D6, thick 4px left border in brand green #0F766E */}
              <div className="bg-[#FFFFFF] border border-[#E6E1D6] border-l-4 border-l-[#0F766E] rounded-[12px] p-5 sm:p-7 transition-all duration-200 hover:-translate-y-1 hover:shadow-[4px_4px_0px_#0F766E]">
                
                {/* Header: Role, Period in Mono, Company & Location */}
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-2 pb-3 border-b border-[#E6E1D6]">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h3 className="text-lg sm:text-xl font-bold font-display text-[#1B2430]">
                      {exp.role}
                    </h3>

                    {/* Selo Atual em Coral #E8590C */}
                    {current && (
                      <span className="px-2.5 py-0.5 rounded-full bg-[#E8590C] text-white font-sans text-xs font-bold inline-flex items-center gap-1.5 shadow-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" aria-hidden="true" />
                        Atual
                      </span>
                    )}
                  </div>

                  <span className="font-mono text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#F1EEE6] text-[#4A5565] border border-[#E6E1D6] shrink-0">
                    {exp.period}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm font-semibold text-[#4A5565] mb-4">
                  <span className="text-[#0F766E] font-bold">{exp.company}</span>
                  <span className="text-[#1B2430]/30">•</span>
                  <span className="flex items-center gap-1 text-[#1B2430]">
                    <MapPin className="w-3.5 h-3.5 text-[#0F766E]" strokeWidth={2} aria-hidden="true" />
                    {exp.location}
                  </span>
                </div>

                {/* Bullet points in comfortable DM Sans */}
                <ul className="space-y-2 text-sm sm:text-base text-[#1B2430] leading-relaxed">
                  {exp.description.map((bullet, bIdx) => (
                    <li key={bIdx} className="flex gap-2.5 items-start">
                      <span className="text-[#0F766E] font-bold text-sm select-none mt-0.5" aria-hidden="true">▸</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>

                {/* Skills tags: #F1EEE6 with dark text, inverts to #0F766E and white text on hover */}
                {exp.skills && exp.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-4 mt-4 border-t border-[#E6E1D6]">
                    {exp.skills.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="px-3 py-1 rounded-full text-xs font-semibold bg-[#F1EEE6] text-[#1B2430] hover:bg-[#0F766E] hover:text-white transition-colors cursor-default"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}

              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
