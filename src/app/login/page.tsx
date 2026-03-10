import LoginForm from "@/components/LoginForm";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Home } from "lucide-react";

export const metadata = {
  title: "Agent Portal Login | Chiang Mai Estates",
};

export default async function LoginPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/admin");
  }

  return (
    <div className="min-h-screen bg-primary-50/50 flex items-center justify-center p-6 lg:p-12">
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 bg-white rounded-[48px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] overflow-hidden border border-white">
        
        {/* Left Side: Branding & Visuals */}
        <div className="hidden lg:flex flex-col justify-between p-16 bg-primary-950 text-white relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-12">
               <Link href="/" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-all text-xs font-bold uppercase tracking-wider">
                  <Home size={16} /> กลับหน้าหลัก
               </Link>
               <img src="/logo.png" alt="Logo" className="h-10 w-10 object-contain brightness-0 invert" />
            </div>
            
            <h1 className="text-6xl font-black tracking-tighter leading-none mb-6">
              Exclusive<br />
              <span className="text-primary-400">Agent Portal</span>
            </h1>
            <p className="text-primary-200/60 text-lg font-medium max-w-sm leading-relaxed">
              Your gateway to managing premium real estate across Northern Thailand.
            </p>
          </div>

          <div className="relative z-10 mt-auto">
             <div className="flex items-center gap-4 py-6 border-t border-white/10">
                <div className="w-12 h-12 bg-primary-400/20 rounded-2xl flex items-center justify-center text-primary-400">
                   <ShieldCheck size={28} />
                </div>
                 <div>
                    <h4 className="font-bold text-sm uppercase tracking-wider">Secure Access</h4>
                    <p className="text-primary-300/40 text-xs font-bold uppercase tracking-wider">End-to-End Encryption</p>
                 </div>
             </div>
          </div>

          {/* Abstract Decorations */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600/20 rounded-full blur-3xl -mr-32 -mt-32 uppercase tracking-widest"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-400/10 rounded-full blur-3xl -ml-48 -mb-48 uppercase tracking-widest"></div>
        </div>

        {/* Right Side: Login Form */}
        <div className="p-8 lg:p-20 flex flex-col justify-center">
          <div className="mb-10 lg:hidden flex justify-center">
             <Link href="/" className="inline-flex items-center gap-2 text-primary-600 font-bold uppercase tracking-widest text-[10px] bg-primary-50 px-6 py-3 rounded-full hover:bg-primary-100 transition-all">
                <ArrowLeft size={14} /> Back to Site
             </Link>
          </div>

           <div className="mb-10">
            <h2 className="text-3xl font-bold text-primary-950 tracking-tight mb-2">ยินดีต้อนรับกลับมา</h2>
            <p className="text-primary-900/40 font-bold text-sm">เข้าสู่ระบบเพื่อจัดการข้อมูลอสังหาริมทรัพย์ของคุณ</p>
          </div>

          <div className="bg-primary-50/30 p-8 rounded-[32px] border border-primary-50">
            <LoginForm />
          </div>

        </div>
      </div>
    </div>
  );
}

