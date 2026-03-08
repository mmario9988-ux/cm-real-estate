"use client";

import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { ImagePlus, X, GripVertical } from "lucide-react";
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

  // Move image to first position (make it cover)
  const makeCover = (index: number) => {
    if (index === 0) return;
    const newUrls = [...value];
    const [moved] = newUrls.splice(index, 1);
    newUrls.unshift(moved);
    onChange(newUrls);
  };

  return (
    <div>
      {/* Image Previews */}
      {value.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
          {value.map((url, index) => (
            <div
              key={url}
              className="relative aspect-video rounded-xl overflow-hidden border-2 border-gray-200 group"
            >
              <Image
                src={url}
                alt={`Uploaded ${index + 1}`}
                fill
                className="object-cover"
              />
              {/* Remove button */}
              <button
                type="button"
                onClick={() => handleRemove(url)}
                title="Remove image"
                className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
              >
                <X size={14} />
              </button>
              {/* Make cover button (shown on non-cover images) */}
              {index !== 0 && (
                <button
                  type="button"
                  onClick={() => makeCover(index)}
                  title="ตั้งเป็นรูปปก"
                  className="absolute bottom-2 right-2 bg-black/70 hover:bg-black text-white text-[10px] font-bold px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ตั้งเป็นปก
                </button>
              )}
              {/* Cover badge */}
              {index === 0 && (
                <span className="absolute bottom-2 left-2 bg-primary-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  COVER
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upload Button */}
      <CldUploadWidget
        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
        onSuccess={handleUpload}
        options={{
          maxFiles: 20,
          multiple: true,
          sources: ["local", "url", "camera"],
          resourceType: "image",
        }}
      >
        {({ open }) => (
          <button
            type="button"
            onClick={() => open()}
            className="w-full border-2 border-dashed border-gray-300 hover:border-primary-500 rounded-xl p-8 flex flex-col items-center gap-3 text-gray-500 hover:text-primary-600 transition-all hover:bg-primary-50/50 cursor-pointer"
          >
            <ImagePlus size={36} />
            <span className="text-sm font-medium">
              คลิกเพื่ออัปโหลดรูปภาพ
            </span>
            <span className="text-xs">
              {value.length > 0
                ? `อัปโหลดแล้ว ${value.length} รูป — คลิกเพื่อเพิ่มอีก`
                : "รองรับ JPG, PNG, WebP — ไม่จำกัดจำนวน"}
            </span>
          </button>
        )}
      </CldUploadWidget>
    </div>
  );
}
