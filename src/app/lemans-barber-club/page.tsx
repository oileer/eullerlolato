"use client";

import Image from "next/image";
import { useEffect } from "react";

const FEATURES = [
  { tag: "mvp", name: "Agendamento de horário", desc: "Cliente escolhe barbeiro, serviço e horário disponível na hora, sem ligar ou mandar mensagem." },
  { tag: "mvp", name: "Sinal antecipado", desc: "Cobrança de um valor no ato do agendamento (Pix/cartão) — reduz falta sem aviso." },
  { tag: "mvp", name: "Lembrete por notificação", desc: "Cliente e barbeiro recebem aviso antes do horário marcado." },
  { tag: "mvp", name: "Painel do dono/barbeiros", desc: "Agenda do dia, bloqueio de horário, cadastro de serviços e preços." },
  { tag: "fase2", name: "Fila de espera automática", desc: "Se alguém cancelar, o próximo da lista é avisado na hora." },
  { tag: "fase2", name: "Cartão fidelidade digital", desc: "A cada N cortes, um sai grátis — acompanhado direto no app." },
  { tag: "fase2", name: "Histórico do cliente", desc: "Barbeiro vê o corte anterior, preferências e observações." },
  { tag: "fase2", name: "Comissão automática", desc: "Split de % por barbeiro calculado sozinho a cada serviço." },
  { tag: "fase2", name: "Relatório de faturamento", desc: "Por período, por profissional, por serviço." },
  { tag: "fase2", name: "Reengajamento automático", desc: "“Faz 30 dias que você não vem” — mensagem automática pra cliente que sumiu." },
];

const FLOW = [
  { who: "Cliente", what: "Abre o app, escolhe o barbeiro e o horário livre, paga o sinal, recebe a confirmação." },
  { who: "Cliente", what: "No dia, recebe um lembrete por notificação — sem depender de WhatsApp manual." },
  { who: "Barbeiro", what: "Vê a própria agenda do dia no celular, com nome, horário e serviço de cada cliente." },
  { who: "Dono", what: "Acompanha a agenda de todos os barbeiros, cadastra serviços/preços e bloqueia horários." },
];

const PHASES = [
  { n: "Fase 1", dur: "3–5 dias", title: "Levantamento", body: "Identidade visual, serviços/preços, regras de negócio e conteúdo institucional." },
  { n: "Fase 2", dur: "5–7 dias", title: "Design das telas", body: "Protótipo navegável com a marca da barbearia aplicada, aprovado antes do código final." },
  { n: "Fase 3", dur: "3–5 semanas", title: "Desenvolvimento do MVP", body: "App (Web + iOS + Android a partir do mesmo código) e painel administrativo." },
  { n: "Fase 4", dur: "1–2 semanas", title: "Teste com uso real", body: "Uso no dia a dia antes do lançamento público — ajustes entram aqui, não depois." },
  { n: "Fase 5", dur: "3–7 dias", title: "Publicação", body: "Envio para App Store e Google Play e disponibilização da versão Web." },
];

export default function LemansBarberClub() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".lemans-page");
    if (!root) return;

    const revealEls = root.querySelectorAll<HTMLElement>(".reveal");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach((el) => io.observe(el));

    const heroEls = root.querySelectorAll<HTMLElement>("[data-hero]");
    heroEls.forEach((el, i) => {
      el.style.transition =
        "opacity 0.8s cubic-bezier(.2,.7,.2,1), transform 0.8s cubic-bezier(.2,.7,.2,1)";
      el.style.transform = "translateY(16px)";
      setTimeout(() => {
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
      }, 200 + i * 130);
    });

    const canvas = root.querySelector<HTMLCanvasElement>("#lemans-field");
    if (!canvas) return () => io.disconnect();
    const ctx = canvas.getContext("2d");
    if (!ctx) return () => io.disconnect();

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0, h = 0, dpr = 1;
    let particles: { x: number; y: number; baseR: number }[] = [];
    let pulses: { x: number; y: number; born: number }[] = [];
    let lastPulse = 0;
    let raf = 0;

    function buildGrid() {
      particles = [];
      const gap = 46;
      const cols = Math.ceil(w / gap) + 1;
      const rows = Math.ceil(h / gap) + 1;
      for (let iY = 0; iY < rows; iY++) {
        for (let iX = 0; iX < cols; iX++) {
          particles.push({ x: iX * gap, y: iY * gap, baseR: 1.1 });
        }
      }
    }

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas!.parentElement!.offsetWidth;
      h = window.innerHeight;
      canvas!.width = w * dpr;
      canvas!.height = h * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildGrid();
    }

    function spawnPulse(t: number) {
      pulses.push({ x: Math.random() * w, y: Math.random() * h * 0.7, born: t });
    }

    function draw(t: number) {
      ctx!.clearRect(0, 0, w, h);

      if (!reduceMotion && t - lastPulse > 1400) {
        lastPulse = t;
        spawnPulse(t);
        if (pulses.length > 4) pulses.shift();
      }

      for (const p of particles) {
        let boost = 0;
        for (const pu of pulses) {
          const age = (t - pu.born) / 1000;
          const radius = age * 340;
          const dist = Math.hypot(p.x - pu.x, p.y - pu.y);
          const ring = Math.abs(dist - radius);
          if (ring < 60 && age < 2.6) {
            boost = Math.max(boost, (1 - ring / 60) * (1 - age / 2.6));
          }
        }
        const alpha = 0.05 + boost * 0.85;
        const r = p.baseR + boost * 1.6;
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx!.fillStyle = boost > 0.08 ? `rgba(255,69,0,${alpha})` : `rgba(245,245,240,${alpha})`;
        ctx!.fill();
      }

      pulses = pulses.filter((pu) => (t - pu.born) / 1000 < 2.6);

      if (!reduceMotion) raf = requestAnimationFrame(draw);
    }

    window.addEventListener("resize", resize);
    resize();
    if (reduceMotion) draw(0);
    else raf = requestAnimationFrame(draw);

    return () => {
      io.disconnect();
      window.removeEventListener("resize", resize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="lemans-page">
      <style>{`
        .lemans-page {
          --l-bg:#0A0A0A;
          --l-bg-card:#141414;
          --l-line:#222222;
          --l-bone:#F5F5F0;
          --l-muted:#8a8a85;
          --l-muted-2:#5c5c58;
          --l-orange:#FF4500;
          --l-orange-dim: rgba(255,69,0,0.35);

          background:var(--l-bg);
          color:var(--l-bone);
          font-family:var(--font-inter), system-ui, sans-serif;
          line-height:1.6;
          -webkit-font-smoothing:antialiased;
          overflow-x:hidden;
          background-image:radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px);
          background-size:28px 28px;
          min-height:100vh;
        }
        .lemans-page *{box-sizing:border-box;}
        .lemans-page ::selection{background:var(--l-orange-dim);color:var(--l-bone);}
        .lemans-page a{color:inherit;}

        .lemans-page::after{
          content:"";
          position:fixed;inset:0;pointer-events:none;z-index:999;opacity:0.03;
          background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size:200px 200px;
        }

        @media (prefers-reduced-motion: reduce){
          .lemans-page *, .lemans-page *::before, .lemans-page *::after{
            animation-duration:0.001ms !important; animation-iteration-count:1 !important;
            transition-duration:0.001ms !important; scroll-behavior:auto !important;
          }
        }

        .lemans-page .wrap{max-width:920px;margin:0 auto;padding:0 24px;}
        .lemans-page section{position:relative;padding:120px 0;}
        @media (max-width:640px){ .lemans-page section{padding:80px 0;} }

        .lemans-page .eyebrow{display:flex;align-items:center;gap:12px;font-size:11px;font-weight:600;letter-spacing:0.28em;text-transform:uppercase;color:var(--l-muted-2);margin-bottom:20px;}
        .lemans-page .eyebrow .num{color:var(--l-orange);}

        .lemans-page h2{font-family:var(--font-audiowide), system-ui, sans-serif;font-size:clamp(26px,4.2vw,44px);line-height:1.15;letter-spacing:0.01em;margin-bottom:16px;text-wrap:balance;}
        .lemans-page .lede{color:var(--l-muted);max-width:56ch;font-size:16.5px;margin-bottom:48px;}

        .lemans-page header.lemans-header{
          position:fixed;top:0;left:0;right:0;z-index:50;
          border-bottom:1px solid var(--l-line);
          background:rgba(10,10,10,0.75);
          backdrop-filter:blur(14px);
        }
        .lemans-page header.lemans-header .wrap{display:flex;align-items:center;justify-content:space-between;padding-top:16px;padding-bottom:16px;max-width:1080px;}
        .lemans-page header.lemans-header .tag{font-size:12px;color:var(--l-muted-2);letter-spacing:0.06em;}

        .lemans-page #hero{min-height:100vh;display:flex;flex-direction:column;justify-content:center;padding-top:140px;padding-bottom:80px;}
        .lemans-page #hero .wrap{max-width:1080px;position:relative;z-index:2;}

        .lemans-page canvas#lemans-field{position:absolute;inset:0;width:100%;height:100%;z-index:0;opacity:0.9;mask-image:linear-gradient(to bottom, black 0%, black 70%, transparent 100%);-webkit-mask-image:linear-gradient(to bottom, black 0%, black 70%, transparent 100%);}

        .lemans-page .kicker{display:inline-flex;align-items:center;gap:10px;font-size:12px;font-weight:600;letter-spacing:0.24em;text-transform:uppercase;color:var(--l-muted-2);margin-bottom:28px;opacity:0;}
        .lemans-page .kicker .dot{width:6px;height:6px;border-radius:50%;background:var(--l-orange);box-shadow:0 0 12px var(--l-orange);}

        .lemans-page h1{font-family:var(--font-audiowide), system-ui, sans-serif;font-size:clamp(40px,9vw,104px);line-height:0.98;letter-spacing:-0.01em;margin-bottom:28px;opacity:0;}
        .lemans-page h1 .accent{color:var(--l-orange);}

        .lemans-page .hero-sub{max-width:52ch;font-size:18px;color:var(--l-muted);margin-bottom:44px;opacity:0;}

        .lemans-page .hero-meta{display:flex;gap:32px;flex-wrap:wrap;opacity:0;}
        .lemans-page .hero-meta div{border-left:2px solid var(--l-line);padding-left:14px;}
        .lemans-page .hero-meta .k{font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:var(--l-muted-2);margin-bottom:4px;}
        .lemans-page .hero-meta .v{font-size:15px;color:var(--l-bone);font-weight:600;}

        .lemans-page .scroll-cue{position:absolute;bottom:36px;left:50%;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;gap:10px;color:var(--l-muted-2);font-size:10px;letter-spacing:0.2em;text-transform:uppercase;z-index:2;opacity:0;}
        .lemans-page .scroll-cue .bar{width:1px;height:36px;background:linear-gradient(to bottom, var(--l-orange), transparent);animation:lemansScrollPulse 1.8s ease-in-out infinite;}
        @keyframes lemansScrollPulse{ 0%,100%{opacity:0.3;} 50%{opacity:1;} }

        .lemans-page .reveal{opacity:0;transform:translateY(28px);transition:opacity 0.7s cubic-bezier(.2,.7,.2,1), transform 0.7s cubic-bezier(.2,.7,.2,1);}
        .lemans-page .reveal.in{opacity:1;transform:translateY(0);}
        .lemans-page .reveal-delay-1{transition-delay:0.08s;}
        .lemans-page .reveal-delay-2{transition-delay:0.16s;}
        .lemans-page .reveal-delay-3{transition-delay:0.24s;}
        .lemans-page .reveal-delay-4{transition-delay:0.32s;}

        .lemans-page .rule{height:2px;border-radius:2px;background:linear-gradient(90deg, var(--l-orange), rgba(255,69,0,0));margin-bottom:32px;width:0;transition:width 1s cubic-bezier(.2,.7,.2,1);}
        .lemans-page .reveal.in .rule{width:64px;}

        .lemans-page .feature-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:14px;}
        @media (max-width:640px){ .lemans-page .feature-grid{grid-template-columns:1fr;} }
        .lemans-page .feature{background:var(--l-bg-card);border:1px solid var(--l-line);border-radius:6px;padding:22px 24px;display:flex;flex-direction:column;gap:8px;transition:border-color 0.25s, transform 0.25s;}
        .lemans-page .feature:hover{border-color:var(--l-orange-dim);transform:translateY(-3px);}
        .lemans-page .feature .tag{align-self:flex-start;font-family:var(--font-jetbrains-mono), monospace;font-size:10px;letter-spacing:0.1em;text-transform:uppercase;padding:3px 8px;border-radius:3px;}
        .lemans-page .tag.mvp{background:rgba(255,69,0,0.14);color:#ff8a5c;border:1px solid rgba(255,69,0,0.35);}
        .lemans-page .tag.fase2{background:rgba(255,255,255,0.05);color:var(--l-muted);border:1px solid var(--l-line);}
        .lemans-page .feature .name{font-weight:700;font-size:15.5px;}
        .lemans-page .feature .desc{font-size:13.5px;color:var(--l-muted);line-height:1.55;}

        .lemans-page .flow{border-left:2px solid var(--l-line);margin-left:8px;}
        .lemans-page .flow-step{position:relative;padding:0 0 36px 32px;}
        .lemans-page .flow-step:last-child{padding-bottom:0;}
        .lemans-page .flow-step::before{content:"";position:absolute;left:-7px;top:3px;width:12px;height:12px;border-radius:50%;background:var(--l-bg);border:2px solid var(--l-orange);box-shadow:0 0 0 4px var(--l-bg), 0 0 16px 0 rgba(255,69,0,0.4);}
        .lemans-page .flow-step .who{font-family:var(--font-jetbrains-mono), monospace;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:var(--l-orange);margin-bottom:4px;}
        .lemans-page .flow-step .what{font-size:16px;color:var(--l-bone);}

        .lemans-page .phase{display:grid;grid-template-columns:120px 1fr;gap:24px;padding:26px 0;border-top:1px solid var(--l-line);}
        .lemans-page .phase:last-child{border-bottom:1px solid var(--l-line);}
        .lemans-page .phase .num{font-family:var(--font-jetbrains-mono), monospace;font-variant-numeric:tabular-nums;color:var(--l-orange);font-size:14px;}
        .lemans-page .phase .num .dur{display:block;color:var(--l-muted-2);font-size:11.5px;margin-top:6px;}
        .lemans-page .phase .title{font-weight:700;font-size:17px;margin-bottom:6px;color:var(--l-bone);}
        .lemans-page .phase .body{color:var(--l-muted);font-size:14.5px;max-width:56ch;}

        .lemans-page #cta{text-align:center;padding:160px 0;position:relative;overflow:hidden;}
        .lemans-page #cta::before{content:"";position:absolute;inset:-40% -10% auto -10%;height:120%;background:radial-gradient(ellipse at 50% 30%, rgba(255,69,0,0.16), transparent 60%);pointer-events:none;}
        .lemans-page #cta h2{font-size:clamp(30px,6vw,60px);margin:0 auto 20px;max-width:16ch;}
        .lemans-page #cta p{color:var(--l-muted);max-width:48ch;margin:0 auto;}

        .lemans-page #autor{padding-top:0;}
        .lemans-page .author-links{display:flex;gap:14px;flex-wrap:wrap;}
        .lemans-page .author-links a{
          display:flex;flex-direction:column;gap:4px;
          background:var(--l-bg-card);border:1px solid var(--l-line);border-radius:6px;
          padding:16px 20px;text-decoration:none;min-width:200px;
          transition:border-color 0.25s, transform 0.25s;
        }
        .lemans-page .author-links a:hover{border-color:var(--l-orange-dim);transform:translateY(-3px);}
        .lemans-page .author-links .k{font-family:var(--font-jetbrains-mono), monospace;font-size:10.5px;letter-spacing:0.1em;text-transform:uppercase;color:var(--l-muted-2);}
        .lemans-page .author-links .v{font-size:15px;font-weight:600;color:var(--l-bone);}

        .lemans-page footer.lemans-footer{border-top:1px solid var(--l-line);padding:36px 0;color:var(--l-muted-2);font-size:12.5px;}
        .lemans-page footer.lemans-footer .wrap{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;max-width:1080px;}
      `}</style>

      <header className="lemans-header">
        <div className="wrap">
          <Image src="/kody-logo.png" alt="KODY" width={72} height={24} style={{ objectFit: "contain", height: 22, width: "auto" }} />
          <span className="tag">proposta de projeto</span>
        </div>
      </header>

      <section id="hero">
        <canvas id="lemans-field" />
        <div className="wrap">
          <div className="kicker" data-hero><span className="dot" />KODY apresenta</div>
          <h1 data-hero>LEMANS<br /><span className="accent">BARBER CLUB</span></h1>
          <p className="hero-sub" data-hero>Um app próprio — agendamento, sinal antecipado e painel de gestão — construído sob medida pra rotina da barbearia, na Web, na App Store e no Google Play.</p>
          <div className="hero-meta" data-hero>
            <div><div className="k">Cliente</div><div className="v">LeMans Barber Club</div></div>
            <div><div className="k">Plataformas</div><div className="v">Web · iOS · Android</div></div>
            <div><div className="k">Escopo</div><div className="v">MVP + Roadmap</div></div>
          </div>
        </div>
        <div className="scroll-cue" data-hero><span className="bar" />role pra ver</div>
      </section>

      <section id="produto">
        <div className="wrap">
          <div className="reveal"><div className="eyebrow"><span className="num">01</span>O sistema</div></div>
          <div className="reveal reveal-delay-1"><div className="rule" /></div>
          <div className="reveal reveal-delay-1"><h2>O que o app faz</h2></div>
          <p className="lede reveal reveal-delay-2">A primeira versão cobre o essencial pra colocar a barbearia pra rodar dentro do app. O resto é roadmap — construído por cima assim que o essencial estiver validado com o uso real.</p>

          <div className="feature-grid">
            {FEATURES.map((f, i) => (
              <div className={`feature reveal${i % 4 ? ` reveal-delay-${i % 4}` : ""}`} key={f.name}>
                <span className={`tag ${f.tag}`}>{f.tag === "mvp" ? "MVP" : "Fase 2"}</span>
                <span className="name">{f.name}</span>
                <span className="desc">{f.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="fluxo">
        <div className="wrap">
          <div className="reveal"><div className="eyebrow"><span className="num">02</span>No dia a dia</div></div>
          <div className="reveal reveal-delay-1"><div className="rule" /></div>
          <div className="reveal reveal-delay-1"><h2>Como cada pessoa usa o app</h2></div>
          <p className="lede reveal reveal-delay-2">Três perspectivas dentro do mesmo sistema — o cliente nunca vê o que o barbeiro vê, e o barbeiro nunca vê o que só o dono precisa enxergar.</p>

          <div className="flow">
            {FLOW.map((s, i) => (
              <div className={`flow-step reveal${i ? ` reveal-delay-${i}` : ""}`} key={i}>
                <div className="who">{s.who}</div>
                <div className="what">{s.what}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="processo">
        <div className="wrap">
          <div className="reveal"><div className="eyebrow"><span className="num">03</span>Como construímos</div></div>
          <div className="reveal reveal-delay-1"><div className="rule" /></div>
          <div className="reveal reveal-delay-1"><h2>O processo, fase por fase</h2></div>
          <p className="lede reveal reveal-delay-2">Prazos abaixo são estimativa de trabalho dedicado — cada fase só avança com validação da anterior.</p>

          <div className="timeline">
            {PHASES.map((p, i) => (
              <div className={`phase reveal${i ? ` reveal-delay-${i}` : ""}`} key={p.n}>
                <div className="num">{p.n}<span className="dur">{p.dur}</span></div>
                <div>
                  <p className="title">{p.title}</p>
                  <p className="body">{p.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="cta">
        <div className="wrap">
          <div className="reveal"><h2>Vamos colocar a LeMans no bolso de cada cliente.</h2></div>
          <p className="reveal reveal-delay-1">Esse documento é o ponto de partida — a próxima etapa é alinhar identidade visual e regras de negócio na reunião de levantamento.</p>
        </div>
      </section>

      <section id="autor">
        <div className="wrap">
          <div className="reveal"><div className="eyebrow"><span className="num">—</span>Quem constrói</div></div>
          <div className="reveal reveal-delay-1"><div className="rule" /></div>
          <div className="reveal reveal-delay-1"><h2>Euller Lolato</h2></div>
          <p className="lede reveal reveal-delay-2">Desenvolvedor por trás da KODY — automações, agentes de IA e produtos web pra negócios reais.</p>
          <div className="author-links reveal reveal-delay-2">
            <a href="https://github.com/oileer" target="_blank" rel="noopener noreferrer">
              <span className="k">GitHub</span>
              <span className="v">github.com/oileer →</span>
            </a>
            <a href="https://www.instagram.com/eullerlolato_/" target="_blank" rel="noopener noreferrer">
              <span className="k">Instagram</span>
              <span className="v">@eullerlolato_ →</span>
            </a>
          </div>
        </div>
      </section>

      <footer className="lemans-footer">
        <div className="wrap">
          <Image src="/kody-logo.png" alt="KODY" width={54} height={18} style={{ objectFit: "contain", opacity: 0.7 }} />
          <span>Proposta de projeto — sujeita a ajuste conforme alinhamento na reunião.</span>
        </div>
      </footer>
    </div>
  );
}
