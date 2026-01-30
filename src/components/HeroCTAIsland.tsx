import React, { useState, useRef, useCallback, useEffect } from 'react';

interface HeroCTAItem {
  title: string;
  description: string;
  href: string;
}

interface HeroCTAIslandProps {
  ctas: HeroCTAItem[];
}

export default function HeroCTAIsland({ ctas }: HeroCTAIslandProps) {
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const [gradientPos, setGradientPos] = useState({ left: 0, width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const ctaRefs = useRef<(HTMLDivElement | null)[]>([]);
  const gridRef = useRef<HTMLDivElement>(null);

  const updateGradient = useCallback((index: number) => {
    const ctaEl = ctaRefs.current[index];
    const containerEl = containerRef.current;
    const gridEl = gridRef.current;

    if (ctaEl && containerEl && gridEl) {
      const ctaRect = ctaEl.getBoundingClientRect();
      const containerRect = containerEl.getBoundingClientRect();
      const gridRect = gridEl.getBoundingClientRect();

      // Calculate position relative to the container
      const left = ctaRect.left - containerRect.left;
      const width = ctaRect.width;
      // Height covers the grid container plus minimal padding
      const height = gridRect.height + 32; // 32px = 2rem padding

      setGradientPos({ left, width, height });
      setActiveIndex(index);
    }
  }, []);

  const resetGradient = useCallback(() => {
    setActiveIndex(-1);
  }, []);

  // Initialize gradient height on mount and resize
  useEffect(() => {
    const updateHeight = () => {
      const gridEl = gridRef.current;
      const containerEl = containerRef.current;
      if (gridEl && containerEl && activeIndex >= 0) {
        const gridRect = gridEl.getBoundingClientRect();
        const containerRect = containerEl.getBoundingClientRect();
        const ctaEl = ctaRefs.current[activeIndex];
        if (ctaEl) {
          const ctaRect = ctaEl.getBoundingClientRect();
          setGradientPos(prev => ({
            ...prev,
            left: ctaRect.left - containerRect.left,
            height: gridRect.height + 32
          }));
        }
      }
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, [activeIndex]);

  if (ctas.length === 0) return null;

  // Square positioned under the hovered CTA, rising from bottom
  const squareLeft = gradientPos.left;
  const squareWidth = gradientPos.width;
  // Height extends slightly above the CTA element
  const squareHeight = gradientPos.height + 40;

  return (
    <div
      ref={containerRef}
      className="relative mt-auto pb-8 sm:pb-12 lg:pb-16"
    >
      {/* Simple square that rises from bottom under the hovered CTA */}
      <div
        className="absolute bottom-0 bg-gradient-to-t from-[#1A1A1A] via-[#1A1A1A]/95 to-[#1A1A1A]/60 transition-all duration-500 ease-out pointer-events-none"
        style={{
          left: `${squareLeft}px`,
          width: `${squareWidth}px`,
          height: activeIndex >= 0 ? `${squareHeight}px` : '0px',
          opacity: activeIndex >= 0 ? 1 : 0,
        }}
      />

      {/* CTA Grid */}
      <div ref={gridRef} className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl">
        {ctas.map((cta, index) => (
          <div
            key={index}
            ref={(el) => { ctaRefs.current[index] = el; }}
            onMouseEnter={() => updateGradient(index)}
            onMouseLeave={resetGradient}
            className="relative z-10"
          >
            <a
              href={cta.href}
              className="group block cursor-pointer transition-all duration-300"
            >
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#C50E1F] group-hover:text-white transition-colors duration-300">
                {cta.title}
              </h3>
              <div className="h-0.5 lg:h-1 bg-gradient-to-r from-white/50 via-white/30 to-transparent my-2 sm:my-3 lg:my-4 group-hover:from-white/70 group-hover:via-white/50 transition-all duration-300" />
              <p className="text-sm sm:text-base lg:text-lg text-[#E1E1E1] leading-relaxed group-hover:text-white transition-colors duration-300">
                {cta.description}
              </p>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
