import prisma from "@/lib/prisma";
import Link from "next/link";
import { Home, MessageSquare, PlusCircle, Users, FileText } from "lucide-react";

export const metadata = {
  title: "Dashboard | Admin Portal",
};

export default async function AdminDashboard() {
  const propertyCount = await prisma.property.count();
  const inquiryCount = await prisma.inquiry.count();
  const pendingInquiriesCount = await prisma.inquiry.count({ where: { status: 'Pending' } });
  const subscriberCount = await prisma.subscriber.count({ where: { active: true } });
  const postCount = await prisma.post.count();
  
  const recentInquiries = await prisma.inquiry.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' }
  });

  const topProperties = await prisma.property.findMany({
    take: 3,
    orderBy: { viewCount: 'desc' },
    where: { viewCount: { gt: 0 } }
  });

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-primary-950 tracking-tight">Dashboard Overview</h1>
          <p className="text-primary-700/60 mt-1 font-medium">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/blog/new" className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 px-6 py-3 rounded-2xl transition-all flex items-center gap-2 font-bold shadow-sm">
            <PlusCircle size={20} /> New Article
          </Link>
          <Link href="/admin/properties/new" className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-2xl transition-all flex items-center gap-2 shadow-lg shadow-primary-600/20 font-bold">
            <PlusCircle size={20} /> Create Listing
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white p-6 rounded-[32px] shadow-sm border border-primary-100 flex items-center gap-4 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary-50 rounded-full -mr-12 -mt-12 group-hover:scale-110 transition-transform duration-500"></div>
          <div className="w-14 h-14 rounded-2xl bg-primary-100 text-primary-600 flex items-center justify-center relative z-10 shrink-0">
            <Home size={28} />
          </div>
          <div className="relative z-10 truncate">
            <p className="text-[10px] text-primary-700/70 font-black uppercase tracking-widest mb-0.5">Listings</p>
            <p className="text-3xl font-black text-primary-950">{propertyCount}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[32px] shadow-sm border border-primary-100 flex items-center gap-4 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-accent-50 rounded-full -mr-12 -mt-12 group-hover:scale-110 transition-transform duration-500"></div>
          <div className="w-14 h-14 rounded-2xl bg-accent-100 text-accent-600 flex items-center justify-center relative z-10 shrink-0">
            <MessageSquare size={28} />
          </div>
          <div className="relative z-10 truncate">
            <p className="text-[10px] text-accent-700/70 font-black uppercase tracking-widest mb-0.5">Inquiries</p>
            <p className="text-3xl font-black text-primary-950">{inquiryCount}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[32px] shadow-sm border border-primary-100 flex items-center gap-4 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50 rounded-full -mr-12 -mt-12 group-hover:scale-110 transition-transform duration-500"></div>
          <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center relative z-10 shrink-0">
            <MessageSquare size={28} />
          </div>
          <div className="relative z-10 truncate">
            <p className="text-[10px] text-amber-700/70 font-black uppercase tracking-widest mb-0.5">Pending</p>
            <p className="text-3xl font-black text-primary-950">{pendingInquiriesCount}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[32px] shadow-sm border border-primary-100 flex items-center gap-4 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-full -mr-12 -mt-12 group-hover:scale-110 transition-transform duration-500"></div>
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center relative z-10 shrink-0">
            <Users size={28} />
          </div>
          <div className="relative z-10 truncate">
            <p className="text-[10px] text-emerald-700/70 font-black uppercase tracking-widest mb-0.5">Members</p>
            <p className="text-3xl font-black text-primary-950">{subscriberCount}</p>
          </div>
        </div>

        <Link href="/admin/blog" className="bg-white p-6 rounded-[32px] shadow-sm border border-primary-100 flex items-center gap-4 relative overflow-hidden group hover:border-indigo-200 transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-full -mr-12 -mt-12 group-hover:scale-110 transition-transform duration-500"></div>
          <div className="w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center relative z-10 shrink-0">
            <FileText size={28} />
          </div>
          <div className="relative z-10 truncate">
            <p className="text-[10px] text-indigo-700/70 font-black uppercase tracking-widest mb-0.5">Articles</p>
            <p className="text-3xl font-black text-primary-950">{postCount}</p>
          </div>
        </Link>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Recent Inquiries */}
        <div className="bg-white rounded-[32px] shadow-sm border border-primary-100 overflow-hidden flex flex-col">
          <div className="p-8 border-b border-primary-50 flex justify-between items-center">
            <h3 className="text-2xl font-black text-primary-950">Recent Inquiries</h3>
            <Link href="/admin/inquiries" className="text-sm font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1">
              View All <PlusCircle size={14} className="rotate-45" />
            </Link>
          </div>
          <div className="divide-y divide-primary-50 flex-1">
            {recentInquiries.length > 0 ? recentInquiries.map((inquiry) => (
              <div key={inquiry.id} className="p-8 hover:bg-primary-50/30 transition-all cursor-default group">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-bold text-primary-950 text-lg group-hover:text-primary-600 transition-colors">{inquiry.name}</h4>
                    <p className="text-xs text-primary-600/50 font-bold uppercase tracking-tighter">{new Date(inquiry.createdAt).toLocaleString('th-TH')}</p>
                  </div>
                  <span className={`text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest shadow-sm ${
                    inquiry.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                    inquiry.status === 'Contacted' ? 'bg-blue-100 text-blue-700' :
                    'bg-emerald-100 text-emerald-700'
                  }`}>
                    {inquiry.status}
                  </span>
                </div>
                <p className="text-sm text-primary-900/70 line-clamp-2 leading-relaxed font-medium italic">{inquiry.message}</p>
              </div>
            )) : (
              <div className="p-12 text-center text-primary-600/40 font-bold italic">No recent inquiries</div>
            )}
          </div>
        </div>

        {/* Top Viewed Properties */}
        <div className="bg-white rounded-[32px] shadow-sm border border-primary-100 overflow-hidden flex flex-col">
          <div className="p-8 border-b border-primary-50">
            <h3 className="text-2xl font-black text-primary-950">Most Viewed</h3>
          </div>
          <div className="divide-y divide-primary-50 flex-1">
            {topProperties.length > 0 ? topProperties.map((property) => (
              <div key={property.id} className="p-8 hover:bg-primary-50/30 transition-all flex items-center justify-between group">
                <div className="flex items-center gap-6">
                  <div className="bg-primary-50 p-2 rounded-2xl group-hover:bg-primary-100 transition-colors">
                     <Home size={24} className="text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-primary-950 mb-1 group-hover:text-primary-600 transition-colors">{property.title}</h4>
                    <p className="text-xs text-primary-600/60 font-bold">{property.location}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-primary-950">{property.viewCount}</p>
                  <p className="text-[10px] text-primary-600/50 font-black uppercase tracking-widest">Impressions</p>
                </div>
              </div>
            )) : (
              <div className="p-12 text-center text-primary-600/40 font-bold italic">No property data yet</div>
            )}
          </div>
          <div className="p-8 mt-auto border-t border-primary-50 bg-primary-50/30">
             <Link href="/admin/properties" className="w-full bg-white text-primary-600 border border-primary-100 py-4 rounded-2xl font-black text-center block hover:bg-primary-600 hover:text-white transition-all shadow-sm">
                Manage All Properties
             </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
