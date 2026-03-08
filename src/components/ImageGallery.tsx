"use client";

import Image from "next/image";
import { useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface ImageGalleryProps {
  images: string[];
  title: string;
}

export default function ImageGallery({ images, title }: ImageGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const validImages = images.filter((img) => img.startsWith("http"));
  if (validImages.length === 0) return null;

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = "";
  };

  const goNext = () => setCurrentIndex((prev) => (prev + 1) % validImages.length);
  const goPrev = () => setCurrentIndex((prev) => (prev - 1 + validImages.length) % validImages.length);

  return (
    <>
      {/* === Desktop: Bento Grid === */}
      <div className="hidden md:block max-w-7xl mx-auto px-6 lg:px-8 mt-6">
        {validImages.length >= 5 ? (
          <div className="grid grid-cols-4 grid-rows-2 gap-2 rounded-2xl overflow-hidden h-[55vh] cursor-pointer">
            <div className="col-span-2 row-span-2 relative" onClick={() => openLightbox(0)}>
              <Image src={validImages[0]} alt={title} fill className="object-cover hover:brightness-90 transition-all" priority />
            </div>
            {validImages.slice(1, 5).map((img, idx) => (
              <div key={idx} className="relative" onClick={() => openLightbox(idx + 1)}>
                <Image src={img} alt={`${title} ${idx + 2}`} fill className="object-cover hover:brightness-90 transition-all" />
                {idx === 3 && validImages.length > 5 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center hover:bg-black/40 transition-all">
                    <span className="text-white font-bold text-lg">+{validImages.length - 5} รูป</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : validImages.length >= 2 ? (
          <div className="grid grid-cols-3 gap-2 rounded-2xl overflow-hidden h-[50vh] cursor-pointer">
            <div className="col-span-2 relative" onClick={() => openLightbox(0)}>
              <Image src={validImages[0]} alt={title} fill className="object-cover hover:brightness-90 transition-all" priority />
            </div>
            <div className="flex flex-col gap-2">
              {validImages.slice(1, 3).map((img, idx) => (
                <div key={idx} className="relative flex-1" onClick={() => openLightbox(idx + 1)}>
                  <Image src={img} alt={`${title} ${idx + 2}`} fill className="object-cover hover:brightness-90 transition-all" />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="relative h-[50vh] rounded-2xl overflow-hidden cursor-pointer" onClick={() => openLightbox(0)}>
            <Image src={validImages[0]} alt={title} fill className="object-cover hover:brightness-90 transition-all" priority />
          </div>
        )}
      </div>

      {/* === Mobile: Cover + Horizontal Scroll Thumbnails === */}
      <div className="md:hidden">
        {/* Cover image */}
        <div className="relative h-[35vh] cursor-pointer" onClick={() => openLightbox(0)}>
          <Image src={validImages[0]} alt={title} fill className="object-cover" priority />
          <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs font-bold px-3 py-1.5 rounded-full">
            📸 {validImages.length} รูป
          </div>
        </div>

        {/* Horizontal scroll strip */}
        {validImages.length > 1 && (
          <div className="flex gap-1.5 overflow-x-auto py-2 px-2 scrollbar-hide">
            {validImages.map((img, idx) => (
              <div
                key={idx}
                className="relative flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden cursor-pointer border-2 border-transparent hover:border-primary-500 transition-all"
                onClick={() => openLightbox(idx)}
              >
                <Image src={img} alt={`${title} ${idx + 1}`} fill className="object-cover" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* === Lightbox (Full Screen Overlay) === */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center" onClick={closeLightbox}>
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-60 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full transition-all"
            title="ปิด"
          >
            <X size={24} />
          </button>

          {/* Image counter */}
          <div className="absolute top-4 left-4 text-white/80 text-sm font-medium">
            {currentIndex + 1} / {validImages.length}
          </div>

          {/* Previous button */}
          {validImages.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); goPrev(); }}
              className="absolute left-2 md:left-6 z-60 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-all"
              title="รูปก่อนหน้า"
            >
              <ChevronLeft size={28} />
            </button>
          )}

          {/* Main image */}
          <div
            className="relative w-[90vw] h-[80vh] max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={validImages[currentIndex]}
              alt={`${title} ${currentIndex + 1}`}
              fill
              className="object-contain"
              sizes="90vw"
            />
          </div>

          {/* Next button */}
          {validImages.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); goNext(); }}
              className="absolute right-2 md:right-6 z-60 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-all"
              title="รูปถัดไป"
            >
              <ChevronRight size={28} />
            </button>
          )}

          {/* Thumbnail strip at bottom */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 px-4 overflow-x-auto">
            {validImages.map((img, idx) => (
              <div
                key={idx}
                className={`relative flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden cursor-pointer transition-all ${
                  idx === currentIndex ? "ring-2 ring-white brightness-100" : "brightness-50 hover:brightness-75"
                }`}
                onClick={(e) => { e.stopPropagation(); setCurrentIndex(idx); }}
              >
                <Image src={img} alt={`thumb ${idx + 1}`} fill className="object-cover" />
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
