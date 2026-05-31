"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getTees, getJeans } from "@/shared/actions/catalogue";
import type { CatalogueProduct } from "@/features/catalogue/types";

import ProductCard from "@/shared/components/ui/ProductCard";
import AnimatedText from "@/shared/components/ui/AnimatedText";
import SectionLabel from "@/shared/components/ui/SectionLabel";

export default function DiscoverSection() {
  const [products, setProducts] = useState<CatalogueProduct[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [mobilePage, setMobilePage] = useState(0);
  const [mobileAnimDir, setMobileAnimDir] = useState<"up" | "down">("up");
  const [mobileIsAnimating, setMobileIsAnimating] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  
  useEffect(() => {
    async function loadProducts() {
      const [tees, jeans] = await Promise.all([getTees(), getJeans()]);
      const data = [...tees, ...jeans];
      setProducts(data);
      // Start in the middle of the triple-list for infinite feel
      setCurrentIndex(data.length > 0 ? data.length : 0);
    }
    loadProducts();
  }, []);

  const totalItems = products.length;
  const displayProducts = [...products, ...products, ...products];

  // Desktop carousel
  const handleNext = useCallback(() => {
    if (isAnimating || totalItems === 0) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => prev + 1);
  }, [isAnimating, totalItems]);

  const handlePrev = useCallback(() => {
    if (isAnimating || totalItems === 0) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => prev - 1);
  }, [isAnimating, totalItems]);

  // Handle wrap-around for infinite loop
  useEffect(() => {
    if (totalItems === 0) return;

    if (currentIndex >= totalItems * 2) {
      const timer = setTimeout(() => {
        setIsAnimating(false);
        setCurrentIndex(totalItems);
      }, 500); // Match transition duration
      return () => clearTimeout(timer);
    }
    if (currentIndex < totalItems) {
      const timer = setTimeout(() => {
        setIsAnimating(false);
        setCurrentIndex(totalItems * 2 - 1);
      }, 500);
      return () => clearTimeout(timer);
    }
    
    const timer = setTimeout(() => setIsAnimating(false), 500);
    return () => clearTimeout(timer);
  }, [currentIndex, totalItems]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, handlePrev]);

  // Mobile paged grid: 4 items per page (2x2)
  const ITEMS_PER_PAGE = 4;
  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
  const mobilePageProducts = products.slice(
    mobilePage * ITEMS_PER_PAGE,
    mobilePage * ITEMS_PER_PAGE + ITEMS_PER_PAGE
  );

  const handleMobileNext = useCallback(() => {
    if (mobileIsAnimating || totalPages <= 1) return;
    setMobileAnimDir("up");
    setMobileIsAnimating(true);
    setTimeout(() => {
      setMobilePage((p) => (p + 1) % totalPages);
      setMobileIsAnimating(false);
    }, 320);
  }, [mobileIsAnimating, totalPages]);

  const handleMobilePrev = useCallback(() => {
    if (mobileIsAnimating || totalPages <= 1) return;
    setMobileAnimDir("down");
    setMobileIsAnimating(true);
    setTimeout(() => {
      setMobilePage((p) => (p - 1 + totalPages) % totalPages);
      setMobileIsAnimating(false);
    }, 320);
  }, [mobileIsAnimating, totalPages]);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const rawYLeft = useTransform(scrollYProgress, [0, 1], [80, -40]);
  const rawYCards = useTransform(scrollYProgress, [0, 1], [60, -30]);

  const yLeft = useSpring(rawYLeft, { stiffness: 60, damping: 20 });
  const yCards = useSpring(rawYCards, { stiffness: 60, damping: 20 });

  // Calculate X offset: card width (300px) + gap (2rem = 32px) = 332px
  const cardWidthWithGap = 332;

  return (
    <section ref={sectionRef} className="discover-section">

      {/* Content */}
      <div className="discover-content">
        {/* Left sticky panel */}
        <motion.div className="discover-left" style={{ y: yLeft }}>
          <SectionLabel number="02" color="#111" />

          <AnimatedText text="Discover" as="h3" baseDelay={0} />
          <AnimatedText text="Koleksi Kami" as="h3" baseDelay={0.3} />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            Dari tees sampai hoodies, setiap piece dibuat dengan fabric innovation yang bikin lo nyaman seharian.
          </motion.p>

          <motion.button
            className="explore-btn"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => router.push("/catalogue")}
          >
            Explore Semua
            <span className="arrow-circle">
              <ArrowUpRight size={14} />
            </span>
          </motion.button>

          {/* Desktop Slider Controls */}
          <div className="slider-controls">
            <motion.button
              className="slider-nav-btn"
              onClick={handlePrev}
              whileHover={{ x: -3 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Previous slide"
            >
              <ChevronLeft size={20} />
            </motion.button>
            <motion.button
              className="slider-nav-btn"
              onClick={handleNext}
              whileHover={{ x: 3 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Next slide"
            >
              <ChevronRight size={20} />
            </motion.button>
          </div>
        </motion.div>

        {/* Right: Desktop Slider */}
        <div className="discover-right-container">
          <motion.div 
            className="discover-right" 
            style={{ y: yCards }}
            animate={{ x: -currentIndex * cardWidthWithGap }}
            transition={isAnimating ? { duration: 0.5, ease: [0.16, 1, 0.3, 1] } : { duration: 0 }}
          >
            {displayProducts.length > 0 ? (
              displayProducts.map((product, index) => (
                <ProductCard 
                  key={`${product.id}-${index}`} 
                  product={product} 
                  index={index % totalItems} 
                />
              ))
            ) : (
              <p className="loading-text">Loading products...</p>
            )}
          </motion.div>
        </div>

        {/* Mobile 2x2 paged grid */}
        <div className="discover-mobile-wrapper">
          <motion.div
            className="discover-mobile-grid"
            key={mobilePage}
            initial={{ opacity: 0, y: mobileAnimDir === "up" ? 40 : -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: mobileAnimDir === "up" ? -40 : 40 }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
          >
            {mobilePageProducts.map((product, index) => (
              <ProductCard
                key={`mobile-${product.id}-${mobilePage}`}
                product={product}
                index={index}
              />
            ))}
          </motion.div>

          {/* Mobile nav buttons */}
          {totalPages > 1 && (
            <div className="discover-mobile-nav">
              <motion.button
                className="discover-mobile-nav-btn"
                onClick={handleMobilePrev}
                whileTap={{ scale: 0.92 }}
                aria-label="Previous page"
              >
                <ChevronLeft size={18} />
              </motion.button>

              <div className="discover-mobile-dots">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    className={`discover-mobile-dot${i === mobilePage ? " active" : ""}`}
                    onClick={() => {
                      setMobileAnimDir(i > mobilePage ? "up" : "down");
                      setMobilePage(i);
                    }}
                    aria-label={`Page ${i + 1}`}
                  />
                ))}
              </div>

              <motion.button
                className="discover-mobile-nav-btn"
                onClick={handleMobileNext}
                whileTap={{ scale: 0.92 }}
                aria-label="Next page"
              >
                <ChevronRight size={18} />
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
