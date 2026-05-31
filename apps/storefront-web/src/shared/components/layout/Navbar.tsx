"use client";

import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag } from "lucide-react";
import NavbarAuthStatus from "@/features/auth/NavbarAuthStatus";
import { useCart } from "@/core/providers/CartContext";
import styles from "@/shared/styles/Navbar.module.css";

interface NavbarProps {
  isInline?: boolean;
}

export default function Navbar({ isInline = false }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const pathname = usePathname();

  const isHome = pathname === "/";
  const isProfile = pathname === "/profile";

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (isProfile) {
      setScrolled(latest > 350);
    } else {
      setScrolled(latest > 50);
    }
  });

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  // If this is the global Navbar (not inline), and we are on home, do not render it!
  // The home page will render its own <Navbar isInline /> below the Hero.
  if (!isInline && isHome) return null;

  const baseClass = isInline ? styles.navbarSticky : (isProfile ? styles.navbarAbsolute : styles.navbar);
  const navbarClassName = [
    baseClass,
    scrolled ? styles.navbarScrolled : "",
    !scrolled && !isInline && isProfile ? styles.navbarTransparent : styles.navbarDefault,
  ]
    .filter(Boolean)
    .join(" ");

  const mainNavbarClassName = [
    styles.mainNavbar,
    scrolled || isInline || !isProfile ? styles.mainNavbarDark : styles.mainNavbarLight,
  ]
    .filter(Boolean)
    .join(" ");

  const isDark = scrolled || isInline || !isProfile;

  return (
    <>
      <nav className={navbarClassName}>
        <div className={mainNavbarClassName}>
          {/* Desktop: left links */}
          <div className={`${styles.navLinksGroup} nav-links-hidden-mobile`}>
            <Link href="/" className={styles.navLink}>Home</Link>
            <Link href="/catalogue" className={styles.navLink}>Katalog</Link>
            <Link href="/about" className={styles.navLink}>About Us</Link>
          </div>

          {/* Brand — always centered on desktop, left on mobile */}
          <Link href="/" className={styles.brand}>
            Novarium
          </Link>

          {/* Desktop: right actions */}
          <div className={`${styles.actionsGroup} nav-links-hidden-mobile`}>
            <CartLink />
            <NavbarAuthStatus />
          </div>

          {/* Mobile: cart icon + hamburger */}
          <div className={styles.mobileActions}>
            <CartLink iconOnly />
            <button
              className={`hamburger-btn${menuOpen ? " open" : ""}`}
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? "Tutup menu" : "Buka menu"}
              style={{ color: isDark ? "#111" : "#fff" }}
            >
              <span className="bar" />
              <span className="bar" />
              <span className="bar" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Full-Screen Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="mobile-menu-overlay open"
          >
            {/* Close button */}
            <button
              onClick={() => setMenuOpen(false)}
              className="hamburger-btn open"
              style={{ position: "absolute", top: "1.5rem", right: "1.5rem", color: "#111" }}
              aria-label="Tutup menu"
            >
              <span className="bar" />
              <span className="bar" />
              <span className="bar" />
            </button>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2rem" }}
            >
              {[
                { href: "/", label: "Home" },
                { href: "/catalogue", label: "Katalog" },
                { href: "/profile", label: "Profil" },
                { href: "/catalogue/cart", label: "My Cart" },
                { href: "/about", label: "About Us" },
              ].map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08 + i * 0.06, duration: 0.4 }}
                >
                  <Link
                    href={item.href}
                    className="mobile-menu-link"
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </motion.div>

            <div className="mobile-menu-bottom">
              <span className="mobile-menu-bottom-label">EST. 2024</span>
              <span className="mobile-menu-bottom-label">Novarium</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function CartLink({ iconOnly = false }: { iconOnly?: boolean }) {
  const { totalItems } = useCart();

  return (
    <Link href="/catalogue/cart" className={styles.cartLink}>
      {iconOnly ? (
        <>
          <ShoppingBag size={20} />
          {totalItems > 0 && (
            <span className={styles.cartBadge}>{totalItems}</span>
          )}
        </>
      ) : (
        <>
          My Cart
          {totalItems > 0 && (
            <span className={styles.cartBadge}>{totalItems}</span>
          )}
        </>
      )}
    </Link>
  );
}
