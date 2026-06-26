"use client";

import React from "react";
import Link from "next/link";
import HexMorphSequence from "./HexMorphSequence";

export default function Hero() {
  const choreography = [
    {
      id: "badge",
      start: 0.0,
      end: 0.18,
      element: (
        <div className="inline-block px-4 py-2 bg-oceanic text-forsythia font-mono font-bold text-sm rounded-full mb-8 border border-forsythia/30 shadow-[0_0_15px_rgba(255,200,1,0.2)]">
          made just for you
        </div>
      ),
    },
    {
      id: "headline",
      start: 0.08,
      end: 0.42,
      element: (
        <h1 className="text-5xl sm:text-7xl md:text-8xl font-mono font-bold mb-8 tracking-tight text-arctic leading-tight text-center">
          Build software that{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-forsythia to-saffron">
            Thinks.
          </span>
        </h1>
      ),
    },
    {
      id: "description",
      start: 0.28,
      end: 0.68,
      element: (
        <p className="text-lg sm:text-2xl mb-12 text-mystic max-w-4xl mx-auto font-light leading-relaxed text-center">
          The infrastructure layer for generative applications. Integrate neural
          capabilities into your codebase with three lines of code.
        </p>
      ),
    },
    {
      id: "cta",
      start: 0.58,
      end: 0.92,
      element: (
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <Link href="/dashboard" className="w-full sm:w-auto">
            <button className="px-10 py-4 w-full bg-forsythia text-oceanic text-lg font-bold rounded-xl hover:bg-saffron transition-colors duration-150 shadow-[0_0_40px_rgba(255,200,1,0.3)] hover:scale-105 transform">
              Initialize Workspace
            </button>
          </Link>
          <Link href="/docs" className="w-full sm:w-auto">
            <button className="px-10 py-4 w-full bg-transparent border-2 border-mystic text-mystic text-lg font-bold rounded-xl hover:bg-mystic/10 transition-colors duration-150 hover:scale-105 transform">
              Read the Docs
            </button>
          </Link>
        </div>
      ),
    },
  ];

  return (
    <section className="relative w-full">
      <HexMorphSequence
        choreography={choreography}
        scrollHeight="200vh"
        hexSize={95}
        splitOffset={210}
        accentColor="#FFC801"
        glowColor="#FF9932"
        glowIntensity={1.1}
        mergeScale={1.35}
        growScale={2.0}
      />
    </section>
  );
}
