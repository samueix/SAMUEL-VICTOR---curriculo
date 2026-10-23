import crypto from 'crypto';
import { TELEGRAM_TOKEN, TELEGRAM_CHAT_ID, ADMIN_KEY } from './_config.js';

// Memória compartilhada do servidor por instância (limite de 300 registros)
const memoryEvents = [];
const serverStartedAt = new Date().toISOString();

// Controle de taxa: máximo 30 avisos de Telegram por minuto por instância
const telegramTimestamps = [];

// Controle de taxa para erros de admin: máximo 10 erros por 10 minutos por instância
const adminErrorTimestamps = [];

// Deduplicação por (sid + event)
const seenEvents = new Set();

const ALLOWED_EVENTS = [
  'acesso',
  'resumo_visita',
  'imprimir_curriculo',
  'baixar_pdf',
  'abrir_admin',
  'clique_whatsapp',
  'clique_email',
  'clique_linkedin',
  'clique_github',
  'clique_telefone'
];

const ALLOWED_SECTIONS = [
  'sobre',
  'experiencia',
  'habilidades',
  'projetos',
  'formacao',
  'objetivos',
  'contato'
];

const TITULOS = {
  acesso: '👀 NOVO ACESSO AO PORTFÓLIO',
  resumo_visita: '📊 RESUMO DE VISITA',
  imprimir_curriculo: '🖨️ CURRÍCULO IMPRESSO',
  baixar_pdf: '📥 CURRÍCULO EM PDF BAIXADO',
  abrir_admin: '🔐 TENTATIVA DE ACESSO AO ADMIN',
  clique_whatsapp: '💬 CLIQUE NO WHATSAPP',
  clique_email: '✉️ CLIQUE NO E-MAIL',
  clique_linkedin: '💼 CLIQUE NO LINKEDIN',
  clique_github: '🐙 CLIQUE NO GITHUB',
  clique_telefone: '📞 CLIQUE NO TELEFONE'
};

function cleanString(val, maxLen = 80) {
  if (typeof val !== 'string') return '';
  return val.replace(/[\x00-\x1F\x7F\r\n]/g, '').trim().slice(0, maxLen);
}

function safeCompare(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  if (!a || !b) return false;
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) {
    crypto.timingSafeEqual(bufA, bufA);
    return false;
  }
  return crypto.timingSafeEqual(bufA, bufB);
}

function formatTelegramMessage(reg) {
  const lines = [];
  lines.push(TITULOS[reg.event] || `🔔 AÇÃO: ${reg.event.toUpperCase()}`);
  lines.push(`Horário de Fortaleza: ${reg.quandoFortaleza}`);
  if (reg.ref || reg.utm) {
    lines.push(`Etiqueta/UTM: ${[reg.ref, reg.utm].filter(Boolean).join(' | ')}`);
  }
  lines.push(`Origem: ${reg.referrer || 'Acesso Direto'}`);
  const localParts = [reg.cidade, reg.regiao, reg.pais].filter(Boolean);
  lines.push(`Local aproximado: ${localParts.length > 0 ? localParts.join(', ') : 'Não identificado'}`);
  lines.push(`Aparelho/Sistema/Navegador: ${reg.device || 'Desconhecido'} | ${reg.os || 'Outro'} | ${reg.browser} ${reg.browserMajor}`.trim());
  let fusoLine = `Idioma e Fuso: ${reg.lang || 'N/A'} | ${reg.tz || 'N/A'}`;
  if (reg.tzDiverge) {
    fusoLine += ' ⚠️ fuso diferente do país (possível VPN)';
  }
  lines.push(fusoLine);
  if (reg.conn) {
    lines.push(`Tipo de conexão: ${reg.conn}`);
  }
  if (reg.tema) {
    lines.push(`Tema: ${reg.tema}`);
  }
  if (reg.event === 'resumo_visita') {
    lines.push(`Duração: ${reg.duracaoS} segundos`);
    lines.push(`Rolagem máxima: ${reg.scrollMax}%`);
    lines.push(`Seções vistas: ${reg.secoes.length > 0 ? reg.secoes.join(', ') : 'Nenhuma'}`);
  }
  return lines.join('\n');
}

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', req.headers['origin'] || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'x-admin-key, content-type, accept, sec-fetch-site, accept-language'
  );

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    return res.end();
  }

  // ============================================================
  // GET: Leitura autenticada para o painel Admin
  // ============================================================
  if (req.method === 'GET') {
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('Content-Type', 'application/json');

    const isAdminPlaceholder = !ADMIN_KEY || ADMIN_KEY === 'COLE_A_SENHA_AQUI';
    if (isAdminPlaceholder) {
      res.statusCode = 404;
      return res.end(JSON.stringify({ error: 'Configuração não definida' }));
    }

    // Rate-limit para erros de senha: no máximo 10 erros por 10 minutos
    const now = Date.now();
    while (adminErrorTimestamps.length > 0 && now - adminErrorTimestamps[0] > 600000) {
      adminErrorTimestamps.shift();
    }
    if (adminErrorTimestamps.length >= 10) {
      res.statusCode = 429;
      return res.end(JSON.stringify({ error: 'Muitas tentativas incorretas. Aguarde alguns minutos.' }));
    }

    const providedKey = req.headers['x-admin-key'] || '';
    const isMatch = safeCompare(String(providedKey), String(ADMIN_KEY));

    if (!isMatch) {
      adminErrorTimestamps.push(now);
      // Chave errada: aguarda 1 s e responde 401
      await new Promise(r => setTimeout(r, 1000));
      res.statusCode = 401;
      return res.end(JSON.stringify({ error: 'Senha incorreta' }));
    }

    const desdeIso = memoryEvents.length > 0 
      ? memoryEvents[memoryEvents.length - 1].quando 
      : serverStartedAt;

    res.statusCode = 200;
    return res.end(JSON.stringify({
      eventos: memoryEvents,
      desdeIso,
      servidorIniciadoEm: serverStartedAt
    }));
  }

  // ============================================================
  // POST: Registro silencioso de evento
  // ============================================================
  if (req.method !== 'POST') {
    res.statusCode = 204;
    return res.end();
  }

  try {
    // 1. Limite de tamanho de corpo: max 2 KB
    let rawBody = req.body;
    let rawString = '';
    if (typeof rawBody === 'string') {
      rawString = rawBody;
    } else if (Buffer.isBuffer(rawBody)) {
      rawString = rawBody.toString('utf8');
    } else if (rawBody && typeof rawBody === 'object') {
      rawString = JSON.stringify(rawBody);
    }

    if (rawString.length > 2048) {
      res.statusCode = 204;
      return res.end();
    }

    let body = {};
    try {
      body = typeof rawBody === 'object' && rawBody !== null && !Buffer.isBuffer(rawBody) 
        ? rawBody 
        : JSON.parse(rawString || '{}');
    } catch {
      res.statusCode = 204;
      return res.end();
    }

    // 2. Verificações de segurança
    const origin = req.headers['origin'] || '';
    const isAllowedOrigin = !origin || 
      origin === 'https://samuel-victor-da-silva-nobre.vercel.app' ||
      origin.includes('localhost') ||
      origin.includes('127.0.0.1') ||
      origin.includes('.run.app');

    if (!isAllowedOrigin) {
      res.statusCode = 204;
      return res.end();
    }

    const secFetchSite = req.headers['sec-fetch-site'];
    if (secFetchSite && secFetchSite !== 'same-origin') {
      res.statusCode = 204;
      return res.end();
    }

    const acceptLanguage = req.headers['accept-language'];
    if (!acceptLanguage) {
      res.statusCode = 204;
      return res.end();
    }

    const userAgent = req.headers['user-agent'] || '';
    const isBot = /bot|crawler|spider|preview|facebookexternalhit|whatsapp|telegram|linkedinbot|slurp|headless|lighthouse|pingdom|curl|python|axios|node-fetch|go-http|httpclient/i.test(userAgent);
    if (isBot) {
      res.statusCode = 204;
      return res.end();
    }

    if (body.humano !== 'provavel') {
      res.statusCode = 204;
      return res.end();
    }

    // 3. Validação estrita do evento
    const event = cleanString(body.event, 30);
    if (!ALLOWED_EVENTS.includes(event)) {
      res.statusCode = 204;
      return res.end();
    }

    // 4. Validação e sanitização dos campos (max 80 chars, sem controles)
    const sid = cleanString(body.sid, 36);
    if (!sid) {
      res.statusCode = 204;
      return res.end();
    }

    // 5. Deduplicação por (sid + event)
    const dedupeKey = `${sid}:${event}`;
    if (seenEvents.has(dedupeKey)) {
      res.statusCode = 204;
      return res.end();
    }
    seenEvents.add(dedupeKey);
    if (seenEvents.size > 2000) {
      const iter = seenEvents.values();
      for (let i = 0; i < 500; i++) {
        seenEvents.delete(iter.next().value);
      }
    }

    const ref = cleanString(body.ref, 80);
    const utm = cleanString(body.utm, 80);
    const referrer = cleanString(body.referrer, 80);
    const path = cleanString(body.path, 80);

    const deviceRaw = cleanString(body.device, 20);
    const device = ['celular', 'tablet', 'computador'].includes(deviceRaw) ? deviceRaw : 'computador';

    const osRaw = cleanString(body.os, 20);
    const os = ['Windows', 'macOS', 'Android', 'iOS', 'Linux', 'outro'].includes(osRaw) ? osRaw : 'outro';

    const browser = cleanString(body.browser, 30);
    const browserMajor = cleanString(body.browserMajor, 10);
    const lang = cleanString(body.lang, 20);
    const tz = cleanString(body.tz, 40);

    const viewportRaw = cleanString(body.viewport, 20);
    const viewport = ['pequeno', 'medio', 'grande'].includes(viewportRaw) ? viewportRaw : 'grande';

    const conn = cleanString(body.conn, 20);
    const temaRaw = cleanString(body.tema, 20);
    const tema = ['claro', 'escuro', 'indefinido'].includes(temaRaw) ? temaRaw : 'claro';

    const duracaoS = Math.min(7200, Math.max(0, parseInt(body.duracaoS, 10) || 0));
    const scrollMax = Math.min(100, Math.max(0, parseInt(body.scrollMax, 10) || 0));

    const secoes = Array.isArray(body.secoes)
      ? body.secoes.filter(s => typeof s === 'string' && ALLOWED_SECTIONS.includes(s)).slice(0, 7)
      : [];

    // Local aproximado SOMENTE por cabeçalhos da Vercel (sem ler nem registrar IP)
    const pais = cleanString(req.headers['x-vercel-ip-country'] || '');
    const regiao = cleanString(req.headers['x-vercel-ip-country-region'] || '');
    let cidade = '';
    let vercelTz = '';
    try {
      cidade = req.headers['x-vercel-ip-city'] ? cleanString(decodeURIComponent(req.headers['x-vercel-ip-city'])) : '';
    } catch {
      cidade = cleanString(req.headers['x-vercel-ip-city'] || '');
    }
    try {
      vercelTz = req.headers['x-vercel-ip-timezone'] ? cleanString(decodeURIComponent(req.headers['x-vercel-ip-timezone'])) : '';
    } catch {
      vercelTz = cleanString(req.headers['x-vercel-ip-timezone'] || '');
    }

    const tzDiverge = Boolean(vercelTz && tz && vercelTz !== tz);

    const agora = new Date();
    const quando = agora.toISOString();
    const quandoFortaleza = new Intl.DateTimeFormat('pt-BR', {
      timeZone: 'America/Fortaleza',
      dateStyle: 'short',
      timeStyle: 'medium',
    }).format(agora);

    const record = {
      id: crypto.randomUUID ? crypto.randomUUID() : `ev_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      quando,
      quandoFortaleza,
      event,
      sid,
      ref,
      utm,
      referrer,
      path,
      device,
      os,
      browser,
      browserMajor,
      lang,
      tz,
      tzDiverge,
      viewport,
      conn,
      tema,
      pais,
      regiao,
      cidade,
      duracaoS,
      scrollMax,
      secoes
    };

    // 6. Enviar ao Telegram (aguardar antes de responder)
    const isTokenPlaceholder = !TELEGRAM_TOKEN || TELEGRAM_TOKEN === 'COLE_O_TOKEN_AQUI';
    const isChatPlaceholder = !TELEGRAM_CHAT_ID || TELEGRAM_CHAT_ID === 'COLE_O_CHAT_ID_AQUI';

    if (!isTokenPlaceholder && !isChatPlaceholder) {
      const nowMs = Date.now();
      while (telegramTimestamps.length > 0 && nowMs - telegramTimestamps[0] > 60000) {
        telegramTimestamps.shift();
      }
      if (telegramTimestamps.length < 30) {
        telegramTimestamps.push(nowMs);
        try {
          await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: TELEGRAM_CHAT_ID,
              text: formatTelegramMessage(record),
              disable_web_page_preview: true
            })
          });
        } catch {
          // Silencioso; nunca registrar tokens em logs
        }
      }
    }

    // 7. Guardar o registro em memória (máximo 300)
    memoryEvents.unshift(record);
    if (memoryEvents.length > 300) {
      memoryEvents.pop();
    }

    res.statusCode = 204;
    return res.end();
  } catch {
    res.statusCode = 204;
    return res.end();
  }
}
