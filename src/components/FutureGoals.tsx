import React, { useState } from 'react';
import { 
  Globe, 
  Cloud, 
  ShieldCheck, 
  GraduationCap, 
  TrendingUp
} from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';

interface GoalItem {
  id: string;
  category: 'skills' | 'tech' | 'career';
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  title: string;
  horizon: string;
  statusLabel: string;
  paragraphs: string[];
  pillars: string[];
  metricLabel?: string;
}

export default function FutureGoals() {
  const [filter, setFilter] = useState<'all' | 'tech' | 'career'>('all');
  const shouldReduceMotion = useReducedMotion();

  // Etapa 7: Manter exatamente 4 metas focadas, padronizando Uniasselvi e Tecnólogo em Cibersegurança (em andamento)
  const goals: GoalItem[] = [
    {
      id: 'graduacao-pos',
      category: 'career',
      icon: GraduationCap,
      title: 'Tecnólogo em Cibersegurança & Pós-Graduação',
      horizon: 'Formação Superior',
      statusLabel: 'Desenvolvimento Acadêmico',
      paragraphs: [
        'Concluir com excelência o Tecnólogo em Cibersegurança (em andamento) na Uniasselvi, consolidando a base teórica e prática da área.',
        'Futuramente, realizar uma pós-graduação ou especialização voltada para áreas estratégicas como Redes, Cloud ou Segurança da Informação.'
      ],
      pillars: [
        'Conclusão do Tecnólogo em Cibersegurança (em andamento)',
        'Pós-graduação em Segurança, Redes ou Cloud',
        'Alinhamento contínuo entre teoria acadêmica e campo'
      ],
      metricLabel: 'Tecnólogo em Cibersegurança (em andamento) na Uniasselvi'
    },
    {
      id: 'cloud',
      category: 'tech',
      icon: Cloud,
      title: 'Cloud Computing & Arquiteturas',
      horizon: 'Próximo Horizonte',
      statusLabel: 'Laboratórios & Certificações',
      paragraphs: [
        'Aprofundar meus conhecimentos em computação em nuvem e adquirir experiência prática com serviços, ferramentas e arquiteturas cloud, buscando futuramente certificações na área.'
      ],
      pillars: [
        'Arquiteturas modernas de nuvem',
        'Serviços e ferramentas cloud computing',
        'Preparação para certificações da área'
      ],
      metricLabel: 'Laboratórios práticos & Arquitetura'
    },
    {
      id: 'seguranca',
      category: 'tech',
      icon: ShieldCheck,
      title: 'Segurança da Informação',
      horizon: 'Foco Contínuo',
      statusLabel: 'Especialização em Defesa',
      paragraphs: [
        'Continuar evoluindo na área de Segurança da Informação, aprofundando conhecimentos em defesa cibernética, segurança de ambientes, análise de vulnerabilidades, monitoramento e boas práticas de proteção.'
      ],
      pillars: [
        'Defesa cibernética e mitigação de ameaças',
        'Hardening e proteção de ambientes de rede',
        'Análise de vulnerabilidades e monitoramento ativo'
      ],
      metricLabel: 'Alinhado ao Tecnólogo em Cibersegurança (em andamento)'
    },
    {
      id: 'ingles',
      category: 'skills',
      icon: Globe,
      title: 'Inglês — Intermediário / Avançado',
      horizon: 'Meta em Andamento',
      statusLabel: 'Rotina Diária Ativa',
      paragraphs: [
        'Iniciar e manter uma rotina consistente de estudos de inglês com o objetivo de alcançar o nível intermediário, principalmente para conseguir consumir documentações técnicas sem barreiras, acompanhar cursos e conteúdos internacionais e me comunicar com naturalidade dentro do ecossistema de tecnologia.'
      ],
      pillars: [
        'Consumo de documentações técnicas oficiais',
        'Treinamentos e conteúdos internacionais',
        'Comunicação técnica e ampliação de vocabulário'
      ],
      metricLabel: 'Prática diária de leitura técnica'
    }
  ];

  const filteredGoals = filter === 'all'
    ? goals
    : filter === 'tech'
    ? goals.filter(g => g.category === 'tech')
    : goals.filter(g => g.category === 'career' || g.category === 'skills');

  return (
    <div className="space-y-6">
      {/* Filters in Clean Rounded Pills */}
      <div className="no-print flex flex-wrap gap-2 pb-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold border transition-all cursor-pointer ${
            filter === 'all'
              ? 'bg-[#0F766E] text-white border-[#0F766E] shadow-sm'
              : 'bg-[#FFFFFF] text-[#4A5565] hover:text-[#0F766E] hover:border-[#0F766E] hover:bg-[#F1EEE6] border-[#E6E1D6]'
          }`}
        >
          Todas as Metas
        </button>
        <button
          onClick={() => setFilter('tech')}
          className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold border transition-all cursor-pointer ${
            filter === 'tech'
              ? 'bg-[#0F766E] text-white border-[#0F766E] shadow-sm'
              : 'bg-[#FFFFFF] text-[#4A5565] hover:text-[#0F766E] hover:border-[#0F766E] hover:bg-[#F1EEE6] border-[#E6E1D6]'
          }`}
        >
          Trilha Técnica (Cloud & Cibersegurança)
        </button>
        <button
          onClick={() => setFilter('career')}
          className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold border transition-all cursor-pointer ${
            filter === 'career'
              ? 'bg-[#0F766E] text-white border-[#0F766E] shadow-sm'
              : 'bg-[#FFFFFF] text-[#4A5565] hover:text-[#0F766E] hover:border-[#0F766E] hover:bg-[#F1EEE6] border-[#E6E1D6]'
          }`}
        >
          Formação, Idiomas & Carreira
        </button>
      </div>

      {/* Roadmap Cards Grid: 4 metas em grid equilibrado */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredGoals.map((goal, idx) => {
          const IconComponent = goal.icon;

          return (
            <motion.div
              key={goal.id}
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: idx * 0.08 }}
              className="bg-[#FFFFFF] border border-[#E6E1D6] rounded-[12px] p-6 sm:p-7 flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 hover:shadow-[4px_4px_0px_#0F766E] group"
            >
              <div>
                {/* Header with Icon and Horizon Badge */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="w-12 h-12 rounded-[10px] bg-[#F1EEE6] border border-[#E6E1D6] flex items-center justify-center text-[#0F766E] shrink-0 group-hover:bg-[#0F766E] group-hover:text-white transition-colors duration-200">
                    <IconComponent className="w-6 h-6" strokeWidth={2.2} />
                  </div>
                  
                  <span className="font-mono text-xs uppercase tracking-wider text-[#0F766E] bg-[#F1EEE6] px-3 py-1 rounded-full font-bold">
                    {goal.horizon}
                  </span>
                </div>

                {/* Title & Status */}
                <h3 className="text-lg sm:text-xl font-bold font-display text-[#1B2430] group-hover:text-[#0F766E] transition-colors leading-tight">
                  {goal.title}
                </h3>
                
                <span className="inline-block text-xs font-semibold text-[#4A5565] mt-1 mb-3">
                  {goal.statusLabel}
                </span>

                {/* Paragraphs */}
                <div className="space-y-2 text-sm text-[#4A5565] leading-relaxed mb-6">
                  {goal.paragraphs.map((p, pIdx) => (
                    <p key={pIdx}>
                      {p}
                    </p>
                  ))}
                </div>
              </div>

              {/* Pillars */}
              <div className="border-t border-[#E6E1D6] pt-3 mt-auto space-y-2.5">
                <span className="font-display text-xs uppercase tracking-wider text-[#1B2430] font-bold block">
                  Pilares de Foco:
                </span>
                
                <ul className="space-y-1.5 text-xs sm:text-sm text-[#1B2430]">
                  {goal.pillars.map((pillar, pIdx) => (
                    <li key={pIdx} className="flex items-start gap-2">
                      <span className="text-[#0F766E] font-bold text-sm select-none mt-0.5" aria-hidden="true">▸</span>
                      <span className="leading-tight font-medium">{pillar}</span>
                    </li>
                  ))}
                </ul>

                {goal.metricLabel && (
                  <div className="pt-2">
                    <span className="inline-flex items-center gap-1.5 text-xs text-[#1B2430] bg-[#F1EEE6] border border-[#E6E1D6] px-3 py-1.5 rounded-full w-full font-semibold">
                      <TrendingUp className="w-3.5 h-3.5 text-[#0F766E] shrink-0" strokeWidth={2} aria-hidden="true" />
                      <span className="truncate">{goal.metricLabel}</span>
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Quote Box in Neutral White with Brand Accent #0F766E */}
      <div className="bg-[#FFFFFF] border border-[#E6E1D6] rounded-[12px] p-6 sm:p-8 text-center transition-all duration-200 hover:-translate-y-1 hover:shadow-[4px_4px_0px_#0F766E]">
        <blockquote className="text-xl sm:text-2xl font-bold font-display text-[#1B2430] tracking-tight max-w-xl mx-auto leading-relaxed">
          “O objetivo não é saber tudo. É continuar evoluindo com consistência, método e empatia técnica.”
        </blockquote>
        <p className="text-xs sm:text-sm text-[#0F766E] font-bold mt-3 uppercase tracking-wider">
          Samuel Victor da Silva Nobre • Visão de Infraestrutura e Carreira
        </p>
      </div>
    </div>
  );
}
