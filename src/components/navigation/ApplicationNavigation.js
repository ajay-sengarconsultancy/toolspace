"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./ApplicationNavigation.module.css";

const navigationItems = [
  { label: "Discover", href: "/discover" },
  { label: "Our Tools", href: "/our-tools" },
  { label: "Requests", href: "/requests" },
];

function isActivePath(pathname, href) {
  return (
    pathname === href ||
    (href === "/requests" && pathname.startsWith("/requests/")) ||
    (href === "/our-tools" && pathname.startsWith("/our-tools/"))
  );
}

export default function ApplicationNavigation() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link className={styles.wordmark} href="/" onClick={closeMenu}>
          toolspace<span className={styles.wordmarkDot}>.</span>
        </Link>

        <button
          className={`${styles.menuToggle} ${menuOpen ? styles.menuToggleOpen : ""}`}
          type="button"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
        </button>

        <div
          className={`${styles.navigationArea} ${menuOpen ? styles.navigationAreaOpen : ""}`}
          id="primary-navigation"
        >
          <nav className={styles.navigation} aria-label="Primary navigation">
            {navigationItems.map(({ label, href }) => {
              const active = isActivePath(pathname, href);

              return (
                <Link
                  className={`${styles.navLink} ${active ? styles.navLinkActive : ""}`}
                  href={href}
                  key={href}
                  aria-current={active ? "page" : undefined}
                  onClick={closeMenu}
                >
                  {label}
                </Link>
              );
            })}
          </nav>
          <Link className={styles.requestAction} href="/requests/new" onClick={closeMenu}>
            Request a Tool
            <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
