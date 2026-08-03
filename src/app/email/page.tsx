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

export default function GenericoSistema() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".email-page");
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

    const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";
    const heroEls = root.querySelectorAll<HTMLElement>("[data-hero]");
    heroEls.forEach((el, i) => {
      el.style.transition = `opacity 0.9s ${EASE}, transform 0.9s ${EASE}, filter 0.9s ${EASE}`;
      el.style.transform = "translateY(24px)";
      el.style.filter = "blur(10px)";
      setTimeout(() => {
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
        el.style.filter = "blur(0)";
      }, 400 + i * 140);
    });

    const canvas = root.querySelector<HTMLCanvasElement>("#email-field");
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
    <div className="email-page">
      <style>{`
        .email-page {
          --l-bg:#0A0A0A;
          --l-bg-card:#141414;
          --l-line:#222222;
          --l-bone:#F5F5F0;
          --l-muted:#8a8a85;
          --l-muted-2:#5c5c58;
          --l-orange:#FF4500;
          --l-orange-dim: rgba(255,69,0,0.35);
          --l-ease: cubic-bezier(0.16, 1, 0.3, 1);

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
        .email-page *{box-sizing:border-box;}
        .email-page ::selection{background:var(--l-orange-dim);color:var(--l-bone);}
        .email-page a{color:inherit;}

        .email-page::after{
          content:"";
          position:fixed;inset:0;pointer-events:none;z-index:999;opacity:0.03;
          background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size:200px 200px;
        }

        @media (prefers-reduced-motion: reduce){
          .email-page *, .email-page *::before, .email-page *::after{
            animation-duration:0.001ms !important; animation-iteration-count:1 !important;
            transition-duration:0.001ms !important; scroll-behavior:auto !important;
          }
        }

        .email-page .wrap{max-width:920px;margin:0 auto;padding:0 24px;}
        .email-page section{position:relative;padding:120px 0;}
        @media (max-width:640px){ .email-page section{padding:80px 0;} }

        .email-page .eyebrow{display:flex;align-items:center;gap:12px;font-size:11px;font-weight:600;letter-spacing:0.28em;text-transform:uppercase;color:var(--l-muted-2);margin-bottom:20px;}
        .email-page .eyebrow .num{color:var(--l-orange);}

        .email-page h2{font-family:var(--font-audiowide), system-ui, sans-serif;font-size:clamp(26px,4.2vw,44px);line-height:1.15;letter-spacing:0.01em;margin-bottom:16px;text-wrap:balance;}
        .email-page .lede{color:var(--l-muted);max-width:56ch;font-size:16.5px;margin-bottom:48px;}

        .email-page header.email-header{
          position:fixed;top:0;left:0;right:0;z-index:50;
          border-bottom:1px solid var(--l-line);
          background:rgba(10,10,10,0.75);
          backdrop-filter:blur(14px);
        }
        .email-page header.email-header .wrap{display:flex;align-items:center;justify-content:space-between;padding-top:16px;padding-bottom:16px;max-width:1080px;}
        .email-page header.email-header .tag{font-size:12px;color:var(--l-muted-2);letter-spacing:0.06em;}

        .email-page #hero{min-height:100vh;display:flex;flex-direction:column;justify-content:center;padding-top:140px;padding-bottom:80px;}
        .email-page #hero .wrap{max-width:1080px;position:relative;z-index:2;}

        .email-page canvas#email-field{position:absolute;inset:0;width:100%;height:100%;z-index:0;opacity:0.9;mask-image:linear-gradient(to bottom, black 0%, black 70%, transparent 100%);-webkit-mask-image:linear-gradient(to bottom, black 0%, black 70%, transparent 100%);}

        .email-page .kicker{display:inline-flex;align-items:center;gap:10px;font-size:12px;font-weight:600;letter-spacing:0.24em;text-transform:uppercase;color:var(--l-muted-2);margin-bottom:28px;opacity:0;}
        .email-page .kicker .dot{width:6px;height:6px;border-radius:50%;background:var(--l-orange);box-shadow:0 0 12px var(--l-orange);}

        .email-page h1{font-family:var(--font-audiowide), system-ui, sans-serif;font-size:clamp(40px,9vw,104px);line-height:0.98;letter-spacing:-0.01em;margin-bottom:28px;opacity:0;}
        .email-page h1 .accent{color:var(--l-orange);}

        .email-page .hero-sub{max-width:52ch;font-size:18px;color:var(--l-muted);margin-bottom:44px;opacity:0;}

        .email-page .hero-meta{display:flex;gap:32px;flex-wrap:wrap;opacity:0;}
        .email-page .hero-meta div{border-left:2px solid var(--l-line);padding-left:14px;}
        .email-page .hero-meta .k{font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:var(--l-muted-2);margin-bottom:4px;}
        .email-page .hero-meta .v{font-size:15px;color:var(--l-bone);font-weight:600;}

        .email-page .scroll-cue{position:absolute;bottom:36px;left:50%;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;gap:10px;color:var(--l-muted-2);font-size:10px;letter-spacing:0.2em;text-transform:uppercase;z-index:2;opacity:0;}
        .email-page .scroll-cue .bar{width:1px;height:36px;background:linear-gradient(to bottom, var(--l-orange), transparent);animation:emailScrollPulse 1.8s ease-in-out infinite;}
        @keyframes emailScrollPulse{ 0%,100%{opacity:0.3;} 50%{opacity:1;} }

        .email-page .reveal{opacity:0;transform:translateY(28px);filter:blur(8px);transition:opacity 0.85s var(--l-ease), transform 0.85s var(--l-ease), filter 0.85s var(--l-ease);}
        .email-page .reveal.in{opacity:1;transform:translateY(0);filter:blur(0);}
        .email-page .reveal-delay-1{transition-delay:0.08s;}
        .email-page .reveal-delay-2{transition-delay:0.16s;}
        .email-page .reveal-delay-3{transition-delay:0.24s;}
        .email-page .reveal-delay-4{transition-delay:0.32s;}

        .email-page .rule{height:2px;border-radius:2px;background:linear-gradient(90deg, var(--l-orange), rgba(255,69,0,0));margin-bottom:32px;width:0;transition:width 1s var(--l-ease);}
        .email-page .reveal.in .rule{width:64px;}

        .email-page .feature-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:14px;}
        @media (max-width:640px){ .email-page .feature-grid{grid-template-columns:1fr;} }
        .email-page .feature{background:var(--l-bg-card);border:1px solid var(--l-line);border-radius:6px;padding:22px 24px;display:flex;flex-direction:column;gap:8px;transition:border-color 0.25s, transform 0.25s;}
        .email-page .feature:hover{border-color:var(--l-orange-dim);transform:translateY(-3px);}
        .email-page .feature .tag{align-self:flex-start;font-family:var(--font-jetbrains-mono), monospace;font-size:10px;letter-spacing:0.1em;text-transform:uppercase;padding:3px 8px;border-radius:3px;}
        .email-page .tag.mvp{background:rgba(255,69,0,0.14);color:#ff8a5c;border:1px solid rgba(255,69,0,0.35);}
        .email-page .tag.fase2{background:rgba(255,255,255,0.05);color:var(--l-muted);border:1px solid var(--l-line);}
        .email-page .feature .name{font-weight:700;font-size:15.5px;}
        .email-page .feature .desc{font-size:13.5px;color:var(--l-muted);line-height:1.55;}

        .email-page .flow{border-left:2px solid var(--l-line);margin-left:8px;}
        .email-page .flow-step{position:relative;padding:0 0 36px 32px;}
        .email-page .flow-step:last-child{padding-bottom:0;}
        .email-page .flow-step::before{content:"";position:absolute;left:-7px;top:3px;width:12px;height:12px;border-radius:50%;background:var(--l-bg);border:2px solid var(--l-orange);box-shadow:0 0 0 4px var(--l-bg), 0 0 16px 0 rgba(255,69,0,0.4);}
        .email-page .flow-step .who{font-family:var(--font-jetbrains-mono), monospace;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:var(--l-orange);margin-bottom:4px;}
        .email-page .flow-step .what{font-size:16px;color:var(--l-bone);}

        .email-page .phase{display:grid;grid-template-columns:120px 1fr;gap:24px;padding:26px 0;border-top:1px solid var(--l-line);}
        .email-page .phase:last-child{border-bottom:1px solid var(--l-line);}
        .email-page .phase .num{font-family:var(--font-jetbrains-mono), monospace;font-variant-numeric:tabular-nums;color:var(--l-orange);font-size:14px;}
        .email-page .phase .num .dur{display:block;color:var(--l-muted-2);font-size:11.5px;margin-top:6px;}
        .email-page .phase .title{font-weight:700;font-size:17px;margin-bottom:6px;color:var(--l-bone);}
        .email-page .phase .body{color:var(--l-muted);font-size:14.5px;max-width:56ch;}

        .email-page #cta{text-align:center;padding:160px 0;position:relative;overflow:hidden;}
        .email-page #cta::before{content:"";position:absolute;inset:-40% -10% auto -10%;height:120%;background:radial-gradient(ellipse at 50% 30%, rgba(255,69,0,0.16), transparent 60%);pointer-events:none;}
        .email-page #cta h2{font-size:clamp(30px,6vw,60px);margin:0 auto 20px;max-width:16ch;}
        .email-page #cta p{color:var(--l-muted);max-width:48ch;margin:0 auto;}

        .email-page #autor{padding-top:0;}
        .email-page .team{display:grid;grid-template-columns:repeat(2,1fr);gap:14px;}
        @media (max-width:720px){ .email-page .team{grid-template-columns:1fr;} }
        .email-page .member{background:var(--l-bg-card);border:1px solid var(--l-line);border-radius:6px;padding:26px 26px 22px;}
        .email-page .member .head{display:flex;gap:16px;align-items:center;margin-bottom:16px;}
        .email-page .member .role{font-family:var(--font-jetbrains-mono), monospace;font-size:10.5px;letter-spacing:0.14em;text-transform:uppercase;color:var(--l-orange);margin-bottom:4px;}
        .email-page .member .who{font-family:var(--font-audiowide), system-ui, sans-serif;font-size:19px;line-height:1.2;}
        .email-page .member .bio{color:var(--l-muted);font-size:14px;}
        .email-page .author-links{display:flex;gap:10px;flex-wrap:wrap;margin-top:18px;}
        .email-page .author-links a{
          display:flex;flex-direction:column;gap:3px;
          background:rgba(255,255,255,0.03);border:1px solid var(--l-line);border-radius:6px;
          padding:12px 16px;text-decoration:none;flex:1;min-width:150px;
          transition:border-color 0.25s, transform 0.25s;
        }
        .email-page .author-links a:hover{border-color:var(--l-orange-dim);transform:translateY(-3px);}
        .email-page .author-links .k{font-family:var(--font-jetbrains-mono), monospace;font-size:10.5px;letter-spacing:0.1em;text-transform:uppercase;color:var(--l-muted-2);}
        .email-page .author-links .v{font-size:14px;font-weight:600;color:var(--l-bone);}

        .email-page footer.email-footer{border-top:1px solid var(--l-line);padding:36px 0;color:var(--l-muted-2);font-size:12.5px;}
        .email-page footer.email-footer .wrap{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;max-width:1080px;}
      `}</style>

      <div className="intro-veil" aria-hidden />

      <header className="email-header">
        <div className="wrap">
          <Image src="/kody-logo.png" alt="KODY" width={72} height={24} style={{ objectFit: "contain", height: 22, width: "auto" }} />
          <span className="tag">proposta de projeto</span>
        </div>
      </header>

      <section id="hero">
        <canvas id="email-field" />
        <div className="wrap">
          <div className="kicker" data-hero><span className="dot" />KODY apresenta</div>
          <h1 data-hero>SISTEMA PARA<br /><span className="accent">BARBEARIAS E SALÕES</span></h1>
          <p className="hero-sub" data-hero>Um app próprio — agendamento, sinal antecipado e painel de gestão — construído sob medida pra rotina da sua barbearia ou salão de beleza, na Web, na App Store e no Google Play.</p>
          <div className="hero-meta" data-hero>
            <div><div className="k">Segmento</div><div className="v">Barbearias e Salões</div></div>
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
          <p className="lede reveal reveal-delay-2">A primeira versão cobre o essencial pra colocar o negócio pra rodar dentro do app. O resto é roadmap — construído por cima assim que o essencial estiver validado com o uso real.</p>

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
          <div className="reveal"><h2>Vamos colocar o seu negócio no bolso de cada cliente.</h2></div>
          <p className="reveal reveal-delay-1">Esse documento é o ponto de partida — um sistema assim é construído sob medida pra sua marca, seus serviços e sua rotina. A próxima etapa é uma conversa rápida pra alinhar identidade visual e regras de negócio.</p>
        </div>
      </section>

      <section id="autor">
        <div className="wrap">
          <div className="reveal"><div className="eyebrow"><span className="num">—</span>Quem constrói</div></div>
          <div className="reveal reveal-delay-1"><div className="rule" /></div>
          <div className="reveal reveal-delay-1"><h2>O time por trás</h2></div>

          <div className="team">
            <div className="member reveal reveal-delay-1">
              <div className="head">
                <Image
                  src="/euller.jpg"
                  alt="Euller Lolato"
                  width={72}
                  height={72}
                  style={{ borderRadius: "50%", objectFit: "cover", border: "2px solid var(--l-line)", flexShrink: 0 }}
                />
                <div>
                  <div className="role">Desenvolvimento</div>
                  <div className="who">Euller Lolato</div>
                </div>
              </div>
              <p className="bio">Desenvolvedor por trás da KODY — automações, agentes de IA e produtos web pra negócios reais.</p>
              <div className="author-links">
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

            <div className="member reveal reveal-delay-2">
              <div className="head">
                <Image
                  src="/cristian.jpg"
                  alt="Cristian"
                  width={72}
                  height={72}
                  style={{ borderRadius: "50%", objectFit: "cover", border: "2px solid var(--l-line)", flexShrink: 0 }}
                />
                <div>
                  <div className="role">Comercial e suporte</div>
                  <div className="who">Cristian</div>
                </div>
              </div>
              <p className="bio">Primeiro contato, alinhamento comercial e acompanhamento no dia a dia — inclusive depois que o app entra no ar.</p>
              <div className="author-links">
                <a href={`https://wa.me/5549991637585?text=${encodeURIComponent("Oi Cristian! Quero saber mais sobre o sistema pra barbearias e salões.")}`} target="_blank" rel="noopener noreferrer">
                  <span className="k">WhatsApp</span>
                  <span className="v">(49) 99163-7585 →</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="email-footer">
        <div className="wrap">
          <Image src="/kody-logo.png" alt="KODY" width={54} height={18} style={{ objectFit: "contain", opacity: 0.7 }} />
          <span>Proposta de projeto — sujeita a ajuste conforme alinhamento na reunião.</span>
        </div>
      </footer>
    </div>
  );
}
