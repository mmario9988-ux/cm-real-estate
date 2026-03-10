import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Mail, Users, Calendar, Trash2 } from "lucide-react";
import BroadcastForm from "@/components/BroadcastForm";

export default async function SubscribersPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const subscribers = await prisma.subscriber.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary-950 tracking-tight">Newsletter Subscribers</h1>
          <p className="text-primary-600 font-medium">Manage your community and news updates.</p>
        </div>
        <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-2xl border border-primary-100 shadow-sm">
          <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600">
            <Users size={20} />
          </div>
          <div>
            <div className="text-2xl font-bold text-primary-950">{subscribers.length}</div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-primary-400">Total Members</div>
          </div>
        </div>
      </div>

      <BroadcastForm />

      <div className="bg-white rounded-[32px] border border-primary-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-primary-50/50">
                <th className="px-8 py-5 text-xs font-bold uppercase tracking-wider text-primary-400 border-b border-primary-100">Subscriber</th>
                <th className="px-8 py-5 text-xs font-bold uppercase tracking-wider text-primary-400 border-b border-primary-100">Joined Date</th>
                <th className="px-8 py-5 text-xs font-bold uppercase tracking-wider text-primary-400 border-b border-primary-100">Status</th>
                <th className="px-8 py-5 text-xs font-bold uppercase tracking-wider text-primary-400 border-b border-primary-100 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary-50">
              {subscribers.length > 0 ? (
                subscribers.map((sub: any) => (
                  <tr key={sub.id} className="hover:bg-primary-50/30 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold">
                          {sub.email[0].toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-primary-950">{sub.name || "Anonymous Subscriber"}</div>
                          <div className="text-xs font-medium text-primary-500 flex items-center gap-1.5">
                            <Mail size={12} /> {sub.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2 text-sm font-medium text-primary-700">
                        <Calendar size={14} className="text-primary-300" />
                        {new Date(sub.createdAt).toLocaleDateString('th-TH', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        sub.active 
                        ? "bg-emerald-50 text-emerald-600 border border-emerald-100" 
                        : "bg-red-50 text-red-600 border border-red-100"
                      }`}>
                        {sub.active ? "Active" : "Unsubscribed"}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button 
                        title="Delete Subscriber"
                        aria-label="Delete Subscriber"
                        className="p-2 text-primary-200 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center text-primary-200">
                        <Users size={32} />
                      </div>
                      <p className="text-primary-400 font-medium">ยังไม่มีสมาชิกสมัครรับข่าวสาร</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
