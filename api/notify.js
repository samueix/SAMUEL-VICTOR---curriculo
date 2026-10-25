import crypto from 'crypto';
import { TELEGRAM_TOKEN, TELEGRAM_CHAT_ID, ADMIN_KEY } from './_config.js';

// Memória compartilhada do servidor por instância (limite de 300 registros)
const memoryEvents = [];
const serverStartedAt = new Date().toISOString();

// Controle de taxa: máximo 30 avisos de Telegram por minuto por instância
const telegramTimestamps = [];

// Controle de taxa para erros de admin: máximo 10 erros por 10 minutos por instância
const adminErrorTimestamps = [];

// Deduplicação com TTL por (sid + event)
const seenEvents = new Map();

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
  'clique_telefone',
  'recado_empresa',
  'abrir_recado'
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
  clique_telefone: '📞 CLIQUE NO TELEFONE',
  recado_empresa: '💼 NOVO RECADO / PROPOSTA DE EMPRESA',
  abrir_recado: '📝 ABERTURA DO FORMULÁRIO DE RECADO'
};

function cleanString(val, maxLen = 100) {
  if (typeof val !== 'string') return '';
  return val.replace(/[\x00-\x1F\x7F\r\n]/g, '').trim().slice(0, maxLen);
}

function cleanMultiline(val, maxLen = 2000) {
  if (typeof val !== 'string') return '';
  return val.replace(/[\x00-\x09\x0B\x0C\x0E-\x1F\x7F]/g, '').trim().slice(0, maxLen);
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
  if (reg.event === 'recado_empresa') {
    const lines = [];
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
    lines.push(`📅 Horário de Fortaleza: ${reg.quandoFortaleza}`);
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

  const lines = [];
  lines.push(TITULOS[reg.event] || `🔔 AÇÃO: ${reg.event.toUpperCase()}`);
  lines.push(`📅 Horário de Fortaleza: ${reg.quandoFortaleza}`);
  if (reg.ref || reg.utm) {
    lines.push(`🏷️ Etiqueta/UTM: ${[reg.ref, reg.utm].filter(Boolean).join(' | ')}`);
  }
  lines.push(`🔗 Origem: ${reg.referrer || 'Acesso Direto'}`);
  const localParts = [reg.cidade, reg.regiao, reg.pais].filter(Boolean);
  lines.push(`📍 Local aproximado: ${localParts.length > 0 ? localParts.join(', ') : 'Não identificado'}${reg.isp ? ` (Provedor: ${reg.isp})` : ''}`);
  
  let deviceEmoji = '💻';
  if (reg.device === 'celular') deviceEmoji = '📱';
  else if (reg.device === 'tablet') deviceEmoji = '📟';
  lines.push(`${deviceEmoji} Aparelho/Sistema/Navegador: ${reg.device || 'Desconhecido'} | ${reg.os || 'Outro'} | ${reg.browser} ${reg.browserMajor}`.trim());

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
    lines.push(`⏱️ Duração: ${reg.duracaoS} segundos`);
    lines.push(`📜 Rolagem máxima: ${reg.scrollMax}%`);
    lines.push(`👁️ Seções vistas: ${reg.secoes.length > 0 ? reg.secoes.join(', ') : 'Nenhuma'}`);
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
    // 1. Limite de tamanho de corpo: max 8 KB (permite mensagens completas de recrutadores)
    let rawBody = req.body;
    let rawString = '';
    if (typeof rawBody === 'string') {
      rawString = rawBody;
    } else if (Buffer.isBuffer(rawBody)) {
      rawString = rawBody.toString('utf8');
    } else if (rawBody && typeof rawBody === 'object') {
      rawString = JSON.stringify(rawBody);
    }

    if (rawString.length > 8192) {
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
      origin.includes('vercel.app') ||
      origin.includes('localhost') ||
      origin.includes('127.0.0.1') ||
      origin.includes('.run.app') ||
      origin.includes('.google.com') ||
      origin.includes('.googleusercontent.com') ||
      origin.includes('.web.app');

    if (!isAllowedOrigin) {
      res.statusCode = 204;
      return res.end();
    }

    const secFetchSite = req.headers['sec-fetch-site'];
    // sec-fetch-site só é bloqueado se for explicitamente cross-site de uma origem externa não autorizada
    if (secFetchSite && secFetchSite === 'cross-site' && !isAllowedOrigin) {
      res.statusCode = 204;
      return res.end();
    }

    const acceptLanguage = req.headers['accept-language'];
    // Ignorar robôs conhecidos por User-Agent (não bloqueia navegadores in-app do Telegram ou WhatsApp)
    const userAgent = req.headers['user-agent'] || '';
    const isBot = /bot\b|crawler|spider|googlebot|bingbot|slurp|headless|lighthouse|pingdom|python|node-fetch|go-http|httpclient/i.test(userAgent);
    if (isBot && body.event !== 'recado_empresa') {
      res.statusCode = 204;
      return res.end();
    }

    const isHumanValid = body.humano === 'provavel' || body.event === 'recado_empresa';
    if (!isHumanValid) {
      res.statusCode = 204;
      return res.end();
    }

    // 3. Validação estrita do evento
    const event = cleanString(body.event, 30);
    if (!ALLOWED_EVENTS.includes(event)) {
      res.statusCode = 204;
      return res.end();
    }

    // 4. Validação e sanitização dos campos
    const sid = cleanString(body.sid, 36);
    if (!sid) {
      res.statusCode = 204;
      return res.end();
    }

    // 5. Deduplicação com janela de tempo: 3s para recados de empresas, 15s para cliques/acessos
    const dedupeKey = `${sid}:${event}`;
    const nowMs = Date.now();
    const lastSeen = seenEvents.get(dedupeKey);
    const minInterval = event === 'recado_empresa' ? 3000 : 15000;
    if (lastSeen && (nowMs - lastSeen < minInterval)) {
      res.statusCode = 204;
      return res.end();
    }
    seenEvents.set(dedupeKey, nowMs);
    if (seenEvents.size > 1000) {
      for (const [k, time] of seenEvents.entries()) {
        if (nowMs - time > 60000) {
          seenEvents.delete(k);
        }
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

    // Dados específicos de recado profissional / proposta
    const nome = cleanString(body.nome, 80);
    const empresa = cleanString(body.empresa, 80);
    const email = cleanString(body.email, 100);
    const telefone = cleanString(body.telefone, 30);
    const assunto = cleanString(body.assunto, 100);
    const mensagem = cleanMultiline(body.mensagem, 2000);

    // Metadados adicionais do visitante
    const resolucao = cleanString(body.resolucao, 30);
    const orientacao = cleanString(body.orientacao, 20);
    const profundidadeCores = cleanString(body.profundidadeCores, 20);
    const nucleosCpu = cleanString(body.nucleosCpu, 20);
    const memoriaGb = cleanString(body.memoriaGb, 20);
    const toque = cleanString(body.toque, 10);
    const idiomas = cleanString(body.idiomas, 60);
    const conexaoVelocidade = cleanString(body.conexaoVelocidade, 20);

    // Local aproximado: primeiro tenta cabeçalhos nativos da Vercel
    let pais = cleanString(req.headers['x-vercel-ip-country'] || '');
    let regiao = cleanString(req.headers['x-vercel-ip-country-region'] || '');
    let cidade = '';
    let vercelTz = '';
    let isp = '';

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

    // Se estiver em preview/ambiente local ou Vercel headers vazios, faz consulta silenciosa de geo no servidor
    if (!pais && !cidade) {
      const clientIp = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || 
                       req.headers['x-real-ip'] || 
                       req.socket?.remoteAddress || '';
      const isLocal = !clientIp || clientIp === '127.0.0.1' || clientIp === '::1' || 
                      clientIp.startsWith('10.') || clientIp.startsWith('192.168.') || clientIp.startsWith('172.');
      if (!isLocal) {
        try {
          const ctrl = new AbortController();
          const timer = setTimeout(() => ctrl.abort(), 1200);
          const geoRes = await fetch(`http://ip-api.com/json/${clientIp}?fields=status,country,regionName,city,isp,org`, {
            signal: ctrl.signal
          });
          clearTimeout(timer);
          if (geoRes.ok) {
            const geoData = await geoRes.json();
            if (geoData.status === 'success') {
              cidade = cleanString(geoData.city || '');
              regiao = cleanString(geoData.regionName || '');
              pais = cleanString(geoData.country || '');
              isp = cleanString(geoData.isp || geoData.org || '');
            }
          }
        } catch {
          // Silencioso
        }
      }
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
      isp,
      duracaoS,
      scrollMax,
      secoes,
      // Campos de Recado de Empresa
      nome,
      empresa,
      email,
      telefone,
      assunto,
      mensagem,
      // Metadados enriquecidos
      resolucao,
      orientacao,
      profundidadeCores,
      nucleosCpu,
      memoriaGb,
      toque,
      idiomas,
      conexaoVelocidade
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
          const tgRes = await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: TELEGRAM_CHAT_ID,
              text: formatTelegramMessage(record),
              disable_web_page_preview: true
            })
          });
          if (!tgRes.ok) {
            const errText = await tgRes.text();
            console.error('Erro na resposta do Telegram:', tgRes.status, errText);
          }
        } catch (tgErr) {
          console.error('Falha de conexão com Telegram:', tgErr);
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
