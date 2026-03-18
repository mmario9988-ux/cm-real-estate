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
  const [isDragging, setIsDragging] = useState(false);

  const uploadFile = async (file: File) => {
    setStatus("loading");
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
        setImageUrl(data.secure_url);
        setStatus("idle");
      }
    } catch (error) {
      console.error("Broadcast Drag Upload Error:", error);
      setStatus("error");
      setFeedback("ไม่สามารถอัปโหลดรูปภาพได้");
    }
  };

  const onDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      await uploadFile(file);
    }
  };

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
          <div className="flex flex-col items-center justify-center py-16 gap-6 animate-in fade-in zoom-in-95 duration-700 ease-out">
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-400/20 blur-3xl rounded-full scale-150 animate-pulse" />
              <div className="relative w-24 h-24 bg-emerald-500 rounded-[32px] flex items-center justify-center text-white shadow-2xl shadow-emerald-500/30 rotate-12 hover:rotate-0 transition-transform duration-500">
                <CheckCircle2 size={48} strokeWidth={2.5} />
              </div>
            </div>
            
            <div className="text-center space-y-2">
              <p className="text-3xl font-black text-primary-950 tracking-tight">ส่งข่าวสารเรียบร้อย!</p>
              <p className="text-primary-500 font-bold max-w-sm mx-auto">{feedback}</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full max-w-sm px-6">
              <button 
                onClick={() => setStatus("idle")}
                className="flex-1 px-8 py-4 bg-primary-950 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-primary-800 transition-all shadow-xl shadow-primary-950/20 active:scale-95"
              >
                ส่งข้อความใหม่
              </button>
              <button 
                onClick={() => window.location.reload()}
                className="flex-1 px-8 py-4 bg-white text-primary-400 border border-primary-100 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-primary-50 hover:text-primary-950 transition-all active:scale-95"
              >
                เสร็จสิ้น
              </button>
            </div>
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
                  uploadPreset="cm_real_estate"
                  onSuccess={(result: any) => {
                    if (result?.info?.secure_url) {
                      setImageUrl(result.info.secure_url);
                    }
                  }}
                  options={{
                    maxFiles: 1,
                    resourceType: "image",
                    clientAllowedFormats: ["jpg", "png", "webp", "jpeg"],
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
                      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={onDrop}
                      className={`w-full max-w-md border-2 border-dashed rounded-2xl p-8 flex flex-col items-center gap-3 transition-all group ${
                        isDragging 
                          ? "bg-primary-600/5 border-primary-600 ring-4 ring-primary-600/5" 
                          : "bg-primary-50/50 border-primary-100 hover:border-primary-500 hover:bg-white"
                      }`}
                    >
                      <div className={`w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center transition-colors ${
                        isDragging ? "text-primary-600" : "text-primary-200 group-hover:text-primary-600"
                      }`}>
                        {status === "loading" ? <Loader2 size={24} className="animate-spin" /> : <ImagePlus size={24} />}
                      </div>
                      <p className={`text-xs font-bold transition-colors uppercase tracking-widest ${
                        isDragging ? "text-primary-600" : "text-primary-400 group-hover:text-primary-600"
                      }`}>
                        {isDragging ? "วางรูปเพื่ออัปโหลด" : "คลิกหรือลากรูปมาวางเพื่ออัปโหลด"}
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
