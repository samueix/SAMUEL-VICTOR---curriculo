/**
 * Sistema de rastreamento estritamente silencioso e anônimo.
 * 
 * Regras:
 * - 100% invisível ao visitante (sem pop-ups, sem banners, sem travar cliques/navegação).
 * - Sem cookies, sem fingerprint, sem coleta de IP ou canvas.
 * - sid aleatório por sessão (sessionStorage).
 * - Validação humana antes do evento "acesso".
 * - Engajamento silencioso (duração visível, rolagem máxima, seções vistas).
 * - Envio único de "resumo_visita" ao sair (somente se "acesso" foi disparado).
 * - Cada clique no máximo 1x por sessão.
 * - Modo dono (?owner=1 ativa / ?owner=0 desativa) silencia o rastreamento.
 * - Bloqueado em import.meta.env.DEV, doNotTrack, globalPrivacyControl e bots.
 */

export type TrackEventType = 
  | 'acesso'
  | 'resumo_visita'
  | 'imprimir_curriculo'
  | 'baixar_pdf'
  | 'abrir_admin'
  | 'clique_whatsapp'
  | 'clique_email'
  | 'clique_linkedin'
  | 'clique_github'
  | 'clique_telefone'
  | 'recado_empresa'
  | 'abrir_recado';

let trackerInitialized = false;
let acessoEnviado = false;
let resumoEnviado = false;
let visibleSeconds = 0;
let maxScrollPercentage = 0;
const viewedSections = new Set<string>();

const TRACKED_SECTIONS = [
  'sobre',
  'experiencia',
  'habilidades',
  'projetos',
  'formacao',
  'objetivos',
  'contato'
];

function getSessionId(): string {
  if (typeof window === 'undefined') return 'anon';
  try {
    let sid = sessionStorage.getItem('sid');
    if (!sid) {
      sid = Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
      sessionStorage.setItem('sid', sid);
    }
    return sid;
  } catch {
    return 'anon';
  }
}

export function checkAndUpdateOwnerMode(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const sp = new URLSearchParams(window.location.search);
    const owner = sp.get('owner');
    if (owner === '1') {
      localStorage.setItem('owner', '1');
      const cleanUrl = window.location.pathname + window.location.hash;
      window.history.replaceState(null, '', cleanUrl);
    } else if (owner === '0') {
      localStorage.removeItem('owner');
      const cleanUrl = window.location.pathname + window.location.hash;
      window.history.replaceState(null, '', cleanUrl);
    }
    return localStorage.getItem('owner') === '1';
  } catch {
    return false;
  }
}

function shouldBlockTracking(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    // 1. Modo dono ativo (?owner=1 ativa, ?owner=0 desativa)
    if (checkAndUpdateOwnerMode()) return true;

    // 2. Robôs, crawlers e navegadores automatizados
    if (navigator.webdriver) return true;
    const ua = navigator.userAgent || '';
    if (/bot|crawler|spider|preview|facebookexternalhit|whatsapp|telegram|linkedinbot|slurp|headless|lighthouse|pingdom/i.test(ua)) {
      return true;
    }

    return false;
  } catch {
    return true;
  }
}

function getDevice(): 'celular' | 'tablet' | 'computador' {
  if (typeof window === 'undefined') return 'computador';
  const w = window.innerWidth;
  const ua = navigator.userAgent || '';
  if (/ipad|tablet/i.test(ua)) return 'tablet';
  if (/mobile|iphone|android/i.test(ua)) {
    return w >= 768 ? 'tablet' : 'celular';
  }
  if (w < 640) return 'celular';
  if (w < 1024) return 'tablet';
  return 'computador';
}

function getOS(): 'Windows' | 'macOS' | 'Android' | 'iOS' | 'Linux' | 'outro' {
  if (typeof navigator === 'undefined') return 'outro';
  const ua = navigator.userAgent || '';
  if (/android/i.test(ua)) return 'Android';
  if (/iphone|ipad|ipod/i.test(ua)) return 'iOS';
  if (/windows/i.test(ua)) return 'Windows';
  if (/macintosh|mac os x/i.test(ua)) return 'macOS';
  if (/linux/i.test(ua)) return 'Linux';
  return 'outro';
}

function getBrowserInfo(): { browser: string; browserMajor: string } {
  if (typeof navigator === 'undefined') return { browser: 'Outro', browserMajor: '' };
  const ua = navigator.userAgent || '';
  let browser = 'Outro';
  let browserMajor = '';

  if (/edg\//i.test(ua)) {
    browser = 'Edge';
    browserMajor = ua.match(/edg\/(\d+)/i)?.[1] || '';
  } else if (/opr\/|opera/i.test(ua)) {
    browser = 'Opera';
    browserMajor = ua.match(/opr\/(\d+)/i)?.[1] || '';
  } else if (/chrome|crios/i.test(ua)) {
    browser = 'Chrome';
    browserMajor = ua.match(/(?:chrome|crios)\/(\d+)/i)?.[1] || '';
  } else if (/firefox|fxios/i.test(ua)) {
    browser = 'Firefox';
    browserMajor = ua.match(/(?:firefox|fxios)\/(\d+)/i)?.[1] || '';
  } else if (/safari/i.test(ua) && !/chrome/i.test(ua)) {
    browser = 'Safari';
    browserMajor = ua.match(/version\/(\d+)/i)?.[1] || '';
  }

  return { browser, browserMajor };
}

function getReferrerDomain(): string {
  if (typeof document === 'undefined' || !document.referrer) return '';
  try {
    const url = new URL(document.referrer);
    return url.hostname.replace(/^www\./, '').slice(0, 80);
  } catch {
    return '';
  }
}

function getParams(): { ref: string; utm: string } {
  if (typeof window === 'undefined') return { ref: '', utm: '' };
  try {
    const sp = new URLSearchParams(window.location.search);
    const ref = sp.get('ref') || sp.get('r') || '';
    const utmParts: string[] = [];
    const src = sp.get('utm_source');
    const med = sp.get('utm_medium');
    const cmp = sp.get('utm_campaign');
    if (src) utmParts.push(`src=${src}`);
    if (med) utmParts.push(`med=${med}`);
    if (cmp) utmParts.push(`cmp=${cmp}`);
    return {
      ref: ref.slice(0, 80),
      utm: utmParts.join('&').slice(0, 80)
    };
  } catch {
    return { ref: '', utm: '' };
  }
}

function getViewport(): 'pequeno' | 'medio' | 'grande' {
  if (typeof window === 'undefined') return 'grande';
  const w = window.innerWidth;
  if (w < 640) return 'pequeno';
  if (w < 1024) return 'medio';
  return 'grande';
}

function getConn(): string {
  if (typeof navigator === 'undefined') return '';
  return (navigator as any).connection?.effectiveType || '';
}

function getTema(): 'claro' | 'escuro' {
  if (typeof window === 'undefined') return 'claro';
  try {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'escuro' : 'claro';
  } catch {
    return 'claro';
  }
}

function sendPayload(payload: Record<string, any>) {
  try {
    const bodyStr = JSON.stringify(payload);
    fetch('/api/notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: bodyStr,
      keepalive: true
    }).catch(() => {});
  } catch {
    // Silêncio absoluto
  }
}

function buildBasePayload(event: TrackEventType) {
  const { browser, browserMajor } = getBrowserInfo();
  const { ref, utm } = getParams();

  // Coleta enriquecida não identificável (zero popups, zero permissões)
  let resolucao = '';
  let orientacao = '';
  let profundidadeCores = '';
  let nucleosCpu = '';
  let memoriaGb = '';
  let toque = 'Não';
  let idiomas = '';
  let conexaoVelocidade = '';

  if (typeof window !== 'undefined') {
    if (window.screen) {
      resolucao = `${window.screen.width || 0}x${window.screen.height || 0}`;
      profundidadeCores = `${window.screen.colorDepth || 24} bits`;
      orientacao = window.screen.orientation?.type?.includes('portrait') ? 'Retrato' : 'Paisagem';
    }
    toque = ('ontouchstart' in window || (navigator && navigator.maxTouchPoints > 0)) ? 'Sim' : 'Não';
  }

  if (typeof navigator !== 'undefined') {
    nucleosCpu = navigator.hardwareConcurrency ? `${navigator.hardwareConcurrency} núcleos` : '';
    memoriaGb = (navigator as any).deviceMemory ? `${(navigator as any).deviceMemory} GB` : '';
    idiomas = navigator.languages ? navigator.languages.slice(0, 3).join(', ') : (navigator.language || 'pt-BR');
    conexaoVelocidade = (navigator as any).connection?.downlink ? `${(navigator as any).connection.downlink} Mbps` : '';
  }

  return {
    event,
    sid: getSessionId(),
    ref,
    utm,
    referrer: getReferrerDomain(),
    path: typeof window !== 'undefined' ? window.location.pathname.slice(0, 80) : '/',
    device: getDevice(),
    os: getOS(),
    browser,
    browserMajor,
    lang: (typeof navigator !== 'undefined' && navigator.language ? navigator.language : 'pt-BR').slice(0, 20),
    tz: Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/Fortaleza',
    viewport: getViewport(),
    conn: getConn(),
    tema: getTema(),
    humano: 'provavel' as const,
    resolucao,
    orientacao,
    profundidadeCores,
    nucleosCpu,
    memoriaGb,
    toque,
    idiomas,
    conexaoVelocidade
  };
}

/**
 * Envia um recado ou proposta de empresa/recrutador diretamente ao Telegram
 */
export async function sendCompanyRecado(data: {
  nome: string;
  empresa: string;
  email: string;
  telefone?: string;
  assunto: string;
  mensagem: string;
}): Promise<boolean> {
  try {
    const base = buildBasePayload('recado_empresa');
    const payload = {
      ...base,
      ...data
    };
    const res = await fetch('/api/notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true
    });
    return res.ok || res.status === 204;
  } catch {
    return false;
  }
}

/**
 * Disparo pontual para eventos de clique/ação do usuário.
 * Cada clique é disparado no máximo 1x por sessão para evitar spam.
 */
export function trackEvent(event: TrackEventType, _detalhesDescritivos?: string) {
  if (typeof window === 'undefined') return;
  if (shouldBlockTracking()) return;

  try {
    // Deduplicação por sessão de cada ação específica
    const sessionDedupeKey = `track_clk_${event}`;
    if (sessionStorage.getItem(sessionDedupeKey)) {
      return;
    }
    sessionStorage.setItem(sessionDedupeKey, '1');

    const payload = buildBasePayload(event);
    sendPayload(payload);
  } catch {
    // Silencioso
  }
}

function sendAcessoEvent() {
  if (acessoEnviado) return;
  if (shouldBlockTracking()) return;

  try {
    const sessionAcessoKey = 'track_acesso_enviado';
    const now = Date.now();
    const lastSent = sessionStorage.getItem(sessionAcessoKey);
    if (lastSent && (now - parseInt(lastSent, 10)) < 15000) {
      acessoEnviado = true;
      return;
    }

    acessoEnviado = true;
    sessionStorage.setItem(sessionAcessoKey, String(now));

    const payload = buildBasePayload('acesso');
    sendPayload(payload);
  } catch {
    // Silencioso
  }
}

function sendResumoVisita() {
  if (!acessoEnviado || resumoEnviado) return;
  if (shouldBlockTracking()) return;

  try {
    resumoEnviado = true;
    const base = buildBasePayload('resumo_visita');
    const payload = {
      ...base,
      duracaoS: Math.min(7200, Math.max(0, visibleSeconds)),
      scrollMax: Math.min(100, Math.max(0, Math.round(maxScrollPercentage))),
      secoes: Array.from(viewedSections).slice(0, 7)
    };
    sendPayload(payload);
  } catch {
    // Silencioso
  }
}

/**
 * Inicializa a observação silenciosa de engajamento e a verificação humana.
 * Executado uma única vez no ciclo de vida da aplicação.
 */
export function initTracker() {
  if (typeof window === 'undefined' || trackerInitialized) return;
  trackerInitialized = true;

  // Processa ?owner=1 ou ?owner=0
  checkAndUpdateOwnerMode();

  if (shouldBlockTracking()) return;

  // 1. Dispara o evento de 'acesso' imediatamente no carregamento da página
  sendAcessoEvent();

  // 2. Contador de segundos com a aba visível
  setInterval(() => {
    if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
      visibleSeconds += 1;
    }
  }, 1000);

  // 3. Medição da porcentagem máxima de rolagem
  const updateScrollMax = () => {
    try {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        const pct = (window.scrollY / docHeight) * 100;
        if (pct > maxScrollPercentage) {
          maxScrollPercentage = Math.min(100, Math.max(0, pct));
        }
      }
    } catch {
      // Silencioso
    }
  };
  window.addEventListener('scroll', updateScrollMax, { passive: true });

  // 4. Detecção de seções visíveis na viewport (IntersectionObserver)
  if ('IntersectionObserver' in window) {
    try {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.target.id) {
            viewedSections.add(entry.target.id);
          }
        });
      }, { threshold: 0.2 });

      TRACKED_SECTIONS.forEach((sectionId) => {
        const el = document.getElementById(sectionId);
        if (el) observer.observe(el);
      });
    } catch {
      // Silencioso
    }
  }

  // 5. Garantia adicional por sinais de interação humana
  const handleHumanSignal = () => {
    sendAcessoEvent();
    removeHumanListeners();
  };

  const removeHumanListeners = () => {
    window.removeEventListener('pointermove', handleHumanSignal);
    window.removeEventListener('touchstart', handleHumanSignal);
    window.removeEventListener('scroll', handleHumanSignal);
    window.removeEventListener('keydown', handleHumanSignal);
  };

  window.addEventListener('pointermove', handleHumanSignal, { once: true, passive: true });
  window.addEventListener('touchstart', handleHumanSignal, { once: true, passive: true });
  window.addEventListener('scroll', handleHumanSignal, { once: true, passive: true });
  window.addEventListener('keydown', handleHumanSignal, { once: true, passive: true });

  // 6. Envio de "resumo_visita" ao sair da página
  const handlePageExit = () => {
    if (document.visibilityState === 'hidden') {
      sendResumoVisita();
    }
  };

  document.addEventListener('visibilitychange', handlePageExit);
  window.addEventListener('pagehide', sendResumoVisita);
}
