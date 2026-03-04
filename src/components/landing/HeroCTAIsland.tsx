import { useState, useEffect, useRef } from 'react';

interface HeroCTAItem {
  title: string;
  description: string;
  href: string;
}

interface HeroCTAIslandProps {
  ctas: HeroCTAItem[];
}

const LG_BREAKPOINT = 1024;

type CardState = 'default' | 'hovered' | 'dimmed';

export default function HeroCTAIsland({ ctas }: HeroCTAIslandProps) {
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= LG_BREAKPOINT);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  if (ctas.length === 0) return null;

  const handleMouseEnter = (index: number) => {
    if (isLargeScreen) setActiveIndex(index);
  };

  const handleMouseLeave = () => {
    if (isLargeScreen) setActiveIndex(-1);
  };

  const getCardState = (index: number): CardState => {
    if (activeIndex === -1) return 'default';
    if (activeIndex === index) return 'hovered';
    return 'dimmed';
  };

  // Compute internal divider borders per item:
  // Mobile (2-col): right border on left-col items, bottom border on non-last-row items
  // Desktop (N-col single row): right border on all except last item
  const getBorderClasses = (index: number): string => {
    if (ctas.length === 1) return '';

    const classes: string[] = ['border-white/[0.06]'];
    const total = ctas.length;
    const isLeftCol = index % 2 === 0;
    const row = Math.floor(index / 2);
    const totalRows = Math.ceil(total / 2);
    const hasRightNeighbor = isLeftCol && index + 1 < total;
    const isLastRow = row === totalRows - 1;
    const isLast = index === total - 1;

    if (hasRightNeighbor) classes.push('border-r');
    if (!isLastRow) classes.push('border-b');

    classes.push('lg:border-b-0');
    if (!hasRightNeighbor && !isLast) classes.push('lg:border-r');

    return classes.join(' ');
  };

  const gridColsClass: Record<number, string> = {
    1: 'lg:grid-cols-1',
    2: 'lg:grid-cols-2',
    3: 'lg:grid-cols-3',
    4: 'lg:grid-cols-4',
  };
  const gridCols = gridColsClass[ctas.length] || 'lg:grid-cols-3';
  const mobileGridCols = ctas.length === 1 ? 'grid-cols-1' : 'grid-cols-2';

  return (
    <div className="relative mt-auto pb-3 sm:pb-5 lg:pb-12">
      <div
        ref={gridRef}
        className={`grid ${mobileGridCols} ${gridCols}
          rounded-xl overflow-hidden
          bg-black/20 backdrop-blur-md
          border border-white/[0.06]
          max-w-6xl mx-auto`}
        onMouseLeave={handleMouseLeave}
      >
        {ctas.map((cta, index) => {
          const state = getCardState(index);
          const isHovered = state === 'hovered';
          const isDimmed = state === 'dimmed';

          return (
            <a
              key={index}
              href={cta.href}
              onMouseEnter={() => handleMouseEnter(index)}
              className={`block px-3 py-2.5 sm:p-4 lg:p-5
                transition-all duration-300 ease-out
                ${getBorderClasses(index)}
                ${isHovered ? 'bg-white/[0.05]' : ''}
                ${isDimmed ? 'lg:opacity-50' : ''}`}
            >
              <div className="flex items-baseline justify-between gap-2">
                <p
                  className={`text-sm sm:text-base lg:text-xl font-semibold transition-colors duration-300
                    ${isHovered ? 'text-white' : 'text-bears-accent'}`}
                >
                  {cta.title}
                </p>
                <span
                  className={`text-white/40 text-xs flex-shrink-0 transition-all duration-300
                    ${isHovered
                      ? 'lg:opacity-100 lg:translate-x-0'
                      : 'lg:opacity-0 lg:-translate-x-1'}`}
                  aria-hidden="true"
                >
                  &rarr;
                </span>
              </div>
              <p
                className={`hidden sm:block mt-1.5 text-sm leading-relaxed transition-colors duration-300
                  ${isHovered ? 'text-white/70' : 'text-white/45'}`}
              >
                {cta.description}
              </p>
            </a>
          );
        })}
      </div>
    </div>
  );
}
