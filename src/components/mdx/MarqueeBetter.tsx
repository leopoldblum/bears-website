import { useState, useEffect, useRef, type ReactNode, type CSSProperties } from 'react';

interface MarqueeBetterProps {
  speed?: number;
  gap?: string;
  pauseOnHover?: boolean;
  height?: string;
  direction?: 'left' | 'right';
  children: ReactNode;
}

export default function MarqueeBetter({
  speed = 50,
  gap = '2rem',
  pauseOnHover = true,
  height = '16rem',
  direction = 'left',
  children,
}: MarqueeBetterProps) {
  const [isReady, setIsReady] = useState(false);
  const [animationDuration, setAnimationDuration] = useState('20s');
  const [clonedSets, setClonedSets] = useState(2);
  const [translateWidth, setTranslateWidth] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const content = contentRef.current;
    const container = containerRef.current;
    if (!content || !container) return;

    const initializeMarquee = async () => {
      // Wait for images to load (with 3s timeout fallback)
      const images = content.querySelectorAll('img');
      if (images.length > 0) {
        await Promise.race([
          Promise.all(
            Array.from(images).map(
              (img) =>
                new Promise<void>((resolve) => {
                  if ((img as HTMLImageElement).complete) {
                    resolve();
                  } else {
                    img.addEventListener('load', () => resolve(), { once: true });
                    img.addEventListener('error', () => resolve(), { once: true });
                  }
                })
            )
          ),
          new Promise<void>((resolve) => setTimeout(resolve, 3000)),
        ]);
      }

      // Get gap in pixels from the track container (which now has gap applied)
      const computedStyle = getComputedStyle(content);
      const gapPx = parseFloat(computedStyle.gap) || 0;

      // Measure the width of ONE content set (first child)
      const firstSet = content.querySelector('.marquee-content-set') as HTMLElement;
      const firstSetWidth = firstSet?.scrollWidth || content.scrollWidth;

      // Width to translate = one set + one gap (to reach the start of the next set)
      const singleSetWithGap = firstSetWidth + gapPx;

      // Measure container width
      const containerWidth = container.clientWidth;

      // Calculate how many sets we need to fill the container plus buffer
      let sets = 2;
      let totalSetsWidth = singleSetWithGap * sets;
      while (totalSetsWidth <= containerWidth * 2 && sets < 20) {
        sets++;
        totalSetsWidth = singleSetWithGap * sets;
      }
      sets++; // Add one more for seamless buffer

      setClonedSets(sets);

      // Store the exact pixel width to translate
      setTranslateWidth(singleSetWithGap);

      // Calculate animation duration based on speed
      const duration = singleSetWithGap / speed;
      setAnimationDuration(`${duration}s`);

      setIsReady(true);
    };

    initializeMarquee();
  }, [speed, children]);

  // Create cloned content for seamless loop
  const contentSets = Array.from({ length: clonedSets }, (_, i) => (
    <div
      key={i}
      className="marquee-content-set flex items-center shrink-0"
      style={{ gap, height }}
    >
      {children}
    </div>
  ));

  const trackStyle: CSSProperties = {
    '--marquee-duration': animationDuration,
    '--marquee-translate': `-${translateWidth}px`,
    gap, // Apply gap between content sets
  } as CSSProperties;

  return (
    <div ref={containerRef} className="w-full overflow-hidden">
      <div
        ref={contentRef}
        className={`flex w-max will-change-transform ${isReady ? 'marquee-animate' : ''} ${
          direction === 'right' ? 'marquee-reverse' : ''
        } ${pauseOnHover ? 'marquee-pause-on-hover' : ''}`}
        style={trackStyle}
      >
        {contentSets}
      </div>

      <style>{`
        .marquee-animate {
          animation: marquee-scroll var(--marquee-duration, 20s) linear infinite;
        }

        .marquee-animate.marquee-reverse {
          animation-direction: reverse;
        }

        .marquee-pause-on-hover:hover {
          animation-play-state: paused;
        }

        .marquee-content-set > * {
          height: 100%;
          width: auto;
          flex-shrink: 0;
        }

        .marquee-content-set img {
          height: 100%;
          width: auto;
          object-fit: cover;
        }

        @keyframes marquee-scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(var(--marquee-translate, -100%));
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .marquee-animate {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
