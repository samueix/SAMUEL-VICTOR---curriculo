import React, { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Skill } from '../types';

interface SkillsGridProps {
  skills: Skill[];
}

export default function SkillsGrid({ skills }: SkillsGridProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'suporte' | 'redes' | 'desenvolvimento' | 'ia' | 'soft'>('all');
  const shouldReduceMotion = useReducedMotion();

  const categories = [
    { id: 'all', label: 'Todas' },
    { id: 'suporte', label: 'Suporte & Infraestrutura' },
    { id: 'redes', label: 'Redes & Telecom' },
    { id: 'desenvolvimento', label: 'Vibe Coding & Automação' },
    { id: 'ia', label: 'Inteligência Artificial' },
    { id: 'soft', label: 'Habilidades Pessoais' }
  ];

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'suporte': return 'Suporte Técnico & Infraestrutura';
      case 'redes': return 'Redes, Telecom & Conectividade';
      case 'desenvolvimento': return 'Vibe Coding & Scripts de Automação';
      case 'ia': return 'Inteligência Artificial & LLMs';
      default: return 'Competências Interpessoais & Gestão';
    }
  };

  const categoryOrder: Array<'suporte' | 'redes' | 'desenvolvimento' | 'ia' | 'soft'> = [
    'suporte',
    'redes',
    'desenvolvimento',
    'ia',
    'soft'
  ];

  const groupsToDisplay = activeTab === 'all'
    ? categoryOrder
    : [activeTab];

  return (
    <div className="space-y-6">
      {/* Category Tabs in Clean Rounded Pills */}
      <div className="no-print flex flex-wrap gap-2 pb-2">
        {categories.map(cat => {
          const isActive = activeTab === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id as any)}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold border transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#0F766E] text-white border-[#0F766E] shadow-sm'
                  : 'bg-[#FFFFFF] text-[#4A5565] hover:text-[#0F766E] hover:border-[#0F766E] hover:bg-[#F1EEE6] border-[#E6E1D6]'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Groups with Bricolage Grotesque titles and Clean Tags (Fundo #F1EEE6, hover verde #0F766E e texto branco) */}
      <div className="space-y-6">
        {groupsToDisplay.map((catKey) => {
          const itemsInCat = skills.filter(s => s.category === catKey);
          if (itemsInCat.length === 0) return null;

          return (
            <div 
              key={catKey} 
              className="bg-[#FFFFFF] border border-[#E6E1D6] rounded-[12px] p-5 sm:p-7 transition-all duration-200 hover:-translate-y-1 hover:shadow-[4px_4px_0px_#0F766E]"
            >
              {/* Group title in Bricolage Grotesque */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E6E1D6] pb-3 mb-4">
                <h3 className="font-display text-lg sm:text-xl font-bold text-[#1B2430]">
                  {getCategoryLabel(catKey)}
                </h3>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#F1EEE6] text-[#0F766E] border border-[#E6E1D6]">
                  {itemsInCat.length} competências
                </span>
              </div>

              {/* Technologies as pills: #F1EEE6 with #1B2430 text, no category colors, inverts to #0F766E + white on hover */}
              <div className="flex flex-wrap gap-2.5">
                {itemsInCat.map((skill, index) => (
                  <motion.div
                    key={skill.name}
                    initial={shouldReduceMotion ? false : { opacity: 0, y: 6 }}
                    whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={shouldReduceMotion ? undefined : { duration: 0.25, delay: index * 0.03 }}
                    className="px-4 py-2 rounded-full font-sans text-xs sm:text-sm font-semibold cursor-default select-none transition-all duration-150 transform hover:-translate-y-0.5 bg-[#F1EEE6] text-[#1B2430] hover:bg-[#0F766E] hover:text-white"
                  >
                    <span>{skill.name}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
