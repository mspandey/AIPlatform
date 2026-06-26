"use client";

import React, { useEffect, useRef, useState } from "react";

interface ChoreographyConfig {
  id: string;
  start: number;
  end: number;
  element: React.ReactNode;
  className?: string;
}

interface ScrollSequenceBlendProps {
  imagePaths: string[]; // Absolute paths or URLs to the 8-12 keyframes
  choreography?: ChoreographyConfig[];
  scrollHeight?: string; 
}

export default function ScrollSequenceCanvas({
  imagePaths,
  choreography = [],
  scrollHeight = "150vh",
}: ScrollSequenceBlendProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>(0);
  
  // Refs to the image elements to update opacity directly via DOM
  const imageRefs = useRef<(HTMLImageElement | null)[]>([]);
  // Refs to choreography elements
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

    let targetProgress = 0;
    let currentProgress = 0;

    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const totalScrollable = rect.height - window.innerHeight;
      
      if (totalScrollable <= 0) return;

      let p = -rect.top / totalScrollable;
      p = Math.max(0, Math.min(1, p));
      
      targetProgress = p;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    const numFrames = imagePaths.length;

    const renderLoop = () => {
      // Smooth interpolation for scroll (optional, but makes it silky)
      currentProgress += (targetProgress - currentProgress) * 0.1;
      
      if (Math.abs(targetProgress - currentProgress) > 0.001) {
        // Update frame opacities
        for (let i = 0; i < numFrames; i++) {
          const img = imageRefs.current[i];
          if (!img) continue;

          // Each frame has a peak at progress = i / (numFrames - 1)
          const peak = i / (numFrames - 1);
          // Width of the fade is the distance to the next frame
          const fadeWidth = 1 / (numFrames - 1);
          
          let opacity = 1 - Math.abs(currentProgress - peak) / fadeWidth;
          opacity = Math.max(0, Math.min(1, opacity));
          
          // Only touch DOM if we need to
          const currentOpacity = img.style.opacity;
          const newOpacity = opacity.toFixed(3);
          if (currentOpacity !== newOpacity) {
             img.style.opacity = newOpacity;
          }
        }

        // Update choreography opacities
        choreography.forEach((config, idx) => {
          const el = choreoRefs.current[idx];
          if (!el) return;

          let opacity = 0;
          if (currentProgress >= config.start && currentProgress <= config.end) {
            const range = config.end - config.start;
            const midpoint = config.start + range / 2;
            if (currentProgress < midpoint) {
               opacity = (currentProgress - config.start) / (range / 2);
            } else {
               opacity = 1 - ((currentProgress - midpoint) / (range / 2));
            }
          }
          opacity = Math.max(0, Math.min(1, opacity));
          el.style.opacity = opacity.toFixed(3);
        });
      }

      requestRef.current = requestAnimationFrame(renderLoop);
    };

    requestRef.current = requestAnimationFrame(renderLoop);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(requestRef.current);
    };
  }, [isMobileOrReducedMotion, imagePaths.length, choreography]);

  if (isMobileOrReducedMotion) {
    return (
      <div className="relative min-h-[85vh] flex flex-col justify-center px-4 bg-nocturnal overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={imagePaths[imagePaths.length - 1]} 
            alt="Sequence Final Frame" 
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-nocturnal/30 to-nocturnal"></div>
        </div>
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
      className="relative bg-nocturnal"
    >
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden bg-nocturnal">
        
        {/* Blended Frames */}
        {imagePaths.map((path, i) => (
          <img
            key={path}
            ref={(el) => { imageRefs.current[i] = el; }}
            src={path}
            alt={`Frame ${i}`}
            className="absolute inset-0 w-full h-full object-cover will-change-opacity"
            style={{ opacity: i === 0 ? 1 : 0 }}
          />
        ))}

        <div className="absolute inset-0 bg-nocturnal/20 mix-blend-overlay"></div>

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
