"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { LogIn, Mail, Lock, AlertCircle, Loader2 } from "lucide-react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
        setLoading(false);
      } else {
        router.push("/admin");
        router.refresh();
      }
    } catch (err) {
      setError("เกิดข้อผิดพลาดที่ไม่คาดคิด กรุณาลองใหม่");
      setLoading(false);
    }
  };

  return (
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
        disabled={loading}
        className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-4.5 px-6 rounded-2xl transition-all flex items-center justify-center gap-3 disabled:opacity-70 shadow-lg shadow-primary-600/20 active:scale-[0.98]"
      >
        {loading ? (
          <Loader2 size={20} className="animate-spin" />
        ) : (
          <>Sign In <LogIn size={20} /></>
        )}
      </button>

      <p className="text-center text-[10px] text-primary-300 font-bold uppercase tracking-widest pt-2">
        Authorized Personnel Only
      </p>
    </form>
  );
}

