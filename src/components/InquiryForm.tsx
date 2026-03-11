"use client";

import { useState } from "react";
import { Send } from "lucide-react";
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
      <div className="bg-primary-50 border border-primary-200 text-primary-800 p-6 rounded-2xl text-center">
        <h4 className="text-lg font-bold mb-2">{t("inquiry.successTitle")}</h4>
        <p className="text-sm opacity-80">{t("inquiry.successMessage")}</p>
        <button 
          onClick={() => setStatus("idle")}
          className="mt-6 text-sm font-semibold text-primary-600 hover:text-primary-700 underline"
        >
          {t("inquiry.sendAnother")}
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
        className="w-full bg-accent-500 hover:bg-accent-600 text-white font-bold py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-md shadow-accent-500/20"
      >
        {status === "loading" ? t("inquiry.sending") : (
          <>{t("inquiry.send")} <Send size={18} /></>
        )}
      </button>
    </form>
  );
}
