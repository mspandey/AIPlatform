"use client";

import React, { useState, useEffect } from 'react';
import { BENTO_ITEMS } from '@/lib/constants';

// ── Card background: Mystic Mint (#D9E8E2) — light surface on dark teal section
// ── Body text: Oceanic Noir (#172B36) — dark, readable on light background
// ── Accent/icon: Nocturnal (#114C5A) collapsed, Forsythia (#FFC801) active
// ── Section bg: linear-gradient #050A0E → #114C5A — unchanged
// Contrast verified: #172B36 on #D9E8E2 = approx 7.5:1 (WCAG AAA)

const CARD_BG         = '#D9E8E2'; // --color-mystic
const CARD_TEXT       = '#172B36'; // --color-oceanic  (dark body text)
const CARD_TEXT_MUTED = '#2E5060'; // mid-tone for description, readable on Mint
const CARD_ACCENT_COL = '#114C5A'; // nocturnal — icon color on collapsed card
const CARD_ACCENT_ACT = '#FFC801'; // forsythia — icon + title color when active

const ITEM_ICONS: Record<number, React.ReactNode> = {
  1: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
    </svg>
  ),
  2: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  3: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5" />
      <path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3" />
    </svg>
  ),
  4: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
};

export default function BentoAccordion() {
  // null = all closed; number = that index is open
  const [activeIndex, setActiveIndex] = useState<number | null>(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);

    // Scroll stagger
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('stagger-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    document.querySelectorAll('.bento-stagger').forEach((el, i) => {
      (el as HTMLElement).style.transitionDelay = `${i * 120}ms`;
      observer.observe(el);
    });

    return () => {
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
    };
  }, []);

  const toggle = (index: number) => {
    // Clicking open card closes it; clicking closed card opens it
    setActiveIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section
      className="bento-section py-32 px-4 relative overflow-hidden"
      style={{ background: 'linear-gradient(to bottom, #050A0E 0%, #0A1E28 12%, #114C5A 40%)' }}
    >
      {/* Noise overlay */}
      <div
        className="absolute inset-0 z-0 opacity-10 mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")',
        }}
      />
      {/* Ambient glow */}
      <div
        className="absolute top-1/3 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[150px] opacity-20 pointer-events-none z-0"
        style={{ background: 'radial-gradient(circle, rgba(255,200,1,0.15) 0%, rgba(17,76,90,0.3) 60%, transparent 100%)' }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <header className="mb-20 text-center md:text-left bento-stagger opacity-0 translate-y-8 transition-all duration-700 ease-out">
          <h2 className="text-4xl md:text-6xl font-mono font-bold text-white mb-6">Core Architecture</h2>
          <p className="text-xl text-mystic max-w-3xl font-light">
            Engineered for absolute performance. Discover the subsystems powering our intelligence layer.
          </p>
        </header>

        {/* ── MOBILE: vertical accordion ───────────────────────────────────── */}
        {isMobile && (
          <div className="flex flex-col gap-4">
            {BENTO_ITEMS.map((item, index) => {
              const isOpen = activeIndex === index;
              const icon   = ITEM_ICONS[item.id];
              return (
                <div
                  key={item.id}
                  className="bento-stagger opacity-0 translate-y-8 transition-all duration-700 ease-out rounded-2xl overflow-hidden"
                  style={{
                    background: CARD_BG,
                    border: isOpen ? `1.5px solid ${CARD_ACCENT_COL}` : `1px solid rgba(23,43,54,0.25)`,
                    boxShadow: isOpen
                      ? '0 4px 24px rgba(17,76,90,0.25)'
                      : '0 2px 8px rgba(0,0,0,0.15)',
                  }}
                >
                  {/* Always-rendered header row — click target */}
                  <button
                    onClick={() => toggle(index)}
                    className="w-full flex items-center gap-4 p-5 text-left focus:outline-none"
                    aria-expanded={isOpen}
                  >
                    <span style={{ color: isOpen ? CARD_ACCENT_COL : CARD_ACCENT_COL }}>{icon}</span>
                    <span
                      className="font-mono text-lg font-bold flex-1"
                      style={{ color: CARD_TEXT }}
                    >
                      {item.title}
                    </span>
                    {/* Chevron — rotates open/closed */}
                    <svg
                      width="20" height="20" viewBox="0 0 24 24"
                      fill="none" stroke={CARD_ACCENT_COL} strokeWidth="2.2"
                      strokeLinecap="round" strokeLinejoin="round"
                      style={{
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 200ms ease-out',
                        flexShrink: 0,
                      }}
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>

                  {/* Content body — height-animated, NEVER removed from DOM */}
                  <div
                    style={{
                      maxHeight: isOpen ? '240px' : '0px',
                      opacity: isOpen ? 1 : 0,
                      overflow: 'hidden',
                      transition: 'max-height 220ms ease-out, opacity 180ms ease-out',
                    }}
                  >
                    <p
                      className="px-5 pb-5 pt-1 text-base font-light leading-relaxed"
                      style={{ color: CARD_TEXT_MUTED }}
                    >
                      {item.content}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── DESKTOP: flex accordion — cards expand horizontally ──────────── */}
        {!isMobile && (
          <div className="flex flex-row gap-4 h-[560px] transition-all duration-500 ease-out">
            {BENTO_ITEMS.map((item, index) => {
              const isOpen = activeIndex === index;
              const icon   = ITEM_ICONS[item.id];
              return (
                <article
                  key={item.id}
                  onClick={() => toggle(index)}
                  className="bento-stagger opacity-0 translate-y-8 transition-all duration-700 ease-out
                             bento-card rounded-2xl cursor-pointer overflow-hidden relative group
                             transition-[flex,box-shadow,border-color] duration-500 ease-out"
                  style={{
                    flex: isOpen ? 3 : 1,
                    background: CARD_BG,
                    border: isOpen
                      ? `1.5px solid ${CARD_ACCENT_COL}`
                      : `1px solid rgba(23,43,54,0.25)`,
                    boxShadow: isOpen
                      ? '0 8px 40px rgba(17,76,90,0.3), inset 0 1px 0 rgba(255,200,1,0.08)'
                      : '0 2px 12px rgba(0,0,0,0.2)',
                  }}
                >
                  {/* ── Collapsed label (always in DOM, fades out when open) ── */}
                  <div
                    className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-5"
                    style={{
                      opacity: isOpen ? 0 : 1,
                      pointerEvents: isOpen ? 'none' : 'auto',
                      transition: 'opacity 180ms ease-out',
                    }}
                  >
                    <span style={{ color: CARD_ACCENT_COL }} className="group-hover:opacity-80 transition-opacity">
                      {icon}
                    </span>
                    <h3
                      className="font-mono text-sm font-bold text-center leading-snug"
                      style={{
                        color: CARD_TEXT,
                        writingMode: 'vertical-rl',
                        textOrientation: 'mixed',
                        letterSpacing: '0.05em',
                      }}
                    >
                      {item.title}
                    </h3>
                    {/* Hover hint */}
                    <svg
                      width="14" height="14" viewBox="0 0 24 24"
                      fill="none" stroke={CARD_ACCENT_COL} strokeWidth="2"
                      strokeLinecap="round" strokeLinejoin="round"
                      className="opacity-0 group-hover:opacity-60 transition-opacity duration-200"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </div>

                  {/* ── Expanded content (always in DOM, fades in when open) ── */}
                  <div
                    className="absolute inset-0 flex flex-col justify-end p-10"
                    style={{
                      opacity: isOpen ? 1 : 0,
                      transform: isOpen ? 'translateY(0)' : 'translateY(16px)',
                      pointerEvents: isOpen ? 'auto' : 'none',
                      transition: 'opacity 250ms ease-out 80ms, transform 250ms ease-out 80ms',
                    }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <span style={{ color: CARD_ACCENT_COL }}>{icon}</span>
                      <h3 className="font-mono text-3xl font-bold" style={{ color: CARD_TEXT }}>
                        {item.title}
                      </h3>
                    </div>
                    <p
                      className="text-lg font-light leading-relaxed max-w-2xl"
                      style={{ color: CARD_TEXT_MUTED }}
                    >
                      {item.content}
                    </p>
                    {/* Close hint */}
                    <p
                      className="mt-6 text-xs font-mono tracking-widest uppercase"
                      style={{ color: CARD_ACCENT_COL, opacity: 0.6 }}
                    >
                      Click to collapse ↑
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `.stagger-visible { opacity: 1 !important; transform: translateY(0) !important; }`
      }} />
    </section>
  );
}
