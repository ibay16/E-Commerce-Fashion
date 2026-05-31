"use client";
/**
 * shared/components/animations/InfiniteMarquee.tsx
 * SRP: Pure presentational animation component.
 * Receives image URLs via props — does NOT fetch data itself.
 * Callers are responsible for providing images.
 */
import { motion } from "framer-motion";
import Image from "next/image";
import { getImageUrl } from "@/shared/utils/image-utils";

interface InfiniteMarqueeProps {
  images: string[];
  /** Animation duration in seconds */
  speed?: number;
  /** Height of each item */
  itemHeight?: number;
}

export default function InfiniteMarquee({ images, speed = 25, itemHeight = 380 }: InfiniteMarqueeProps) {
  if (images.length === 0) return null;

  // Duplicate for seamless loop
  const loopedImages = [...images, ...images];

  return (
    <div className="marquee-wrapper" style={{ position: "relative", width: "100%", overflow: "hidden" }}>
      <motion.div
        className="marquee-track"
        style={{ display: "flex", gap: "2rem", width: "max-content" }}
        animate={{ x: ["-50%", "0%"] }}
        transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
      >
        {loopedImages.map((src, idx) => (
            <div
              className="marquee-item"
              key={idx}
              style={{
                width: "320px",
                height: `${itemHeight}px`,
                position: "relative",
                flexShrink: 0,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Image
                src={getImageUrl(src || "/images/about/model1.png")}
                alt={`Featured item ${idx + 1}`}
                className="marquee-image"
                fill
                sizes="(max-width: 768px) 30vw, 300px"
                style={{
                  objectFit: "contain",
                  filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.5))",
                }}
              />
            </div>
        ))}
      </motion.div>
    </div>
  );
}
