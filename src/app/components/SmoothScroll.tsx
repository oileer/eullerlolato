"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

/**
 * Scroll suave (Lenis) — a inércia que dá peso ao rolar a página.
 *
 * Os valores espelham a referência `fourdesignestudio`: interpolação de 0.1
 * (quanto menor, mais "pesado"), âncoras resolvidas pela própria lib e scroll
 * aninhado liberado — sem isso, qualquer área com overflow próprio trava.
 *
 * Sob `prefers-reduced-motion` a lib nem chega a subir: quem pediu menos
 * movimento fica com o scroll nativo do browser.
 */
export default function SmoothScroll() {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);
  const firstRun = useRef(true);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      smoothWheel: true,
      lerp: 0.1,
      autoRaf: true,
      anchors: true,
      allowNestedScroll: true,
      stopInertiaOnNavigate: true,
    });
    lenisRef.current = lenis;

    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  useEffect(() => {
    // O Lenis guarda a posição por conta própria, então numa troca de rota a
    // página nova abriria na altura da anterior. O primeiro render fica de
    // fora para não atropelar link com âncora (#secao) vindo de fora.
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    lenisRef.current?.scrollTo(0, { immediate: true });
  }, [pathname]);

  return null;
}
