"use client";

import HeroSection from "@/features/home/components/HeroSection";
import EssentializedSection from "@/features/home/components/EssentializedSection";
import DiscoverSection from "@/features/home/components/DiscoverSection";

import ScienceSection from "@/features/home/components/ScienceSection";
import Navbar from "@/shared/components/layout/Navbar";

export default function HomePage() {
  return (
    <main style={{ width: "100%", display: "flex", flexDirection: "column" }}>
      {/* Section 1: Dark hero with cursor-following clothes */}
      <HeroSection />

      {/* Inline Sticky Navbar for Home Page */}
      <div style={{ position: "sticky", top: 0, zIndex: 100 }}>
        <Navbar isInline />
      </div>

      {/* Section 2: Essentialized - */}
      <EssentializedSection />

      {/* Section 3: Discover Reimagined - product grid */}
      <DiscoverSection />



      {/* Section 5: Science of Everyday Comfort */}
      <ScienceSection />
    </main>
  );
}
