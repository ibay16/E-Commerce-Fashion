"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

interface SliderItem {
  id: string | number;
  name: string;
  role: string;
  bio: string;
  avatar: string;
  accent: string;
}

interface ImmersiveSlider3DProps {
  items: SliderItem[];
}

export default function ImmersiveSlider3D({ items }: ImmersiveSlider3DProps) {
  const [index, setIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [direction, setDirection] = useState(1);

  const next = useCallback(() => {
    setDirection(1);
    setIndex((prev) => (prev + 1) % items.length);
  }, [items.length]);

  const prev = useCallback(() => {
    setDirection(-1);
    setIndex((prev) => (prev - 1 + items.length) % items.length);
  }, [items.length]);

  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [isHovered, next]);

  const current = items[index];

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 80 : -80,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -80 : 80,
      opacity: 0,
    }),
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        width: "100%",
        maxWidth: "1100px",
        margin: "0 auto",
        padding: "0 2rem 4rem",
      }}
    >
      {/* Main Card */}
      <div style={{ position: "relative", overflow: "hidden" }}>
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={current.id}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "4rem",
              alignItems: "center",
              background: "#fff",
              borderRadius: "2rem",
              padding: "3rem",
              boxShadow: "0 40px 80px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.03)",
            }}
          >
            {/* Left: Image */}
            <div
              style={{
                position: "relative",
                aspectRatio: "3/4",
                borderRadius: "1.25rem",
                overflow: "hidden",
                background: "#f3f3f1",
              }}
            >
              <Image
                src={current.avatar}
                alt={current.name}
                fill
                style={{ objectFit: "cover" }}
                sizes="(max-width: 768px) 90vw, 420px"
                priority
              />
              {/* Accent overlay strip */}
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: "4px",
                  background: current.accent,
                }}
              />
            </div>

            {/* Right: Content */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {/* Index indicator */}
              <span
                style={{
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  color: "#aaa",
                }}
              >
                {String(index + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
              </span>

              {/* Name */}
              <div>
                <h3
                  style={{
                    fontSize: "clamp(1.8rem, 3vw, 2.5rem)",
                    fontWeight: 800,
                    color: "#111",
                    letterSpacing: "-0.03em",
                    lineHeight: 1.1,
                    margin: 0,
                  }}
                >
                  {current.name}
                </h3>

                {/* Role pill */}
                <div style={{ marginTop: "0.75rem" }}>
                  <span
                    style={{
                      display: "inline-block",
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      color: current.accent,
                      background: `${current.accent}18`,
                      padding: "0.35rem 0.85rem",
                      borderRadius: "2rem",
                      border: `1px solid ${current.accent}30`,
                    }}
                  >
                    {current.role}
                  </span>
                </div>
              </div>

              {/* Divider */}
              <div
                style={{
                  width: "40px",
                  height: "2px",
                  background: current.accent,
                  borderRadius: "2px",
                }}
              />

              {/* Bio */}
              <p
                style={{
                  fontSize: "1rem",
                  lineHeight: 1.75,
                  color: "#444",
                  fontWeight: 400,
                  margin: 0,
                }}
              >
                {current.bio}
              </p>

              {/* Navigation controls */}
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginTop: "0.5rem" }}>
                <button
                  onClick={prev}
                  aria-label="Previous"
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "50%",
                    border: "1.5px solid #e0e0e0",
                    background: "#fff",
                    color: "#111",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1rem",
                    transition: "all 0.25s ease",
                    flexShrink: 0,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#111";
                    e.currentTarget.style.color = "#fff";
                    e.currentTarget.style.borderColor = "#111";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#fff";
                    e.currentTarget.style.color = "#111";
                    e.currentTarget.style.borderColor = "#e0e0e0";
                  }}
                >
                  ←
                </button>
                <button
                  onClick={next}
                  aria-label="Next"
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "50%",
                    border: "1.5px solid #111",
                    background: "#111",
                    color: "#fff",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1rem",
                    transition: "all 0.25s ease",
                    flexShrink: 0,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#333";
                    e.currentTarget.style.borderColor = "#333";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#111";
                    e.currentTarget.style.borderColor = "#111";
                  }}
                >
                  →
                </button>

                {/* Dot indicators */}
                <div style={{ display: "flex", gap: "0.5rem", marginLeft: "0.5rem" }}>
                  {items.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => { setDirection(i > index ? 1 : -1); setIndex(i); }}
                      aria-label={`Slide ${i + 1}`}
                      style={{
                        width: i === index ? "24px" : "6px",
                        height: "6px",
                        borderRadius: "3px",
                        background: i === index ? current.accent : "#ddd",
                        border: "none",
                        cursor: "pointer",
                        padding: 0,
                        transition: "all 0.4s ease",
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Thumbnail strip */}
      <div
        style={{
          display: "flex",
          gap: "1rem",
          marginTop: "1.5rem",
          justifyContent: "center",
        }}
      >
        {items.map((item, i) => (
          <button
            key={item.id}
            onClick={() => { setDirection(i > index ? 1 : -1); setIndex(i); }}
            aria-label={`View ${item.name}`}
            style={{
              position: "relative",
              width: "56px",
              height: "56px",
              borderRadius: "50%",
              overflow: "hidden",
              border: `2.5px solid ${i === index ? item.accent : "transparent"}`,
              outline: i === index ? `2px solid ${item.accent}40` : "none",
              outlineOffset: "2px",
              cursor: "pointer",
              background: "#f3f3f1",
              padding: 0,
              transition: "all 0.3s ease",
              flexShrink: 0,
              opacity: i === index ? 1 : 0.5,
            }}
          >
            <Image
              src={item.avatar}
              alt={item.name}
              fill
              style={{ objectFit: "cover" }}
              sizes="56px"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
