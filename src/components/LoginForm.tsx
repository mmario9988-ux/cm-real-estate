"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { LogIn, Mail, Lock, AlertCircle, Loader2 } from "lucide-react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading("credentials");
    setError("");

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
        setLoading(null);
      } else {
        router.push("/admin");
        router.refresh();
      }
    } catch (err) {
      setError("เกิดข้อผิดพลาดที่ไม่คาดคิด กรุณาลองใหม่");
      setLoading(null);
    }
  };

  const handleSocialLogin = async (provider: string) => {
    setLoading(provider);
    await signIn(provider, { callbackUrl: "/" });
  };

  return (
    <div className="space-y-8">
      {/* Social Logins */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => handleSocialLogin("google")}
          disabled={!!loading}
          className="flex items-center justify-center gap-3 py-4.5 px-6 bg-white border border-primary-100/60 rounded-2xl font-black text-primary-900 hover:bg-primary-50/50 hover:border-primary-200 hover:shadow-lg hover:shadow-primary-600/5 transition-all active:scale-[0.98] disabled:opacity-50 group"
        >
          {loading === "google" ? (
            <Loader2 size={20} className="animate-spin text-primary-400" />
          ) : (
            <>
              <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5 grayscale group-hover:grayscale-0 transition-all opacity-80" />
              <span className="text-[15px]">Google</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={() => handleSocialLogin("facebook")}
          disabled={!!loading}
          className="flex items-center justify-center gap-3 py-4.5 px-6 bg-white border border-primary-100/60 rounded-2xl font-black text-primary-900 hover:bg-primary-50/50 hover:border-primary-200 hover:shadow-lg hover:shadow-primary-600/5 transition-all active:scale-[0.98] disabled:opacity-50 group"
        >
          {loading === "facebook" ? (
            <Loader2 size={20} className="animate-spin text-primary-400" />
          ) : (
            <>
              <svg className="w-5 h-5 text-[#1877F2] fill-current opacity-80 group-hover:opacity-100 transition-opacity" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span className="text-[15px]">Facebook</span>
            </>
          )}
        </button>
      </div>

      <div className="relative flex items-center">
        <div className="flex-grow border-t border-primary-100"></div>
        <span className="flex-shrink mx-4 text-primary-300 text-[10px] font-black uppercase tracking-widest">หรือเข้าด้วยอีเมล</span>
        <div className="flex-grow border-t border-primary-100"></div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl text-xs font-bold flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
            <AlertCircle size={16} />
            {error}
          </div>
        )}
        
        <div className="space-y-2">
          <label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-primary-400 ml-1">อีเมลผู้ใช้งาน (Email Address)</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
               <Mail size={18} className="text-primary-300 group-focus-within:text-primary-600 transition-colors" />
            </div>
            <input
              id="email"
              type="email"
              required
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border border-primary-100 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all outline-none font-bold text-primary-950 placeholder:text-primary-200"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-primary-400 ml-1">รหัสผ่าน (Password)</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
               <Lock size={18} className="text-primary-300 group-focus-within:text-primary-600 transition-colors" />
            </div>
            <input
              id="password"
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border border-primary-100 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all outline-none font-bold text-primary-950 placeholder:text-primary-200"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={!!loading}
          className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-4.5 px-6 rounded-2xl transition-all flex items-center justify-center gap-3 disabled:opacity-70 shadow-lg shadow-primary-600/20 active:scale-[0.98]"
        >
          {loading === "credentials" ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <>เข้าสู่ระบบ <LogIn size={20} /></>
          )}
        </button>

        <p className="text-center text-[10px] text-primary-300 font-black uppercase tracking-[0.2em] pt-2 flex items-center justify-center gap-2">
          <span className="w-8 h-[1px] bg-primary-100"></span>
          Secure & Private Portal
          <span className="w-8 h-[1px] bg-primary-100"></span>
        </p>
      </form>
    </div>
  );
}

