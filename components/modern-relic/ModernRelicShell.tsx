"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type ReactNode } from "react";
import type { SiteSocialLink } from "@/data/deadsignal/content";

type ModernRelicShellProps = {
  children: ReactNode;
  socialLinks: SiteSocialLink[];
};

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "The Workshop", href: "/workshop" },
  { label: "Projects", href: "/projects" },
  { label: "Now", href: "/now" },
  { label: "Shop", href: "/shop" },
  { label: "Contact", href: "/contact" },
] as const;

export function ModernRelicShell({ children, socialLinks }: ModernRelicShellProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main className="mr-site">
      <div className="noise" />

      <header className="site-header">
        <Link className="brand" href="/" aria-label="Modern Relic Home" onClick={() => setMenuOpen(false)}>
          <Image src="/images/modern-relic/modern-relic-logo.png" alt="Modern Relic logo" width={48} height={48} className="brand-logo" />
          <span>Modern Relic</span>
        </Link>
        <button className="nav-toggle" aria-label="Toggle navigation" onClick={() => setMenuOpen((open) => !open)}>
          ☰
        </button>
        <nav className={`nav ${menuOpen ? "open" : ""}`}>
          {navLinks.map((link) => (
            <Link key={link.label} href={link.href} onClick={() => setMenuOpen(false)}>
              {link.label}
            </Link>
          ))}
        </nav>
      </header>

      {children}

      <footer className="footer">
        <div>
          <strong>Modern Relic</strong>
          <p>Old Soul. Modern Tools.</p>
          <p className="builder-credit">
            <a href="https://deadsignal.co" target="_blank" rel="noopener noreferrer">
              Built &amp; Managed by DeadSignal
            </a>
          </p>
        </div>
        <div className="footer-links">
          {socialLinks.map((link) => (
            <a key={link.platform} href={link.url} target="_blank" rel="noopener noreferrer">
              {link.platform}
            </a>
          ))}
        </div>
      </footer>

      <style jsx global>{`
        .mr-site {
          --black: #080807;
          --charcoal: #181512;
          --bone: #e8e1d4;
          --muted: #b8aa92;
          --brass: #b08d57;
          --line: rgba(232, 225, 212, 0.16);
          --shadow: rgba(0, 0, 0, 0.45);
          margin: 0;
          padding: 0;
          border: 0;
          width: 100%;
          background: var(--black);
          color: var(--bone);
          font-family: var(--font-modern-relic-montserrat), Arial, sans-serif;
          line-height: 1.65;
          position: relative;
          isolation: isolate;
          min-height: 100vh;
        }

        .mr-site * {
          box-sizing: border-box;
        }

        .mr-site a {
          color: inherit;
        }

        .noise {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 10;
          opacity: 0.25;
          background: radial-gradient(circle at 18% 12%, rgba(176, 141, 87, 0.18), transparent 28%),
            linear-gradient(rgba(255, 255, 255, 0.025) 1px, transparent 1px);
          background-size: auto, 100% 4px;
        }

        .site-header {
          position: sticky;
          top: 0;
          z-index: 50;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 5vw;
          background: rgba(8, 8, 7, 0.9);
          border-bottom: 1px solid var(--line);
          backdrop-filter: blur(14px);
        }

        .brand {
          display: flex;
          gap: 12px;
          align-items: center;
          text-decoration: none;
          text-transform: uppercase;
          font-family: var(--font-modern-relic-cinzel), serif;
          font-weight: 800;
          letter-spacing: 0.08em;
        }

        .brand-logo {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          object-fit: cover;
        }

        .nav {
          display: flex;
          gap: 22px;
          align-items: center;
        }

        .nav a {
          text-decoration: none;
          text-transform: uppercase;
          font-size: 0.76rem;
          letter-spacing: 0.16em;
          color: var(--muted);
          font-weight: 700;
        }

        .nav a:hover {
          color: var(--bone);
        }

        .nav-toggle {
          display: none;
          background: none;
          border: 1px solid var(--line);
          color: var(--bone);
          font-size: 1.4rem;
          padding: 6px 10px;
        }

        .hero {
          min-height: 88vh;
          display: grid;
          place-items: center;
          text-align: center;
          padding: 120px 5vw;
          background: linear-gradient(90deg, rgba(8, 8, 7, 0.92), rgba(8, 8, 7, 0.55), rgba(8, 8, 7, 0.92)),
            url('/images/modern-relic/hero-workshop.png') center / cover no-repeat;
        }

        .hero-inner {
          max-width: 1050px;
        }

        .eyebrow {
          text-transform: uppercase;
          color: var(--brass);
          font-weight: 800;
          letter-spacing: 0.25em;
          font-size: 0.78rem;
        }

        .mr-site h1,
        .mr-site h2,
        .mr-site h3 {
          font-family: var(--font-modern-relic-cinzel), serif;
          text-transform: uppercase;
          line-height: 1.05;
          margin: 0 0 18px;
        }

        .mr-site h1 {
          font-size: clamp(3.8rem, 11vw, 9rem);
          letter-spacing: 0.04em;
          text-shadow: 0 20px 50px #000;
        }

        .mr-site h2 {
          font-size: clamp(2.1rem, 5vw, 4.5rem);
        }

        .mr-site h3 {
          font-size: 1.55rem;
        }

        .hero-sub {
          font-size: clamp(1.1rem, 2vw, 1.45rem);
          max-width: 850px;
          margin: 0 auto 34px;
          color: #d8cfbf;
        }

        .btn {
          display: inline-block;
          margin: 8px;
          padding: 14px 24px;
          text-decoration: none;
          text-transform: uppercase;
          font-size: 0.78rem;
          letter-spacing: 0.16em;
          font-weight: 800;
          border: 1px solid var(--brass);
        }

        .btn.primary {
          background: var(--brass);
          color: var(--black);
        }

        .btn.secondary {
          background: rgba(0, 0, 0, 0.35);
          color: var(--bone);
        }

        .ticker {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          background: var(--charcoal);
          border-top: 1px solid var(--line);
          border-bottom: 1px solid var(--line);
        }

        .ticker span {
          text-align: center;
          padding: 22px;
          font-family: var(--font-modern-relic-cinzel), serif;
          text-transform: uppercase;
          letter-spacing: 0.18em;
          color: var(--brass);
          font-weight: 800;
          border-right: 1px solid var(--line);
        }

        .section {
          max-width: 1280px;
          margin: 0 auto;
          padding: 86px 5vw;
        }

        .intro-grid,
        .split,
        .about-layout,
        .contact-grid {
          display: grid;
          grid-template-columns: 0.9fr 1.1fr;
          gap: 48px;
          align-items: start;
        }

        .copy p,
        .story p,
        .split p,
        .contact-card p,
        .video-section p,
        .maker-info p {
          color: var(--muted);
          font-size: 1.05rem;
        }

        .cards-section {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 18px;
        }

        .card,
        .project-card,
        .contact-card,
        .maker-card {
          background: linear-gradient(145deg, rgba(255, 255, 255, 0.055), rgba(255, 255, 255, 0.015));
          border: 1px solid var(--line);
          box-shadow: 0 25px 70px var(--shadow);
          padding: 28px;
        }

        .card {
          min-height: 230px;
        }

        .card p {
          color: var(--muted);
        }

        .feature {
          padding: 100px 5vw;
          background: linear-gradient(90deg, rgba(8, 8, 7, 0.86), rgba(8, 8, 7, 0.6)),
            url('/images/modern-relic/about-workshop.png') center / cover no-repeat;
          border-top: 1px solid var(--line);
          border-bottom: 1px solid var(--line);
        }

        .feature-content {
          max-width: 720px;
        }

        .feature p {
          color: #d6cbb8;
          font-size: 1.1rem;
        }

        .big-link {
          display: grid;
          place-items: center;
          min-height: 180px;
          text-align: center;
          text-decoration: none;
          border: 1px solid var(--brass);
          font-family: var(--font-modern-relic-cinzel), serif;
          text-transform: uppercase;
          font-size: 1.6rem;
          color: var(--brass);
          padding: 24px;
        }

        .page-hero {
          min-height: 48vh;
          display: grid;
          place-items: center;
          text-align: center;
          padding: 100px 5vw 80px;
          background: linear-gradient(90deg, rgba(8, 8, 7, 0.9), rgba(8, 8, 7, 0.62)),
            url('/images/modern-relic/hero-workshop.png') center / cover no-repeat;
          border-bottom: 1px solid var(--line);
        }

        .page-hero p {
          max-width: 780px;
          color: #d8cfbf;
          font-size: 1.15rem;
        }

        .page-hero h1 {
          font-size: clamp(3.8rem, 8.8vw, 7.2rem);
        }

        .shop-compact-hero {
          min-height: 260px;
          padding: 58px 5vw 48px;
        }

        .shop-compact-hero h1 {
          max-width: 900px;
          margin-left: auto;
          margin-right: auto;
          font-size: clamp(2.8rem, 5.5vw, 4.8rem);
        }

        .shop-compact-hero p {
          max-width: 720px;
          margin-left: auto;
          margin-right: auto;
        }

        .shop-feature-section {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(320px, 0.9fr);
          gap: 42px;
          align-items: center;
          padding-top: 54px;
          padding-bottom: 54px;
        }

        .shop-feature-media {
          min-height: 360px;
          display: grid;
          place-items: center;
          padding: 24px;
        }

        .shop-feature-copy h2 {
          font-size: clamp(2rem, 3.4vw, 3.25rem);
        }

        .shop-feature-price {
          color: var(--brass);
          font-size: 1.35rem;
          font-weight: 800;
          margin: 8px 0 16px;
        }

        .shop-info-cards {
          gap: 14px;
          padding-top: 34px;
          padding-bottom: 54px;
        }

        .shop-info-cards .card {
          min-height: 160px;
          padding: 20px;
        }

        .shop-info-cards h3 {
          font-size: 1.15rem;
        }

        .product-compact-banner {
          min-height: 200px;
          display: grid;
          place-items: center;
          text-align: center;
          padding: 46px 5vw 38px;
          background: linear-gradient(90deg, rgba(8, 8, 7, 0.92), rgba(8, 8, 7, 0.66)),
            url('/images/modern-relic/hero-workshop.png') center / cover no-repeat;
          border-bottom: 1px solid var(--line);
        }

        .product-banner-inner {
          max-width: 1040px;
        }

        .product-compact-banner h1 {
          font-size: clamp(2.45rem, 5vw, 4.6rem);
          margin-bottom: 10px;
        }

        .product-banner-price {
          color: var(--brass);
          font-size: 1.2rem;
          font-weight: 800;
          margin: 0;
        }

        .product-commerce-layout {
          display: grid;
          grid-template-columns: minmax(0, 1.1fr) minmax(330px, 0.9fr);
          gap: 48px;
          align-items: start;
          padding-top: 52px;
          padding-bottom: 58px;
        }

        .product-gallery {
          min-width: 0;
        }

        .product-main-image {
          min-height: 430px;
          display: grid;
          place-items: center;
          padding: 26px;
        }

        .product-main-image img {
          width: 100%;
          height: auto;
          max-height: 520px;
          object-fit: contain;
        }

        .product-buy-panel {
          position: sticky;
          top: 105px;
        }

        .product-buy-panel h2 {
          font-size: clamp(2rem, 3.6vw, 3.4rem);
        }

        .product-price {
          color: var(--brass);
          font-size: 1.45rem;
          font-weight: 800;
          margin: 8px 0 18px;
        }

        .product-description {
          color: var(--muted);
          font-size: 1rem;
        }

        .product-customize-button {
          margin: 20px 0 0;
        }

        #customize {
          scroll-margin-top: 110px;
        }

        .about-hero {
          background: linear-gradient(90deg, rgba(8, 8, 7, 0.9), rgba(8, 8, 7, 0.58)),
            url('/images/modern-relic/about-workshop.png') center / cover no-repeat;
        }

        .story {
          max-width: 820px;
        }

        .pullquote {
          font-size: 1.55rem !important;
          color: var(--brass) !important;
          font-family: var(--font-modern-relic-cinzel), serif;
          line-height: 1.25 !important;
        }

        .pullquote.small {
          font-size: 1.25rem !important;
        }

        .story h3 {
          margin-top: 44px;
          color: var(--brass);
        }

        .two-col-list {
          columns: 2;
          line-height: 2;
          color: var(--bone);
          padding-left: 20px;
        }

        .signature {
          font-family: var(--font-modern-relic-cinzel), serif;
          font-size: 1.3rem !important;
          color: var(--bone) !important;
          margin-top: 36px;
        }

        .signature span {
          color: var(--brass);
          font-size: 1rem;
          letter-spacing: 0.08em;
        }

        .sticky-image {
          position: sticky;
          top: 100px;
        }

        .sticky-image img {
          width: 100%;
          border: 1px solid var(--line);
          box-shadow: 0 25px 80px var(--shadow);
          height: auto;
        }

        .video-section {
          display: grid;
          grid-template-columns: 0.7fr 1.3fr;
          gap: 38px;
          align-items: center;
        }

        .video-frame {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 9;
          background: #000;
          border: 1px solid var(--line);
          box-shadow: 0 25px 80px var(--shadow);
        }

        .video-frame iframe {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          border: 0;
        }

        .project-list {
          display: grid;
          gap: 18px;
        }

        .project-card {
          display: grid;
          grid-template-columns: 90px 1fr 1fr;
          gap: 24px;
          align-items: start;
        }

        .project-card span {
          font-family: var(--font-modern-relic-cinzel), serif;
          color: var(--brass);
          font-size: 2rem;
        }

        .project-card p {
          color: var(--muted);
        }

        .maker-card {
          display: grid;
          grid-template-columns: 420px 1fr;
          gap: 42px;
          align-items: center;
        }

        .maker-photo {
          width: 100%;
          aspect-ratio: 1 / 1;
          object-fit: cover;
          display: block;
          border: 1px solid var(--line);
          box-shadow: 0 18px 55px rgba(0, 0, 0, 0.45);
          background: #111;
          height: auto;
        }

        .maker-title {
          color: var(--brass) !important;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          font-weight: 800;
          margin-top: 0;
        }

        .contact-form {
          display: flex !important;
          flex-direction: column !important;
          gap: 18px;
          margin-top: 24px;
        }

        .contact-form label {
          display: block;
          color: var(--brass);
          text-transform: uppercase;
          letter-spacing: 0.12em;
          font-size: 0.76rem;
          font-weight: 800;
        }

        .contact-form input,
        .contact-form select,
        .contact-form textarea {
          width: 100%;
          display: block;
          background: rgba(0, 0, 0, 0.35);
          color: var(--bone);
          border: 1px solid var(--line);
          padding: 14px;
          font-family: var(--font-modern-relic-montserrat), Arial, sans-serif;
          font-size: 1rem;
        }

        .contact-form button {
          cursor: pointer;
          width: fit-content;
        }

        .social-list {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }

        .social-list a {
          padding: 12px 16px;
          border: 1px solid var(--line);
          text-decoration: none;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          font-size: 0.78rem;
          color: var(--brass);
        }

        .footer {
          display: flex;
          justify-content: space-between;
          gap: 24px;
          padding: 34px 5vw;
          border-top: 1px solid var(--line);
          background: #070706;
          color: var(--muted);
        }

        .footer strong {
          font-family: var(--font-modern-relic-cinzel), serif;
          text-transform: uppercase;
          color: var(--bone);
        }

        .footer p {
          margin: 0.2rem 0;
        }

        .builder-credit {
          margin-top: 0.55rem;
          font-size: 0.78rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #b8aa92;
        }

        .builder-credit a {
          text-decoration: none;
          border-bottom: 1px solid rgba(176, 141, 87, 0.45);
          transition: color 140ms ease, border-color 140ms ease;
        }

        .builder-credit a:hover {
          color: #d5c3a4;
          border-color: rgba(176, 141, 87, 0.85);
        }

        .footer-links {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          align-items: center;
        }

        .footer-links a {
          text-decoration: none;
          color: var(--muted);
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .workbench-section {
          padding-top: 40px;
        }

        .workbench-card,
        .latest-card {
          background: linear-gradient(145deg, rgba(255, 255, 255, 0.055), rgba(255, 255, 255, 0.015));
          border: 1px solid var(--line);
          box-shadow: 0 25px 70px var(--shadow);
          padding: 34px;
        }

        .workbench-list {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin: 28px 0;
        }

        .workbench-list span {
          border: 1px solid var(--line);
          color: var(--brass);
          padding: 10px 14px;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          font-size: 0.72rem;
          font-weight: 800;
        }

        .latest-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 42px;
          align-items: center;
        }

        .latest-card h3 {
          color: var(--bone);
        }

        @media (max-width: 900px) {
          .site-header {
            align-items: flex-start;
          }

          .nav-toggle {
            display: block;
          }

          .nav {
            display: none;
            position: absolute;
            left: 0;
            right: 0;
            top: 77px;
            background: rgba(8, 8, 7, 0.98);
            padding: 22px 5vw;
            border-bottom: 1px solid var(--line);
            flex-direction: column;
            align-items: flex-start;
          }

          .nav.open {
            display: flex;
          }

          .hero {
            min-height: 78vh;
            padding-top: 90px;
          }

          .shop-compact-hero {
            min-height: auto;
            padding: 46px 5vw 38px;
          }

          .shop-compact-hero h1 {
            font-size: clamp(2.35rem, 10vw, 3.8rem);
          }

          .shop-feature-section,
          .product-commerce-layout {
            grid-template-columns: 1fr;
            gap: 28px;
          }

          .shop-feature-section {
            padding-top: 38px;
            padding-bottom: 42px;
          }

          .shop-feature-media {
            min-height: 300px;
          }

          .product-compact-banner {
            min-height: auto;
            padding: 42px 5vw 34px;
          }

          .product-compact-banner h1 {
            font-size: clamp(2.2rem, 10vw, 3.7rem);
          }

          .product-commerce-layout {
            padding-top: 38px;
            padding-bottom: 44px;
          }

          .product-main-image {
            min-height: 320px;
          }

          .product-buy-panel {
            position: static;
          }

          .ticker {
            grid-template-columns: repeat(2, 1fr);
          }

          .intro-grid,
          .split,
          .about-layout,
          .contact-grid,
          .video-section,
          .maker-card,
          .latest-section,
          .cards-section {
            grid-template-columns: 1fr;
          }

          .project-card {
            grid-template-columns: 1fr;
            gap: 8px;
          }

          .two-col-list {
            columns: 1;
          }

          .sticky-image {
            position: static;
            order: -1;
          }

          .maker-photo {
            max-width: 430px;
            margin: 0 auto;
          }

          .footer {
            flex-direction: column;
          }

          .builder-credit {
            font-size: 0.74rem;
            letter-spacing: 0.07em;
          }
        }
      `}</style>
    </main>
  );
}
