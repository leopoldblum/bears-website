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
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const justPositionedRef = useRef(false);
  const prevCtasRef = useRef<HeroCTAItem[]>(ctas);
  const containerRef = useRef<HTMLDivElement>(null);
  const ctaRefs = useRef<(HTMLDivElement | null)[]>([]);
  const gridRef = useRef<HTMLDivElement>(null);

  // Reset animation state when CTAs change
  useEffect(() => {
    const prevCtas = prevCtasRef.current;
    const ctasChanged = prevCtas.length !== ctas.length ||
      prevCtas.some((cta, i) =>
        cta.href !== ctas[i]?.href ||
        cta.title !== ctas[i]?.title
      );

    if (ctasChanged) {
      setHasAnimated(false);
      setActiveIndex(-1);
      // Reset position to center of new CTAs
      if (gridRef.current && containerRef.current) {
        const timer = setTimeout(() => {
          if (gridRef.current && containerRef.current && ctaRefs.current[0]) {
            const gridRect = gridRef.current.getBoundingClientRect();
            const containerRect = containerRef.current.getBoundingClientRect();
            const centerIndex = Math.floor(ctas.length / 2);
            const referenceCta = ctaRefs.current[centerIndex] || ctaRefs.current[0];
            if (referenceCta) {
              const ctaRect = referenceCta.getBoundingClientRect();
              setGradientPos({
                left: ctaRect.left - containerRect.left,
                width: 0,
                height: gridRect.height + 32
              });
            }
          }
        }, 0);
        return () => clearTimeout(timer);
      }
    }
    prevCtasRef.current = ctas;
  }, [ctas]);

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
      justPositionedRef.current = true;
    }
  }, []);

  const resetGradient = useCallback(() => {
    setActiveIndex(-1);
  }, []);

  // Enable transitions after first positioning is complete
  useEffect(() => {
    if (justPositionedRef.current) {
      // Small delay to ensure the position has been rendered without transition
      const timer = setTimeout(() => {
        setHasAnimated(true);
        justPositionedRef.current = false;
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [gradientPos]);

  // Initialize gradient position after refs are populated
  useEffect(() => {
    const initializePosition = () => {
      if (gridRef.current && containerRef.current && ctaRefs.current[0]) {
        const gridRect = gridRef.current.getBoundingClientRect();
        const containerRect = containerRef.current.getBoundingClientRect();
        // Find the center CTA or use the first one as fallback
        const centerIndex = Math.floor(ctas.length / 2);
        const referenceCta = ctaRefs.current[centerIndex] || ctaRefs.current[0];
        if (referenceCta) {
          const ctaRect = referenceCta.getBoundingClientRect();
          // Set initial position but keep invisible (width=0)
          setGradientPos({
            left: ctaRect.left - containerRect.left,
            width: 0,
            height: gridRect.height + 32
          });
        }
      }
    };

    // Try immediately
    initializePosition();
    // And also after a short delay to ensure DOM is ready
    const timer = setTimeout(initializePosition, 100);
    return () => clearTimeout(timer);
  }, [ctas.length]);
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

  // Dynamic grid columns based on CTA count
  const gridColsClass: Record<number, string> = {
    1: 'lg:grid-cols-1',
    2: 'lg:grid-cols-2',
    3: 'lg:grid-cols-3',
    4: 'lg:grid-cols-4',
  };
  const gridCols = gridColsClass[ctas.length] || 'lg:grid-cols-3';

  // Mobile: use 2 cols when there are 3+ CTAs to avoid vertical overflow
  const mobileGridCols = ctas.length >= 3 ? 'grid-cols-2' : 'grid-cols-1';

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
      {/* Glow layer - larger, more blurred version for ethereal effect */}
      <svg
        className="absolute bottom-0 pointer-events-none overflow-visible"
        style={{
          left: `${rectLeft - bottomWidth - 40}px`,
          width: `${expandedWidth + bottomWidth * 2}px`,
          height: `${rectHeight + curveHeight}px`,
          opacity: activeIndex >= 0 ? 0.5 : 0,
          filter: 'blur(20px)',
          transform: 'scale(1.1)',
          transformOrigin: 'center bottom',
          clipPath: activeIndex >= 0 ? 'inset(0 0 0 0)' : 'inset(100% 0 0 0)',
          transition: hasAnimated
            ? 'left 500ms ease-out, width 500ms ease-out, opacity 500ms ease-out, clip-path 500ms ease-out'
            : 'opacity 500ms ease-out, clip-path 500ms ease-out',
        }}
        viewBox={`${-bottomWidth} ${-curveHeight} ${expandedWidth + bottomWidth * 2} ${rectHeight + curveHeight}`}
        preserveAspectRatio="none"
      >
        <defs>
          <radialGradient id="ctaGlowGradient" cx="50%" cy="100%" r="70%" fx="50%" fy="100%">
            <stop offset="0%" stopColor="#C50E1F" stopOpacity="0.3" />
            <stop offset="40%" stopColor="var(--color-bears-bg)" stopOpacity="0.5" />
            <stop offset="100%" stopColor="var(--color-bears-bg)" stopOpacity="0" />
          </radialGradient>
        </defs>
        <path
          d={svgPath}
          fill="url(#ctaGlowGradient)"
          style={{
            transition: 'all 500ms ease-out',
          }}
        />
      </svg>

      {/* Main shape with one smooth continuous curve */}
      <svg
        className="absolute bottom-0 pointer-events-none overflow-visible"
        style={{
          left: `${rectLeft - bottomWidth - 40}px`,
          width: `${expandedWidth + bottomWidth * 2}px`,
          height: `${rectHeight + curveHeight}px`,
          opacity: activeIndex >= 0 ? 1 : 0,
          filter: 'blur(2px)',
          clipPath: activeIndex >= 0 ? 'inset(0 0 0 0)' : 'inset(100% 0 0 0)',
          transition: hasAnimated
            ? 'left 500ms ease-out, width 500ms ease-out, opacity 500ms ease-out, clip-path 500ms ease-out'
            : 'opacity 500ms ease-out, clip-path 500ms ease-out',
        }}
        viewBox={`${-bottomWidth} ${-curveHeight} ${expandedWidth + bottomWidth * 2} ${rectHeight + curveHeight}`}
        preserveAspectRatio="none"
      >
        <defs>
          <radialGradient id="ctaGradient" cx="50%" cy="100%" r="70%" fx="50%" fy="100%">
            <stop offset="0%" stopColor="var(--color-bears-bg)" stopOpacity="1" />
            <stop offset="50%" stopColor="var(--color-bears-bg)" stopOpacity="0.85" />
            <stop offset="100%" stopColor="var(--color-bears-bg)" stopOpacity="0" />
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
        className={`relative z-10 grid ${mobileGridCols} ${gridCols} gap-x-5 gap-y-3 sm:gap-6 lg:gap-8 max-w-6xl`}
        onMouseLeave={() => isLargeScreen && resetGradient()}
      >
        {ctas.map((cta, index) => (
          <div
            key={index}
            ref={(el) => { ctaRefs.current[index] = el; }}
            onMouseEnter={() => isLargeScreen && updateGradient(index)}
            className={`relative z-10 transition-all duration-300 ease-out
              bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-3 sm:p-4
              lg:bg-transparent lg:backdrop-blur-none lg:border-0 lg:rounded-none lg:p-0
              active:scale-[0.98] active:bg-white/10 lg:active:scale-100 lg:active:bg-transparent
              ${activeIndex === index ? 'lg:scale-105' : 'lg:scale-100'}`}
          >
            <a
              href={cta.href}
              className="group block cursor-pointer transition-all duration-300"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-lg sm:text-2xl lg:text-3xl font-bold text-bears-accent group-hover:text-white transition-colors duration-300">
                  {cta.title}
                </p>
                <span className="lg:hidden text-white/30 text-sm flex-shrink-0" aria-hidden="true">&rarr;</span>
              </div>
              <div className="h-px lg:h-0.5 bg-gradient-to-r from-white/50 from-30% via-white/20 via-70% to-transparent my-1.5 sm:my-3 lg:my-4 sm:mr-10 rounded-full group-hover:from-white/70 group-hover:via-white/20 transition-all duration-300" />
              <p className="text-xs sm:text-base lg:text-lg text-bears-text-onDark leading-relaxed group-hover:text-white transition-colors duration-300">
                {cta.description}
              </p>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

