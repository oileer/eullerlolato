type CurtainTextProps = {
  text: string;
  /** atraso inicial em segundos */
  delay?: number;
  /** intervalo entre palavras em segundos */
  stagger?: number;
  className?: string;
  style?: React.CSSProperties;
};

/**
 * Revela um texto palavra por palavra, cada uma subindo de trás de uma
 * máscara (efeito cortina). Server component — é só markup + CSS.
 */
export default function CurtainText({
  text,
  delay = 0,
  stagger = 0.08,
  className,
  style,
}: CurtainTextProps) {
  const words = text.split(" ");

  return (
    <span className={className} style={style}>
      {words.map((word, i) => (
        <span key={`${word}-${i}`}>
          <span className="curtain">
            <span style={{ "--d": `${delay + i * stagger}s` } as React.CSSProperties}>
              {word}
            </span>
          </span>
          {i < words.length - 1 ? " " : null}
        </span>
      ))}
    </span>
  );
}
