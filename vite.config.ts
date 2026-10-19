import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [
      react(), 
      tailwindcss(),
      {
        name: 'notify-api-dev',
        configureServer(server) {
          server.middlewares.use('/api/notify', async (req, res) => {
            try {
              const { default: handler } = await import('./api/notify.js');
              if (req.method === 'POST') {
                let raw = '';
                req.on('data', chunk => { raw += chunk; });
                req.on('end', async () => {
                  (req as any).body = raw;
                  await handler(req, res);
                });
              } else {
                await handler(req, res);
              }
            } catch (err) {
              console.error('Erro na API de notificação:', err);
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ ok: false, error: err.message }));
            }
          });
        }
      }
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
