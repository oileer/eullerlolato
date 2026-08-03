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
| `LinkStage.tsx` | Palco de links: um card por vez, centralizado, trocando no scroll |
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

### Palco de links (`LinkStage.tsx`)

Um card por vez, centralizado na tela; o anterior some enquanto o próximo
aparece, conforme rola.

Como funciona: o miolo (`.link-stage-pin`) fica `position: sticky` no topo e a
seção é alta o bastante para ele permanecer preso enquanto os cards se revezam.
Todos ocupam a mesma célula do grid (`grid-area: 1/1`), então a troca é fusão
cruzada, não empilhamento.

A altura é `100vh + (n-1) × VH_POR_TROCA` — uma tela para o miolo preso, mais o
percurso de cada troca. **O ritmo é definido por troca, não por card**
(`VH_POR_TROCA`, hoje `60`): assim ele não muda quando entra ou sai um link.
Menor encurta a página e acelera; abaixo de ~40 começa a parecer nervoso.

**Três pontos que não são óbvios:**

1. **`overflow: clip`, não `hidden`, na `.hero-section`.** Os dois recortam o
   `::before` do parallax igual, mas `hidden` cria um contêiner de scroll — e
   isso mata o `position: sticky` de qualquer descendente. `clip` não cria.
   Trocar de volta para `hidden` quebra o palco silenciosamente.
2. **O percurso vai do centro do primeiro card ao centro do último**
   (`cursor = 0.5 + progress * (n - 1)`), e não de `0` a `n`. Com o mapeamento
   ingênuo, o primeiro e o último card aparecem pela metade nas pontas da seção
   — medido: 0.15 de opacidade em vez de 1.
3. **`LinkCard` recebe `staged`** para largar a classe `.reveal`. Sem isso o
   `ScrollReveal` e o palco disputariam a opacidade do mesmo elemento.

Para afrouxar ou apertar a fusão, mexer no fator `1.7` do cálculo de opacidade:
menor = mais sobreposição entre os cards, maior = troca mais seca.

### Acessibilidade

Todos os cinco componentes checam `prefers-reduced-motion` e não inicializam sob
essa flag — no caso do `LinkStage`, ele cai na coluna empilhada de sempre, já
que um palco preso ao scroll esconderia conteúdo de quem não pode rolar três
telas. Esse mesmo fallback é o que sai no SSR, então quem está sem JS também vê
os três links de uma vez.

O `<noscript>` no `layout.tsx` força `.reveal` visível para quem está sem JS.

## Snap

Não se aplica aqui: a home é coluna única, sem `<section>`, então não há ponto
de encaixe. O snap do Lenis (`lenis/snap`) está implementado no repo
`kodyos-site` se algum dia for útil de referência.
