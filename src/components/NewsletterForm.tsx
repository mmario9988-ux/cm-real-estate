"use client";

import { useState } from "react";
import { Send, CheckCircle2, Loader2, Mail } from "lucide-react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setMessage(data.message);
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "เกิดข้อผิดพลาด");
      }
    } catch (err) {
      setStatus("error");
      setMessage("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้");
    }
  };

  return (
    <div className="w-full max-w-lg">
      <div className="relative group">
        {status === "success" ? (
          <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl animate-in zoom-in-95 duration-300">
            <CheckCircle2 className="text-emerald-500 shrink-0" size={24} />
            <p className="text-sm font-bold text-emerald-800">{message}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="relative">
            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-primary-300 group-focus-within:text-primary-600 transition-colors" />
            </div>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="กรอกอีเมลของคุณเพื่อรับข่าวสารบ้านใหม่..."
              className="w-full pl-14 pr-32 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all font-medium"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="absolute right-2 top-2 bottom-2 px-6 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-bold text-sm transition-all flex items-center gap-2 disabled:opacity-50 active:scale-95"
            >
              {status === "loading" ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <>
                  <span className="hidden sm:inline">ติดตาม</span>
                  <Send size={16} />
                </>
              )}
            </button>
          </form>
        )}
        
        {status === "error" && (
          <p className="mt-2 text-xs font-bold text-red-400 pl-4">{message}</p>
        )}
      </div>
      <p className="mt-4 text-xs text-primary-200/60 font-medium leading-relaxed">
        ร่วมเป็นส่วนหนึ่งของครอบครัวเรา เพื่อรับข่าวสารอัปเดตบ้านใหม่ที่ตรงใจคุณ
      </p>
    </div>
  );
}
