export default async function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    if (res.status) return res.status(200).end();
    res.statusCode = 200;
    return res.end();
  }

  if (req.method !== 'POST') {
    if (res.status) {
      return res.status(405).json({ error: 'Método não permitido' });
    }
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ error: 'Método não permitido' }));
  }

  // Credenciais Telegram
  const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8820557041:AAHNJGOQn2Pn6p88ljQSobFLK2KRIT-yYiM';
  const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '6226370084';

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {
        body = {};
      }
    } else if (!body) {
      body = {};
    }

    const { tipo = 'acesso', detalhes = '', url = '', referrer = '' } = body;

    const userAgent = req.headers['user-agent'] || 'Desconhecido';

    // Filtro anti-bot
    const isBot = /bot|crawler|spider|googlebot|bingbot|lighthouse|facebookexternalhit|whatsapp|telegram/i.test(userAgent);
    if (isBot) {
      const resp = { ok: true, ignored: 'bot' };
      if (res.status) return res.status(200).json(resp);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify(resp));
    }

    // Identificação básica de dispositivo
    let device = '💻 Desktop';
    if (/android/i.test(userAgent)) device = '📱 Android';
    else if (/iphone|ipad|ipod/i.test(userAgent)) device = '📱 iOS/iPhone';
    else if (/mobile/i.test(userAgent)) device = '📱 Mobile';

    // IP e Localização aproximada
    const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || 
               req.headers['x-real-ip'] || 
               req.socket?.remoteAddress || 
               'Desconhecido';
               
    const city = req.headers['x-vercel-ip-city'] ? decodeURIComponent(req.headers['x-vercel-ip-city']) : null;
    const country = req.headers['x-vercel-ip-country'] || null;
    const locationStr = city ? `${city}, ${country || 'BR'}` : (country || 'Não identificada');

    // Data e Hora em America/Fortaleza
    const dataHora = new Intl.DateTimeFormat('pt-BR', {
      timeZone: 'America/Fortaleza',
      dateStyle: 'short',
      timeStyle: 'medium',
    }).format(new Date());

    // Mensagens formatadas por tipo
    const titulos = {
      acesso: '👀 *NOVO ACESSO AO PORTFÓLIO*',
      baixar_pdf: '📥 *CURRÍCULO EM PDF BAIXADO*',
      imprimir_curriculo: '🖨️ *CURRÍCULO IMPRESSO*',
      abrir_admin: '🔐 *TENTATIVA DE ACESSO AO ADMIN*',
      clique_whatsapp: '💬 *CLIQUE NO WHATSAPP*',
      clique_email: '✉️ *CLIQUE NO E-MAIL*',
      clique_linkedin: '💼 *CLIQUE NO LINKEDIN*',
      clique_github: '🐙 *CLIQUE NO GITHUB*',
      clique_telefone: '📞 *CLIQUE NO TELEFONE*'
    };

    const header = titulos[tipo] || `🔔 *NOVA AÇÃO:* ${tipo.toUpperCase()}`;

    let texto = `${header}\n\n`;
    texto += `📅 *Horário:* ${dataHora}\n`;
    texto += `📍 *Origem:* ${locationStr}\n`;
    texto += `📱 *Dispositivo:* ${device}\n`;
    if (detalhes) texto += `📝 *Detalhes:* ${detalhes}\n`;
    if (referrer) texto += `🔗 *Veio de:* ${referrer}\n`;
    if (url) texto += `🌐 *Página:* ${url}\n`;
    texto += `🌐 *IP:* ${ip}\n`;

    // Enviar mensagem para o Telegram
    const telegramRes = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: texto,
        parse_mode: 'Markdown',
        disable_web_page_preview: true
      })
    });

    const data = await telegramRes.json();
    const result = { ok: data.ok || true };
    if (res.status) return res.status(200).json(result);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify(result));
  } catch (err) {
    console.error('Erro no envio Telegram:', err);
    const errResp = { ok: false, error: err.message };
    if (res.status) return res.status(200).json(errResp);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify(errResp));
  }
}
