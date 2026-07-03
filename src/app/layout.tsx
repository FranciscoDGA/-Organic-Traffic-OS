import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Organic Traffic OS",
  description: "Sistema Operacional de Tráfego Orgânico — Epic 03",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body style={{ backgroundColor: "#0b0e14", color: "#e2e8f0", margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  );
}
