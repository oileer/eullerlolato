import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";

const jetbrainsMono = JetBrains_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  title: "KODY apresenta — Gauer's Barbearia",
  description:
    "Proposta de projeto: app de agendamento sob medida para a Gauer's Barbearia, por KODY.",
};

export default function GauersLayout({ children }: { children: React.ReactNode }) {
  return <div className={jetbrainsMono.variable}>{children}</div>;
}
