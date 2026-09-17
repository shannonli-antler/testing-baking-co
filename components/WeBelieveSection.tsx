export default function WeBelieveSection() {
  return (
    <section className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden bg-cream-200 px-5 py-28 sm:py-36 md:px-11">
      {/* decorative vintage scatter — hidden on small screens to avoid clutter */}
      <div className="pointer-events-none absolute inset-0 hidden md:block" aria-hidden>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/illustration-swirl.png"
          alt=""
          className="absolute left-[2%] top-[6%] w-[14vw] max-w-[190px] -rotate-6 opacity-95"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/illustration-treat.png"
          alt=""
          className="absolute left-[30%] top-[2%] w-[6vw] max-w-[80px] rotate-12 opacity-95"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/illustration-treat.png"
          alt=""
          className="absolute right-[26%] top-[8%] w-[4vw] max-w-[56px] -rotate-12 opacity-95"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/illustration-orb-b.png"
          alt=""
          className="absolute right-[2%] top-[14%] w-[20vw] max-w-[280px] rotate-3 opacity-95"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/illustration-orb-a.png"
          alt=""
          className="absolute -right-6 bottom-[6%] w-[19vw] max-w-[260px] opacity-95"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/illustration-blob.png"
          alt=""
          className="absolute -left-8 bottom-[2%] w-[19vw] max-w-[240px] opacity-95"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/illustration-ribbon.png"
          alt=""
          className="absolute bottom-[8%] left-[32%] w-[16vw] max-w-[220px] opacity-95"
        />
      </div>

      <p
        className="relative max-w-[1200px] text-center uppercase text-[color:var(--text-on-white)]"
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 400,
          lineHeight: 0.9,
          letterSpacing: "-0.04em",
          fontSize: "clamp(1.9rem, 6.5vw, 6rem)",
        }}
      >
        At Unsupervised Baking Co.
        <br />
        we believe:
      </p>
    </section>
  );
}
