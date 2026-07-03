import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Habilitar Turbopack para build mais rapido
  turbopack: {},
  
  // Configuracoes de seguranca
  poweredByHeader: false,
  
  // Headers de seguranca
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: process.env.CORS_ORIGINS || '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ];
  },
};

export default nextConfig;
