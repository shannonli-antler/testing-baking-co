"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const EVENTS = [
  {
    name: "Queens Night Market",
    address: ["90 Kent Ave", "Brooklyn, NY, 11249"],
    date: ["08.29.2026", "11am–6pm"],
  },
  {
    name: "Smorgasburg Brooklyn",
    address: ["90 Kent Ave", "Brooklyn, NY, 11249"],
    date: ["08.29.2026", "11am–6pm"],
  },
  {
    name: "Sheep & Wool Festival",
    address: ["Dutchess County Fairgrounds in Rhinebeck, New York"],
    date: ["October 15 to", "October 18, 2026"],
  },
];

function EventCard({ event }: { event: (typeof EVENTS)[number] }) {
  return (
    <div className="flex w-full max-w-[800px] flex-col items-center gap-6 text-center">
      <p
        className="w-full uppercase text-[color:var(--text-brand-secondary-8)]"
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 400,
          lineHeight: 0.9,
          letterSpacing: "-0.03em",
          fontSize: "clamp(1.75rem, 6vw, 6rem)",
        }}
      >
        {event.name}
      </p>
      <div
        className="max-w-[280px] text-[color:var(--text-brand-secondary-8)]"
        style={{
          fontFamily: "var(--font-display)",
          fontStyle: "italic",
          lineHeight: 1.24,
          letterSpacing: "-0.03em",
          fontSize: "clamp(1rem, 2vw, 1.5rem)",
        }}
      >
        {event.address.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>
      <div
        className="max-w-[280px] text-[color:var(--text-brand-secondary-8)]"
        style={{
          fontFamily: "var(--font-display)",
          fontStyle: "italic",
          lineHeight: 1.24,
          letterSpacing: "-0.03em",
          fontSize: "clamp(1rem, 2vw, 1.5rem)",
        }}
      >
        {event.date.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>
    </div>
  );
}

export default function PopupCarousel() {
  const [index, setIndex] = useState(1);

  const go = (dir: 1 | -1) =>
    setIndex((i) => (i + dir + EVENTS.length) % EVENTS.length);

  return (
    <section className="relative flex flex-col items-center justify-end overflow-hidden bg-secondary-yellow pt-16 sm:pt-20">
      <div className="pointer-events-none absolute inset-x-0 bottom-[8%] flex justify-center opacity-20" aria-hidden>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/footer-eye-motif-mask.png"
          alt=""
          className="w-[140px] sm:w-[190px]"
        />
      </div>

      <div className="flex w-full flex-col items-center gap-10 border-b border-[color:var(--stroke-brand-secondary-yellow)] px-5 pb-16 sm:gap-14 sm:pb-24 md:px-11">
        <p className="eyebrow text-[14px] text-[color:var(--text-brand-secondary-8)] sm:text-[16px]">
          Next Pop Up @
        </p>

        <div className="relative flex w-full min-h-[260px] items-center justify-center overflow-hidden px-5 sm:min-h-[300px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="w-full"
            >
              <EventCard event={EVENTS[index]} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="flex w-full max-w-[1440px] items-center justify-between px-5 py-10 sm:py-14 md:px-11">
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous pop up"
          className="group flex flex-col items-center gap-3 px-2 py-1"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/arrow-hand-2.svg"
            alt=""
            className="h-6 w-auto -scale-x-100 transition-transform group-hover:-translate-x-1"
          />
          <span className="eyebrow text-[13px] text-[color:var(--text-brand-secondary-8)] sm:text-[16px]">
            Previous
          </span>
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Next pop up"
          className="group flex flex-col items-center gap-3 px-2 py-1"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/arrow-hand-2.svg"
            alt=""
            className="h-6 w-auto transition-transform group-hover:translate-x-1"
          />
          <span className="eyebrow text-[13px] text-[color:var(--text-brand-secondary-8)] sm:text-[16px]">
            Next
          </span>
        </button>
      </div>
    </section>
  );
}
