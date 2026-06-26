"use client";

import React, { useRef, useEffect } from 'react';
import { PRICING_MATRIX } from '@/lib/constants';

// Simple SVG Icons
const IconBasic = () => (
  <svg className="w-5 h-5 text-forsythia" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const IconPro = () => (
  <svg className="w-5 h-5 text-saffron" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
  </svg>
);

const IconEnterprise = () => (
  <svg className="w-5 h-5 text-arctic" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
  </svg>
);

export default function PricingEngine() {
  const basicPriceRef = useRef<HTMLSpanElement>(null);
  const proPriceRef = useRef<HTMLSpanElement>(null);
  const enterprisePriceRef = useRef<HTMLSpanElement>(null);
  const billingToggleRef = useRef<HTMLInputElement>(null);
  const currencySelectRef = useRef<HTMLSelectElement>(null);

  const observerRef = useRef<IntersectionObserver | null>(null);

  const updatePrices = () => {
    if (!billingToggleRef.current || !currencySelectRef.current) return;
    
    const isAnnual = billingToggleRef.current.checked;
    const currency = currencySelectRef.current.value;
    const period = isAnnual ? 'annual' : 'monthly';
    const config = PRICING_MATRIX[currency];
    const prices = config[period];

    if (basicPriceRef.current) basicPriceRef.current.textContent = `${config.symbol}${prices.basic}`;
    if (proPriceRef.current) proPriceRef.current.textContent = `${config.symbol}${prices.pro}`;
    if (enterprisePriceRef.current) enterprisePriceRef.current.textContent = `${config.symbol}${prices.enterprise}`;
  };

  useEffect(() => {
    updatePrices();

    // Scroll Stagger Animation
    const elements = document.querySelectorAll('.animate-stagger');
    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('stagger-visible');
          observerRef.current?.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    elements.forEach((el, index) => {
      (el as HTMLElement).style.transitionDelay = `${index * 100}ms`;
      observerRef.current?.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, []);

  return (
    <section className="pricing-engine relative bg-nocturnal text-arctic py-32 px-4 overflow-hidden">
      
      {/* Texture & Depth: Noise Overlay */}
      <div 
        className="absolute inset-0 z-0 opacity-10 mix-blend-overlay pointer-events-none"
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}
      ></div>

      <div className="max-w-6xl mx-auto relative z-10">
        <header className="text-center mb-20 animate-stagger opacity-0 translate-y-8 transition-all duration-700 ease-out">
          <h2 className="text-4xl md:text-5xl font-bold font-mono mb-6 text-white tracking-tight">Transparent Pricing</h2>
          <p className="text-xl opacity-70 max-w-2xl mx-auto font-light">Predictable scaling for AI-driven teams, with full control over usage and no hidden latency fees.</p>
        </header>
        
        <div className="flex flex-col sm:flex-row justify-center items-center gap-8 mb-20 animate-stagger opacity-0 translate-y-8 transition-all duration-700 ease-out">
          <div className="flex items-center gap-3">
            <label htmlFor="currency" className="font-medium text-lg text-mystic">Currency</label>
            <select 
              id="currency" 
              ref={currencySelectRef} 
              onChange={updatePrices}
              className="px-4 py-2 border border-oceanic rounded-md bg-nocturnal text-white font-mono focus:outline-none focus:border-forsythia transition-colors duration-150 cursor-pointer"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="INR">INR (₹)</option>
            </select>
          </div>
          
          <div className="flex items-center gap-4 text-mystic">
            <span className="font-medium text-lg">Monthly</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                ref={billingToggleRef} 
                onChange={updatePrices} 
                className="sr-only peer" 
                defaultChecked={true}
              />
              <div className="w-14 h-7 bg-oceanic peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-transform after:duration-200 peer-checked:bg-saffron"></div>
            </label>
            <span className="font-medium text-lg flex items-center">
              Annually <span className="text-saffron bg-oceanic/50 px-2 py-1 rounded text-sm ml-3 font-mono">-20%</span>
            </span>
          </div>
        </div>

        {/* Glow Blob behind Middle Card */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-saffron rounded-full blur-[120px] opacity-[0.15] pointer-events-none z-0 hidden md:block"></div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10 items-center">
          
          {/* Basic Card */}
          <article className="animate-stagger opacity-0 translate-y-8 transition-all duration-700 ease-out pricing-card p-8 rounded-2xl border border-arctic/12 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(255,200,1,0.1)] transition-all duration-200 flex flex-col h-[500px]" style={{ background: '#071318' }}>
            <h3 className="text-2xl font-mono font-bold mb-3 text-forsythia">Basic</h3>
            <p className="mb-8 opacity-70 h-12 text-sm font-light">For individuals and hobbyists testing the waters.</p>
            <div className="text-5xl font-bold mb-8 text-white tracking-tighter">
              <span ref={basicPriceRef}>$15</span><span className="text-xl font-normal opacity-50 tracking-normal">/mo</span>
            </div>
            <ul className="mb-10 space-y-5 font-light flex-grow">
              <li className="flex items-center gap-3"><IconBasic /> 1 Active Agent</li>
              <li className="flex items-center gap-3"><IconBasic /> 10k Inference Tokens</li>
              <li className="flex items-center gap-3"><IconBasic /> Community Support</li>
            </ul>
            <button className="w-full py-4 rounded-xl bg-white/5 text-white font-medium border border-white/10 hover:bg-white/10 transition-colors duration-150">Deploy Now</button>
          </article>

          {/* Pro Card (Recommended) */}
          <div className="animate-stagger opacity-0 translate-y-8 transition-all duration-700 ease-out relative md:scale-105 z-20">
            {/* 1px Gradient Border Wrapper */}
            <div className="absolute inset-0 bg-gradient-to-br from-forsythia to-saffron rounded-2xl p-[1px]"></div>
            
            <article className="pricing-card p-8 rounded-2xl shadow-[0_30px_60px_-15px_rgba(255,150,0,0.3)] hover:-translate-y-2 hover:shadow-[0_40px_70px_-15px_rgba(255,150,0,0.4)] transition-all duration-200 flex flex-col h-[540px] relative h-full w-full" style={{ background: '#0A1E28' }}>
              <div className="absolute top-0 right-8 transform -translate-y-1/2 bg-gradient-to-r from-forsythia to-saffron text-nocturnal text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-lg">Most Popular</div>
              <h3 className="text-2xl font-mono font-bold mb-3 text-white">Pro</h3>
              <p className="mb-8 opacity-70 h-12 text-sm font-light">For scaling teams needing dedicated compute.</p>
              <div className="text-6xl font-bold mb-8 text-white tracking-tighter">
                <span ref={proPriceRef}>$39</span><span className="text-xl font-normal opacity-50 tracking-normal">/mo</span>
              </div>
              <ul className="mb-10 space-y-5 font-light flex-grow">
                <li className="flex items-center gap-3"><IconPro /> 10 Active Agents</li>
                <li className="flex items-center gap-3"><IconPro /> 500k Inference Tokens</li>
                <li className="flex items-center gap-3"><IconPro /> Priority Support</li>
                <li className="flex items-center gap-3"><IconPro /> Advanced Telemetry</li>
              </ul>
              <button className="w-full py-4 rounded-xl bg-saffron text-nocturnal font-bold hover:brightness-110 transition-all duration-150 shadow-[0_0_20px_rgba(255,200,1,0.2)]">Start Free Trial</button>
            </article>
          </div>

          {/* Enterprise Card */}
          <article className="animate-stagger opacity-0 translate-y-8 transition-all duration-700 ease-out pricing-card p-8 rounded-2xl border border-arctic/12 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(255,255,255,0.08)] transition-all duration-200 flex flex-col h-[500px]" style={{ background: '#071318' }}>
            <h3 className="text-2xl font-mono font-bold mb-3 text-arctic">Enterprise</h3>
            <p className="mb-8 opacity-70 h-12 text-sm font-light">Custom deployments for large-scale operations.</p>
            <div className="text-5xl font-bold mb-8 text-white tracking-tighter">
              <span ref={enterprisePriceRef}>$79</span><span className="text-xl font-normal opacity-50 tracking-normal">/mo</span>
            </div>
            <ul className="mb-10 space-y-5 font-light flex-grow">
              <li className="flex items-center gap-3"><IconEnterprise /> Unlimited Agents</li>
              <li className="flex items-center gap-3"><IconEnterprise /> Custom Token Quotas</li>
              <li className="flex items-center gap-3"><IconEnterprise /> 24/7 Dedicated Support</li>
              <li className="flex items-center gap-3"><IconEnterprise /> VPC Peering</li>
            </ul>
            <button className="w-full py-4 rounded-xl bg-white/5 text-white font-medium border border-white/10 hover:bg-white/10 transition-colors duration-150">Contact Sales</button>
          </article>

        </div>
      </div>
      
      {/* Global CSS for Stagger Animation */}
      <style dangerouslySetInnerHTML={{__html: `
        .stagger-visible {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
      `}} />
    </section>
  );
}
