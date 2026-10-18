import React, { useState, useEffect } from 'react';
import { 
  CheckSquare, 
  Square, 
  HelpCircle, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Network, 
  Radio, 
  Terminal, 
  RotateCcw,
  BookOpen
} from 'lucide-react';

const STORAGE_KEY = 'jobtracker_interview_prep';

interface ChecklistItem {
  id: string;
  category: 'antes' | 'tecnica' | 'perguntas_finais';
  label: string;
  tip?: string;
}

const CHECKLIST_ITEMS: ChecklistItem[] = [
  // 1. Antes da Entrevista
  {
    id: 'prep-1',
    category: 'antes',
    label: 'Pesquisar sobre a empresa, clientes e produtos/serviços que oferecem',
    tip: 'Verifique se atuam como ISP/Telecom, integrador de TI ou corporativo interno.'
  },
  {
    id: 'prep-2',
    category: 'antes',
    label: 'Revisar os requisitos da vaga e conectar com suas histórias STAR',
    tip: 'Tenha em mente quais das suas histórias cobrem o que a vaga mais pede.'
  },
  {
    id: 'prep-3',
    category: 'antes',
    label: 'Testar câmera, microfone e conexão de internet com 15 minutos de antecedência',
    tip: 'Ambiente silencioso e bem iluminado.'
  },
  {
    id: 'prep-4',
    category: 'antes',
    label: 'Deixar o currículo PDF aberto e o link do portfólio pronto no clipboard',
    tip: 'Caso o entrevistador peça para compartilhar a tela ou enviar pelo chat.'
  },

  // 2. Tópicos Técnicos Chave
  {
    id: 'prep-5',
    category: 'tecnica',
    label: 'Revisar troubleshooting de camada física e óptica (OTDR e Power Meter)',
    tip: 'Saber explicar atenuação, cálculo de perda (dB), curvatura excessiva e fusão por arco voltaico.'
  },
  {
    id: 'prep-6',
    category: 'tecnica',
    label: 'Revisar modelo OSI e TCP/IP (DNS, DHCP, PPPoE, VLANs 802.1Q)',
    tip: 'Saber isolar problemas: ping no gateway, ping 8.8.8.8, nslookup, traceroute.'
  },
  {
    id: 'prep-7',
    category: 'tecnica',
    label: 'Revisar melhores práticas ITIL v4 (Gestão de Incidentes vs Problemas, SLA e FCR)',
    tip: 'Destaque como você prioriza chamados críticos e registra base de conhecimento.'
  },
  {
    id: 'prep-8',
    category: 'tecnica',
    label: 'Revisar diferenças entre teoria e prática com transparência e segurança',
    tip: 'Destacar sólida prática em redes/telecom e base conceitual em Docker, Zabbix, pfSense e AD.'
  },

  // 3. Perguntas Inteligentes para Fazer ao Entrevistador
  {
    id: 'prep-9',
    category: 'perguntas_finais',
    label: '"Como é estruturada a rotina diária da equipe e quais são os maiores desafios atuais de infraestrutura?"',
    tip: 'Demonstra interesse em somar e entender o ambiente.'
  },
  {
    id: 'prep-10',
    category: 'perguntas_finais',
    label: '"Quais ferramentas de chamados (Service Desk) e monitoramento a equipe mais utiliza?"',
    tip: 'Mostra familiaridade com processos corporativos organizados.'
  },
  {
    id: 'prep-11',
    category: 'perguntas_finais',
    label: '"Quais são as principais metas ou expectativas para quem assumir essa posição nos primeiros 90 dias?"',
    tip: 'Demonstra foco em entrega de resultados e comprometimento.'
  }
];

export default function InterviewPrep() {
  const [checkedIds, setCheckedIds] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setCheckedIds(JSON.parse(saved));
      }
    } catch (err) {
      console.warn('Erro ao carregar checklist de entrevistas:', err);
    }
  }, []);

  const toggleItem = (id: string) => {
    const updated = { ...checkedIds, [id]: !checkedIds[id] };
    setCheckedIds(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {
      console.warn('Erro ao salvar checklist:', err);
    }
  };

  const handleReset = () => {
    setCheckedIds({});
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      console.warn('Erro ao resetar checklist:', err);
    }
  };

  const totalItems = CHECKLIST_ITEMS.length;
  const completedCount = Object.values(checkedIds).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / totalItems) * 100);

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-[#FFFBF2] border border-[#E6E1D6] p-5 rounded-[12px] space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-[#0F766E]">
            <CheckSquare className="w-5 h-5" strokeWidth={2.2} />
            <h4 className="font-display font-bold text-base text-[#1B2430]">
              Guia & Checklist de Preparação para Entrevistas
            </h4>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-xs font-mono font-bold text-[#0F766E] px-3 py-1 bg-white border border-[#E6E1D6] rounded-full">
              {completedCount} de {totalItems} concluídos ({progressPercent}%)
            </span>
            {completedCount > 0 && (
              <button
                onClick={handleReset}
                className="p-1 text-[#4A5565] hover:text-[#0F766E] rounded-full hover:bg-[#F1EEE6] transition-colors cursor-pointer"
                title="Resetar checklist"
                aria-label="Resetar checklist"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-[#E6E1D6] h-2 rounded-full overflow-hidden">
          <div 
            className="bg-[#0F766E] h-full transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <p className="text-xs sm:text-sm text-[#4A5565] leading-relaxed">
          Checklist interativo e pontos-chave para você revisar antes de qualquer entrevista técnica ou comportamental para vagas de TI, Suporte e Telecomunicações.
        </p>
      </div>

      {/* Sections */}
      <div className="space-y-5">
        {/* Section 1: Antes da Entrevista */}
        <div className="bg-white border border-[#E6E1D6] rounded-[12px] p-5 space-y-3">
          <h5 className="font-mono text-xs font-bold uppercase tracking-wider text-[#0F766E] border-b border-[#E6E1D6] pb-2">
            1. Preparação Pré-Entrevista
          </h5>
          <div className="space-y-2.5">
            {CHECKLIST_ITEMS.filter(i => i.category === 'antes').map(item => {
              const isChecked = !!checkedIds[item.id];
              return (
                <button
                  key={item.id}
                  onClick={() => toggleItem(item.id)}
                  className="w-full text-left p-2.5 rounded-[8px] border transition-all flex items-start gap-3 cursor-pointer hover:bg-[#FAF9F5]"
                  style={{ borderColor: isChecked ? '#0F766E' : '#E6E1D6' }}
                >
                  <div className="mt-0.5 shrink-0 text-[#0F766E]">
                    {isChecked ? <CheckCircle2 className="w-4 h-4 text-[#0F766E]" /> : <Square className="w-4 h-4 text-[#4A5565]" />}
                  </div>
                  <div className="space-y-0.5 flex-1 min-w-0">
                    <p className={`text-xs font-bold ${isChecked ? 'line-through text-[#5B5E62]' : 'text-[#1B2430]'}`}>
                      {item.label}
                    </p>
                    {item.tip && (
                      <p className="text-[11px] text-[#4A5565] leading-normal">
                        💡 {item.tip}
                      </p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 2: Tópicos Técnicos Chave */}
        <div className="bg-white border border-[#E6E1D6] rounded-[12px] p-5 space-y-3">
          <h5 className="font-mono text-xs font-bold uppercase tracking-wider text-[#0F766E] border-b border-[#E6E1D6] pb-2">
            2. Revisão Técnica Rápida (Redes, Telecom & Suporte)
          </h5>
          <div className="space-y-2.5">
            {CHECKLIST_ITEMS.filter(i => i.category === 'tecnica').map(item => {
              const isChecked = !!checkedIds[item.id];
              return (
                <button
                  key={item.id}
                  onClick={() => toggleItem(item.id)}
                  className="w-full text-left p-2.5 rounded-[8px] border transition-all flex items-start gap-3 cursor-pointer hover:bg-[#FAF9F5]"
                  style={{ borderColor: isChecked ? '#0F766E' : '#E6E1D6' }}
                >
                  <div className="mt-0.5 shrink-0 text-[#0F766E]">
                    {isChecked ? <CheckCircle2 className="w-4 h-4 text-[#0F766E]" /> : <Square className="w-4 h-4 text-[#4A5565]" />}
                  </div>
                  <div className="space-y-0.5 flex-1 min-w-0">
                    <p className={`text-xs font-bold ${isChecked ? 'line-through text-[#5B5E62]' : 'text-[#1B2430]'}`}>
                      {item.label}
                    </p>
                    {item.tip && (
                      <p className="text-[11px] text-[#4A5565] leading-normal">
                        🔍 {item.tip}
                      </p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 3: Perguntas Finais */}
        <div className="bg-white border border-[#E6E1D6] rounded-[12px] p-5 space-y-3">
          <h5 className="font-mono text-xs font-bold uppercase tracking-wider text-[#0F766E] border-b border-[#E6E1D6] pb-2">
            3. Perguntas de Alto Impacto para Fazer ao Recrutador
          </h5>
          <div className="space-y-2.5">
            {CHECKLIST_ITEMS.filter(i => i.category === 'perguntas_finais').map(item => {
              const isChecked = !!checkedIds[item.id];
              return (
                <button
                  key={item.id}
                  onClick={() => toggleItem(item.id)}
                  className="w-full text-left p-2.5 rounded-[8px] border transition-all flex items-start gap-3 cursor-pointer hover:bg-[#FAF9F5]"
                  style={{ borderColor: isChecked ? '#0F766E' : '#E6E1D6' }}
                >
                  <div className="mt-0.5 shrink-0 text-[#0F766E]">
                    {isChecked ? <CheckCircle2 className="w-4 h-4 text-[#0F766E]" /> : <Square className="w-4 h-4 text-[#4A5565]" />}
                  </div>
                  <div className="space-y-0.5 flex-1 min-w-0">
                    <p className={`text-xs font-bold ${isChecked ? 'line-through text-[#5B5E62]' : 'text-[#1B2430]'}`}>
                      {item.label}
                    </p>
                    {item.tip && (
                      <p className="text-[11px] text-[#4A5565] leading-normal">
                        🎯 {item.tip}
                      </p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
