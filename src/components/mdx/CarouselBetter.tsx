import { useState, useEffect, useCallback, useRef, type ReactNode } from 'react';

interface CarouselBetterProps {
  autoScroll?: boolean;
  autoScrollInterval?: number;
  showArrows?: boolean;
  showDots?: boolean;
  minHeight?: string;
  children: ReactNode;
}

export default function CarouselBetter({
  autoScroll = false,
  autoScrollInterval = 5000,
  showArrows = true,
  showDots = true,
  minHeight = 'min-h-[400px]',
  children,
}: CarouselBetterProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [totalSlides, setTotalSlides] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<MutationObserver | null>(null);

  // Initialize: detect slides from DOM and apply positioning
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let rafId: number | undefined;

    const applySlideStyles = (slideElements: HTMLElement[], currentIndex: number) => {
      slideElements.forEach((slide, index) => {
        // Position slide to fill full width between arrows
        slide.style.position = 'absolute';
        slide.style.inset = '0';
        slide.style.width = '100%';
        slide.style.height = '100%';
        slide.style.display = 'flex';
        slide.style.alignItems = 'center';
        slide.style.justifyContent = 'center';
        slide.style.transition = 'opacity 300ms';

        if (index === currentIndex) {
          slide.style.opacity = '1';
          slide.style.pointerEvents = 'auto';
        } else {
          slide.style.opacity = '0';
          slide.style.pointerEvents = 'none';
        }

        // Fix intermediate containers to propagate flex centering
        const containers = slide.querySelectorAll('div');
        containers.forEach((cont) => {
          const el = cont as HTMLElement;
          el.style.display = 'flex';
          el.style.alignItems = 'center';
          el.style.justifyContent = 'center';
          el.style.width = '100%';
          el.style.height = '100%';
        });

        // Fix images to preserve aspect ratio while allowing full width
        const images = slide.querySelectorAll('img');
        images.forEach((img) => {
          const imgEl = img as HTMLImageElement;
          imgEl.style.objectFit = 'contain';
          imgEl.style.maxHeight = '100%';
          imgEl.style.maxWidth = '100%';
        });
      });
    };

    const initializeSlides = (): boolean => {
      // Astro wraps slot content in <astro-slot>, so check for that first
      const astroSlot = container.querySelector(':scope > astro-slot');
      const slideContainer = astroSlot || container;

      // Get direct children of the slot container
      const slideElements = Array.from(
        slideContainer.querySelectorAll(':scope > *')
      ) as HTMLElement[];
      const count = slideElements.length;

      // If no children found, signal that we need to retry
      if (count === 0) {
        return false;
      }

      setTotalSlides(count);
      applySlideStyles(slideElements, 0);
      setIsInitialized(true);
      return true;
    };

    // Try to initialize immediately
    if (!initializeSlides()) {
      // If immediate init failed, use requestAnimationFrame to wait for paint
      rafId = requestAnimationFrame(() => {
        if (!initializeSlides()) {
          // Still no children? Set up MutationObserver as final fallback
          observerRef.current = new MutationObserver(() => {
            if (initializeSlides()) {
              observerRef.current?.disconnect();
              observerRef.current = null;
            }
          });

          observerRef.current.observe(container, {
            childList: true,
            subtree: true,
          });

          // Safety timeout: disconnect observer after 5 seconds
          setTimeout(() => {
            if (observerRef.current) {
              observerRef.current.disconnect();
              observerRef.current = null;
            }
          }, 5000);
        }
      });
    }

    // Always return cleanup function
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, []);

  // Update slide visibility when currentSlide changes
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !isInitialized) return;

    // Astro wraps slot content in <astro-slot>
    const astroSlot = container.querySelector(':scope > astro-slot');
    const slideContainer = astroSlot || container;

    const slideElements = Array.from(
      slideContainer.querySelectorAll(':scope > *')
    ) as HTMLElement[];

    slideElements.forEach((slide, index) => {
      if (index === currentSlide) {
        slide.style.opacity = '1';
        slide.style.pointerEvents = 'auto';
      } else {
        slide.style.opacity = '0';
        slide.style.pointerEvents = 'none';
      }
    });
  }, [currentSlide, isInitialized]);

  // Navigation functions
  const nextSlide = useCallback(() => {
    if (totalSlides > 0) {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    if (totalSlides > 0) {
      setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
    }
  }, [totalSlides]);

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
  }, []);

  // Auto-scroll effect
  useEffect(() => {
    if (!autoScroll || isPaused || totalSlides <= 1) return;

    const interval = setInterval(() => {
      nextSlide();
    }, autoScrollInterval);

    return () => clearInterval(interval);
  }, [autoScroll, autoScrollInterval, isPaused, nextSlide, totalSlides]);

  // Arrow button component
  const ArrowButton = ({
    direction,
    onClick,
  }: {
    direction: 'prev' | 'next';
    onClick: () => void;
  }) => {
    const arrowPath = direction === 'prev' ? 'M15 19l-7-7 7-7' : 'M9 5l7 7-7 7';

    return (
      <button
        onClick={onClick}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-transparent border-2 border-bears-accent/40 text-bears-text-onDark hover:border-bears-accent hover:bg-bears-accent/10 hover:shadow-[0_0_20px_rgba(197,14,31,0.25)] hover:scale-105 active:bg-bears-accent/5 active:scale-100 transition-all duration-200 flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bears-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bears-bg cursor-pointer"
        aria-label={direction === 'prev' ? 'Previous slide' : 'Next slide'}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={arrowPath} />
        </svg>
      </button>
    );
  };

  return (
    <div className="w-full">
      {/* Carousel Container with Navigation */}
      <div className={`relative flex items-center justify-between gap-4 sm:gap-6 lg:gap-8 ${minHeight}`}>
        {showArrows && <ArrowButton direction="prev" onClick={prevSlide} />}

        {/* Slides Container */}
        <div
          ref={containerRef}
          className={`relative flex-1 overflow-hidden w-full ${minHeight}`}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {children}
        </div>

        {showArrows && <ArrowButton direction="next" onClick={nextSlide} />}
      </div>

      {/* Dot Indicators */}
      {showDots && totalSlides > 1 && (
        <div className="flex justify-center gap-2 sm:gap-3 mt-4 sm:mt-5 lg:mt-6">
          {Array.from({ length: totalSlides }, (_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4 rounded-full border transition-[background,border-color,box-shadow,transform] duration-200 cursor-pointer ${
                currentSlide === index
                  ? 'bg-gradient-to-b from-bears-accent to-bears-accent-muted border-bears-accent/30 shadow-[0_0_16px_rgba(197,14,31,0.5),0_2px_8px_rgba(0,0,0,0.4)] scale-110 hover:shadow-[0_0_20px_rgba(197,14,31,0.6),0_2px_8px_rgba(0,0,0,0.4)]'
                  : 'bg-white/10 backdrop-blur-sm border-white/20 shadow-[0_2px_8px_rgba(0,0,0,0.3)] hover:scale-105 hover:border-white/30'
              }`}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={currentSlide === index ? 'true' : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
}
