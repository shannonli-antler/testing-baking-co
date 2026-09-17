import type { Metadata } from "next";
import { Fraunces } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: "variable",
  axes: ["opsz", "SOFT", "WONK"],
});

export const metadata: Metadata = {
  title: "Unsupervised Baking Co.",
  description:
    "Curiously delicious desserts, crafted with a spirit of mischief.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${fraunces.variable} antialiased`}>
      <body className="bg-cream-200 text-[color:var(--text-on-white)]">
        {children}
      </body>
    </html>
  );
}
