"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";
import Link from "next/link";
import ImageUpload from "./ImageUpload";

export default function PropertyForm({ initialData }: { initialData?: any }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!initialData;

  // Parse initial images
  let initialImages: string[] = [];
  if (initialData?.images) {
    try {
      const parsed = JSON.parse(initialData.images);
      if (Array.isArray(parsed)) {
        initialImages = parsed.filter((url: string) => !url.startsWith("/"));
      }
    } catch (e) {}
  }

  const [uploadedImages, setUploadedImages] = useState<string[]>(initialImages);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get("title"),
      description: formData.get("description"),
      price: formData.get("price"),
      location: formData.get("location"),
      bedrooms: formData.get("bedrooms"),
      bathrooms: formData.get("bathrooms"),
      area: formData.get("area"),
      type: formData.get("type"),
      status: formData.get("status"),
      images: JSON.stringify(
        uploadedImages.length > 0
          ? uploadedImages
          : ["/placeholder-property.jpg"]
      ),
      features: initialData?.features || JSON.stringify(["Balcony", "Garden", "Parking"]),
    };

    try {
      const endpoint = isEditing ? `/api/properties/${initialData.id}` : "/api/properties";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to save property");
      
      router.push("/admin/properties");
      router.refresh();
    } catch (error) {
      alert("Error saving property");
      setIsSubmitting(false);
    }
  };

  const inputClass = "w-full px-4 py-2.5 rounded-lg bg-white text-gray-900 border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all placeholder:text-gray-400";
  const labelClass = "block text-sm font-semibold text-gray-700 mb-2";

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 max-w-4xl space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label htmlFor="title" className={labelClass}>Title *</label>
          <input type="text" id="title" name="title" required defaultValue={initialData?.title} placeholder="e.g. Modern Villa in Chiang Mai" className={inputClass} />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="description" className={labelClass}>Description *</label>
          <textarea id="description" name="description" required rows={4} defaultValue={initialData?.description} placeholder="Describe the property..." className={`${inputClass} resize-none`}></textarea>
        </div>

        <div>
          <label htmlFor="price" className={labelClass}>Price (THB) *</label>
          <input type="number" id="price" name="price" required min="0" defaultValue={initialData?.price} placeholder="e.g. 5000000" className={inputClass} />
        </div>

        <div>
          <label htmlFor="location" className={labelClass}>Location *</label>
          <input type="text" id="location" name="location" required defaultValue={initialData?.location} placeholder="e.g. Nimman, Chiang Mai" className={inputClass} />
        </div>

        <div>
          <label htmlFor="type" className={labelClass}>Property Type *</label>
          <select id="type" name="type" required defaultValue={initialData?.type || "House"} aria-label="Property Type" className={inputClass}>
            <option value="House">House</option>
            <option value="Condo">Condo</option>
            <option value="Villa">Villa</option>
            <option value="Land">Land</option>
            <option value="Commercial">Commercial</option>
          </select>
        </div>

        <div>
          <label htmlFor="status" className={labelClass}>Status *</label>
          <select id="status" name="status" required defaultValue={initialData?.status || "Available"} aria-label="Status" className={inputClass}>
            <option value="Available">Available</option>
            <option value="Sold">Sold</option>
            <option value="Rented">Rented</option>
          </select>
        </div>

        <div>
          <label htmlFor="bedrooms" className={labelClass}>Bedrooms *</label>
          <input type="number" id="bedrooms" name="bedrooms" required min="0" defaultValue={initialData?.bedrooms || 0} className={inputClass} />
        </div>

        <div>
          <label htmlFor="bathrooms" className={labelClass}>Bathrooms *</label>
          <input type="number" id="bathrooms" name="bathrooms" required min="0" defaultValue={initialData?.bathrooms || 0} className={inputClass} />
        </div>

        <div>
          <label htmlFor="area" className={labelClass}>Area (Sqm)</label>
          <input type="number" id="area" name="area" min="0" defaultValue={initialData?.area} placeholder="e.g. 250" className={inputClass} />
        </div>
      </div>

      {/* Image Upload Section */}
      <div className="pt-6 border-t border-gray-200">
        <label className="block text-sm font-semibold text-gray-700 mb-3">Property Images</label>
        <ImageUpload value={uploadedImages} onChange={setUploadedImages} />
      </div>

      <div className="flex gap-4 pt-6 border-t border-gray-200">
        <button type="submit" disabled={isSubmitting} className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70 shadow-sm">
          {isSubmitting ? "Saving..." : <><Save size={18} /> {isEditing ? "Update Property" : "Create Property"}</>}
        </button>
        <Link href="/admin/properties" className="flex-1 bg-gray-100 border border-gray-300 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2">
          Cancel
        </Link>
      </div>
    </form>
  );
}
