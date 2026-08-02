'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

type PropertyGalleryProps = {
  images: string[];
  title: string;
};

export default function PropertyGallery({
  images,
  title,
}: PropertyGalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const activeImage =
    activeIndex !== null ? images[activeIndex] : null;

  function previousImage() {
    setActiveIndex((current) => {
      if (current === null) return 0;
      return current === 0 ? images.length - 1 : current - 1;
    });
  }

  function nextImage() {
    setActiveIndex((current) => {
      if (current === null) return 0;
      return current === images.length - 1 ? 0 : current + 1;
    });
  }

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (activeIndex === null) return;

      if (event.key === 'Escape') {
        setActiveIndex(null);
      }

      if (event.key === 'ArrowLeft') {
        previousImage();
      }

      if (event.key === 'ArrowRight') {
        nextImage();
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeIndex, images.length]);

  useEffect(() => {
    document.body.style.overflow =
      activeIndex === null ? '' : 'hidden';

    return () => {
      document.body.style.overflow = '';
    };
  }, [activeIndex]);

  return (
    <>
      <div className="gallery">
        {images.map((image, index) => (
          <button
            type="button"
            key={`${image}-${index}`}
            className={index === 0 ? 'galleryLarge' : ''}
            onClick={() => setActiveIndex(index)}
            aria-label={`Hap fotografinë ${index + 1}`}
          >
            <Image
              src={image}
              alt={`${title} – fotografia ${index + 1}`}
              fill
              sizes={
                index === 0
                  ? '(max-width: 850px) 100vw, 60vw'
                  : '(max-width: 850px) 100vw, 30vw'
              }
              className="galleryImage"
            />
          </button>
        ))}
      </div>

      {activeImage && activeIndex !== null && (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Galeria e fotografive"
        >
          <button
            type="button"
            className="lightboxClose"
            onClick={() => setActiveIndex(null)}
            aria-label="Mbyll galerinë"
          >
            <X />
          </button>

          {images.length > 1 && (
            <button
              type="button"
              className="lightboxArrow lightboxArrowLeft"
              onClick={previousImage}
              aria-label="Fotografia e mëparshme"
            >
              <ChevronLeft />
            </button>
          )}

          <div className="lightboxImageWrap">
            <Image
              src={activeImage}
              alt={`${title} – fotografia ${activeIndex + 1}`}
              fill
              priority
              sizes="100vw"
              className="lightboxImage"
            />
          </div>

          {images.length > 1 && (
            <button
              type="button"
              className="lightboxArrow lightboxArrowRight"
              onClick={nextImage}
              aria-label="Fotografia tjetër"
            >
              <ChevronRight />
            </button>
          )}

          <div className="lightboxCounter">
            {activeIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
}