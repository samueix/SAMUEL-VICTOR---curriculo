import React, { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Education, Certification } from '../types';

interface AcademicEducationProps {
  educations: Education[];
  certifications: Certification[];
  languages?: string[];
  tools?: string[];
}

export default function AcademicEducation({ educations, certifications, languages, tools }: AcademicEducationProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'grad' | 'certs'>('all');
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="space-y-6">
      {/* Tab controls */}
      <div className="no-print flex flex-wrap gap-2 pb-2">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold border transition-all cursor-pointer ${
            activeTab === 'all'
              ? 'bg-[#0F766E] text-white border-[#0F766E] shadow-sm'
              : 'bg-[#FFFFFF] text-[#4A5565] hover:text-[#0F766E] hover:border-[#0F766E] hover:bg-[#F1EEE6] border-[#E6E1D6]'
          }`}
        >
          Todos os Registros
        </button>
        <button
          onClick={() => setActiveTab('grad')}
          className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold border transition-all cursor-pointer ${
            activeTab === 'grad'
              ? 'bg-[#0F766E] text-white border-[#0F766E] shadow-sm'
              : 'bg-[#FFFFFF] text-[#4A5565] hover:text-[#0F766E] hover:border-[#0F766E] hover:bg-[#F1EEE6] border-[#E6E1D6]'
          }`}
        >
          Formação Acadêmica
        </button>
        <button
          onClick={() => setActiveTab('certs')}
          className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold border transition-all cursor-pointer ${
            activeTab === 'certs'
              ? 'bg-[#0F766E] text-white border-[#0F766E] shadow-sm'
              : 'bg-[#FFFFFF] text-[#4A5565] hover:text-[#0F766E] hover:border-[#0F766E] hover:bg-[#F1EEE6] border-[#E6E1D6]'
          }`}
        >
          Certificações & Cursos
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Education column */}
        {(activeTab === 'all' || activeTab === 'grad') && (
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 pb-1">
              <span className="w-3 h-3 rounded-full bg-[#0F766E]" aria-hidden="true" />
              <h3 className="font-display text-lg font-bold text-[#1B2430]">
                Formação Acadêmica
              </h3>
            </div>
            
            <div className="space-y-4">
              {educations.map((edu, idx) => (
                <motion.div 
                  key={idx}
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
                  whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={shouldReduceMotion ? undefined : { duration: 0.3, delay: idx * 0.08 }}
                  className="bg-[#FFFFFF] border border-[#E6E1D6] p-6 rounded-[12px] transition-all duration-200 hover:-translate-y-1 hover:shadow-[4px_4px_0px_#0F766E]"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                    <span className="px-3 py-1 rounded-full bg-[#F1EEE6] text-[#0F766E] font-bold text-xs border border-[#E6E1D6]">
                      {edu.status}
                    </span>
                    <span className="font-mono text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#F1EEE6] text-[#4A5565] border border-[#E6E1D6]">
                      {edu.period}
                    </span>
                  </div>

                  <h4 className="text-lg font-bold font-display text-[#1B2430]">
                    {edu.degree}
                  </h4>
                  <p className="text-sm text-[#0F766E] font-bold mb-3">{edu.institution}</p>
                  
                  <p className="text-sm text-[#4A5565] leading-relaxed mb-3 font-medium">
                    {edu.description}
                  </p>
                  
                  {edu.bullets && edu.bullets.length > 0 && (
                    <ul className="space-y-1.5 text-xs sm:text-sm text-[#1B2430] border-t border-[#E6E1D6] pt-3">
                      {edu.bullets.map((bullet, bIdx) => (
                        <li key={bIdx} className="flex gap-2 items-start">
                          <span className="text-[#0F766E] font-bold select-none" aria-hidden="true">▸</span>
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications column */}
        {(activeTab === 'all' || activeTab === 'certs') && (
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 pb-1">
              <span className="w-3 h-3 rounded-full bg-[#0F766E]" aria-hidden="true" />
              <h3 className="font-display text-lg font-bold text-[#1B2430]">
                Certificações & Qualificações
              </h3>
            </div>
            
            <div className="space-y-4">
              {certifications.map((cert, idx) => (
                <motion.div 
                  key={idx}
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
                  whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={shouldReduceMotion ? undefined : { duration: 0.3, delay: idx * 0.08 }}
                  className="bg-[#FFFFFF] border border-[#E6E1D6] p-6 rounded-[12px] transition-all duration-200 hover:-translate-y-1 hover:shadow-[4px_4px_0px_#0F766E]"
                >
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="px-3 py-1 rounded-full bg-[#F1EEE6] text-[#0F766E] font-bold text-xs border border-[#E6E1D6]">
                      Credencial Ativa
                    </span>
                    <span className="font-mono text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#F1EEE6] border border-[#E6E1D6] text-[#4A5565]">
                      {cert.year}
                    </span>
                  </div>

                  <h4 className="text-lg font-bold font-display text-[#1B2430]">
                    {cert.name}
                  </h4>
                  <p className="text-sm text-[#0F766E] font-bold mb-3">{cert.institution}</p>
                  
                  <p className="text-sm text-[#4A5565] leading-relaxed mb-3 font-medium">
                    {cert.description}
                  </p>

                  {cert.bullets && cert.bullets.length > 0 && (
                    <ul className="space-y-1.5 text-xs sm:text-sm text-[#1B2430] border-t border-[#E6E1D6] pt-3">
                      {cert.bullets.map((bullet, bIdx) => (
                        <li key={bIdx} className="flex gap-2 items-start">
                          <span className="text-[#0F766E] font-bold select-none" aria-hidden="true">▸</span>
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Languages and Tools */}
      {activeTab === 'all' && ((languages && languages.length > 0) || (tools && tools.length > 0)) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-[#E6E1D6]">
          {/* Languages */}
          {languages && languages.length > 0 && (
            <div className="space-y-3">
              <span className="font-display text-base font-bold text-[#1B2430] block">
                Idiomas
              </span>
              <div className="bg-[#FFFFFF] border border-[#E6E1D6] p-5 rounded-[12px] divide-y divide-[#E6E1D6] hover:shadow-[4px_4px_0px_#0F766E] transition-all duration-200">
                {languages.map((lang, idx) => {
                  const parts = lang.split(' – ');
                  const name = parts[0];
                  const desc = parts[1] || '';
                  return (
                    <div key={idx} className="py-2.5 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 text-sm">
                      <span className="font-bold text-[#1B2430]">{name}</span>
                      <span className="text-[#0F766E] font-semibold">{desc}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tools */}
          {tools && tools.length > 0 && (
            <div className="space-y-3">
              <span className="font-display text-base font-bold text-[#1B2430] block">
                Ferramentas Operacionais
              </span>
              <div className="bg-[#FFFFFF] border border-[#E6E1D6] p-5 rounded-[12px] hover:shadow-[4px_4px_0px_#0F766E] transition-all duration-200">
                <div className="flex flex-wrap gap-2">
                  {tools.map((tool, idx) => (
                    <span 
                      key={idx}
                      className="px-3.5 py-1.5 bg-[#F1EEE6] text-[#1B2430] text-xs font-semibold rounded-full border border-[#E6E1D6] hover:bg-[#0F766E] hover:text-white transition-colors cursor-default"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
