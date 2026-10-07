import Image from "next/image";
import CursorSpotlight from "./components/CursorSpotlight";
import CurtainText from "./components/CurtainText";
import LinkStage from "./components/LinkStage";
import ScrollReveal from "./components/ScrollReveal";

const WHATSAPP = "5549991637585";
const WHATSAPP_MSG = encodeURIComponent(
  "Oi Euller! Quero saber mais sobre IA para o meu negócio."
);

const LINKS = [
  {
    titulo: "Nex Studio",
    desc: "Vídeo, anúncios e sites para o seu negócio vender mais.",
    href: "https://studionex.com.br",
    featured: true,
  },
  {
    titulo: "Nexora",
    desc: "Sistemas que simplificam, automatizam e aceleram negócios.",
    href: "https://nexoraos.com.br",
    featured: false,
  },
  {
    titulo: "Brand Books",
    desc: "Guias de identidade visual e diretrizes de marca dos clientes da consultoria.",
    href: "https://brandbooks.eullerlolato.com",
    featured: false,
  },
  {
    titulo: "WhatsApp",
    desc: "Quer aplicar IA no seu negócio? Me chama e a gente conversa.",
    href: `https://wa.me/${WHATSAPP}?text=${WHATSAPP_MSG}`,
    featured: false,
  },
];

export default function Home() {
  return (
    <main
      className="hero-section"
      data-parallax="10"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "64px 24px 48px",
      }}
    >
      <div className="intro-veil" aria-hidden />
      <ScrollReveal />
      <CursorSpotlight />
      <div
        style={{
          position: "relative",
          maxWidth: 520,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          flex: 1,
        }}
      >
        <div className="hero-glow" aria-hidden />
        <div className="avatar-wrap anim-avatar-in delay-1">
          <Image
            src="/euller.jpg"
            alt="Euller Lolato"
            width={108}
            height={108}
            className="avatar-ring"
            style={{
              borderRadius: "50%",
              objectFit: "cover",
              border: "2px solid var(--line)",
              display: "block",
            }}
          />
        </div>

        <h1
          style={{
            fontFamily: "var(--font-nex)",
            fontSize: "clamp(24px, 6vw, 32px)",
            marginTop: 24,
            color: "var(--bone)",
          }}
        >
          <CurtainText text="Euller Lolato" delay={0.55} stagger={0.09} />
        </h1>

        <p
          className="anim-blur-up delay-6"
          style={{
            marginTop: 10,
            textAlign: "center",
            color: "var(--muted)",
            fontSize: 14,
            maxWidth: "40ch",
          }}
        >
          Empreendedor digital. Construo sistemas de IA que estruturam presença
          online, conteúdo e vendas para empresas.
        </p>

        <hr
          className="anim-slide-right"
          style={{
            border: 0,
            height: 2,
            width: 48,
            borderRadius: 2,
            background: "linear-gradient(90deg, #A64B2A, rgba(166,75,42,0))",
            margin: "28px 0 36px",
            animationDelay: "0.85s",
          }}
        />

        <LinkStage items={LINKS} />

        <div
          className="reveal"
          style={{
            "--d": "1.45s",
            marginTop: "auto",
            paddingTop: 48,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 12,
          } as React.CSSProperties}
        >
          <Image
            src="/nex-studio-logo.png"
            alt="Nex Studio"
            width={96}
            height={32}
            style={{ objectFit: "contain", opacity: 0.5 }}
          />
          <p
            style={{
              fontSize: 10,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "var(--muted-2)",
            }}
          >
            Euller Lolato · 2026
          </p>
        </div>
      </div>
    </main>
  );
}
