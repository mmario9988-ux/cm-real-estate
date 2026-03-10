import prisma from "@/lib/prisma";
import InquiryStatusSelect from "@/components/InquiryStatusSelect";
import { Mail, Phone, Calendar, User, MessageCircle } from "lucide-react";

export const metadata = { title: "Inquiries | Admin Portal" };

export default async function AdminInquiriesPage() {
  const inquiries = await prisma.inquiry.findMany({
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-primary-950 tracking-tight">Client Inquiries</h1>
          <p className="text-primary-700/60 mt-1 font-medium">Review and manage interest from potential clients.</p>
        </div>
      </div>

      <div className="bg-white border border-primary-100 rounded-[32px] shadow-sm overflow-hidden overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-primary-50/50 border-b border-primary-50">
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-primary-600">Client Details</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-primary-600">Message Content</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-primary-600">Received On</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-primary-600 text-right">Action / Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-primary-50">
            {inquiries.length > 0 ? inquiries.map((inquiry) => (
              <tr key={inquiry.id} className="hover:bg-primary-50/20 transition-all group">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold group-hover:scale-110 transition-transform">
                      {inquiry.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-primary-950 mb-0.5">{inquiry.name}</h4>
                      <div className="flex items-center gap-3 mt-1">
                        <a href={`mailto:${inquiry.email}`} className="text-xs text-primary-600/70 hover:text-primary-600 flex items-center gap-1 font-medium transition-colors">
                          <Mail size={12} /> {inquiry.email}
                        </a>
                        {inquiry.phone && (
                          <span className="text-xs text-primary-600/70 flex items-center gap-1 font-medium">
                            <Phone size={12} /> {inquiry.phone}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6 max-w-sm">
                  <p className="text-sm text-primary-900/80 line-clamp-2 leading-relaxed font-medium" title={inquiry.message}>
                    {inquiry.message}
                  </p>
                </td>
                <td className="px-8 py-6">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-primary-950 flex items-center gap-1.5">
                       <Calendar size={14} className="text-primary-400" />
                       {new Date(inquiry.createdAt).toLocaleDateString('th-TH')}
                    </span>
                    <span className="text-[10px] text-primary-600/50 font-black uppercase ml-5">
                       {new Date(inquiry.createdAt).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </td>
                <td className="px-8 py-6 text-right">
                  <InquiryStatusSelect id={inquiry.id} initialStatus={inquiry.status} />
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={4} className="px-8 py-20 text-center">
                  <div className="flex flex-col items-center gap-4 text-primary-600/30">
                     <MessageCircle size={48} className="animate-pulse" />
                     <p className="font-black italic uppercase tracking-widest text-lg">No inquiries received yet</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
