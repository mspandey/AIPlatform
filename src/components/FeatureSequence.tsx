"use client";

import React from "react";
import HexMorphSequence from "./HexMorphSequence";

export default function FeatureSequence() {
  const choreography = [
    {
      id: "feature-title",
      start: 0.1,
      end: 0.52,
      element: (
        <h2 className="text-4xl sm:text-6xl font-mono font-bold mb-4 tracking-tight text-white leading-tight text-center">
          Observe every{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-saffron to-forsythia">
            Neural Pathway.
          </span>
        </h2>
      ),
    },
    {
      id: "feature-desc",
      start: 0.38,
      end: 0.82,
      element: (
        <p className="text-lg sm:text-xl text-mystic max-w-2xl mx-auto font-light leading-relaxed text-center">
          Debug LLM hallucinations in real-time with our 3D trace explorer.
          See exactly which layer caused the deviation without pouring through log files.
        </p>
      ),
    },
  ];

  return (
    <section className="relative w-full">
      <HexMorphSequence
        choreography={choreography}
        scrollHeight="150vh"
        reverse={true}
        hexSize={80}
        splitOffset={180}
        accentColor="#FF9932"
        glowColor="#FFC801"
        glowIntensity={0.9}
        mergeScale={1.4}
        growScale={1.85}
      />
    </section>
  );
}
