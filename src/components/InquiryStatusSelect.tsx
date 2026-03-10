"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function InquiryStatusSelect({ id, initialStatus }: { id: string, initialStatus: string }) {
  const [status, setStatus] = useState(initialStatus);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = async (newStatus: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/inquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setStatus(newStatus);
        router.refresh();
      }
    } catch (err) {
      console.error("Failed to update status", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <select
      value={status}
      disabled={loading}
      aria-label="Change inquiry status"
      onChange={(e) => handleChange(e.target.value)}
      className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest border-2 transition-all outline-none cursor-pointer disabled:opacity-50 ${
        status === 'Pending' ? 'bg-amber-50 border-amber-200 text-amber-700 hover:border-amber-400' :
        status === 'Contacted' ? 'bg-blue-50 border-blue-200 text-blue-700 hover:border-blue-400' :
        'bg-emerald-50 border-emerald-200 text-emerald-700 hover:border-emerald-400'
      }`}
    >
      <option value="Pending">Pending</option>
      <option value="Contacted">Contacted</option>
      <option value="Resolved">Resolved</option>
    </select>
  );
}
