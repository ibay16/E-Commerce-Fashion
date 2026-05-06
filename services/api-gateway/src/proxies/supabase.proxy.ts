import { createProxyMiddleware } from 'http-proxy-middleware';
import { env } from '../../config/env';

export const supabaseProxy = createProxyMiddleware({
  target: env.SUPABASE_URL,
  changeOrigin: true,
  pathRewrite: {
    '^/api/assets/supabase/': '/storage/v1/object/public/'
  },
  on: {
    error: (err, req, res) => {
      console.error(`[Supabase Proxy Error] ${req.method} ${req.url}:`, err.message);
      if (res && 'writeHead' in res) {
        res.writeHead(502, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: false,
          error: 'Supabase storage connection error'
        }));
      }
    }
  }
});
