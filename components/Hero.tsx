"use client";

import { useEffect, useRef, useState } from "react";
import Nav from "./Nav";

function clamp01(v: number) {
  return Math.min(1, Math.max(0, v));
}
function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}
function mapRange(
  v: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
) {
  const t = clamp01((v - inMin) / (inMax - inMin));
  return lerp(outMin, outMax, t);
}

// Hand-authored torn-paper edge: [x%, yOffsetPx] pairs describing the jagged tear.
const TORN_EDGE: [number, number][] = [
  [0, 10],
  [8, -15],
  [16, 20],
  [24, -10],
  [33, 25],
  [42, -20],
  [50, 15],
  [58, -25],
  [67, 10],
  [75, -15],
  [83, 20],
  [91, -10],
  [100, 15],
];

export default function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const scrolled = -rect.top;
      setProgress(clamp01(total > 0 ? scrolled / total : 0));
    };
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const bigLogoOpacity = mapRange(progress, 0, 0.22, 1, 0);
  const bigLogoScale = mapRange(progress, 0, 0.28, 1, 0.7);
  const copyOpacity = mapRange(progress, 0.32, 0.6, 0, 1);
  const copyY = mapRange(progress, 0.32, 0.65, 48, 0);
  const navOpacity = mapRange(progress, 0.55, 0.85, 0, 1);
  const smallLogoOpacity = mapRange(progress, 0.35, 0.6, 0, 1);
  const smallLogoScale = mapRange(progress, 0.35, 0.65, 0.5, 1);

  const baseY = mapRange(progress, 0, 1, 97, -30);
  const clipPath = `polygon(${TORN_EDGE.map(
    ([x, o]) => `${x}% calc(${baseY}% + ${o}px)`
  ).join(", ")}, 100% 100%, 0% 100%)`;

  return (
    <div>
      {/* Scroll-driven torn-paper reveal */}
      <section ref={sectionRef} className="relative h-[200vh] bg-brand-primary">
        <div className="sticky top-0 h-screen overflow-hidden bg-brand-primary-2">
          {/* Nav sits above everything once revealed */}
          <div
            style={{ opacity: navOpacity }}
            className="absolute inset-x-0 top-0 z-30"
          >
            <Nav className="text-[color:var(--surface-brand-primary-2)]" />
          </div>

          {/* Giant centered wordmark, visible before the reveal */}
          <div
            style={{ opacity: bigLogoOpacity }}
            className="absolute left-1/2 top-1/2 w-[78vw] max-w-[1000px] -translate-x-1/2 -translate-y-1/2"
          >
            <div style={{ transform: `scale(${bigLogoScale})` }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/ubc-wordmark-two-line.svg"
                alt="Unsupervised Baking Co."
                className="w-full h-auto"
              />
            </div>
          </div>

          {/* Torn orange reveal layer */}
          <div
            className="absolute inset-0"
            style={{
              backgroundColor: "var(--surface-brand-primary)",
              clipPath,
              WebkitClipPath: clipPath,
            }}
          >
            <div className="relative flex h-full w-full flex-col items-center justify-center gap-8 px-6 sm:gap-10 md:gap-12">
              {/* decorative scatter */}
              <div
                className="pointer-events-none absolute inset-0 hidden overflow-hidden md:block"
                aria-hidden
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/illustration-orb-b.png"
                  alt=""
                  className="absolute -left-16 top-[10%] w-[22vw] max-w-[300px] -rotate-6 opacity-90"
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/illustration-swirl.png"
                  alt=""
                  className="absolute right-[4%] top-[18%] w-[14vw] max-w-[180px] rotate-6 opacity-90"
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/illustration-ribbon.png"
                  alt=""
                  className="absolute bottom-[6%] left-[8%] w-[20vw] max-w-[260px] rotate-3 opacity-90"
                />
              </div>

              <div
                style={{
                  opacity: smallLogoOpacity,
                  transform: `scale(${smallLogoScale})`,
                }}
                className="w-[120px] sm:w-[150px]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/ubc-wordmark-two-line-4.svg"
                  alt=""
                  className="w-full h-auto"
                />
              </div>

              <div
                style={{
                  opacity: copyOpacity,
                  transform: `translateY(${copyY}px)`,
                }}
                className="flex flex-col items-center gap-6 sm:gap-8"
              >
                <p
                  className="max-w-[1000px] text-center uppercase text-[color:var(--surface-brand-primary-2)]"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 400,
                    fontSize: "clamp(2.25rem, 6.5vw, 6rem)",
                    lineHeight: 0.9,
                    letterSpacing: "-0.04em",
                  }}
                >
                  The best things happen in kitchens where no one&rsquo;s
                  watching.
                </p>
                <a
                  href="#find-us"
                  className="cta-label rounded-[4px] bg-[color:var(--surface-brand-primary-2)] px-5 py-[13px] text-[16px] text-[color:var(--text-on-dark-gray)] transition-transform hover:scale-[1.04] hover:brightness-110"
                >
                  Find us
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Binoculars illustration, normal document flow on the orange field */}
      <div className="relative flex h-[70vh] min-h-[420px] items-center justify-center overflow-hidden bg-brand-primary sm:h-[85vh]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/ubc-binoculars.png"
          alt="Illustration of a hand holding binoculars"
          className="relative w-[62vw] max-w-[560px] drop-shadow-xl"
        />
      </div>
    </div>
  );
}
