import prisma from "@/lib/prisma";
import Link from "next/link";
import { PlusCircle, Edit, Search, Filter, Home, Eye } from "lucide-react";
import DeletePropertyButton from "@/components/DeletePropertyButton";

export const metadata = { title: "Manage Properties | Admin Portal" };

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function AdminPropertiesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const search = typeof params.search === 'string' ? params.search : undefined;
  const statusFilter = typeof params.status === 'string' ? params.status : undefined;

  const where: any = {};
  if (search) {
    where.title = { contains: search, mode: 'insensitive' };
  }
  if (statusFilter && statusFilter !== 'All') {
    where.status = statusFilter;
  }

  const properties = await prisma.property.findMany({
    where,
    orderBy: { createdAt: "desc" }
  });

  const propertyStatuses = ["All", "For Sale", "For Rent", "Sold", "Rented"];

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-primary-950 tracking-tight">Property Directory</h1>
          <p className="text-primary-700/60 mt-1 font-medium">Manage and monitor all your listings in one place.</p>
        </div>
        <Link href="/admin/properties/new" className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-2xl transition-all flex items-center gap-2 shadow-lg shadow-primary-600/20 font-bold whitespace-nowrap">
          <PlusCircle size={20} /> Add Property
        </Link>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="relative flex-1">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-primary-400" size={20} />
          <form method="GET" action="/admin/properties">
            <input 
              name="search"
              defaultValue={search}
              placeholder="Search by property title..." 
              className="w-full pl-14 pr-6 py-4 rounded-2xl bg-white border border-primary-100 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all font-medium text-primary-950"
            />
            {statusFilter && <input type="hidden" name="status" value={statusFilter} />}
          </form>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 no-scrollbar">
          {propertyStatuses.map((status) => (
            <Link
              key={status}
              href={`/admin/properties?status=${status}${search ? `&search=${search}` : ''}`}
              className={`px-6 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap border-2 ${
                (statusFilter === status || (!statusFilter && status === 'All'))
                  ? 'bg-primary-600 border-primary-600 text-white shadow-lg shadow-primary-600/20'
                  : 'bg-white border-primary-100 text-primary-600 hover:border-primary-300'
              }`}
            >
              {status}
            </Link>
          ))}
        </div>
      </div>

      <div className="bg-white border border-primary-100 rounded-[32px] shadow-sm overflow-hidden overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-primary-50/50 border-b border-primary-50">
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-primary-600">Property Information</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-primary-600">Pricing</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-primary-600 text-center">Engagement</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-primary-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-primary-50">
            {properties.length > 0 ? properties.map((property) => (
              <tr key={property.id} className="hover:bg-primary-50/20 transition-all group">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-600 group-hover:bg-primary-100 transition-colors">
                      <Home size={28} />
                    </div>
                    <div>
                      <h4 className="font-bold text-primary-950 text-lg mb-1 group-hover:text-primary-600 transition-colors">{property.title}</h4>
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                          property.status === 'For Sale' ? 'bg-amber-100 text-amber-700' :
                          property.status === 'For Rent' ? 'bg-blue-100 text-blue-700' :
                          property.status === 'Sold' ? 'bg-red-100 text-red-700' :
                          property.status === 'Rented' ? 'bg-gray-100 text-gray-700' :
                          'bg-emerald-100 text-emerald-700'
                        }`}>
                          {property.status}
                        </span>
                        {property.isFeatured && (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-accent-500 text-white flex items-center gap-1 shadow-sm">
                            ★ Recommended
                          </span>
                        )}
                        <span className="text-xs text-primary-600/50 font-bold">• {property.location}</span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex flex-col">
                    <span className="text-xl font-black text-primary-950">฿{property.price.toLocaleString()}</span>
                    <span className="text-[10px] text-primary-600/50 font-black uppercase tracking-widest">{property.type}</span>
                  </div>
                </td>
                <td className="px-8 py-6 text-center">
                  <div className="inline-flex flex-col items-center justify-center bg-primary-50/50 px-4 py-2 rounded-2xl border border-primary-50">
                    <span className="text-xl font-black text-primary-950 flex items-center gap-1.5">
                       <Eye size={16} className="text-primary-600" />
                       {property.viewCount}
                    </span>
                    <span className="text-[10px] text-primary-600/50 font-black uppercase tracking-widest">Views</span>
                  </div>
                </td>
                <td className="px-8 py-6 text-right">
                  <div className="flex justify-end items-center gap-3">
                    <Link 
                      href={`/properties/${property.id}`} 
                      target="_blank"
                      className="text-primary-600 hover:text-white bg-primary-50 hover:bg-primary-600 p-3 rounded-2xl transition-all shadow-sm group/btn"
                      title="View Live"
                    >
                      <Eye size={18} />
                    </Link>
                    <Link 
                      href={`/admin/properties/edit/${property.id}`} 
                      className="text-blue-600 hover:text-white bg-blue-50 hover:bg-blue-600 p-3 rounded-2xl transition-all shadow-sm group/btn"
                      title="Edit"
                    >
                      <Edit size={18} />
                    </Link>
                    <DeletePropertyButton id={property.id} />
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={4} className="px-8 py-32 text-center">
                   <div className="flex flex-col items-center gap-6 text-primary-600/20">
                      <Home size={64} className="animate-pulse" />
                      <div className="space-y-1">
                        <p className="font-black italic uppercase tracking-widest text-xl">No properties found</p>
                        <p className="text-sm font-medium">Try adjusting your search or filters.</p>
                      </div>
                      <Link href="/admin/properties/new" className="text-primary-600 font-bold hover:underline">
                         Create your first listing
                      </Link>
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
