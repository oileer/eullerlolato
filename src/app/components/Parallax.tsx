"use client";

import { useEffect } from "react";

/**
 * Parallax de fundo — desloca imagens marcadas com `data-parallax` num ritmo
 * menor que o do scroll, dando profundidade sem tirar o texto do lugar.
 *
 * O componente só escreve a variável `--parallax-y`; quem aplica o transform é
 * o CSS (`globals.css`). Assim o efeito é opcional por elemento e o JS não
 * precisa saber nada de layout.
 *
 * `data-parallax` aceita a amplitude em % (padrão 10). O CSS reserva folga de
 * 14% em cima e embaixo, então a amplitude precisa caber nessa margem — senão
 * a borda da imagem aparece.
 */
export default function Parallax() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-parallax]"));
    if (els.length === 0) return;

    let raf = 0;

    const update = () => {
      raf = 0;
      const vh = window.innerHeight;

      for (const el of els) {
        const r = el.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) continue; // fora da tela: não gasta trabalho

        // -1 quando o elemento entra por baixo, 0 no centro, +1 quando sai por cima
        const progress = (r.top + r.height / 2 - vh / 2) / ((vh + r.height) / 2);
        const amplitude = Number(el.dataset.parallax) || 10;
        el.style.setProperty("--parallax-y", `${(progress * amplitude).toFixed(2)}%`);
      }
    };

    // O scroll dispara muito mais que 60x/s; o rAF agrupa tudo num frame só.
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
  }, []);

  return null;
}
