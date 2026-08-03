"use client";

import { useEffect } from "react";

/**
 * Revela elementos `.reveal` conforme entram na tela.
 *
 * Cada elemento carrega seu atraso de coreografia em `--d`. O que já está
 * visível no primeiro paint entra em cascata com esse atraso (fecha a
 * animação de abertura); o que está abaixo da dobra espera o scroll e entra
 * com um atraso curto — senão pareceria travado ao rolar até ele.
 */
export default function ScrollReveal() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
    if (els.length === 0) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      els.forEach((el) => {
        el.style.transitionDelay = "0s";
        el.classList.add("in");
      });
      return;
    }

    const belowFold: HTMLElement[] = [];

    els.forEach((el) => {
      const top = el.getBoundingClientRect().top;
      if (top < window.innerHeight) {
        // visível de cara: mantém o atraso da coreografia de abertura
        el.classList.add("in");
      } else {
        // fora da tela: encurta o atraso, quem manda é o scroll
        el.style.transitionDelay = "0s";
        belowFold.push(el);
      }
    });

    if (belowFold.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0.05 }
    );

    belowFold.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return null;
}
