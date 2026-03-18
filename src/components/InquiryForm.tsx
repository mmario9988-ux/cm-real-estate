"use client";

import { useState } from "react";
import { Send, CheckCircle2, Loader2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function InquiryForm({ propertyId, propertyTitle }: { propertyId?: string, propertyTitle?: string }) {
  const { t } = useLanguage();
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      message: formData.get("message"),
      propertyId: propertyId || null,
    };

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to submit inquiry");
      setStatus("success");
      (e.target as HTMLFormElement).reset();
    } catch (error: any) {
      console.error(error);
      setStatus("error");
      setErrorMessage(error.message || "Something went wrong.");
    }
  }

  if (status === "success") {
    return (
      <div className="bg-white border border-primary-100 p-10 rounded-[32px] text-center shadow-sm animate-in fade-in zoom-in-95 duration-500">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 rotate-6">
            <CheckCircle2 size={40} strokeWidth={2.5} />
          </div>
        </div>
        <h4 className="text-2xl font-black text-primary-950 mb-2 tracking-tight">
          {t("inquiry.successTitle") || "ส่งข้อมูลเรียบร้อย!"}
        </h4>
        <p className="text-primary-500 font-bold text-sm mb-8 leading-relaxed max-w-[240px] mx-auto">
          {t("inquiry.successMessage") || "เจ้าหน้าที่จะติดต่อกลับหาคุณโดยเร็วที่สุด"}
        </p>
        <button 
          onClick={() => setStatus("idle")}
          className="w-full py-4 bg-primary-950 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-primary-800 transition-all shadow-xl shadow-primary-950/20 active:scale-95"
        >
          {t("inquiry.sendAnother") || "ส่งข้อความอื่นเพิ่มเติม"}
        </button>
      </div>
    );
  }

  const defaultMessage = propertyTitle 
    ? t("inquiry.defaultMessage").replace("{title}", propertyTitle)
    : "";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-foreground/80 mb-1">{t("inquiry.name")}</label>
        <input 
          type="text" 
          id="name" 
          name="name" 
          required
          className="w-full px-4 py-3 rounded-lg bg-background border border-primary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all outline-none text-foreground"
          placeholder="John Doe"
        />
      </div>
      
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-foreground/80 mb-1">{t("inquiry.email")}</label>
        <input 
          type="email" 
          id="email" 
          name="email" 
          required
          className="w-full px-4 py-3 rounded-lg bg-background border border-primary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all outline-none text-foreground"
          placeholder="john@example.com"
        />
      </div>
      
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-foreground/80 mb-1">{t("inquiry.phone")}</label>
        <input 
          type="tel" 
          id="phone" 
          name="phone" 
          className="w-full px-4 py-3 rounded-lg bg-background border border-primary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all outline-none text-foreground"
          placeholder="+66 81 234 5678"
        />
      </div>
      
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-foreground/80 mb-1">{t("inquiry.message")}</label>
        <textarea 
          id="message" 
          name="message" 
          required
          rows={4}
          defaultValue={defaultMessage}
          className="w-full px-4 py-3 rounded-lg bg-background border border-primary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all outline-none text-foreground resize-none"
        ></textarea>
      </div>

      {status === "error" && (
        <div className="text-red-500 text-sm font-medium">
          {errorMessage}
        </div>
      )}

      <button 
        type="submit" 
        disabled={status === "loading"}
        className="w-full bg-accent-500 hover:bg-accent-600 text-white font-black py-4 px-4 rounded-xl transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed shadow-xl shadow-accent-500/20 active:scale-95 uppercase tracking-widest text-[10px]"
      >
        {status === "loading" ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            {t("inquiry.sending") || "กำลังส่ง..."}
          </>
        ) : (
          <>{t("inquiry.send") || "ส่งข้อมูล"} <Send size={18} /></>
        )}
      </button>
    </form>
  );
}
