"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

import SectionLabel from "@/shared/components/ui/SectionLabel";
import AnimatedText from "@/shared/components/ui/AnimatedText";
import GlowOrb from "@/shared/components/ui/GlowOrb";
import InfiniteMarquee from "@/shared/components/animations/InfiniteMarquee";
import { getCarouselImages } from "@/shared/actions/catalogue";

export default function ScienceSection() {
  const containerRef = useRef<HTMLElement>(null);
  const [carouselImages, setCarouselImages] = useState<string[]>([]);

  useEffect(() => {
    getCarouselImages().then(setCarouselImages);
  }, []);

  // Scroll animations
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const yHeading1 = useSpring(useTransform(scrollYProgress, [0, 1], [100, -80]), { stiffness: 50, damping: 20 });
  const yHeading2 = useSpring(useTransform(scrollYProgress, [0, 1], [150, -120]), { stiffness: 50, damping: 20 });
  const yDesc = useSpring(useTransform(scrollYProgress, [0, 1], [-50, 80]), { stiffness: 50, damping: 20 });
  const yFeatures = useSpring(useTransform(scrollYProgress, [0, 1], [200, -50]), { stiffness: 50, damping: 20 });
  const yMarquee = useSpring(useTransform(scrollYProgress, [0, 1], [80, -30]), { stiffness: 50, damping: 20 });

  return (
    <section ref={containerRef} className="science-section" style={{ backgroundColor: "#0a0a0a", color: "#ffffff", position: "relative", overflow: "hidden" }}>
      {/* Background with noise/grain effect */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.05,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      <GlowOrb color="rgba(155,81,224,0.15)" size={400} top="10%" left="-10%" duration={12} blur={80} />
      <GlowOrb color="rgba(39,174,96,0.1)" size={500} bottom="-10%" right="-10%" duration={15} blur={100} delay={2} />

      <div style={{ position: "relative", zIndex: 10 }}>
        {/* Header content */}
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 3rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <div style={{ flex: 1 }}>
              <SectionLabel number="03" color="rgba(255,255,255,0.4)" />

              <motion.div style={{ y: yHeading1 }}>
                <AnimatedText
                  text="Sains"
                  as="h2"
                  style={{
                    fontSize: "clamp(3rem, 7vw, 7rem)",
                    fontWeight: 700,
                    letterSpacing: "-0.04em",
                    lineHeight: 1,
                    marginTop: "1.5rem",
                  }}
                />
              </motion.div>
              
              <motion.div style={{ y: yHeading2 }}>
                <AnimatedText
                  text="Di Balik Kenyamanan"
                  as="h2"
                  style={{
                    fontSize: "clamp(3rem, 7vw, 7rem)",
                    fontWeight: 700,
                    letterSpacing: "-0.04em",
                    lineHeight: 1,
                    color: "#ffffff",
                  }}
                  baseDelay={0.3}
                />
              </motion.div>
            </div>

            <motion.div
              style={{ y: yDesc, flex: 1, maxWidth: "400px" }}
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <p style={{ fontSize: "1.1rem", lineHeight: 1.6, color: "rgba(255,255,255,0.7)" }}>
                Kita merancang fabric di level molekuler. Campuran modal, elastane, dan long-staple cotton bikin bajunya jatuh pas dan nggak gampang melar.
              </p>
            </motion.div>
          </div>

          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{
              width: "100%",
              height: "1px",
              background: "rgba(255,255,255,0.1)",
              marginTop: "4rem",
              transformOrigin: "left",
            }}
          />

          <motion.div style={{ y: yFeatures }} className="science-features-grid">
            {[
              {
                title: "Thermoregulasi",
                desc: "Bisa adaptasi sama suhu badan lo, bikin adem pas panas dan anget pas dingin.",
              },
              {
                title: "4-Way Stretch",
                desc: "Fleksibel ngikutin movement lo tanpa bikin kendor di bagian lutut atau sikut.",
              },
              {
                title: "Zero Pilling",
                desc: "Di-treat pakai bio-wash eksklusif biar permukaannya tetap smooth meskipun sering dicuci.",
              },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.9 + i * 0.15 }}
              >
                <h4 style={{ fontSize: "1.2rem", fontWeight: 600, marginBottom: "0.5rem" }}>{feature.title}</h4>
                <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.5 }}>{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Infinite Looping Carousel */}
      <motion.div
        className="science-marquee-container"
        style={{
          y: yMarquee,
          width: "100%",
          position: "relative",
          zIndex: 5,
        }}
      >
        <InfiniteMarquee images={carouselImages} speed={30} itemHeight={400} />
      </motion.div>
    </section>
  );
}
