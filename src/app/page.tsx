import Image from "next/image";

const WHATSAPP = "5549991637585";
const WHATSAPP_MSG = encodeURIComponent(
  "Oi Euller! Quero saber mais sobre IA para o meu negócio."
);

const LINKS = [
  {
    titulo: "KODY OS",
    desc: "Sistema de IA que estrutura sua empresa do zero. Cadastre-se para acesso antecipado + artigos semanais sobre IA e negócios.",
    href: "https://captura.eullerlolato.com",
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
      <div
        style={{
          maxWidth: 520,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          flex: 1,
        }}
      >
        <Image
          src="/euller.jpg"
          alt="Euller Lolato"
          width={108}
          height={108}
          className="avatar-ring anim-fade-in"
          style={{
            borderRadius: "50%",
            objectFit: "cover",
            border: "2px solid var(--line)",
          }}
        />

        <h1
          className="anim-fade-up delay-1"
          style={{
            fontFamily: "var(--font-audiowide)",
            fontSize: "clamp(24px, 6vw, 32px)",
            marginTop: 24,
            color: "var(--bone)",
          }}
        >
          Euller Lolato
        </h1>

        <p
          className="anim-fade-up delay-2"
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
          className="anim-slide-right delay-3"
          style={{
            border: 0,
            height: 2,
            width: 48,
            borderRadius: 2,
            background: "linear-gradient(90deg, #FF4500, rgba(255,69,0,0))",
            margin: "28px 0 36px",
          }}
        />

        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 14 }}>
          {LINKS.map((link, i) => (
            <a
              key={link.titulo}
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
              className={`link-card anim-fade-up delay-${i + 4}${link.featured ? " featured" : ""}`}
            >
              <div
                style={{
                  fontFamily: "var(--font-audiowide)",
                  fontSize: 15,
                  letterSpacing: "0.04em",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                {link.titulo} <span className="link-arrow">→</span>
              </div>
              <p style={{ marginTop: 6, fontSize: 13, color: "var(--muted)", lineHeight: 1.6 }}>
                {link.desc}
              </p>
            </a>
          ))}
        </div>

        <div
          className="anim-fade-up delay-7"
          style={{
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
