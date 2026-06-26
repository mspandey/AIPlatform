"use client";
import React, { useEffect, useRef, useState } from "react";

// ─── TIMING CONFIG — retune all thresholds here ──────────────────────────────
const T = {
  approachEnd: 0.40,
  mergeEnd:    0.60,
  growEnd:     0.85,
  dissolveEnd: 1.00,
} as const;

// SVG coordinate space
const VW = 800, VH = 500, CX = VW / 2, CY = VH / 2;

// ─── Math helpers ────────────────────────────────────────────────────────────
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp = (v: number, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, v));
const mapR = (v: number, a: number, b: number) => clamp((v - a) / (b - a));
const eio  = (t: number) => t < 0.5 ? 2*t*t : -1 + (4 - 2*t)*t;

// Return 6 vertices of a flat-top regular hexagon
function hexV(cx: number, cy: number, r: number): [number,number][] {
  return Array.from({ length: 6 }, (_, i) => {
    const a = (i / 6) * Math.PI * 2 - Math.PI / 6;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)] as [number,number];
  });
}

// Lerp two vertex arrays element-wise
function lerpV(a: [number,number][], b: [number,number][], t: number): [number,number][] {
  return a.map(([ax, ay], i) => [lerp(ax, b[i][0], t), lerp(ay, b[i][1], t)]);
}

// SVG polygon points string
const toP = (v: [number,number][]) => v.map(([x,y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");

// ─── Types ───────────────────────────────────────────────────────────────────
interface Choreo {
  id: string; start: number; end: number;
  element: React.ReactNode; className?: string;
}
interface Props {
  hexSize?:      number;
  mergeScale?:   number;
  growScale?:    number;
  accentColor?:  string;
  glowColor?:    string;
  glowIntensity?:number;
  splitOffset?:  number;
  scrollHeight?: string;
  choreography?: Choreo[];
  reverse?:      boolean;
}

export default function HexMorphSequence({
  hexSize      = 90,
  mergeScale   = 1.35,
  growScale    = 1.95,
  accentColor  = "#FFC801",
  glowColor    = "#FF9932",
  glowIntensity= 1,
  splitOffset  = 200,
  scrollHeight = "200vh",
  choreography = [],
  reverse      = false,
}: Props) {
  const containerRef  = useRef<HTMLDivElement>(null);
  const leftPRef      = useRef<SVGPolygonElement>(null);
  const rightPRef     = useRef<SVGPolygonElement>(null);
  const mergedPRef    = useRef<SVGPolygonElement>(null);
  const leftGRef      = useRef<SVGPolygonElement>(null);
  const rightGRef     = useRef<SVGPolygonElement>(null);
  const mergedGRef    = useRef<SVGPolygonElement>(null);
  const rafRef        = useRef<number>(0);
  const choreoRefs    = useRef<(HTMLDivElement | null)[]>([]);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mobile  = window.innerWidth < 768;
    const noMotion= window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReduced(mobile || noMotion);
  }, []);

  useEffect(() => {
    if (reduced) return;

    let target = 0, current = 0, lastRendered = -1;

    const onScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      if (scrollable <= 0) return;
      let p = clamp(-rect.top / scrollable);
      target = reverse ? 1 - p : p;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    const render = () => {
      current += (target - current) * 0.08;

      if (Math.abs(current - lastRendered) > 0.0005) {
        lastRendered = current;
        const p = current;

        // ── Phase 1: Approach (0 → T.approachEnd) ────────────────────────
        const approachT = eio(mapR(p, 0, T.approachEnd));

        // Left / right hex centers slide together
        const leftCX  = lerp(CX - splitOffset, CX, approachT);
        const rightCX = lerp(CX + splitOffset, CX, approachT);

        // Deformation: inner vertices of each hex curve toward gap (peaks at midpoint)
        const deformPeak = Math.sin(approachT * Math.PI) * hexSize * 0.22 * glowIntensity;

        const leftBase  = hexV(leftCX,  CY, hexSize);
        const rightBase = hexV(rightCX, CY, hexSize);

        // Inner-facing vertex indices for flat-top hex:
        // Left hex → vertices 0 (top-right) and 1 (bottom-right) face the gap
        // Right hex → vertices 3 (bottom-left) and 4 (top-left) face the gap
        const leftDeformed  = leftBase.map(([x,y], i) =>
          (i === 0 || i === 1) ? [x + deformPeak, y] as [number,number] : [x,y] as [number,number]
        ) as [number,number][];
        const rightDeformed = rightBase.map(([x,y], i) =>
          (i === 3 || i === 4) ? [x - deformPeak, y] as [number,number] : [x,y] as [number,number]
        ) as [number,number][];

        // ── Phase 2: Merge (T.approachEnd → T.mergeEnd) ─────────────────
        const mergeT = eio(mapR(p, T.approachEnd, T.mergeEnd));
        const mergedRadius = hexSize * lerp(1, mergeScale, mergeT);
        const mergedTarget = hexV(CX, CY, mergedRadius);

        const leftFinal  = lerpV(leftDeformed,  mergedTarget, mergeT);
        const rightFinal = lerpV(rightDeformed, mergedTarget, mergeT);

        // ── Phase 3: Grow (T.mergeEnd → T.growEnd) ───────────────────────
        const growT  = eio(mapR(p, T.mergeEnd, T.growEnd));
        const growR  = lerp(hexSize * mergeScale, hexSize * growScale, growT);
        const mergedV = hexV(CX, CY, growR);

        // ── Phase 4: Dissolve (T.growEnd → T.dissolveEnd) ────────────────
        const dissolveT = eio(mapR(p, T.growEnd, T.dissolveEnd));
        const shrinkR   = lerp(hexSize * growScale, hexSize * mergeScale * 0.5, dissolveT);
        const finalMergedV = hexV(CX, CY, p > T.growEnd ? shrinkR : growR);

        // ── Opacity logic ─────────────────────────────────────────────────
        const twoHexOpacity   = clamp(1 - mergeT * 1.5);           // fades during merge
        const mergedOpacity   = p < T.dissolveEnd
          ? clamp(mergeT * 2) * (1 - dissolveT)                    // fades in + out
          : 0;

        // ── Glow blur intensity scales with growth ────────────────────────
        const baseBlur   = 8 * glowIntensity;
        const growBlur   = baseBlur + growT * 18 * glowIntensity;
        const activeBlur = p > T.mergeEnd ? growBlur : baseBlur;

        // ── Apply to DOM ──────────────────────────────────────────────────
        const setEl = (ref: React.RefObject<SVGPolygonElement | null>, pts: [number,number][], op: number, blur: number) => {
          if (!ref.current) return;
          ref.current.setAttribute("points", toP(pts));
          ref.current.style.opacity = String(op.toFixed(3));
          ref.current.style.filter  = `blur(${blur.toFixed(1)}px)`;
        };

        setEl(leftPRef,   leftFinal,      twoHexOpacity, 0);
        setEl(rightPRef,  rightFinal,     twoHexOpacity, 0);
        setEl(leftGRef,   leftFinal,      twoHexOpacity * 0.5, baseBlur * 2.5);
        setEl(rightGRef,  rightFinal,     twoHexOpacity * 0.5, baseBlur * 2.5);
        setEl(mergedPRef, finalMergedV,   mergedOpacity, 0);
        setEl(mergedGRef, finalMergedV,   mergedOpacity * 0.6, activeBlur * 2);

        // ── Choreography text overlays ────────────────────────────────────
        const dp = reverse ? 1 - p : p;
        choreography.forEach((cfg, idx) => {
          const el = choreoRefs.current[idx];
          if (!el) return;
          let op = 0;
          if (dp >= cfg.start && dp <= cfg.end) {
            const range = cfg.end - cfg.start;
            const mid   = cfg.start + range / 2;
            op = dp < mid
              ? (dp - cfg.start) / (range / 2)
              : 1 - (dp - mid) / (range / 2);
          }
          el.style.opacity = clamp(op).toFixed(3);
        });
      }

      rafRef.current = requestAnimationFrame(render);
    };
    rafRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, [reduced, choreography, reverse, hexSize, mergeScale, growScale, splitOffset, glowIntensity]);

  // Static fallback for mobile / reduced-motion
  if (reduced) {
    const staticV = hexV(CX, CY, hexSize * mergeScale);
    return (
      <div className="relative min-h-[85vh] flex flex-col justify-center overflow-hidden" style={{ background: "#050A0E" }}>
        <svg viewBox={`0 0 ${VW} ${VH}`} className="absolute inset-0 w-full h-full opacity-60">
          <defs>
            <filter id="hex-glow-static"><feGaussianBlur stdDeviation="12" result="blur" /><feComposite in="SourceGraphic" in2="blur" operator="over" /></filter>
          </defs>
          <polygon points={toP(staticV)} fill="none" stroke={accentColor} strokeWidth="2.5" filter="url(#hex-glow-static)" />
        </svg>
        <div className="max-w-7xl mx-auto px-4 text-center z-10 relative">
          {choreography.map(cfg => (
            <div key={cfg.id} className={cfg.className || "mb-8"}>{cfg.element}</div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} style={{ height: scrollHeight }} className="relative">
      <div className="sticky top-0 w-full h-screen overflow-hidden" style={{ background: "#050A0E" }}>

        {/* SVG Animation Layer */}
        <svg
          viewBox={`0 0 ${VW} ${VH}`}
          preserveAspectRatio="xMidYMid meet"
          className="absolute inset-0 w-full h-full"
        >
          <defs>
            {/* Glow filter for two-hex phase */}
            <filter id="hex-glow-two" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="0" result="blur" />
            </filter>
            {/* Glow filter for merged phase */}
            <filter id="hex-glow-merged" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="0" result="blur" />
            </filter>
          </defs>

          {/* Dot grid background */}
          {Array.from({ length: 17 }, (_, col) =>
            Array.from({ length: 11 }, (_, row) => (
              <circle
                key={`${col}-${row}`}
                cx={col * 50}
                cy={row * 50}
                r={1}
                fill="rgba(17,108,120,0.2)"
              />
            ))
          )}

          {/* ── Glow layers (rendered below stroke layers) ── */}
          <polygon ref={leftGRef}   fill={accentColor} stroke="none" />
          <polygon ref={rightGRef}  fill={glowColor}   stroke="none" />
          <polygon ref={mergedGRef} fill={accentColor} stroke="none" />

          {/* ── Stroke layers ── */}
          <polygon ref={leftPRef}  fill="none" stroke={accentColor} strokeWidth="2.2" />
          <polygon ref={rightPRef} fill="none" stroke={glowColor}   strokeWidth="2.2" />
          <polygon ref={mergedPRef} fill="none" stroke={accentColor} strokeWidth="2.5" />
        </svg>

        {/* Text Choreography */}
        <div className="absolute inset-0 z-10 flex flex-col justify-center items-center px-4 pointer-events-none">
          {choreography.map((cfg, idx) => (
            <div
              key={cfg.id}
              ref={el => { choreoRefs.current[idx] = el; }}
              className={`absolute pointer-events-auto ${cfg.className || ""}`}
              style={{ opacity: 0 }}
            >
              {cfg.element}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
