import type { Metadata } from "next";
import { Inter, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import SmoothScroll from "./components/SmoothScroll";
import Parallax from "./components/Parallax";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const audiowide = Bricolage_Grotesque({ weight: ["600", "700", "800"], subsets: ["latin"], variable: "--font-audiowide" });

export const metadata: Metadata = {
  title: "Euller Lolato — IA aplicada a negócios",
  description: "Empreendedor digital especializado em IA aplicada a negócios. Conheça a Nex Studio, a Nexora e os brand books.",
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
