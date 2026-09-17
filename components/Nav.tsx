type NavProps = {
  className?: string;
  logoSrc?: string;
};

export default function Nav({
  className = "",
  logoSrc = "/images/ubc-wordmark-two-line-5.svg",
}: NavProps) {
  return (
    <nav
      className={`flex items-center justify-between px-5 py-4 sm:px-8 md:px-11 md:py-5 ${className}`}
    >
      <a
        href="#about"
        className="eyebrow text-[13px] sm:text-[16px] transition-opacity hover:opacity-60"
      >
        About
      </a>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={logoSrc}
        alt="Unsupervised Baking Co."
        className="h-6 w-auto sm:h-7 md:h-8"
      />
      <a
        href="#contact"
        className="eyebrow text-[13px] sm:text-[16px] transition-opacity hover:opacity-60"
      >
        Contact
      </a>
    </nav>
  );
}
