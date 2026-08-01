import type { Metadata } from "next";
import { Montserrat, Inter } from "next/font/google";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import "./site.css";

config.autoAddCss = false; // evita o "flash" de ícone gigante no SSR

const display = Montserrat({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});
const body = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "GAABTUR — Sonhos viram passagens reais",
  description:
    "Agência de viagens com 9 anos de experiência. Passagens nacionais e internacionais, pacotes, emissões e suporte 24h. Peça seu orçamento.",
};

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`gaab-root ${display.variable} ${body.variable}`}>{children}</div>
  );
}
