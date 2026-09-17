import Hero from "@/components/Hero";
import IntroHeadline from "@/components/IntroHeadline";
import WeBelieveSection from "@/components/WeBelieveSection";
import BeliefsCarousel from "@/components/BeliefsCarousel";
import PopupCarousel from "@/components/PopupCarousel";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="overflow-x-clip">
      <Hero />
      <IntroHeadline />
      <WeBelieveSection />
      <BeliefsCarousel />
      <PopupCarousel />
      <Footer />
    </main>
  );
}
