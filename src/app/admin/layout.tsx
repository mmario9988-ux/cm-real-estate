import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Home, MessageSquare, LogOut, Users, Settings, FileText } from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const adminEmails = (process.env.ADMIN_EMAILS || "").split(",");

  if (!session?.user || !session.user.email || !adminEmails.includes(session.user.email)) {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-68 bg-white border-r border-primary-100 text-foreground flex-shrink-0 flex flex-col hidden md:flex">
        <div className="p-8 pb-4">
          <Link href="/" className="flex items-center gap-2 group mb-2">
            <div className="bg-primary-600 p-2 rounded-xl group-hover:scale-110 transition-transform">
              <Home className="text-white" size={20} />
            </div>
            <span className="text-xl font-bold tracking-tight text-primary-900">Agent Portal</span>
          </Link>
          <p className="text-primary-600/60 text-xs font-semibold uppercase tracking-widest px-1">{session.user.name || 'Admin User'}</p>
        </div>
        
        <nav className="flex-1 px-4 space-y-1.5 mt-6">
          <Link href="/admin" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium hover:bg-primary-50 hover:text-primary-700`}>
            <LayoutDashboard size={20} /> Dashboard
          </Link>
          <Link href="/admin/properties" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium hover:bg-primary-50 hover:text-primary-700`}>
            <Home size={20} /> Properties
          </Link>
          <Link href="/admin/inquiries" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium hover:bg-primary-50 hover:text-primary-700`}>
            <MessageSquare size={20} /> Inquiries
          </Link>
          <Link href="/admin/subscribers" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium hover:bg-primary-50 hover:text-primary-700`}>
            <Users size={20} /> Subscribers
          </Link>
          <Link href="/admin/blog" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium hover:bg-primary-50 hover:text-primary-700`}>
            <FileText size={20} /> Blog Posts
          </Link>
          <Link href="/admin/settings" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium hover:bg-primary-50 hover:text-primary-700`}>
            <Settings size={20} /> Settings
          </Link>
        </nav>
        
        <div className="p-4 border-t border-primary-50 mt-auto">
          <div className="bg-primary-50 rounded-2xl p-4 mb-4">
             <p className="text-xs text-primary-700/70 font-medium mb-1 truncate">{session.user.email}</p>
             <div className="w-full h-1 bg-primary-100 rounded-full overflow-hidden">
                <div className="w-3/4 h-full bg-primary-500"></div>
             </div>
          </div>
          <Link href="/api/auth/signout" className="flex items-center gap-3 px-4 py-3 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all font-semibold w-full">
            <LogOut size={20} /> Sign Out
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-gray-50">
        <header className="bg-white border-b border-primary-100 px-8 py-4 flex items-center justify-between md:hidden">
            <h2 className="text-lg font-bold">Agent Portal</h2>
            <Link href="/api/auth/signout" className="text-sm text-red-500 font-medium">Sign Out</Link>
        </header>

        <div className="flex-1 p-8 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
