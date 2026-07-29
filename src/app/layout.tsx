import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Central de Comando — Bots WhatsApp & Instagram",
  description: "Configure e opere seus bots de atendimento com IA.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
