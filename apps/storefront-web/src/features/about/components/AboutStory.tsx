"use client";

import { motion } from "framer-motion";
import SectionLabel from "@/shared/components/ui/SectionLabel";
import RevealText from "@/shared/components/ui/RevealText";
import Image from "next/image";

interface AboutStoryProps {
  studioModel1: string;
}

export default function AboutStory({ studioModel1 }: AboutStoryProps) {
  return (
    <section style={{ position: "relative", zIndex: 10, padding: "15vh 2rem 15vh", background: "#f5f5f3" }}>
      <div className="about-story-grid" style={{ maxWidth: "1200px", margin: "0 auto", alignItems: "center" }}>

        <div style={{ position: "relative" }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            style={{
              width: "100%",
              aspectRatio: "4/5",
              borderRadius: "1.5rem",
              overflow: "hidden",
              boxShadow: "0 40px 80px rgba(0,0,0,0.06)",
              background: "#fff"
            }}
          >
            <Image src={studioModel1} alt="Studio Fashion" fill style={{ objectFit: "cover" }} sizes="(max-width: 768px) 100vw, 50vw" />
          </motion.div>

          <motion.div
            initial={{ x: -40, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="about-story-text-card"
          >
            <span style={{ fontSize: "0.7rem", fontWeight: 800, letterSpacing: "0.3em", color: "#999", textTransform: "uppercase", display: "block", marginBottom: "1rem" }}>
              Filosofi Kami
            </span>
            <p style={{ fontSize: "1.1rem", color: "#111", lineHeight: 1.5, fontWeight: 500, letterSpacing: "-0.01em" }}>
              &quot;Kesederhanaan adalah kunci dari gaya yang timeless.&quot;
            </p>
          </motion.div>
        </div>

        <div style={{ paddingLeft: "2rem" }}>
          <SectionLabel number="02" label="Origin Story" color="#aaa" />

          <div style={{ marginTop: "3rem", marginBottom: "4rem", overflow: "visible" }}>
            <RevealText
              text="Dirancang untuk mereka yang menjalani kehidupan modern setiap harinya."
              style={{
                fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
                fontWeight: 800,
                lineHeight: 1.1,
                letterSpacing: "-0.04em",
                color: "#111"
              }}
            />
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            style={{ fontSize: "1.15rem", lineHeight: 1.7, color: "#666", fontWeight: 400, maxWidth: "480px" }}
          >
            Novarium lahir di sebuah studio kecil dengan visi yang besar: menciptakan pakaian yang
            beradaptasi dengan kehidupan Anda, bukan sebaliknya. Kami memadukan technical fabrics
            dengan tailored silhouettes untuk menghadirkan essentials yang nyaman dikenakan
            sekaligus elegan dipandang.
          </motion.p>

          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ delay: 1, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            style={{ width: "80px", height: "3px", background: "#111", marginTop: "4rem", originX: 0 }}
          />
        </div>
      </div>
    </section>
  );
}
