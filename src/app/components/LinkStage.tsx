"use client";

import { useEffect, useRef, useState } from "react";
import LinkCard from "./LinkCard";

export type StageLink = {
  titulo: string;
  desc: string;
  href: string;
  featured?: boolean;
};

/**
 * Palco de links: um card por vez, centralizado, trocando conforme rola.
 *
 * A seção é alta (100vh por card) e o miolo fica `sticky` no topo — enquanto a
 * seção passa pela tela, o miolo permanece parado e os cards se revezam nele.
 * Todos ocupam a mesma célula do grid, então a troca é uma fusão cruzada e não
 * um empilhamento.
 *
 * Sem JS, e sob `prefers-reduced-motion`, cai na coluna empilhada de sempre —
 * o palco depende de scroll para revelar conteúdo, o que seria uma armadilha
 * para quem não pode rolar 3 telas.
 */
export default function LinkStage({ items }: { items: StageLink[] }) {
  const [staged, setStaged] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const slotRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setStaged(true);
  }, []);

  useEffect(() => {
    if (!staged) return;
    const section = sectionRef.current;
    if (!section) return;

    let raf = 0;

    const update = () => {
      raf = 0;
      const rect = section.getBoundingClientRect();

      // O miolo fica preso enquanto a seção cruza a tela; o trecho realmente
      // percorrido é a altura da seção menos uma tela.
      const travel = rect.height - window.innerHeight;
      const progress = travel > 0 ? Math.min(1, Math.max(0, -rect.top / travel)) : 0;

      // Converte para "posição na fila", onde i+0.5 é o centro do card i.
      // O percurso vai do centro do primeiro ao centro do último (e não de 0 a
      // N): assim o card 1 já entra inteiro e o último termina inteiro, em vez
      // de ambos aparecerem pela metade nas pontas da seção.
      const last = Math.max(1, items.length - 1);
      const cursor = 0.5 + progress * last;

      slotRefs.current.forEach((slot, i) => {
        if (!slot) return;
        const distance = cursor - (i + 0.5);

        // Zera a 0.59 de distância — os vizinhos se sobrepõem por uma fatia
        // curta, que é o que faz a troca parecer fusão e não corte.
        const opacity = Math.max(0, 1 - Math.abs(distance) * 1.7);

        slot.style.opacity = opacity.toFixed(3);
        slot.style.transform = `translateY(${(distance * -36).toFixed(1)}px)`;
        // Card apagado não pode roubar o clique do que está aparecendo.
        slot.style.pointerEvents = opacity > 0.5 ? "auto" : "none";
      });
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [staged, items.length]);

  if (!staged) {
    return (
      <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 14 }}>
        {items.map((link, i) => (
          <LinkCard
            key={link.titulo}
            href={link.href}
            titulo={link.titulo}
            desc={link.desc}
            featured={link.featured}
            delay={1 + i * 0.11}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      ref={sectionRef}
      className="link-stage"
      style={{ height: `${items.length * 100}vh` }}
    >
      <div className="link-stage-pin">
        {items.map((link, i) => (
          <div
            key={link.titulo}
            ref={(el) => {
              slotRefs.current[i] = el;
            }}
            className="link-stage-slot"
          >
            <LinkCard
              href={link.href}
              titulo={link.titulo}
              desc={link.desc}
              featured={link.featured}
              staged
            />
          </div>
        ))}
      </div>
    </div>
  );
}
