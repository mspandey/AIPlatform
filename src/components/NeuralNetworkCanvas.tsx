"use client";

import React, { useEffect, useRef, useState } from "react";

interface ChoreographyConfig {
  id: string;
  start: number;
  end: number;
  element: React.ReactNode;
  className?: string;
}

interface NeuralNetworkCanvasProps {
  choreography?: ChoreographyConfig[];
  scrollHeight?: string; 
  reverse?: boolean;
}

export default function NeuralNetworkCanvas({
  choreography = [],
  scrollHeight = "200vh",
  reverse = false,
}: NeuralNetworkCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>(0);
  
  const choreoRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [isMobileOrReducedMotion, setIsMobileOrReducedMotion] = useState(false);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isMobile || prefersReducedMotion) {
      setIsMobileOrReducedMotion(true);
    }
  }, []);

  useEffect(() => {
    if (isMobileOrReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width * window.devicePixelRatio;
    canvas.height = height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * window.devicePixelRatio;
      canvas.height = height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    window.addEventListener("resize", handleResize);

    let targetProgress = 0;
    let currentProgress = 0;

    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const totalScrollable = rect.height - window.innerHeight;
      
      if (totalScrollable <= 0) return;

      let p = -rect.top / totalScrollable;
      p = Math.max(0, Math.min(1, p));
      
      if (reverse) {
        p = 1 - p;
      }
      
      targetProgress = p;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    const renderLoop = () => {
      // Smooth interpolation for scroll
      currentProgress += (targetProgress - currentProgress) * 0.1;

      // Clear background
      ctx.fillStyle = '#050A0E';
      ctx.fillRect(0, 0, width, height);

      // Draw subtle dot-grid
      ctx.fillStyle = 'rgba(17, 108, 120, 0.18)';
      const gridSize = 48;
      for (let x = 0; x < width; x += gridSize) {
        for (let y = 0; y < height; y += gridSize) {
          ctx.beginPath();
          ctx.arc(x, y, 1.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      const cx = width / 2;
      const cy = height / 2;
      const rotation = currentProgress * Math.PI * 2;
      const baseRadius = 160 + currentProgress * 90;

      // --- Outer glow ring ---
      const glowGrad = ctx.createRadialGradient(cx, cy, baseRadius * 0.8, cx, cy, baseRadius * 1.6);
      glowGrad.addColorStop(0, 'rgba(255, 200, 1, 0.08)');
      glowGrad.addColorStop(1, 'rgba(255, 200, 1, 0)');
      ctx.beginPath();
      ctx.arc(cx, cy, baseRadius * 1.6, 0, Math.PI * 2);
      ctx.fillStyle = glowGrad;
      ctx.fill();

      // --- Inner glow ring (oceanic) ---
      const innerGlowGrad = ctx.createRadialGradient(cx, cy, baseRadius * 0.3, cx, cy, baseRadius * 0.9);
      innerGlowGrad.addColorStop(0, 'rgba(23, 43, 54, 0.0)');
      innerGlowGrad.addColorStop(1, 'rgba(17, 76, 90, 0.5)');
      ctx.beginPath();
      ctx.arc(cx, cy, baseRadius * 0.9, 0, Math.PI * 2);
      ctx.fillStyle = innerGlowGrad;
      ctx.fill();

      // --- Draw hexagon ---
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rotation);

      const sides = 6;
      const hexPath = () => {
        ctx.beginPath();
        for (let i = 0; i < sides; i++) {
          const angle = (i * 2 * Math.PI) / sides - Math.PI / 2;
          const x = baseRadius * Math.cos(angle);
          const y = baseRadius * Math.sin(angle);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
      };

      // Shadow glow under hex
      ctx.shadowColor = 'rgba(255, 200, 1, 0.6)';
      ctx.shadowBlur = 24;
      hexPath();
      ctx.strokeStyle = 'rgba(255, 200, 1, 0.85)';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Second inner hex (counter-rotate)
      ctx.rotate(-rotation * 2);
      const innerRadius = baseRadius * 0.58;
      ctx.beginPath();
      for (let i = 0; i < sides; i++) {
        const angle = (i * 2 * Math.PI) / sides - Math.PI / 2;
        const x = innerRadius * Math.cos(angle);
        const y = innerRadius * Math.sin(angle);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.shadowColor = 'rgba(255, 153, 50, 0.5)';
      ctx.shadowBlur = 16;
      ctx.strokeStyle = 'rgba(255, 153, 50, 0.6)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.shadowBlur = 0;
      ctx.restore();

      // --- Orbiting particles ---
      const numParticles = 8;
      for (let i = 0; i < numParticles; i++) {
        const angle = (i / numParticles) * Math.PI * 2 + rotation * 1.5;
        const orbitR = baseRadius * 1.15;
        const px = cx + orbitR * Math.cos(angle);
        const py = cy + orbitR * Math.sin(angle);
        const size = i % 2 === 0 ? 3 : 2;
        ctx.beginPath();
        ctx.arc(px, py, size, 0, Math.PI * 2);
        ctx.fillStyle = i % 2 === 0 ? 'rgba(255,200,1,0.9)' : 'rgba(255,153,50,0.7)';
        ctx.fill();
      }

      // --- Spoke lines from center to hex vertices ---
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rotation);
      for (let i = 0; i < sides; i++) {
        const angle = (i * 2 * Math.PI) / sides - Math.PI / 2;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(baseRadius * Math.cos(angle), baseRadius * Math.sin(angle));
        ctx.strokeStyle = 'rgba(255,200,1,0.08)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      ctx.restore();

      // Update choreography opacities
      const displayProgress = reverse ? 1 - currentProgress : currentProgress;
      choreography.forEach((config, idx) => {
        const el = choreoRefs.current[idx];
        if (!el) return;

        let opacity = 0;
        if (displayProgress >= config.start && displayProgress <= config.end) {
          const range = config.end - config.start;
          const midpoint = config.start + range / 2;
          if (displayProgress < midpoint) {
             opacity = (displayProgress - config.start) / (range / 2);
          } else {
             opacity = 1 - ((displayProgress - midpoint) / (range / 2));
          }
        }
        opacity = Math.max(0, Math.min(1, opacity));
        el.style.opacity = opacity.toFixed(3);
      });

      requestRef.current = requestAnimationFrame(renderLoop);
    };

    requestRef.current = requestAnimationFrame(renderLoop);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(requestRef.current);
    };
  }, [isMobileOrReducedMotion, choreography, reverse]);

  if (isMobileOrReducedMotion) {
    return (
      <div className="relative min-h-[85vh] flex flex-col justify-center px-4 bg-nocturnal overflow-hidden">
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-nocturnal to-oceanic/20"></div>
        <div className="max-w-7xl mx-auto relative z-10 text-center">
           {choreography.map((config) => (
             <div key={config.id} className={config.className || "mb-8"}>
               {config.element}
             </div>
           ))}
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef} 
      style={{ height: scrollHeight }} 
      className="relative bg-black"
    >
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden bg-black">
        
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
        />

        <div className="absolute inset-0 z-0 opacity-10 mix-blend-overlay pointer-events-none"></div>

        {/* Overlayed Text Choreography */}
        <div className="absolute inset-0 flex flex-col justify-center items-center px-4 z-10 pointer-events-none">
          {choreography.map((config, idx) => (
            <div 
              key={config.id}
              ref={(el) => { choreoRefs.current[idx] = el; }}
              className={`absolute transition-none pointer-events-auto ${config.className || ""}`}
              style={{ opacity: 0 }}
            >
              {config.element}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
