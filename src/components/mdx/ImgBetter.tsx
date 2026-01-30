import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

interface ImgBetterProps {
  src: string;
  blurSrc?: string;
  modalSrc?: string;
  alt: string;
  srcSet?: string;
  sizes?: string;
  className?: string;
  width?: number | string;
  height?: number;
  loading?: 'eager' | 'lazy';
  enableClickToEnlarge?: boolean;
}

export default function ImgBetter({
  src,
  blurSrc,
  modalSrc,
  alt,
  srcSet,
  sizes = '100vw',
  className = '',
  width,
  height,
  loading = 'lazy',
  enableClickToEnlarge = true,
}: ImgBetterProps) {
  const [loaded, setLoaded] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Set mounted state for portal rendering (avoid SSR mismatch)
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Check if image is already loaded (handles cached images AND late hydration)
  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    // Check if already loaded
    if (img.complete && img.naturalWidth > 0) {
      setLoaded(true);
      return;
    }

    // Fallback: listen for load event in case it fires after this effect runs
    const handleLoad = () => setLoaded(true);
    img.addEventListener('load', handleLoad);
    return () => img.removeEventListener('load', handleLoad);
  }, []);

  // Escape key handler for modal
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setModalOpen(false);
    };
    if (modalOpen) {
      window.addEventListener('keydown', handler);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [modalOpen]);

  const handleImageClick = () => {
    if (enableClickToEnlarge && modalSrc) {
      setModalOpen(true);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    // Close when clicking the backdrop (not the image)
    if (e.target === e.currentTarget) {
      setModalOpen(false);
    }
  };

  // Parse width for style
  const widthStyle = typeof width === 'number' ? `${width}px` : width;

  return (
    <>
      <div
        className={`relative overflow-hidden ${enableClickToEnlarge && modalSrc ? 'cursor-pointer' : ''}`}
        style={{
          width: widthStyle,
          height: height ? `${height}px` : undefined,
        }}
        onClick={handleImageClick}
      >
        {/* Blur placeholder */}
        {blurSrc && (
          <img
            src={blurSrc}
            alt=""
            aria-hidden="true"
            className={`absolute inset-0 w-full h-full object-cover blur-xl scale-110 transition-opacity duration-500 ${
              loaded ? 'opacity-0' : 'opacity-100'
            }`}
          />
        )}

        {/* Main image */}
        <img
          ref={imgRef}
          src={src}
          srcSet={srcSet}
          sizes={sizes}
          alt={alt}
          width={typeof width === 'number' ? width : undefined}
          height={height}
          loading={loading}
          onLoad={() => setLoaded(true)}
          className={`w-full h-full object-cover transition-opacity duration-500 ${
            loaded ? 'opacity-100' : 'opacity-0'
          } ${className}`}
        />
      </div>

      {/* Modal via Portal */}
      {isMounted &&
        modalOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 p-4 motion-safe:animate-fade-in"
            onClick={handleBackdropClick}
            role="dialog"
            aria-modal="true"
            aria-label={`Enlarged view: ${alt}`}
          >
            {/* Close button */}
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 z-[10000] p-2 text-white bg-black/50 rounded-full hover:bg-black/70 transition-colors"
              aria-label="Close enlarged image"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Modal image */}
            <img
              src={modalSrc}
              alt={alt}
              className="max-w-full max-h-full object-contain"
            />
          </div>,
          document.body
        )}
    </>
  );
}
