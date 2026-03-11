"use client";

import { CldUploadWidget } from "next-cloudinary";
import { ImagePlus, X, ImageIcon, Loader2 } from "lucide-react";
import Image from "next/image";

interface BlogImageUploadProps {
  value: string;
  onChange: (url: string) => void;
}

export default function BlogImageUpload({ value, onChange }: BlogImageUploadProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-bold text-gray-700 uppercase tracking-wider italic">
          Featured Image (รูปภาพประกอบบทความ)
        </label>
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="text-xs font-bold text-red-500 hover:text-red-700 flex items-center gap-1 transition-colors"
          >
            <X size={14} /> Remove Image
          </button>
        )}
      </div>

      {value && value.startsWith('http') ? (
        <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-gray-100 group shadow-sm">
          <Image
            src={value}
            alt="Blog Featured Image"
            fill
            className="object-cover"
            unoptimized
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <CldUploadWidget
              uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
              onSuccess={(result: any) => {
                if (result?.info?.secure_url) {
                  onChange(result.info.secure_url);
                }
              }}
              options={{
                maxFiles: 1,
                resourceType: "image",
              }}
            >
              {({ open }) => (
                <button
                  type="button"
                  onClick={() => open()}
                  className="bg-white/90 hover:bg-white text-gray-900 px-4 py-2 rounded-xl font-bold text-sm shadow-lg flex items-center gap-2 transition-all active:scale-95"
                >
                  <ImagePlus size={18} /> เปลี่ยนรูปภาพ
                </button>
              )}
            </CldUploadWidget>
          </div>
        </div>
      ) : (
        <CldUploadWidget
          uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
          onSuccess={(result: any) => {
            if (result?.info?.secure_url) {
              onChange(result.info.secure_url);
            }
          }}
          options={{
            maxFiles: 1,
            resourceType: "image",
            styles: {
              palette: {
                window: "#FFFFFF",
                windowBorder: "#E5E7EB",
                tabIcon: "#950000",
                textDark: "#000000",
                link: "#950000",
                action: "#950000",
                inProgress: "#950000",
              }
            }
          }}
        >
          {({ open }) => (
            <button
              type="button"
              onClick={() => open()}
              className="w-full bg-gray-50 border-2 border-dashed border-gray-200 hover:border-primary-500 hover:bg-gray-100 rounded-2xl p-12 flex flex-col items-center gap-4 transition-all group"
            >
              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-gray-300 group-hover:text-primary-600 transition-colors border border-gray-100">
                <ImagePlus size={32} />
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-gray-900">คลิกเพื่ออัปโหลดรูปภาพ</p>
                <p className="text-xs text-gray-500 mt-1">แนะนำขนาด 16:9 หรือ 1200x675px</p>
              </div>
            </button>
          )}
        </CldUploadWidget>
      )}
    </div>
  );
}
