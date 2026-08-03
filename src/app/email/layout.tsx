import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";

const jetbrainsMono = JetBrains_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  title: "KODY apresenta — Sistema para Barbearias e Salões",
  description:
    "Proposta de projeto: app de agendamento sob medida para barbearias e salões de beleza, por KODY.",
};

export default function EmailLayout({ children }: { children: React.ReactNode }) {
  return <div className={jetbrainsMono.variable}>{children}</div>;
}
