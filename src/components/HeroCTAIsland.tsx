import React, { useState, useRef, useCallback, useEffect } from 'react';

interface HeroCTAItem {
  title: string;
  description: string;
  href: string;
}

interface HeroCTAIslandProps {
  ctas: HeroCTAItem[];
}

// Breakpoint constant matching Tailwind's lg breakpoint
const LG_BREAKPOINT = 1024;

export default function HeroCTAIsland({ ctas }: HeroCTAIslandProps) {
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const [gradientPos, setGradientPos] = useState({ left: 0, width: 0, height: 0 });
  const [isLargeScreen, setIsLargeScreen] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const ctaRefs = useRef<(HTMLDivElement | null)[]>([]);
  const gridRef = useRef<HTMLDivElement>(null);

  // Check screen size on mount and resize
  useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= LG_BREAKPOINT);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

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

  // Rectangle positioned under the hovered CTA, slightly wider with curved-in foot
  const widthExpansion = 1.02; // 2% wider than CTA
  const expandedWidth = gradientPos.width * widthExpansion;
  const widthDiff = expandedWidth - gradientPos.width;
  const rectLeft = gradientPos.left - widthDiff / 2;
  // Height extends slightly above the CTA element
  const rectHeight = gradientPos.height + 40;

  // Smooth curve configuration - adjusted for one continuous flowing shape
  const curveHeight = rectHeight * 0.65; // Height of the curve peak (slightly higher)
  const bottomWidth = expandedWidth * 0.5; // Width at the bottom (wider to cover all CTAs)

  // Create SVG path with one smooth continuous curve
  // The shape flows smoothly from left bottom, up to peak, down to right bottom
  // Control points adjusted to make the base rise faster
  const svgPath = `
    M ${-bottomWidth} ${rectHeight}
    Q ${-bottomWidth * 0.1} ${rectHeight * 0.6}, 0 ${rectHeight * 0.3}
    Q ${expandedWidth * 0.5} ${-curveHeight}, ${expandedWidth} ${rectHeight * 0.3}
    Q ${expandedWidth + bottomWidth * 0.1} ${rectHeight * 0.6}, ${expandedWidth + bottomWidth} ${rectHeight}
    L ${-bottomWidth} ${rectHeight}
    Z
  `.trim().replace(/\s+/g, ' ');

  return (
    <div
      ref={containerRef}
      className="relative mt-auto pb-8 sm:pb-12 lg:pb-16"
    >
      {/* Shape with one smooth continuous curve */}
      <svg
        className="absolute bottom-0 pointer-events-none overflow-visible"
        style={{
          left: `${rectLeft - bottomWidth - 40}px`,
          width: `${expandedWidth + bottomWidth * 2}px`,
          height: `${rectHeight + curveHeight}px`,
          opacity: activeIndex >= 0 ? 1 : 0,
          clipPath: activeIndex >= 0 ? 'inset(0 0 0 0)' : 'inset(100% 0 0 0)',
          transition: 'left 500ms ease-out, width 500ms ease-out, opacity 500ms ease-out, clip-path 500ms ease-out',
        }}
        viewBox={`${-bottomWidth} ${-curveHeight} ${expandedWidth + bottomWidth * 2} ${rectHeight + curveHeight}`}
        preserveAspectRatio="none"
      >
        <defs>
          <radialGradient id="ctaGradient" cx="50%" cy="100%" r="70%" fx="50%" fy="100%">
            <stop offset="0%" stopColor="#1A1A1A" stopOpacity="1" />
            <stop offset="50%" stopColor="#1A1A1A" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#1A1A1A" stopOpacity="0" />
          </radialGradient>
        </defs>
        <path
          d={svgPath}
          fill="url(#ctaGradient)"
          style={{
            transition: 'all 500ms ease-out',
          }}
        />
      </svg>

      {/* CTA Grid */}
      <div
        ref={gridRef}
        className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl"
        onMouseLeave={() => isLargeScreen && resetGradient()}
      >
        {ctas.map((cta, index) => (
          <div
            key={index}
            ref={(el) => { ctaRefs.current[index] = el; }}
            onMouseEnter={() => isLargeScreen && updateGradient(index)}
            className="relative z-10"
          >
            <a
              href={cta.href}
              className="group block cursor-pointer transition-all duration-300"
            >
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#C50E1F] group-hover:text-white transition-colors duration-300">
                {cta.title}
              </h3>
              <div className="h-0.5 lg:h-1 bg-gradient-to-r from-white/50 via-white/20 to-transparent my-2 sm:my-3 lg:my-4 mr-10 group-hover:from-white/70 group-hover:via-white/20 transition-all duration-300" />
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

