import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  RefreshCw, 
  Copy, 
  Check, 
  Clock, 
  Radio, 
  Search, 
  AlertTriangle,
  AlertCircle
} from 'lucide-react';

interface EventRecord {
  id: string;
  quando: string;
  quandoFortaleza: string;
  event: string;
  sid: string;
  ref?: string;
  utm?: string;
  referrer?: string;
  path?: string;
  device?: string;
  os?: string;
  browser?: string;
  browserMajor?: string;
  lang?: string;
  tz?: string;
  tzDiverge?: boolean;
  viewport?: string;
  conn?: string;
  tema?: string;
  pais?: string;
  regiao?: string;
  cidade?: string;
  isp?: string;
  duracaoS?: number;
  scrollMax?: number;
  secoes?: string[];
  // Campos de recado de empresas
  nome?: string;
  empresa?: string;
  email?: string;
  telefone?: string;
  assunto?: string;
  mensagem?: string;
  // Metadados enriquecidos
  resolucao?: string;
  orientacao?: string;
  nucleosCpu?: string;
  memoriaGb?: string;
  toque?: string;
  idiomas?: string;
  conexaoVelocidade?: string;
}

interface ApiResponse {
  eventos: EventRecord[];
  desdeIso: string;
  servidorIniciadoEm: string;
}

const EVENT_LABELS: Record<string, string> = {
  acesso: 'Novo Acesso',
  resumo_visita: 'Resumo de Visita',
  clique_whatsapp: 'WhatsApp',
  clique_email: 'E-mail',
  clique_linkedin: 'LinkedIn',
  clique_github: 'GitHub',
  clique_telefone: 'Telefone',
  baixar_pdf: 'Baixar PDF',
  imprimir_curriculo: 'Impressão',
  abrir_admin: 'Acesso Admin',
  recado_empresa: '💼 Recado de Empresa',
  abrir_recado: '📝 Abertura do Form Recado'
};

const TITULOS_TELEGRAM: Record<string, string> = {
  acesso: '👀 NOVO ACESSO AO PORTFÓLIO',
  resumo_visita: '📊 RESUMO DE VISITA',
  imprimir_curriculo: '🖨️ CURRÍCULO IMPRESSO',
  baixar_pdf: '📥 CURRÍCULO EM PDF BAIXADO',
  abrir_admin: '🔐 TENTATIVA DE ACESSO AO ADMIN',
  clique_whatsapp: '💬 CLIQUE NO WHATSAPP',
  clique_email: '✉️ CLIQUE NO E-MAIL',
  clique_linkedin: '💼 CLIQUE NO LINKEDIN',
  clique_github: '🐙 CLIQUE NO GITHUB',
  clique_telefone: '📞 CLIQUE NO TELEFONE',
  recado_empresa: '💼 NOVO RECADO / PROPOSTA DE EMPRESA',
  abrir_recado: '📝 ABERTURA DO FORMULÁRIO DE RECADO'
};

function formatTelegramText(reg: EventRecord): string {
  if (reg.event === 'recado_empresa') {
    const lines: string[] = [];
    lines.push('💼 *NOVO RECADO / PROPOSTA DE EMPRESA*');
    lines.push('');
    lines.push(`🏢 *Empresa:* ${reg.empresa || 'Não informada'}`);
    lines.push(`👤 *Responsável:* ${reg.nome || 'Não informado'}`);
    lines.push(`✉️ *E-mail / Gmail:* ${reg.email || 'Não informado'}`);
    if (reg.telefone) {
      lines.push(`📞 *WhatsApp / Tel:* ${reg.telefone}`);
    }
    lines.push(`🎯 *Assunto / Vaga:* ${reg.assunto || 'Oportunidade Profissional'}`);
    lines.push('');
    lines.push('📝 *Mensagem / Recado:*');
    lines.push(reg.mensagem || '(Sem mensagem adicional)');
    lines.push('');
    lines.push('━━━━━━━━━━━━━━━━━━━━');
    lines.push(`📅 Horário de Fortaleza: ${reg.quandoFortaleza || reg.quando}`);
    const localParts = [reg.cidade, reg.regiao, reg.pais].filter(Boolean);
    lines.push(`📍 Local aproximado: ${localParts.length > 0 ? localParts.join(', ') : 'Não identificado'}${reg.isp ? ` (Provedor: ${reg.isp})` : ''}`);
    let devIcon = '💻';
    if (reg.device === 'celular') devIcon = '📱';
    else if (reg.device === 'tablet') devIcon = '📟';
    lines.push(`${devIcon} Aparelho: ${reg.device} | ${reg.os} | ${reg.browser} ${reg.browserMajor}`);
    if (reg.resolucao) lines.push(`🖥️ Tela: ${reg.resolucao} (${reg.orientacao || 'Paisagem'})`);
    lines.push(`🌐 Idioma e Fuso: ${reg.idiomas || reg.lang || 'N/A'} | ${reg.tz || 'N/A'}`);
    if (reg.conn) lines.push(`📶 Conexão: ${reg.conn}${reg.conexaoVelocidade ? ` (~${reg.conexaoVelocidade})` : ''}`);
    lines.push(`🔗 Página: ${reg.path || '/'}`);
    return lines.join('\n');
  }

  const lines: string[] = [];
  lines.push(TITULOS_TELEGRAM[reg.event] || `🔔 AÇÃO: ${String(reg.event).toUpperCase()}`);
  lines.push(`📅 Horário de Fortaleza: ${reg.quandoFortaleza || reg.quando}`);
  if (reg.ref || reg.utm) {
    lines.push(`🏷️ Etiqueta/UTM: ${[reg.ref, reg.utm].filter(Boolean).join(' | ')}`);
  }
  lines.push(`🔗 Origem: ${reg.referrer || 'Acesso Direto'}`);
  const localParts = [reg.cidade, reg.regiao, reg.pais].filter(Boolean);
  lines.push(`📍 Local aproximado: ${localParts.length > 0 ? localParts.join(', ') : 'Não identificado'}${reg.isp ? ` (Provedor: ${reg.isp})` : ''}`);
  
  let deviceEmoji = '💻';
  if (reg.device === 'celular') deviceEmoji = '📱';
  else if (reg.device === 'tablet') deviceEmoji = '📟';
  lines.push(`${deviceEmoji} Aparelho/Sistema/Navegador: ${reg.device || 'Desconhecido'} | ${reg.os || 'Outro'} | ${reg.browser || ''} ${reg.browserMajor || ''}`.trim());

  if (reg.resolucao) {
    lines.push(`🖥️ Tela: ${reg.resolucao} (${reg.orientacao || 'Paisagem'}) | ${reg.viewport}`);
  }
  if (reg.nucleosCpu || reg.memoriaGb) {
    const hwParts = [reg.nucleosCpu, reg.memoriaGb].filter(Boolean);
    lines.push(`⚙️ Hardware estimado: ${hwParts.join(' | ')}`);
  }

  let fusoLine = `🌐 Idioma e Fuso: ${reg.idiomas || reg.lang || 'N/A'} | ${reg.tz || 'N/A'}`;
  if (reg.tzDiverge) {
    fusoLine += ' ⚠️ fuso diferente do país (possível VPN)';
  }
  lines.push(fusoLine);

  if (reg.conn) {
    lines.push(`📶 Tipo de conexão: ${reg.conn}${reg.conexaoVelocidade ? ` (~${reg.conexaoVelocidade})` : ''}`);
  }
  if (reg.tema) {
    const temaDesc = reg.tema === 'escuro' ? '🌙 Escuro' : (reg.tema === 'claro' ? '☀️ Claro' : reg.tema);
    lines.push(`🎨 Tema: ${temaDesc}`);
  }
  if (reg.event === 'resumo_visita') {
    lines.push(`⏱️ Duração: ${reg.duracaoS ?? 0} segundos`);
    lines.push(`📜 Rolagem máxima: ${reg.scrollMax ?? 0}%`);
    lines.push(`👁️ Seções vistas: ${Array.isArray(reg.secoes) && reg.secoes.length > 0 ? reg.secoes.join(', ') : 'Nenhuma'}`);
  }
  return lines.join('\n');
}

export default function AdminAccessLog() {
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [data, setData] = useState<ApiResponse | null>(null);

  const [viewMode, setViewMode] = useState<'visitas' | 'mensagens'>('visitas');
  const [eventFilter, setEventFilter] = useState('todos');
  const [refFilter, setRefFilter] = useState('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/notify', {
        method: 'GET',
        headers: {
          'x-admin-key': 'samuel_admin_autorizado'
        }
      });

      if (res.status === 200) {
        const json: ApiResponse = await res.json();
        setData(json);
      } else if (res.status === 429) {
        setErrorMessage('Muitas tentativas simultâneas. Aguarde alguns instantes.');
      } else {
        setErrorMessage(`Falha na resposta do servidor (código ${res.status}).`);
      }
    } catch {
      setErrorMessage('Erro ao conectar ao servidor de monitoramento. Verifique sua conexão.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Carrega imediatamente ao abrir a aba
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Atualização automática a cada 60 segundos enquanto a aba estiver aberta
  useEffect(() => {
    const interval = setInterval(() => {
      fetchEvents();
    }, 60000);
    return () => clearInterval(interval);
  }, [fetchEvents]);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  // Métricas do que está carregado
  const metrics = useMemo(() => {
    const list = data?.eventos || [];
    let acessos = 0;
    let recados = 0;
    let whatsapp = 0;
    let email = 0;
    let linkedin = 0;
    let pdfs = 0;
    let impressoes = 0;
    let adminOpens = 0;
    let totalDuracao = 0;
    let countDuracao = 0;

    for (const item of list) {
      if (item.event === 'acesso') acessos += 1;
      else if (item.event === 'recado_empresa') recados += 1;
      else if (item.event === 'clique_whatsapp') whatsapp += 1;
      else if (item.event === 'clique_email') email += 1;
      else if (item.event === 'clique_linkedin') linkedin += 1;
      else if (item.event === 'baixar_pdf') pdfs += 1;
      else if (item.event === 'imprimir_curriculo') impressoes += 1;
      else if (item.event === 'abrir_admin') adminOpens += 1;
      else if (item.event === 'resumo_visita' && typeof item.duracaoS === 'number' && item.duracaoS > 0) {
        totalDuracao += item.duracaoS;
        countDuracao += 1;
      }
    }

    const avgSeconds = countDuracao > 0 ? Math.round(totalDuracao / countDuracao) : 0;
    const avgFormatted = countDuracao > 0
      ? (avgSeconds >= 60 
          ? `${Math.floor(avgSeconds / 60)}m ${avgSeconds % 60}s` 
          : `${avgSeconds}s`)
      : '—';

    return {
      acessos,
      recados,
      avgFormatted,
      whatsapp,
      email,
      linkedin,
      pdfs,
      impressoes,
      adminOpens
    };
  }, [data]);

  const uniqueRefs = useMemo(() => {
    const set = new Set<string>();
    for (const item of data?.eventos || []) {
      if (item.ref) set.add(item.ref);
    }
    return Array.from(set);
  }, [data]);

  const filteredEvents = useMemo(() => {
    let list = data?.eventos || [];

    if (eventFilter !== 'todos') {
      list = list.filter(e => e.event === eventFilter);
    }

    if (refFilter !== 'todos') {
      list = list.filter(e => e.ref === refFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(e => {
        const str = `${e.event} ${e.cidade} ${e.regiao} ${e.pais} ${e.device} ${e.os} ${e.browser} ${e.ref} ${e.utm} ${e.referrer} ${e.nome || ''} ${e.empresa || ''} ${e.email || ''} ${e.assunto || ''} ${e.mensagem || ''}`.toLowerCase();
        return str.includes(q);
      });
    }

    return list;
  }, [data, eventFilter, refFilter, searchQuery]);

  const groupedVisits = useMemo(() => {
    const groupsMap = new Map<string, {
      sid: string;
      quandoFortaleza: string;
      quando: string;
      cidade: string;
      regiao: string;
      pais: string;
      device: string;
      os: string;
      browser: string;
      browserMajor: string;
      ref?: string;
      utm?: string;
      referrer?: string;
      tzDiverge?: boolean;
      duracaoS: number;
      scrollMax: number;
      secoes: string[];
      actions: { id: string; event: string; quandoFortaleza: string }[];
    }>();

    for (const ev of filteredEvents) {
      const sid = ev.sid || 'anon';
      let group = groupsMap.get(sid);

      if (!group) {
        group = {
          sid,
          quandoFortaleza: ev.quandoFortaleza,
          quando: ev.quando,
          cidade: ev.cidade || '',
          regiao: ev.regiao || '',
          pais: ev.pais || '',
          device: ev.device || 'computador',
          os: ev.os || 'outro',
          browser: ev.browser || '',
          browserMajor: ev.browserMajor || '',
          ref: ev.ref,
          utm: ev.utm,
          referrer: ev.referrer,
          tzDiverge: ev.tzDiverge,
          duracaoS: ev.duracaoS || 0,
          scrollMax: ev.scrollMax || 0,
          secoes: Array.isArray(ev.secoes) ? [...ev.secoes] : [],
          actions: []
        };
        groupsMap.set(sid, group);
      }

      if (ev.event === 'resumo_visita') {
        if (typeof ev.duracaoS === 'number' && ev.duracaoS > group.duracaoS) {
          group.duracaoS = ev.duracaoS;
        }
        if (typeof ev.scrollMax === 'number' && ev.scrollMax > group.scrollMax) {
          group.scrollMax = ev.scrollMax;
        }
        if (Array.isArray(ev.secoes) && ev.secoes.length > group.secoes.length) {
          group.secoes = ev.secoes;
        }
      }

      if (ev.tzDiverge) {
        group.tzDiverge = true;
      }

      group.actions.push({
        id: ev.id,
        event: ev.event,
        quandoFortaleza: ev.quandoFortaleza
      });
    }

    return Array.from(groupsMap.values());
  }, [filteredEvents]);

  if (isLoading && !data) {
    return (
      <div className="py-16 text-center space-y-3">
        <RefreshCw className="w-7 h-7 text-[#0F766E] animate-spin mx-auto" />
        <p className="text-sm font-semibold text-[#1B2430]">Carregando acessos e mensagens...</p>
      </div>
    );
  }

  if (errorMessage && !data) {
    return (
      <div className="p-6 bg-[#FAF9F5] border border-red-200 rounded-[12px] text-center space-y-3">
        <AlertCircle className="w-8 h-8 text-[#C2410C] mx-auto" />
        <p className="text-sm font-bold text-[#1B2430]">{errorMessage}</p>
        <button
          onClick={() => fetchEvents()}
          className="px-4 py-2 bg-[#0F766E] text-white rounded-full text-xs font-bold transition-all cursor-pointer shadow-xs"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  const servidorIniciadoFormatado = data?.servidorIniciadoEm
    ? new Intl.DateTimeFormat('pt-BR', {
        timeZone: 'America/Fortaleza',
        dateStyle: 'short',
        timeStyle: 'medium'
      }).format(new Date(data.servidorIniciadoEm))
    : 'data recente';

  return (
    <div className="space-y-6 text-[#1B2430]">
      {/* Aviso fixo e visível no topo da aba */}
      <div className="p-3.5 bg-[#FFFBF2] border border-[#E6E1D6] rounded-[10px] flex items-start gap-3 shadow-xs">
        <Radio className="w-4 h-4 text-[#0F766E] shrink-0 mt-0.5 animate-pulse" />
        <div className="text-xs leading-relaxed text-[#4A5565] flex-1">
          <span className="font-bold text-[#1B2430]">Aviso de Memória do Servidor: </span>
          Esta lista mostra os eventos guardados na memória do servidor desde {servidorIniciadoFormatado}. Se o servidor ficou inativo ou foi reiniciado, ela pode estar vazia ou parcial. O histórico completo está no seu Telegram.
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => fetchEvents()}
            disabled={isLoading}
            className="px-3 py-1.5 bg-white hover:bg-[#F1EEE6] text-[#0F766E] border border-[#E6E1D6] rounded-full text-xs font-bold inline-flex items-center gap-1.5 transition-all cursor-pointer"
            title="Atualizar agora"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Atualizar</span>
          </button>
        </div>
      </div>

      {/* Cartões de Resumo */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 bg-[#FAF9F5] border border-[#E6E1D6] rounded-[8px]">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#5B5E62] block">
            Acessos Registrados
          </span>
          <span className="text-xl font-bold font-display text-[#1B2430] mt-0.5 block">
            {metrics.acessos}
          </span>
        </div>

        <div className="p-3 bg-[#FAF9F5] border border-[#E6E1D6] rounded-[8px]">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#5B5E62] block">
            Tempo Médio
          </span>
          <span className="text-xl font-bold font-display text-[#0F766E] mt-0.5 block">
            {metrics.avgFormatted}
          </span>
        </div>

        <div className="p-3 bg-[#ECFDF5] border border-[#A7F3D0] rounded-[8px]">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#059669] block">
            Recados Empresas
          </span>
          <span className="text-xl font-bold font-display text-[#0F766E] mt-0.5 block">
            {metrics.recados}
          </span>
        </div>

        <div className="p-3 bg-[#FAF9F5] border border-[#E6E1D6] rounded-[8px]">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#5B5E62] block">
            WhatsApp
          </span>
          <span className="text-xl font-bold font-display text-[#C2410C] mt-0.5 block">
            {metrics.whatsapp}
          </span>
        </div>

        <div className="p-3 bg-[#FAF9F5] border border-[#E6E1D6] rounded-[8px]">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#5B5E62] block">
            E-mails
          </span>
          <span className="text-xl font-bold font-display text-[#1B2430] mt-0.5 block">
            {metrics.email}
          </span>
        </div>

        <div className="p-3 bg-[#FAF9F5] border border-[#E6E1D6] rounded-[8px]">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#5B5E62] block">
            LinkedIn
          </span>
          <span className="text-xl font-bold font-display text-[#1B2430] mt-0.5 block">
            {metrics.linkedin}
          </span>
        </div>

        <div className="p-3 bg-[#FAF9F5] border border-[#E6E1D6] rounded-[8px]">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#5B5E62] block">
            PDFs Baixados
          </span>
          <span className="text-xl font-bold font-display text-[#1B2430] mt-0.5 block">
            {metrics.pdfs}
          </span>
        </div>

        <div className="p-3 bg-[#FAF9F5] border border-[#E6E1D6] rounded-[8px]">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#5B5E62] block">
            Impressões
          </span>
          <span className="text-xl font-bold font-display text-[#1B2430] mt-0.5 block">
            {metrics.impressoes}
          </span>
        </div>

        <div className="p-3 bg-[#FAF9F5] border border-[#E6E1D6] rounded-[8px]">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#5B5E62] block">
            Aberturas Admin
          </span>
          <span className="text-xl font-bold font-display text-[#1B2430] mt-0.5 block">
            {metrics.adminOpens}
          </span>
        </div>
      </div>

      {/* Controles de Visão & Filtros */}
      <div className="space-y-3 pt-2">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 p-1 bg-[#F1EEE6] rounded-full self-start">
            <button
              onClick={() => setViewMode('visitas')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'visitas'
                  ? 'bg-white text-[#1B2430] shadow-xs'
                  : 'text-[#4A5565] hover:text-[#1B2430]'
              }`}
            >
              Visitas Agrupadas ({groupedVisits.length})
            </button>
            <button
              onClick={() => setViewMode('mensagens')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'mensagens'
                  ? 'bg-white text-[#1B2430] shadow-xs'
                  : 'text-[#4A5565] hover:text-[#1B2430]'
              }`}
            >
              Feed de Mensagens Telegram ({filteredEvents.length})
            </button>
          </div>

          <div className="relative min-w-[200px]">
            <Search className="w-3.5 h-3.5 text-[#5B5E62] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar cidade, ref, navegador, empresa..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#FFFBF2] border border-[#E6E1D6] rounded-full text-[#1B2430] focus:outline-none focus:border-[#0F766E]"
            />
          </div>
        </div>

        {/* Linha de Filtros Dropdown */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-[#5B5E62] font-semibold">Tipo:</span>
            <select
              value={eventFilter}
              onChange={(e) => setEventFilter(e.target.value)}
              className="bg-white border border-[#E6E1D6] rounded-[6px] px-2.5 py-1 text-xs font-medium text-[#1B2430] focus:outline-none focus:border-[#0F766E]"
            >
              <option value="todos">Todos os Eventos</option>
              <option value="recado_empresa">💼 Recados de Empresas (recado_empresa)</option>
              <option value="acesso">Novo Acesso (acesso)</option>
              <option value="resumo_visita">Resumo de Visita (resumo_visita)</option>
              <option value="clique_whatsapp">WhatsApp (clique_whatsapp)</option>
              <option value="clique_email">E-mail (clique_email)</option>
              <option value="clique_linkedin">LinkedIn (clique_linkedin)</option>
              <option value="clique_github">GitHub (clique_github)</option>
              <option value="clique_telefone">Telefone (clique_telefone)</option>
              <option value="baixar_pdf">Baixar PDF (baixar_pdf)</option>
              <option value="imprimir_curriculo">Impressão (imprimir_curriculo)</option>
              <option value="abrir_admin">Acesso Admin (abrir_admin)</option>
            </select>
          </div>

          {uniqueRefs.length > 0 && (
            <div className="flex items-center gap-1.5">
              <span className="text-[#5B5E62] font-semibold">Etiqueta:</span>
              <select
                value={refFilter}
                onChange={(e) => setRefFilter(e.target.value)}
                className="bg-white border border-[#E6E1D6] rounded-[6px] px-2.5 py-1 text-xs font-medium text-[#1B2430] focus:outline-none focus:border-[#0F766E]"
              >
                <option value="todos">Todas as Etiquetas</option>
                {uniqueRefs.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
          )}

          {(eventFilter !== 'todos' || refFilter !== 'todos' || searchQuery) && (
            <button
              onClick={() => {
                setEventFilter('todos');
                setRefFilter('todos');
                setSearchQuery('');
              }}
              className="text-[11px] text-[#0F766E] hover:underline font-bold ml-auto"
            >
              Limpar filtros
            </button>
          )}
        </div>
      </div>

      {/* Visão 1: Visitas Agrupadas por SID em Linha do Tempo */}
      {viewMode === 'visitas' && (
        <div className="space-y-3">
          {groupedVisits.length === 0 ? (
            <div className="p-8 text-center bg-[#FAF9F5] border border-[#E6E1D6] rounded-[10px] text-xs text-[#5B5E62]">
              Nenhuma visita registrada com os filtros selecionados.
            </div>
          ) : (
            groupedVisits.map((group) => {
              const localStr = [group.cidade, group.regiao, group.pais].filter(Boolean).join(', ') || 'Local não identificado';
              return (
                <div 
                  key={group.sid} 
                  className="p-4 bg-white border border-[#E6E1D6] rounded-[10px] shadow-xs space-y-3 hover:border-[#0F766E]/40 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E6E1D6]/60 pb-2.5">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-[#0F766E]" />
                      <span className="text-xs font-bold text-[#1B2430]">{group.quandoFortaleza}</span>
                      <span className="text-[11px] font-mono text-[#5B5E62]">({group.sid})</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5">
                      {group.tzDiverge && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold border border-amber-300 flex items-center gap-1">
                          <AlertTriangle className="w-2.5 h-2.5" />
                          possível VPN
                        </span>
                      )}
                      {group.ref && (
                        <span className="px-2 py-0.5 rounded-full bg-[#F1EEE6] text-[#0F766E] text-[10px] font-bold border border-[#E6E1D6]">
                          tag: {group.ref}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Informações da Visita: Local, Dispositivo, Origem */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs text-[#4A5565]">
                    <div>
                      <span className="font-semibold text-[#1B2430] block text-[11px]">Localização:</span>
                      <span className="text-[#1B2430]">{localStr}</span>
                    </div>

                    <div>
                      <span className="font-semibold text-[#1B2430] block text-[11px]">Aparelho & Sistema:</span>
                      <span>{group.device} • {group.os} • {group.browser} {group.browserMajor}</span>
                    </div>

                    <div>
                      <span className="font-semibold text-[#1B2430] block text-[11px]">Origem / Referrer:</span>
                      <span className="break-all">{group.referrer || 'Acesso Direto'}</span>
                    </div>
                  </div>

                  {/* Métricas de Engajamento */}
                  {(group.duracaoS > 0 || group.scrollMax > 0 || group.secoes.length > 0) && (
                    <div className="p-2.5 bg-[#FAF9F5] border border-[#E6E1D6] rounded-[6px] text-xs flex flex-wrap items-center gap-4 text-[#4A5565]">
                      {group.duracaoS > 0 && (
                        <div>
                          <span className="text-[11px] font-bold text-[#1B2430]">Duração: </span>
                          <span>{group.duracaoS}s</span>
                        </div>
                      )}
                      {group.scrollMax > 0 && (
                        <div>
                          <span className="text-[11px] font-bold text-[#1B2430]">Rolagem máx: </span>
                          <span>{group.scrollMax}%</span>
                        </div>
                      )}
                      {group.secoes.length > 0 && (
                        <div>
                          <span className="text-[11px] font-bold text-[#1B2430]">Seções: </span>
                          <span className="font-mono text-[11px]">{group.secoes.join(', ')}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Ações Realizadas nesta Sessão */}
                  {group.actions.length > 0 && (
                    <div className="pt-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#5B5E62] block mb-1.5">
                        Ações nesta visita ({group.actions.length}):
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {group.actions.map(act => (
                          <span 
                            key={act.id}
                            className="px-2 py-0.5 rounded-[4px] bg-[#FFFBF2] border border-[#E6E1D6] text-[11px] font-medium text-[#1B2430]"
                          >
                            {EVENT_LABELS[act.event] || act.event} ({act.quandoFortaleza.split(' ')[1] || act.quandoFortaleza})
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Visão 2: Feed no mesmo texto detalhado do Telegram */}
      {viewMode === 'mensagens' && (
        <div className="space-y-3">
          {filteredEvents.length === 0 ? (
            <div className="p-8 text-center bg-[#FAF9F5] border border-[#E6E1D6] rounded-[10px] text-xs text-[#5B5E62]">
              Nenhum evento registrado com os filtros selecionados.
            </div>
          ) : (
            filteredEvents.map((ev) => {
              const textContent = formatTelegramText(ev);
              const isCopied = copiedId === ev.id;

              return (
                <div 
                  key={ev.id} 
                  className="p-4 bg-white border border-[#E6E1D6] rounded-[10px] shadow-xs relative group"
                >
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#E6E1D6]/60">
                    <span className="text-xs font-bold text-[#0F766E] uppercase tracking-wide">
                      {EVENT_LABELS[ev.event] || ev.event}
                    </span>
                    <button
                      onClick={() => handleCopy(ev.id, textContent)}
                      className="px-2.5 py-1 text-xs font-bold text-[#0F766E] hover:bg-[#F1EEE6] rounded-[4px] border border-[#E6E1D6] inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                      title="Copiar texto idêntico ao do Telegram"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-[#0F766E]" />
                          <span>Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copiar</span>
                        </>
                      )}
                    </button>
                  </div>

                  <pre className="font-mono text-xs text-[#1B2430] whitespace-pre-wrap leading-relaxed select-text bg-[#FAF9F5] p-3 rounded-[6px] border border-[#E6E1D6]">
                    {textContent}
                  </pre>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
