import prisma from "@/lib/prisma";
import Link from "next/link";
import { PlusCircle, Edit } from "lucide-react";
import DeletePropertyButton from "@/components/DeletePropertyButton";

export const metadata = { title: "Manage Properties | Admin Portal" };

export default async function AdminPropertiesPage() {
  const properties = await prisma.property.findMany({
    orderBy: { createdAt: "desc" }
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Properties</h1>
          <p className="text-gray-600 text-sm mt-1">Manage all property listings on your website.</p>
        </div>
        <Link href="/admin/properties/new" className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium">
          <PlusCircle size={18} /> Add Property
        </Link>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-700">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs border-b border-gray-200">
              <tr>
                <th scope="col" className="px-6 py-4 font-semibold">Title</th>
                <th scope="col" className="px-6 py-4 font-semibold">Location</th>
                <th scope="col" className="px-6 py-4 font-semibold">Price</th>
                <th scope="col" className="px-6 py-4 font-semibold">Views</th>
                <th scope="col" className="px-6 py-4 font-semibold">Status</th>
                <th scope="col" className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {properties.length > 0 ? properties.map((property) => (
                <tr key={property.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{property.title}</td>
                  <td className="px-6 py-4 text-gray-600">{property.location}</td>
                  <td className="px-6 py-4 font-semibold text-primary-600">
                    ฿{property.price.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-gray-500 font-medium">
                    {property.viewCount}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                      property.status === 'Available' ? 'bg-green-100 text-green-800' :
                      property.status === 'Sold' ? 'bg-red-100 text-red-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {property.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right flex justify-end gap-2">
                    <Link href={`/admin/properties/edit/${property.id}`} className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 p-2 rounded-lg transition-colors">
                      <Edit size={18} />
                    </Link>
                    <DeletePropertyButton id={property.id} />
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    No properties found. Click &quot;Add Property&quot; to create one.
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
