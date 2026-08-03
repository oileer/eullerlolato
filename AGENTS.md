# eullerlolato.com

Página principal (link-in-bio) + propostas de cliente. Next 16 · React 19 ·
Tailwind 4. Hospedado na Vercel, deploy automático a cada push em `master`.

## Sistema de motion

Quatro peças, todas em `src/app/components/`, montadas no `layout.tsx` (exceto
`ScrollReveal`, que é da home):

| Componente | O que faz |
|---|---|
| `SmoothScroll.tsx` | Scroll com inércia via [Lenis](https://github.com/darkroomengineering/lenis) |
| `Parallax.tsx` | Desloca fundos marcados com `data-parallax` |
| `ScrollReveal.tsx` | Revela `.reveal` conforme entra na tela (IntersectionObserver) |
| `CursorSpotlight.tsx` | Brilho que segue o cursor |

Referência de origem dos efeitos: `fourdesignestudio` no acervo
`kodyos/referencias/` — ver `EFFECTS.md` lá para o catálogo completo.

### Scroll suave (Lenis)

Config em `SmoothScroll.tsx`: `lerp: 0.1` (quanto menor, mais "pesado"),
âncoras e scroll aninhado resolvidos pela própria lib.

Dois detalhes que não são óbvios:

- **`html:not(.lenis)` no `globals.css`.** O Lenis marca `<html class="lenis">`
  quando assume o scroll. O `scroll-behavior: smooth` nativo precisa sair do
  caminho nesse momento, senão os dois disputam a mesma rolagem. Fora do Lenis
  (reduced-motion, JS off) o nativo segue valendo.
- **Reset ao trocar de rota.** O Lenis guarda a posição por conta própria, então
  sem o `scrollTo(0)` no `usePathname` a página nova abriria na altura da
  anterior. O primeiro render fica de fora para não atropelar link com âncora.

### Parallax

`Parallax.tsx` só escreve a variável `--parallax-y`; quem aplica o `transform` é
o CSS. Assim o efeito é opcional por elemento e o JS não precisa saber de layout.

Para ativar num elemento novo:

```tsx
<section className="hero-section" data-parallax="10">
```

```css
.hero-section::before {
  inset: -14% 0;   /* folga > amplitude, senão a borda da imagem aparece */
  transform: translate3d(0, var(--parallax-y, 0%), 0);
  will-change: transform;
}
```

O número em `data-parallax` é a amplitude em %, padrão 10. **A folga do `inset`
precisa ser maior que a amplitude** — o `::before` esticado tem altura maior que
o pai, então a margem real encolhe proporcionalmente.

### Acessibilidade

Todos os quatro componentes checam `prefers-reduced-motion` e não inicializam
sob essa flag. O `<noscript>` no `layout.tsx` força `.reveal` visível para quem
está sem JS.

## Snap

Não se aplica aqui: a home é coluna única, sem `<section>`, então não há ponto
de encaixe. O snap do Lenis (`lenis/snap`) está implementado no repo
`kodyos-site` se algum dia for útil de referência.
