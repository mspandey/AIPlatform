# AIPlatform

### Build software that Thinks.

AIPlatform is a premium, high-performance landing page representing the next generation of developer infrastructure. It showcases a modern, immersive web experience built to demonstrate how developers can integrate neural capabilities into their codebase with just three lines of code.

---

## 🌟 Key Features

### 1. Cinematic Scroll-Scrub Sequence (`NeuralNetworkCanvas`)
* **Interactive Storytelling:** A canvas-based interactive neural network that dynamically responds to the user's scroll.
* **The Blooming Effect:** The animation begins with scattered, out-of-focus glowing nodes in deep space. As the user scrolls, the nodes multiply, connections draw themselves, and the structure sharpens into a coherent, organic neural network.
* **Performance Focused:** Built using native HTML5 Canvas API and customized requestAnimationFrame hooks, achieving 60fps animations with optimized CPU/GPU utilization.
* **Reduced Motion Support:** Respects system-level accessibility settings, falling back to a clean static version if `prefers-reduced-motion` is active.

### 2. Premium Bento Grid & Interactive Accordion (`BentoAccordion`)
* **Visual Hierarchy:** Organizes platform features into a high-fidelity bento layout that shifts cleanly across responsive breakpoints.
* **Micro-interactions:** Interactive hover states, sleek gradients, and clean borders that respond organically to user interactions.

### 3. Adaptive Pricing Engine (`PricingEngine`)
* **Glassmorphic Cards:** High-fidelity pricing tiers with deep color drop shadows, radial glows, and interactive slider logic.
* **Curated Design Tokens:** Utilizes Forsythia (deep warm yellow) and Saffron accents on top of an Oceanic dark base palette to convey premium value.

---

## 🛠️ Technology Stack

* **Core Framework:** Next.js 15.5.19 & React 19 (App Router)
* **Styling & Theme:** Tailwind CSS & Vanilla CSS (Fluid Glassmorphism & Custom SVG Grain overlays)
* **Animation Engine:** Pure HTML5 Canvas API with linear and cubic-bezier interpolation curves
* **Platform:** Vercel (Edge-compatible serverless structure)

---

## 🚀 Getting Started

### Prerequisites

* Node.js (v18.x or later)
* npm (v10.x or later)

### Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/mspandey/AIPlatform.git
   cd AIPlatform
   ```

2. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🏗️ Production Build & Optimization

To compile the application for production:

```bash
npm run build
```

This compiles optimized client-side JS bundles, pre-renders static HTML pages, and runs Next.js server-side build optimizations.

---

## 🎨 Architecture & Design System

The application is styled using a custom nocturnal theme. The design tokens are declared as global Tailwind utilities, utilizing:
* **Backgrounds:** Deep space oceanic gradients (`#050A0E` to `#0B131A`).
* **Accents:** Forsythia yellow highlights (`#FFC801`) combined with soft amber/saffron gradients to create natural highlights.
* **Typography:** Clean, monospaced fonts for headers to capture the developer infrastructure vibe, paired with high-readability sans-serif text.
