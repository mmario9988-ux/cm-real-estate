"use client";

import React, { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState<string | null>(null);
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

            <div className="space-y-4">
              {/* Social Buttons */}
              <div className="space-y-4">
                <button 
                  onClick={() => handleSocialLogin("google")}
                  disabled={!!loading}
                  className="w-full flex items-center justify-center gap-4 py-4.5 border-2 border-gray-100/80 rounded-[24px] font-black text-gray-800 hover:bg-gray-50 hover:border-primary-100 hover:shadow-xl hover:shadow-primary-600/5 transition-all relative overflow-hidden group"
                >
                  {loading === "google" ? (
                    <Loader2 size={24} className="animate-spin text-primary-500" />
                  ) : (
                    <>
                      <div className="bg-white p-1.5 rounded-lg shadow-sm border border-gray-50 group-hover:scale-110 transition-transform">
                        <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5 grayscale group-hover:grayscale-0 transition-all" />
                      </div>
                      <span className="text-base">ดำเนินการต่อด้วย Google</span>
                    </>
                  )}
                </button>

                <button 
                  onClick={() => handleSocialLogin("facebook")}
                  disabled={!!loading}
                  className="w-full flex items-center justify-center gap-4 py-4.5 border-2 border-gray-100/80 rounded-[24px] font-black text-gray-800 hover:bg-gray-50 hover:border-blue-100 hover:shadow-xl hover:shadow-blue-600/5 transition-all relative group"
                >
                   {loading === "facebook" ? (
                    <Loader2 size={24} className="animate-spin text-blue-500" />
                  ) : (
                    <>
                      <div className="bg-[#1877F2]/10 p-1.5 rounded-lg group-hover:bg-[#1877F2]/20 transition-colors">
                        <svg className="w-5 h-5 text-[#1877F2] fill-current" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                      </div>
                      <span className="text-base">ดำเนินการต่อด้วย Facebook</span>
                    </>
                  )}
                </button>
              </div>

              {/* Trust & Security Section */}
              <div className="pt-6 mt-4 border-t border-gray-50 flex items-center justify-center gap-6 opacity-60">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">SSL Secure</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Private Access</span>
                </div>
              </div>
            </div>

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
