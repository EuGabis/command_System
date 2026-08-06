import type { NextConfig } from "next";

// Cabeçalhos de segurança aplicados a todas as respostas.
const securityHeaders = [
  // Força HTTPS por 2 anos (o navegador nem tenta http)
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  // Impede adivinhação de tipo de conteúdo
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Evita que o site seja embutido em iframes (clickjacking)
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Bloqueia acesso a câmera/microfone/geolocalização por padrão
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false, // não expõe "X-Powered-By: Next.js"
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      // O painel nunca deve ser embutido nem cacheado (dados sensíveis)
      {
        source: "/painel/:path*",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Cache-Control", value: "no-store, max-age=0" },
        ],
      },
      // Respostas de API não são cacheadas
      { source: "/api/:path*", headers: [{ key: "Cache-Control", value: "no-store, max-age=0" }] },
    ];
  },
};

export default nextConfig;
