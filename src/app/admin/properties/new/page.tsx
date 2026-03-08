import PropertyForm from "@/components/PropertyForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = { title: "Add Property | Admin Portal" };

export default function NewPropertyPage() {
  return (
    <div>
      <div className="mb-8">
        <Link href="/admin/properties" className="text-primary-600 hover:text-primary-800 flex items-center gap-2 text-sm font-medium mb-4 transition-colors w-fit">
          <ArrowLeft size={16} /> กลับไปหน้ารายการ
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">เพิ่มรายการใหม่ (Add New Property)</h1>
        <p className="text-foreground/70 text-sm mt-1">Create a new real estate listing.</p>
      </div>

      <PropertyForm />
    </div>
  );
}
