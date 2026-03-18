"use client";

import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { ImagePlus, X, ArrowLeft, ArrowRight, Star, Loader2, ImageIcon } from "lucide-react";
import { useRef, useCallback, useState } from "react";

interface ImageUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
}

export default function ImageUpload({ value, onChange }: ImageUploadProps) {
  // Use ref to avoid stale closure when multiple uploads fire quickly
  const valueRef = useRef(value);
  valueRef.current = value;
  const [isDragging, setIsDragging] = useState(false);
  const [uploadingCount, setUploadingCount] = useState(0);

  const uploadFile = async (file: File) => {
    setUploadingCount(prev => prev + 1);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "cm_real_estate");

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/dcsnbthca/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      if (data.secure_url) {
        const newUrls = [...valueRef.current, data.secure_url];
        valueRef.current = newUrls;
        onChange(newUrls);
      }
    } catch (error) {
      console.error("Manual Drop Upload Error:", error);
    } finally {
      setUploadingCount(prev => Math.max(0, prev - 1));
    }
  };

  const onDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length === 0) return;

    // Filter for images only
    const imageFiles = files.filter(file => file.type.startsWith("image/"));
    if (imageFiles.length === 0) return;

    // Upload files sequentially or in parallel
    await Promise.all(imageFiles.map(file => uploadFile(file)));
  }, [onChange]);

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

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
        uploadPreset="cm_real_estate"
        onSuccess={handleUpload}
        options={{
          maxFiles: 20,
          multiple: true,
          sources: ["local", "url", "camera"],
          resourceType: "image",
          clientAllowedFormats: ["jpg", "png", "webp", "jpeg"],
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
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            disabled={uploadingCount > 0}
            className={`w-full relative group transition-all duration-300 ${
              isDragging ? "scale-[0.98]" : "scale-100"
            }`}
          >
            <div className={`w-full rounded-[40px] p-12 lg:p-20 flex flex-col items-center gap-6 transition-all duration-500 border-4 border-dashed ${
              isDragging 
                ? "bg-primary-600/5 border-primary-600 ring-8 ring-primary-600/5" 
                : "bg-primary-50/30 border-primary-100 group-hover:border-primary-500 group-hover:bg-primary-50"
            }`}>
               {uploadingCount > 0 ? (
                 <div className="w-24 h-24 bg-white rounded-[32px] shadow-sm flex items-center justify-center text-primary-600 border border-primary-100">
                    <Loader2 size={48} className="animate-spin" />
                 </div>
               ) : (
                 <div className={`w-24 h-24 bg-white rounded-[32px] shadow-sm flex items-center justify-center transition-all duration-500 border border-primary-50 ${
                   isDragging 
                    ? "text-primary-600 scale-110 rotate-0" 
                    : "text-primary-200 group-hover:text-primary-600 group-hover:scale-110 group-hover:-rotate-6"
                 }`}>
                    <ImagePlus size={48} />
                 </div>
               )}
               
               <div className="text-center space-y-2">
                  <h4 className="text-xl font-black text-primary-950">
                    {isDragging ? "วางรูปที่นี่เพื่ออัปโหลด" : uploadingCount > 0 ? `กำลังอัปโหลด ${uploadingCount} รูป...` : "Add Property Photos"}
                  </h4>
                  <p className={`text-sm font-bold transition-colors ${isDragging ? "text-primary-600" : "text-primary-900/40"}`}>
                    {isDragging ? "Drop images to start uploading automatically" : "Recommended: High quality 16:9 landscape images."}
                  </p>
               </div>
               
               {!isDragging && uploadingCount === 0 && (
                 <div className="flex gap-4">
                    <div className="bg-white px-4 py-2 rounded-full border border-primary-100 text-[10px] font-black uppercase tracking-widest text-primary-400">JPG / PNG / WEBP</div>
                    <div className="bg-white px-4 py-2 rounded-full border border-primary-100 text-[10px] font-black uppercase tracking-widest text-primary-400">Up to 20 files</div>
                 </div>
               )}
            </div>
          </button>
        )}
      </CldUploadWidget>
    </div>
  );
}

