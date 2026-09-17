"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const SLIDES = [
  {
    number: "One",
    image: "/images/illustration-treat.png",
    quote:
      "The rules exist to be learned thoroughly before they are abandoned entirely.",
  },
  {
    number: "Two",
    image: "/images/illustration-swirl.png",
    quote: "A crumb on the counter is proof that something good just happened.",
  },
  {
    number: "Three",
    image: "/images/illustration-orb-a.png",
    quote: "Butter is not an ingredient. It is a philosophy.",
  },
  {
    number: "Four",
    image: "/images/illustration-ribbon.png",
    quote: "The best recipes are the ones nobody wrote down.",
  },
  {
    number: "Five",
    image: "/images/illustration-blob.png",
    quote: "If it didn't get a little messy, you weren't trying hard enough.",
  },
];

export default function BeliefsCarousel() {
  const [index, setIndex] = useState(0);

  const go = (dir: 1 | -1) =>
    setIndex((i) => (i + dir + SLIDES.length) % SLIDES.length);

  const slide = SLIDES[index];

  return (
    <section className="relative flex flex-col items-center justify-end overflow-hidden bg-cream-200 pt-8 pb-10 sm:pb-16">
      <div className="flex w-full max-w-[700px] flex-col items-center px-5">
        <div className="relative flex h-[220px] w-[220px] items-center justify-center overflow-visible sm:h-[320px] sm:w-[320px] md:h-[400px] md:w-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="absolute inset-0 flex items-center justify-center"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={slide.image}
                alt=""
                className="max-h-full max-w-full object-contain drop-shadow-md"
              />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-4 h-[44px] overflow-hidden text-center sm:mt-6">
          <AnimatePresence mode="wait">
            <motion.p
              key={index}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              style={{
                fontFamily: "var(--font-display)",
                fontStyle: "italic",
                fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
              }}
            >
              {slide.number}
            </motion.p>
          </AnimatePresence>
        </div>

        <div className="mt-4 flex h-[110px] items-start justify-center sm:mt-6 sm:h-[90px]">
          <AnimatePresence mode="wait">
            <motion.p
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="max-w-[600px] text-center uppercase text-[color:var(--text-on-white)]"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 400,
                lineHeight: 1.1,
                letterSpacing: "-0.01em",
                fontSize: "clamp(1.15rem, 2.6vw, 1.6rem)",
              }}
            >
              {slide.quote}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      <div className="mt-8 flex w-full max-w-[1440px] items-center justify-between px-5 sm:mt-10 md:px-11">
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous belief"
          className="group flex flex-col items-center gap-3 px-2 py-1"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/arrow-hand.svg"
            alt=""
            className="h-6 w-auto -scale-x-100 transition-transform group-hover:-translate-x-1"
          />
          <span className="eyebrow text-[13px] text-[color:var(--text-on-white)] sm:text-[16px]">
            Previous
          </span>
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Next belief"
          className="group flex flex-col items-center gap-3 px-2 py-1"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/arrow-hand.svg"
            alt=""
            className="h-6 w-auto transition-transform group-hover:translate-x-1"
          />
          <span className="eyebrow text-[13px] text-[color:var(--text-on-white)] sm:text-[16px]">
            Next
          </span>
        </button>
      </div>
    </section>
  );
}
