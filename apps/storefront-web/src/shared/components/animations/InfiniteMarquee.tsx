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
    <div style={{ position: "relative", width: "100%", overflow: "hidden", padding: "2rem 0" }}>
      <motion.div
        style={{ display: "flex", gap: "3rem", width: "max-content" }}
        animate={{ x: ["-50%", "0%"] }}
        transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
      >
        {loopedImages.map((src, idx) => (
          <div
            key={idx}
            style={{
              width: "320px",
              height: `${itemHeight}px`,
              flexShrink: 0,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              src={getImageUrl(src || "/images/about/model1.png")}
              alt={`Featured item ${idx + 1}`}
              width={288}
              height={Math.round(itemHeight * 0.9)}
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
