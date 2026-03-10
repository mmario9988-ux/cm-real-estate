"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

export default function DeletePropertyButton({ id }: { id: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this property?")) return;
    
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/properties/${id}`, { method: "DELETE" });
      if (res.ok) {
        router.refresh();
      } else {
        alert("Failed to delete property");
      }
    } catch (error) {
      alert("Error deleting property");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="text-red-600 hover:text-white bg-red-50 hover:bg-red-600 p-3 rounded-2xl transition-all shadow-sm group/btn disabled:opacity-50"
      title="Delete"
      aria-label="Delete property"
    >
      <Trash2 size={18} />
    </button>
  );
}
