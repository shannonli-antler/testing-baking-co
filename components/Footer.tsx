"use client";

import { useState } from "react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  };

  return (
    <footer className="flex flex-col items-center gap-16 bg-on-cream px-5 py-16 text-[color:var(--text-on-dark-gray)] sm:gap-20 sm:px-11 sm:py-20">
      <div className="eyebrow flex w-full max-w-[1352px] flex-wrap items-center justify-center gap-x-8 gap-y-3 text-center text-[13px] sm:justify-between sm:text-[16px]">
        <a href="#about" className="transition-opacity hover:opacity-60">
          About
        </a>
        <a href="#contact" className="transition-opacity hover:opacity-60">
          Contact Us
        </a>
        <a href="#follow" className="transition-opacity hover:opacity-60">
          Follow Us
        </a>
        <a href="#press" className="transition-opacity hover:opacity-60">
          Press
        </a>
      </div>

      <div className="flex flex-col items-center gap-10 sm:gap-12">
        <div className="relative h-[70px] w-[70px] sm:h-[100px] sm:w-[100px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/footer-eye-motif-mask.png"
            alt=""
            className="h-full w-full object-contain opacity-90"
          />
        </div>

        <div className="flex w-full max-w-[600px] flex-col items-center gap-8 sm:gap-12">
          <div className="flex flex-col items-center gap-4 text-center sm:gap-8">
            <p className="eyebrow text-[14px] sm:text-[16px]">Newsletter</p>
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 500,
                lineHeight: 1.24,
                letterSpacing: "-0.03em",
                fontSize: "clamp(1.25rem, 3vw, 1.5rem)",
              }}
            >
              Stay up to speed on all things unsupervised
            </p>
          </div>

          {submitted ? (
            <p className="eyebrow text-[14px] text-[color:var(--text-on-dark-gray)]">
              You&rsquo;re on the list. See you in the kitchen.
            </p>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex w-full flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:gap-[27px]"
            >
              <label className="flex h-[44px] flex-1 items-center border-b border-[color:var(--stroke-white)]">
                <span className="sr-only">Email</span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="cta-label w-full bg-transparent text-[16px] text-[color:var(--text-on-dark-gray)] placeholder:text-[color:var(--text-on-dark-gray)] placeholder:opacity-80 focus:outline-none"
                />
              </label>
              <button
                type="submit"
                className="cta-label shrink-0 rounded-[4px] bg-cream-200 px-5 py-[13px] text-[16px] text-[color:var(--text-on-white)] transition-transform hover:scale-[1.04] hover:brightness-95"
              >
                Submit
              </button>
            </form>
          )}
        </div>
      </div>

      <div className="flex w-full max-w-[1352px] flex-col items-start gap-8 sm:gap-8">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/ubc-wordmark-single-line.svg"
          alt="Unsupervised Baking Co."
          className="w-full h-auto"
        />
        <div className="eyebrow flex w-full flex-col items-center gap-3 text-center text-[12px] sm:flex-row sm:justify-between sm:text-[16px]">
          <p className="text-[color:var(--surface-cream-200)]">
            &copy; 2026 Unsupervised Baking Co.
          </p>
          <div className="flex items-center gap-3">
            <a href="#privacy" className="transition-opacity hover:opacity-60">
              Privacy
            </a>
            <a href="#terms" className="transition-opacity hover:opacity-60">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
