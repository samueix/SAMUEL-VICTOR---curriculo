/**
 * Sistema de rastreamento silencioso e seguro para notificações Telegram.
 * 
 * Regras:
 * 1. 100% invisível e silencioso (sem alertas, sem travar cliques/downloads/navegação).
 * 2. Token NÃO exposto no front-end: comunica via /api/notify.
 * 3. Anti-bot e deduplicação de acesso por sessão (sessionStorage).
 * 4. Modo Dono: ?owner=1 ativa e salva no localStorage; ?owner=0 desativa.
 */

export type TrackEventType = 
  | 'acesso'
  | 'baixar_pdf'
  | 'imprimir_curriculo'
  | 'abrir_admin'
  | 'clique_whatsapp'
  | 'clique_email'
  | 'clique_linkedin'
  | 'clique_github'
  | 'clique_telefone';

const OWNER_STORAGE_KEY = 'portfolio_owner_mode';
const SESSION_ACCESS_KEY = 'notified_acesso';

export function checkAndUpdateOwnerMode(): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const params = new URLSearchParams(window.location.search);
    const ownerParam = params.get('owner');

    if (ownerParam === '1') {
      localStorage.setItem(OWNER_STORAGE_KEY, 'true');
    } else if (ownerParam === '0') {
      localStorage.removeItem(OWNER_STORAGE_KEY);
    }

    return localStorage.getItem(OWNER_STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

export function isOwnerModeActive(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return localStorage.getItem(OWNER_STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

export function trackEvent(tipo: TrackEventType, detalhes?: string) {
  if (typeof window === 'undefined') return;

  try {
    // 1. Verifica Modo Dono (URL ou localStorage)
    const isOwner = checkAndUpdateOwnerMode();
    if (isOwner) {
      return; // Silenciosamente não dispara nada para o dono
    }

    // 2. Proteção Anti-Bot client-side
    const userAgent = navigator.userAgent || '';
    const isBot = /bot|crawler|spider|googlebot|bingbot|lighthouse|facebookexternalhit|whatsapp|telegram/i.test(userAgent);
    if (isBot) {
      return;
    }

    // 3. Deduplicação de acesso repetido por sessão
    if (tipo === 'acesso') {
      const alreadyTracked = sessionStorage.getItem(SESSION_ACCESS_KEY);
      if (alreadyTracked) {
        return;
      }
      sessionStorage.setItem(SESSION_ACCESS_KEY, 'true');
    }

    const payload = JSON.stringify({
      tipo,
      detalhes: detalhes || '',
      url: window.location.href,
      referrer: document.referrer || ''
    });

    // 4. Envio 100% não bloqueante (sendBeacon prioritário ou fetch keepalive)
    if (navigator.sendBeacon) {
      const blob = new Blob([payload], { type: 'application/json' });
      navigator.sendBeacon('/api/notify', blob);
    } else {
      fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
        keepalive: true
      }).catch(() => {});
    }
  } catch {
    // Silêncio absoluto em caso de qualquer exceção
  }
}
