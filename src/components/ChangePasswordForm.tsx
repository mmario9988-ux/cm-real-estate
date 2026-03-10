"use client";

import { useState } from "react";
import { Lock, Loader2, CheckCircle2, AlertCircle, Eye, EyeOff } from "lucide-react";

export default function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setStatus("error");
      setFeedback("รหัสผ่านใหม่ไม่ตรงกัน");
      return;
    }

    if (newPassword.length < 6) {
      setStatus("error");
      setFeedback("รหัสผ่านใหม่ต้องมีความยาวอย่างน้อย 6 ตัวอักษร");
      return;
    }

    setStatus("loading");
    setFeedback("");

    try {
      const res = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setFeedback(data.message);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setStatus("error");
        setFeedback(data.error || "เกิดข้อผิดพลาด");
      }
    } catch (err) {
      setStatus("error");
      setFeedback("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้");
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="bg-white rounded-[32px] border border-primary-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-primary-50 bg-primary-50/30">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary-600/20">
              <Lock size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-primary-950">เปลี่ยนรหัสผ่าน (Change Password)</h3>
              <p className="text-xs text-primary-600 font-medium uppercase tracking-wider">รักษาความปลอดภัยของบัญชีผู้ใช้</p>
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
                <p className="text-xl font-bold text-primary-950 mb-1">สำเร็จ!</p>
                <p className="text-primary-600 font-medium">{feedback}</p>
              </div>
              <button 
                onClick={() => setStatus("idle")}
                className="mt-4 px-8 py-3 bg-primary-50 text-primary-600 rounded-xl font-bold hover:bg-primary-100 transition-colors"
              >
                ตกลง
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-primary-900 ml-1 italic">รหัสผ่านปัจจุบัน</label>
                <div className="relative">
                  <input
                    type={showPasswords ? "text" : "password"}
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-6 py-4 bg-primary-50/50 border border-primary-100 rounded-2xl text-primary-950 focus:outline-none focus:ring-2 focus:ring-primary-600/20 focus:bg-white transition-all font-medium"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-primary-900 ml-1 italic">รหัสผ่านใหม่</label>
                <div className="relative">
                  <input
                    type={showPasswords ? "text" : "password"}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-6 py-4 bg-primary-50/50 border border-primary-100 rounded-2xl text-primary-950 focus:outline-none focus:ring-2 focus:ring-primary-600/20 focus:bg-white transition-all font-medium"
                    placeholder="ขั้นต่ำ 6 ตัวอักษร"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-primary-900 ml-1 italic">ยืนยันรหัสผ่านใหม่</label>
                <div className="relative">
                  <input
                    type={showPasswords ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-6 py-4 bg-primary-50/50 border border-primary-100 rounded-2xl text-primary-950 focus:outline-none focus:ring-2 focus:ring-primary-600/20 focus:bg-white transition-all font-medium"
                    placeholder="ยืนยันรหัสผ่านใหม่อีกครั้ง"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(!showPasswords)}
                    className="absolute right-6 top-1/2 -translate-y-1/2 text-primary-300 hover:text-primary-600 transition-colors"
                  >
                    {showPasswords ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {status === "error" && (
                <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-bold italic animate-in slide-in-from-top-2">
                  <AlertCircle size={20} />
                  {feedback}
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full md:w-auto px-10 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-bold transition-all flex items-center justify-center gap-3 shadow-xl shadow-primary-600/20 disabled:opacity-50 active:scale-95"
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      กำลังบันทึก...
                    </>
                  ) : (
                    "บันทึกรหัสผ่านใหม่"
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
