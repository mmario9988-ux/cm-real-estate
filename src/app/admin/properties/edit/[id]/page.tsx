import PropertyForm from "@/components/PropertyForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

export const metadata = { title: "Edit Property | Admin Portal" };

export default async function EditPropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const property = await prisma.property.findUnique({
    where: { id: resolvedParams.id }
  });

  if (!property) {
    notFound();
  }

  return (
    <div>
      <div className="mb-8">
        <Link href="/admin/properties" className="text-primary-600 hover:text-primary-800 flex items-center gap-2 text-sm font-medium mb-4 transition-colors w-fit">
          <ArrowLeft size={16} /> Back to Properties
        </Link>
        <h1 className="text-3xl font-bold text-foreground">Edit Property</h1>
        <p className="text-foreground/70 text-sm mt-1">Update details for {property.title}</p>
      </div>

      <PropertyForm initialData={property} />
    </div>
  );
}
