import type { Metadata } from "next";
import { Inter, Audiowide } from "next/font/google";
import "./globals.css";
import SmoothScroll from "./components/SmoothScroll";
import Parallax from "./components/Parallax";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const audiowide = Audiowide({ weight: "400", subsets: ["latin"], variable: "--font-audiowide" });

export const metadata: Metadata = {
  title: "Euller Lolato — IA aplicada a negócios",
  description: "Empreendedor digital especializado em IA aplicada a negócios. Conheça o KODY OS, brand books e projetos.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${audiowide.variable}`}>
      <body style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
        <noscript>
          <style>{`.reveal{opacity:1 !important;transform:none !important;filter:none !important;}`}</style>
        </noscript>
        <SmoothScroll />
        <Parallax />
        {children}
      </body>
    </html>
  );
}
