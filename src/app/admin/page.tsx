import prisma from "@/lib/prisma";
import Link from "next/link";
import { Home, MessageSquare, PlusCircle } from "lucide-react";

export const metadata = {
  title: "Dashboard | Admin Portal",
};

export default async function AdminDashboard() {
  const propertyCount = await prisma.property.count();
  const inquiryCount = await prisma.inquiry.count();
  
  const recentInquiries = await prisma.inquiry.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <Link href="/admin/properties/new" className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium">
          <PlusCircle size={18} /> New Listing
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center">
            <Home size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-600 font-medium">Total Properties</p>
            <p className="text-3xl font-bold text-gray-900">{propertyCount}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-accent-100 text-accent-600 flex items-center justify-center">
            <MessageSquare size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-600 font-medium">Total Inquiries</p>
            <p className="text-3xl font-bold text-gray-900">{inquiryCount}</p>
          </div>
        </div>
      </div>

      {/* Overview Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Inquiries */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50">
            <h3 className="text-lg font-bold text-gray-900">Recent Inquiries</h3>
            <Link href="/admin/inquiries" className="text-sm text-primary-600 hover:underline">View All</Link>
          </div>
          <div className="divide-y divide-gray-100">
            {recentInquiries.length > 0 ? recentInquiries.map((inquiry) => (
              <div key={inquiry.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-gray-900">{inquiry.name}</h4>
                  <span className="text-xs text-gray-500">{new Date(inquiry.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-sm text-gray-700 line-clamp-2">{inquiry.message}</p>
                <div className="mt-3 flex gap-2">
                  <span className={`text-xs px-2 py-1 rounded-md font-medium ${
                    inquiry.status === 'Pending' ? 'bg-amber-100 text-amber-800' :
                    inquiry.status === 'Contacted' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {inquiry.status}
                  </span>
                </div>
              </div>
            )) : (
              <div className="p-8 text-center text-gray-500">No recent inquiries</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
