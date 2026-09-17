"use client";

import { useEffect, useRef, useState } from "react";
import Nav from "./Nav";

/**
 * Pixel-accurate keyframes come from Figma's actual prototype (node 8:430),
 * which is a 4-step CLICK-through: 1 -> 2 -> 3 -> revealed. Per request, this
 * is driven by SCROLL instead of clicks — a deliberate departure from the
 * source file's own interaction model, not a fidelity gap. Scroll progress
 * (0..1) is split into three equal thirds:
 *   [0, 1/3)   torn mask grows from state 1 -> state 2
 *   [1/3, 2/3) torn mask grows from state 2 -> state 3 (== fully covering)
 *   [2/3, 1]   mask stays fixed; headline/CTA fade in, logo shrinks to its
 *              resting spot above the headline, nav fades in, pattern shifts
 *              — mirroring Figma's own state-3 -> Variant5 step, which only
 *              changes those properties (never the mask).
 *
 * All layout is expressed as % of the 1440x820 Figma canvas so it scales
 * responsively via the aspect-ratio container.
 */

const MASKS: Record<1 | 2 | 3, { src: string; w: number; h: number; x: number; y: number }> = {
  1: { src: "/images/tear-mask-intro-collapsed.svg", w: 261.237, h: 253.449, x: -160.118, y: 760.976 },
  2: { src: "/images/tear-mask-state2.svg", w: 1312.236, h: 1095.449, x: -160.118, y: -81.024 },
  3: { src: "/images/tear-mask-intro-expanded.svg", w: 2477.236, h: 2028.449, x: -160.118, y: -1014.024 },
};

const pct = (v: number, base: number) => (v / base) * 100;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

type PatternItem = {
  src: string;
  outerW: number;
  outerH: number;
  innerScale?: number; // for wrapper+inner icon items
  rotateDeg?: number;
  flipX?: boolean;
  crop?: { top: number; left: number; w: number; h: number }; // % overscan crop
  mask?: { src: string; w: number; h: number; x: number; y: number }; // % of own box
  a: { top?: number; bottom?: number; left?: number; centerX?: number; centerY?: number };
  b: { top?: number; bottom?: number; left?: number; centerX?: number; centerY?: number };
};

const PATTERN_ITEMS: PatternItem[] = [
  {
    // snail + gramophone
    src: "/images/illustration-swirl.png",
    outerW: 292,
    outerH: 254,
    flipX: true,
    crop: { top: -8.41, left: -10.48, w: 116.54, h: 134.07 },
    a: { top: pct(-57, 820), centerX: pct(50, 100) - pct(328, 1440) },
    b: { top: pct(-274, 820), centerX: pct(50, 100) - pct(328, 1440) },
  },
  {
    // mirror + piping hand
    src: "/images/illustration-orb-a.png",
    outerW: 396.486,
    outerH: 396.486,
    a: { bottom: pct(18.51, 820), left: pct(1063, 1440) },
    b: { bottom: pct(18.51, 820), left: pct(1385, 1440) },
  },
  {
    // masked bird-carriage composite
    src: "/images/illustration-orb-b.png",
    outerW: 566.615,
    outerH: 318.891,
    mask: { src: "/images/illustration-orb-mask.svg", w: pct(524.19, 566.615), h: pct(298.27, 318.891), x: pct(20.262, 566.615), y: pct(17.493, 318.891) },
    a: { top: pct(-72.49, 820), left: pct(975.74, 1440) },
    b: { top: pct(-72.49, 820), left: pct(1408.74, 1440) },
  },
  {
    // butterfly-key, small, rotated
    src: "/images/illustration-treat.png",
    outerW: 122.152,
    outerH: 122.152,
    innerScale: 0.729,
    rotateDeg: -31.01,
    a: { top: pct(7, 820), left: pct(799.12, 1440) },
    b: { top: pct(-227, 820), left: pct(799.12, 1440) },
  },
  {
    src: "/images/illustration-treat.png",
    outerW: 220.197,
    outerH: 220.197,
    innerScale: 0.791,
    rotateDeg: 18.33,
    a: { top: pct(48.4, 820), left: pct(596, 1440) },
    b: { top: pct(-185.6, 820), left: pct(596, 1440) },
  },
  {
    // kid + dog
    src: "/images/illustration-ribbon.png",
    outerW: 411,
    outerH: 327,
    flipX: true,
    a: { bottom: pct(-49, 820), left: pct(410, 1440) },
    b: { bottom: pct(-305, 820), left: pct(410, 1440) },
  },
  {
    // bicycle woman + cherry hand
    src: "/images/illustration-blob.png",
    outerW: 589.318,
    outerH: 668.171,
    flipX: true,
    crop: { top: -11.55, left: -37.76, w: 145.27, h: 119.06 },
    a: { centerY: pct(50, 100) + pct(48.09, 820), centerX: pct(50, 100) - pct(703.34, 1440) },
    b: { centerY: pct(50, 100) + pct(48.09, 820), centerX: pct(50, 100) - pct(1021.34, 1440) },
  },
  {
    src: "/images/illustration-treat.png",
    outerW: 142.244,
    outerH: 142.244,
    innerScale: 0.7199,
    rotateDeg: 34.23,
    a: { top: pct(598, 820), left: pct(891, 1440) },
    b: { top: pct(810, 820), left: pct(891, 1440) },
  },
];

// Interpolate a pattern item's position; `a` and `b` share the same keys per item.
function patternStyle(
  a: PatternItem["a"],
  b: PatternItem["a"],
  t: number,
  outerW: number,
  outerH: number
): React.CSSProperties {
  const style: React.CSSProperties = {
    width: `${pct(outerW, 1440)}%`,
    height: `${pct(outerH, 820)}%`,
  };
  const transforms: string[] = [];
  if (a.centerX !== undefined && b.centerX !== undefined) {
    style.left = `${lerp(a.centerX, b.centerX, t)}%`;
    transforms.push("translateX(-50%)");
  } else if (a.left !== undefined && b.left !== undefined) {
    style.left = `${lerp(a.left, b.left, t)}%`;
  }
  if (a.centerY !== undefined && b.centerY !== undefined) {
    style.top = `${lerp(a.centerY, b.centerY, t)}%`;
    transforms.push("translateY(-50%)");
  } else if (a.top !== undefined && b.top !== undefined) {
    style.top = `${lerp(a.top, b.top, t)}%`;
  } else if (a.bottom !== undefined && b.bottom !== undefined) {
    style.bottom = `${lerp(a.bottom, b.bottom, t)}%`;
  }
  if (transforms.length) style.transform = transforms.join(" ");
  return style;
}

// Big-centered (steps 1-3) -> small-above-headline (revealed) logo geometry.
const LOGO_BIG = { top: 50, w: pct(1000, 1440), h: pct(211.864, 820) };
const LOGO_SMALL = { top: 50 - pct(360, 820), w: pct(151.04, 1440), h: pct(32, 820) };

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

  // Mask growth: two thirds of the scroll, 1 -> 2 -> 3.
  let mask;
  if (progress < 1 / 3) {
    const t = progress * 3;
    const from = MASKS[1];
    const to = MASKS[2];
    mask = { src: from.src, w: lerp(from.w, to.w, t), h: lerp(from.h, to.h, t), x: lerp(from.x, to.x, t), y: lerp(from.y, to.y, t) };
  } else if (progress < 2 / 3) {
    const t = (progress - 1 / 3) * 3;
    const from = MASKS[2];
    const to = MASKS[3];
    mask = { src: from.src, w: lerp(from.w, to.w, t), h: lerp(from.h, to.h, t), x: lerp(from.x, to.x, t), y: lerp(from.y, to.y, t) };
  } else {
    mask = MASKS[3];
  }

  // Reveal (content) progress: final third of the scroll, 3 -> Variant5.
  const reveal = progress < 2 / 3 ? 0 : (progress - 2 / 3) * 3;

  return (
    <div>
      {/* Extra scroll room drives the reveal; the hero itself stays pinned. */}
      <section ref={sectionRef} className="relative h-[300vh]">
        <div
          className="sticky top-0 h-[100dvh] w-full overflow-hidden bg-brand-primary-2 sm:h-auto sm:aspect-[1440/820]"
          style={{ containerType: "size" }}
        >
          {/* Background wordmark — always full size/position; the mask layer above it
              simply paints over more of it as the reveal grows. */}
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{ width: `${pct(1000, 1440)}%`, height: `${pct(211.864, 820)}%` }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/ubc-wordmark-two-line.svg"
              alt="Unsupervised Baking Co."
              className="h-full w-full"
            />
          </div>

          <div
            className="absolute inset-0"
            style={{
              backgroundColor: "var(--surface-brand-primary)",
              WebkitMaskImage: `url(${mask.src})`,
              maskImage: `url(${mask.src})`,
              WebkitMaskRepeat: "no-repeat",
              maskRepeat: "no-repeat",
              WebkitMaskSize: `${pct(mask.w, 1440)}% ${pct(mask.h, 820)}%`,
              maskSize: `${pct(mask.w, 1440)}% ${pct(mask.h, 820)}%`,
              // NOTE: mask-position percentages are relative to (container - image)
              // size, which breaks down once the mask is larger than its box with a
              // large negative offset (our fully-revealed case) — the mask ends up
              // shifted entirely off-canvas, rendering as fully hidden. Container
              // query units behave as simple linear offsets instead, so they
              // reproduce Figma's pixel-based mask-position at any container width.
              WebkitMaskPosition: `${pct(mask.x, 1440)}cqw ${pct(mask.y, 820)}cqh`,
              maskPosition: `${pct(mask.x, 1440)}cqw ${pct(mask.y, 820)}cqh`,
            }}
          >
            {/* Decorative pattern scatter, hidden on very small screens */}
            <div className="pointer-events-none absolute inset-0 hidden overflow-visible sm:block" aria-hidden>
              {PATTERN_ITEMS.map((item, i) => (
                <div
                  key={i}
                  className="absolute flex items-center justify-center"
                  style={patternStyle(item.a, item.b, reveal, item.outerW, item.outerH)}
                >
                  <div
                    style={{
                      width: item.innerScale ? `${item.innerScale * 100}%` : "100%",
                      height: item.innerScale ? `${item.innerScale * 100}%` : "100%",
                      transform: [
                        item.rotateDeg ? `rotate(${item.rotateDeg}deg)` : "",
                        item.flipX ? "scaleX(-1)" : "",
                      ]
                        .filter(Boolean)
                        .join(" "),
                    }}
                  >
                    {item.mask ? (
                      <div
                        className="h-full w-full"
                        style={{
                          WebkitMaskImage: `url(${item.mask.src})`,
                          maskImage: `url(${item.mask.src})`,
                          WebkitMaskRepeat: "no-repeat",
                          maskRepeat: "no-repeat",
                          WebkitMaskSize: `${item.mask.w}% ${item.mask.h}%`,
                          maskSize: `${item.mask.w}% ${item.mask.h}%`,
                          WebkitMaskPosition: `${item.mask.x}% ${item.mask.y}%`,
                          maskPosition: `${item.mask.x}% ${item.mask.y}%`,
                        }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={item.src} alt="" className="h-full w-full object-cover" />
                      </div>
                    ) : item.crop ? (
                      <div className="relative h-full w-full overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.src}
                          alt=""
                          className="absolute max-w-none"
                          style={{
                            top: `${item.crop.top}%`,
                            left: `${item.crop.left}%`,
                            width: `${item.crop.w}%`,
                            height: `${item.crop.h}%`,
                          }}
                        />
                      </div>
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.src} alt="" className="h-full w-full object-cover" />
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Foreground wordmark: shrinks from big+centered to sit above the headline as reveal completes */}
            <div
              className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{
                top: `${lerp(LOGO_BIG.top, LOGO_SMALL.top, reveal)}%`,
                width: `${lerp(LOGO_BIG.w, LOGO_SMALL.w, reveal)}%`,
                height: `${lerp(LOGO_BIG.h, LOGO_SMALL.h, reveal)}%`,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={reveal > 0.5 ? "/images/ubc-wordmark-two-line-4.svg" : "/images/ubc-wordmark-two-line.svg"}
                alt=""
                className="h-full w-full"
              />
            </div>

            {/* Copy block: fades in as reveal completes */}
            <div
              className="absolute left-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-8 px-6 sm:gap-10 md:gap-12"
              style={{
                top: `${50 + pct(23.5, 820)}%`,
                width: `${pct(1352, 1440)}%`,
                opacity: reveal,
              }}
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

          {/* Site nav — its maroon text only reads against the revealed orange
              field, so it fades in with the reveal rather than sitting on top
              of the maroon background where it would be illegible. */}
          <div
            className="pointer-events-none absolute inset-x-0 top-0 z-30"
            style={{ opacity: reveal }}
          >
            <Nav className="pointer-events-auto text-[color:var(--surface-brand-primary-2)]" />
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
