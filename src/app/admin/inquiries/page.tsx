import prisma from "@/lib/prisma";

export const metadata = { title: "Inquiries | Admin Portal" };

export default async function AdminInquiriesPage() {
  const inquiries = await prisma.inquiry.findMany({
    orderBy: { createdAt: "desc" }
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary-900">Inquiries</h1>
        <p className="text-primary-700 text-sm mt-1">View messages and property viewing requests.</p>
      </div>

      <div className="bg-white border border-primary-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-primary-800">
            <thead className="bg-primary-50 text-primary-700 uppercase text-xs border-b border-primary-100">
              <tr>
                <th scope="col" className="px-6 py-4 font-semibold">Date</th>
                <th scope="col" className="px-6 py-4 font-semibold">Name</th>
                <th scope="col" className="px-6 py-4 font-semibold">Contact</th>
                <th scope="col" className="px-6 py-4 font-semibold">Message</th>
                <th scope="col" className="px-6 py-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary-100">
              {inquiries.length > 0 ? inquiries.map((inquiry) => (
                <tr key={inquiry.id} className="hover:bg-primary-50/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">{new Date(inquiry.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 font-medium text-primary-900">{inquiry.name}</td>
                  <td className="px-6 py-4">
                    <div>{inquiry.email}</div>
                    <div className="text-xs text-primary-600">{inquiry.phone || '-'}</div>
                  </td>
                  <td className="px-6 py-4 max-w-xs truncate" title={inquiry.message}>
                    {inquiry.message}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                      inquiry.status === 'Pending' ? 'bg-amber-100 text-amber-800' :
                      inquiry.status === 'Contacted' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {inquiry.status}
                    </span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-primary-700">
                    No inquiries received yet.
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
