const displayBase: React.CSSProperties = {
  fontFamily: "var(--font-display)",
  fontWeight: 400,
  lineHeight: 0.9,
  letterSpacing: "-0.04em",
};

const italicBase: React.CSSProperties = {
  fontFamily: "var(--font-display)",
  fontStyle: "italic",
  fontWeight: 400,
  lineHeight: 1,
  letterSpacing: "-0.02em",
};

export default function IntroHeadline() {
  return (
    <section className="flex min-h-[80vh] flex-col items-center justify-center gap-10 overflow-hidden bg-cream-200 px-5 py-24 sm:gap-12 sm:py-32 md:px-11">
      <div className="flex flex-col items-center gap-1 text-center uppercase text-[color:var(--text-on-white)] sm:gap-2">
        <span
          style={{ ...displayBase, fontSize: "clamp(2rem, 7vw, 6rem)" }}
        >
          Curiouslly
        </span>
        <span className="flex flex-wrap items-end justify-center gap-3 sm:gap-4">
          <span
            className="lowercase"
            style={{ ...italicBase, fontSize: "clamp(1.5rem, 4.6vw, 4rem)" }}
          >
            delicious
          </span>
          <span style={{ ...displayBase, fontSize: "clamp(2rem, 7vw, 6rem)" }}>
            Desserts,
          </span>
        </span>
        <span className="flex flex-wrap items-end justify-center gap-3 sm:gap-4">
          <span style={{ ...displayBase, fontSize: "clamp(2rem, 7vw, 6rem)" }}>
            Crafted
          </span>
          <span
            className="lowercase"
            style={{ ...italicBase, fontSize: "clamp(1.5rem, 4.6vw, 4rem)" }}
          >
            with a
          </span>
        </span>
        <span className="flex flex-wrap items-end justify-center gap-3 sm:gap-4">
          <span style={{ ...displayBase, fontSize: "clamp(2rem, 7vw, 6rem)" }}>
            Spirit
          </span>
          <span
            className="lowercase"
            style={{ ...italicBase, fontSize: "clamp(1.5rem, 4.6vw, 4rem)" }}
          >
            of
          </span>
          <span style={{ ...displayBase, fontSize: "clamp(2rem, 7vw, 6rem)" }}>
            Mischief
          </span>
        </span>
      </div>
      <a
        href="#find-us"
        className="cta-label rounded-[4px] bg-[color:var(--surface-on-cream)] px-5 py-[13px] text-[16px] text-[color:var(--text-on-dark-gray)] transition-transform hover:scale-[1.04] hover:brightness-125"
      >
        Follow along
      </a>
    </section>
  );
}
