"use client";

import { useState } from "react";
import { Megaphone, Send, Loader2, CheckCircle2, AlertCircle, ImagePlus, X, ImageIcon } from "lucide-react";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";

export default function BroadcastForm() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !message) return;

    setStatus("loading");
    setFeedback("");

    try {
      const res = await fetch("/api/admin/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, message, imageUrl }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setFeedback(data.message);
        setSubject("");
        setMessage("");
        setImageUrl("");
      } else {
        setStatus("error");
        setFeedback(data.error || "เกิดข้อผิดพลาดในการส่ง");
      }
    } catch (err) {
      setStatus("error");
      setFeedback("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้");
    }
  };

  return (
    <div className="bg-white rounded-[32px] border border-primary-100 shadow-sm overflow-hidden mb-10">
      <div className="p-8 border-b border-primary-50 flex items-center justify-between bg-primary-50/30">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary-600/20">
            <Megaphone size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-primary-950">ส่งข่าวสาร (Broadcast News)</h3>
            <p className="text-xs text-primary-600 font-medium uppercase tracking-wider">ส่งอีเมลแจ้งสมาชิกทุกคนในระบบ</p>
          </div>
        </div>
      </div>

      <div className="p-8">
        {status === "success" ? (
          <div className="flex flex-col items-center justify-center py-10 gap-4 animate-in zoom-in-95 duration-500">
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500">
              <CheckCircle2 size={48} />
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-primary-950 mb-1">ส่งข่าวสารเรียบร้อย!</p>
              <p className="text-primary-600 font-medium">{feedback}</p>
            </div>
            <button 
              onClick={() => setStatus("idle")}
              className="mt-4 px-8 py-3 bg-primary-50 text-primary-600 rounded-xl font-bold hover:bg-primary-100 transition-colors"
            >
              ส่งข้อความใหม่
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="subject" className="text-sm font-bold text-primary-900 ml-1 italic">
                หัวข้ออีเมล (Subject)
              </label>
              <input
                id="subject"
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="เช่น: อัปเดตบ้านใหม่โซนแม่ริม ประจำสัปดาห์นี้..."
                className="w-full px-6 py-4 bg-primary-50/50 border border-primary-100 rounded-2xl text-primary-950 placeholder:text-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-600/20 focus:bg-white transition-all font-medium"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-primary-900 ml-1 italic">
                รูปภาพประกอบ (Featured Image)
              </label>
              
              {imageUrl ? (
                <div className="relative aspect-video w-full max-w-md rounded-2xl overflow-hidden border border-primary-100 group">
                  <Image
                    src={imageUrl}
                    alt="Broadcast Preview"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => setImageUrl("")}
                      className="bg-red-500 text-white p-3 rounded-full hover:bg-red-600 transition-all shadow-lg active:scale-95"
                      title="Remove Image"
                      aria-label="Remove Image"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>
              ) : (
                <CldUploadWidget
                  uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                  onSuccess={(result: any) => {
                    if (result?.info?.secure_url) {
                      setImageUrl(result.info.secure_url);
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
                      className="w-full max-w-md bg-primary-50/50 border-2 border-dashed border-primary-100 hover:border-primary-500 hover:bg-white rounded-2xl p-8 flex flex-col items-center gap-3 transition-all group"
                    >
                      <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary-200 group-hover:text-primary-600 transition-colors">
                        <ImagePlus size={24} />
                      </div>
                      <p className="text-xs font-bold text-primary-400 group-hover:text-primary-600 transition-colors uppercase tracking-widest">
                        คลิกเพื่ออัปโหลดรูปภาพ
                      </p>
                    </button>
                  )}
                </CldUploadWidget>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-bold text-primary-900 ml-1 italic">
                เนื้อหาข่าวสาร (Message)
              </label>
              <textarea
                id="message"
                required
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="ใส่รายละเอียดข่าวสารที่ต้องการแจ้งสมาชิก..."
                className="w-full px-6 py-4 bg-primary-50/50 border border-primary-100 rounded-2xl text-primary-950 placeholder:text-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-600/20 focus:bg-white transition-all font-medium resize-none"
              />
            </div>

            {status === "error" && (
              <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-bold italic">
                <AlertCircle size={20} />
                {feedback}
              </div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full md:w-auto px-10 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-bold transition-all flex items-center justify-center gap-3 shadow-xl shadow-primary-600/20 disabled:opacity-50 active:scale-95 group"
              >
                {status === "loading" ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    กำลังประมวลผล...
                  </>
                ) : (
                  <>
                    <span>ส่งข่าวสารตอนนี้</span>
                    <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
