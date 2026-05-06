"use client";

import { useScroll } from "framer-motion";
import GlowOrb from "@/components/ui/GlowOrb";
import AboutHero from "@/components/sections/about/AboutHero";
import AboutStory from "@/components/sections/about/AboutStory";
import AboutTeam from "@/components/sections/about/AboutTeam";
import AboutValues from "@/components/sections/about/AboutValues";
import AboutCTA from "@/components/sections/about/AboutCTA";
import Footer from "@/components/layout/Footer";

export default function AboutPage() {
  const { scrollYProgress } = useScroll();

  return (
    <main className="min-h-screen bg-[#f5f5f3] relative overflow-hidden">
      {/* Decorative Orbs with correct types */}
      <GlowOrb color="rgba(156, 173, 143, 0.2)" size={800} top="-200px" right="-200px" />
      <GlowOrb color="rgba(155, 81, 224, 0.1)" size={600} bottom="-100px" left="-100px" />
      
      {/* Sections with required props */}
      <AboutHero scrollYProgress={scrollYProgress} />
      <AboutStory studioModel1="/images/model1.jpg" />
      <AboutValues />
      <AboutTeam />
      <AboutCTA />
      
      <Footer />
    </main>
  );
}
