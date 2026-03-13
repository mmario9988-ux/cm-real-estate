"use client";

import React, { useState, useEffect } from "react";
import { X, Mail, Lock, Loader2, ArrowRight } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState<string | null>(null);
  const [step, setStep] = useState(1); // 1: Select/Email, 2: Password (for credentials)
  const router = useRouter();

  // Handle ESC key to close
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  const handleSocialLogin = async (provider: string) => {
    setLoading(provider);
    await signIn(provider, { callbackUrl: "/" });
  };

  const handleEmailContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setStep(2);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="relative bg-white w-full max-w-[480px] rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col">
        
        {/* Header */}
        <div className="p-6 pb-0 flex justify-between items-center bg-white sticky top-0 z-10">
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
            aria-label="Close login modal"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="px-8 pb-10 pt-4 flex-grow overflow-y-auto">
          {/* Logo & Welcome */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-50 rounded-2xl mb-4">
              <img src="/logo.png" alt="Logo" className="w-10 h-10 object-contain" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">ยินดีต้อนรับสู่ Chiang Mai Estates</h2>
            <p className="text-gray-500 text-sm font-medium">เข้าสู่ระบบ หรือสมัครสมาชิก เพื่อประสบการณ์การใช้งานที่ดีที่สุด</p>
          </div>

          {step === 1 ? (
            <div className="space-y-4">
              {/* Email Input */}
              <form onSubmit={handleEmailContinue} className="space-y-4">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <Mail size={18} className="text-gray-400 group-focus-within:text-primary-600 transition-colors" />
                  </div>
                  <input
                    type="email"
                    placeholder="อีเมล"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all outline-none font-bold text-gray-900"
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full bg-primary-700 hover:bg-primary-800 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-primary-700/20 active:scale-[0.98]"
                >
                  ดำเนินการต่อ
                </button>
              </form>

              <div className="relative py-4 flex items-center">
                <div className="flex-grow border-t border-gray-100"></div>
                <span className="flex-shrink mx-4 text-gray-400 text-[10px] font-black uppercase tracking-widest">หรือ</span>
                <div className="flex-grow border-t border-gray-100"></div>
              </div>

              {/* Social Buttons */}
              <div className="space-y-3">
                <button 
                  onClick={() => handleSocialLogin("google")}
                  disabled={!!loading}
                  className="w-full flex items-center justify-center gap-3 py-3.5 border-2 border-gray-100 rounded-2xl font-bold text-gray-700 hover:bg-gray-50 transition-all relative overflow-hidden group"
                >
                  {loading === "google" ? (
                    <Loader2 size={20} className="animate-spin text-gray-400" />
                  ) : (
                    <>
                      <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5 grayscale group-hover:grayscale-0 transition-all opacity-70 group-hover:opacity-100" />
                      ดำเนินการต่อด้วย Google
                    </>
                  )}
                </button>

                <button 
                  onClick={() => handleSocialLogin("facebook")}
                  disabled={!!loading}
                  className="w-full flex items-center justify-center gap-3 py-3.5 border-2 border-gray-100 rounded-2xl font-bold text-gray-700 hover:bg-gray-50 transition-all relative group"
                >
                   {loading === "facebook" ? (
                    <Loader2 size={20} className="animate-spin text-gray-400" />
                  ) : (
                    <>
                      <svg className="w-5 h-5 text-[#1877F2] opacity-70 group-hover:opacity-100 transition-opacity fill-current" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                      ดำเนินการต่อด้วย Facebook
                    </>
                  )}
                </button>

                <button 
                  className="w-full flex items-center justify-center gap-3 py-3.5 border-2 border-gray-100 rounded-2xl font-bold text-gray-700 hover:bg-gray-50 transition-all relative group"
                >
                  <svg className="w-5 h-5 text-black opacity-70 group-hover:opacity-100 transition-opacity fill-current" viewBox="0 0 24 24">
                    <path d="M17.073 2.302c-1.229 0-2.583.719-3.238 1.144-.655-.425-2.009-1.144-3.238-1.144-2.822 0-5.11 2.228-5.11 4.977 0 3.321 3.25 7.151 7.15 11.05 1.198 1.198 2.054 2.054 2.435 2.435.38-.381 1.237-1.237 2.435-2.435 3.9-3.9 7.15-7.729 7.15-11.05 0-2.749-2.288-4.977-5.11-4.977z"/>
                  </svg>
                  ดำเนินการต่อด้วย Apple
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <button 
                onClick={() => setStep(1)}
                className="text-xs font-bold text-primary-600 hover:underline flex items-center gap-1"
              >
                ย้อนกลับ (Back)
              </button>
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Logging in as:</p>
                <p className="font-bold text-gray-900">{email}</p>
              </div>
              <p className="text-sm text-gray-500 text-center py-4">
                สำหรับผู้ดูแลระบบ กรุณาใช้รหัสผ่านเพื่อเข้าสู่หลังบ้าน
              </p>
              <button 
                 onClick={() => router.push(`/login?email=${encodeURIComponent(email)}`)}
                 className="w-full bg-gray-900 hover:bg-black text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2"
              >
                ยืนยันตัวตนด้วยรหัสผ่าน <ArrowRight size={18} />
              </button>
            </div>
          )}

          {/* Footer Terms */}
          <p className="mt-8 text-[11px] text-gray-400 text-center leading-relaxed">
            การดำเนินการต่อถือว่าคุณตกลงตาม <a href="#" className="underline hover:text-gray-600">ข้อกำหนดการให้บริการ</a> และ <br />
            <a href="#" className="underline hover:text-gray-600">นโยบายความเป็นส่วนตัว</a> ของ Chiang Mai Estates
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
