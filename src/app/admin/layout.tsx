import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Home, MessageSquare, LogOut } from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 bg-primary-900 text-white flex-shrink-0 flex flex-col hidden md:flex">
        <div className="p-6">
          <h2 className="text-xl font-bold tracking-tight text-white mb-2">Agent Portal</h2>
          <p className="text-primary-300 text-sm truncate">{session.user.email}</p>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-8">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-primary-800 transition-colors">
            <LayoutDashboard size={20} /> Dashboard
          </Link>
          <Link href="/admin/properties" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-primary-800 transition-colors">
            <Home size={20} /> Properties
          </Link>
          <Link href="/admin/inquiries" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-primary-800 transition-colors">
            <MessageSquare size={20} /> Inquiries
          </Link>
        </nav>
        
        <div className="p-4 border-t border-primary-800 mt-auto">
          <Link href="/api/auth/signout" className="flex items-center gap-3 px-4 py-3 text-red-300 hover:text-red-200 hover:bg-red-900/30 rounded-lg transition-colors w-full">
            <LogOut size={20} /> Sign Out
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-primary-50/30">
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
