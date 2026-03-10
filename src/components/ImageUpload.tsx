"use client";

import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { ImagePlus, X, ArrowLeft, ArrowRight, Star, Loader2, ImageIcon } from "lucide-react";
import { useRef, useCallback } from "react";

interface ImageUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
}

export default function ImageUpload({ value, onChange }: ImageUploadProps) {
  // Use ref to avoid stale closure when multiple uploads fire quickly
  const valueRef = useRef(value);
  valueRef.current = value;

  const handleUpload = useCallback((result: any) => {
    if (result?.info?.secure_url) {
      const newUrls = [...valueRef.current, result.info.secure_url];
      valueRef.current = newUrls;
      onChange(newUrls);
    }
  }, [onChange]);

  const handleRemove = (urlToRemove: string) => {
    onChange(value.filter((url) => url !== urlToRemove));
  };

  const moveLeft = (index: number) => {
    if (index === 0) return;
    const newUrls = [...value];
    [newUrls[index - 1], newUrls[index]] = [newUrls[index], newUrls[index - 1]];
    onChange(newUrls);
  };

  const moveRight = (index: number) => {
    if (index === value.length - 1) return;
    const newUrls = [...value];
    [newUrls[index + 1], newUrls[index]] = [newUrls[index], newUrls[index + 1]];
    onChange(newUrls);
  };

  const makeCover = (index: number) => {
    if (index === 0) return;
    const newUrls = [...value];
    const [moved] = newUrls.splice(index, 1);
    newUrls.unshift(moved);
    onChange(newUrls);
  };

  return (
    <div className="space-y-6">
      {/* Image Previews */}
      {value.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {value.map((url, index) => (
            <div
              key={url}
              className={`relative aspect-square rounded-3xl overflow-hidden border-4 transition-all group ${
                index === 0 ? "border-primary-500 ring-4 ring-primary-500/10 shadow-lg scale-100" : "border-white shadow-sm hover:border-primary-100"
              }`}
            >
              <Image
                src={url}
                alt={`Uploaded ${index + 1}`}
                fill
                className="object-cover"
              />
              
              {/* Overlay Controls */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                <div className="flex justify-between items-start">
                   <button
                    type="button"
                    onClick={() => handleRemove(url)}
                    className="bg-red-500/80 hover:bg-red-600 text-white p-2 rounded-xl transition-all shadow-lg active:scale-90"
                    title="Remove"
                  >
                    <X size={14} />
                  </button>
                  
                  {index !== 0 && (
                    <button
                      type="button"
                      onClick={() => makeCover(index)}
                      className="bg-primary-600/90 hover:bg-primary-600 text-white p-2 rounded-xl transition-all shadow-lg active:scale-90"
                      title="Set as Cover"
                    >
                      <Star size={14} fill="currentColor" />
                    </button>
                  )}
                </div>

                <div className="flex justify-center gap-2">
                   <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => moveLeft(index)}
                    aria-label="Move Image Left"
                    className="bg-white/90 hover:bg-white text-primary-950 p-2 rounded-xl transition-all shadow-md disabled:opacity-30 disabled:cursor-not-allowed active:scale-90"
                  >
                    <ArrowLeft size={16} />
                  </button>
                  <button
                    type="button"
                    disabled={index === value.length - 1}
                    onClick={() => moveRight(index)}
                    aria-label="Move Image Right"
                    className="bg-white/90 hover:bg-white text-primary-950 p-2 rounded-xl transition-all shadow-md disabled:opacity-30 disabled:cursor-not-allowed active:scale-90"
                  >
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>

              {/* Cover Badge */}
              {index === 0 && (
                <div className="absolute top-3 left-3 bg-primary-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
                  <Star size={10} fill="currentColor" /> Cover Image
                </div>
              )}

              {/* Index Badge */}
              {index !== 0 && (
                <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-md text-white text-[10px] font-black px-2 py-1 rounded-lg">
                  #{index + 1}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upload Button Area */}
      <CldUploadWidget
        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
        onSuccess={handleUpload}
        options={{
          maxFiles: 20,
          multiple: true,
          sources: ["local", "url", "camera"],
          resourceType: "image",
          styles: {
            palette: {
               window: "#FFFFFF",
               windowBorder: "#E5E7EB",
               tabIcon: "#950000",
               menuIcons: "#4B5563",
               textDark: "#000000",
               textLight: "#FFFFFF",
               link: "#950000",
               action: "#950000",
               inactiveTabIcon: "#9CA3AF",
               error: "#EF4444",
               inProgress: "#950000",
               complete: "#10B981",
               sourceBg: "#F9FAFB"
            }
          }
        }}
      >
        {({ open }) => (
          <button
            type="button"
            onClick={() => open()}
            className="w-full relative group"
          >
            <div className="w-full bg-primary-50/30 border-4 border-dashed border-primary-100 group-hover:border-primary-500 group-hover:bg-primary-50 rounded-[40px] p-12 lg:p-20 flex flex-col items-center gap-6 transition-all duration-300">
               <div className="w-24 h-24 bg-white rounded-[32px] shadow-sm flex items-center justify-center text-primary-200 group-hover:text-primary-600 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500 border border-primary-50">
                  <ImagePlus size={48} />
               </div>
               <div className="text-center space-y-2">
                  <h4 className="text-xl font-black text-primary-950">Add Property Photos</h4>
                  <p className="text-primary-900/40 text-sm font-bold">Recommended: High quality 16:9 landscape images.</p>
               </div>
               <div className="flex gap-4">
                  <div className="bg-white px-4 py-2 rounded-full border border-primary-100 text-[10px] font-black uppercase tracking-widest text-primary-400">JPG / PNG / WEBP</div>
                  <div className="bg-white px-4 py-2 rounded-full border border-primary-100 text-[10px] font-black uppercase tracking-widest text-primary-400">Up to 20 files</div>
               </div>
            </div>
          </button>
        )}
      </CldUploadWidget>
    </div>
  );
}

