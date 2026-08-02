"use client";

import { useRef } from "react";

type LinkCardProps = {
  href: string;
  titulo: string;
  desc: string;
  featured?: boolean;
  /** atraso de entrada em segundos */
  delay?: number;
};

export default function LinkCard({ href, titulo, desc, featured, delay = 0 }: LinkCardProps) {
  const ref = useRef<HTMLAnchorElement>(null);

  const onPointerMove = (e: React.PointerEvent<HTMLAnchorElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--my", `${e.clientY - rect.top}px`);
  };

  return (
    <a
      ref={ref}
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel="noopener noreferrer"
      onPointerMove={onPointerMove}
      className={`link-card anim-blur-up${featured ? " featured" : ""}`}
      style={{ animationDelay: `${delay}s` }}
    >
      <div
        style={{
          fontFamily: "var(--font-audiowide)",
          fontSize: 15,
          letterSpacing: "0.04em",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {titulo}
          {featured && <span className="pulse-dot" aria-hidden />}
        </span>
        <span className="link-arrow">→</span>
      </div>
      <p style={{ marginTop: 6, fontSize: 13, color: "var(--muted)", lineHeight: 1.6 }}>
        {desc}
      </p>
    </a>
  );
}
