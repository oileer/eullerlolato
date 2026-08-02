import Image from "next/image";
import CursorSpotlight from "./components/CursorSpotlight";
import CurtainText from "./components/CurtainText";
import LinkCard from "./components/LinkCard";

const WHATSAPP = "5549991637585";
const WHATSAPP_MSG = encodeURIComponent(
  "Oi Euller! Quero saber mais sobre IA para o meu negócio."
);

const LINKS = [
  {
    titulo: "KODY OS",
    desc: "Sistema de IA que estrutura sua empresa do zero. Cadastre-se para acesso antecipado + artigos semanais sobre IA e negócios.",
    href: "https://kodyos.eullerlolato.com",
    featured: true,
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
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "64px 24px 48px",
      }}
    >
      <div className="intro-veil" aria-hidden />
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
            fontFamily: "var(--font-audiowide)",
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
            background: "linear-gradient(90deg, #FF4500, rgba(255,69,0,0))",
            margin: "28px 0 36px",
            animationDelay: "0.85s",
          }}
        />

        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 14 }}>
          {LINKS.map((link, i) => (
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

        <div
          className="anim-blur-up"
          style={{
            animationDelay: "1.45s",
            marginTop: "auto",
            paddingTop: 48,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 12,
          }}
        >
          <Image
            src="/kody-logo.png"
            alt="KODY"
            width={54}
            height={18}
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
