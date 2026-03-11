"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, MapPin, Sofa, Zap, Wind, Droplets, Car, PawPrint, Info, Ruler, Layout, ArrowLeft, Loader2, Banknote, Bed } from "lucide-react";
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
      features: initialData?.features || JSON.stringify([]),
      googleMapsUrl: formData.get("googleMapsUrl") || null,
      youtubeUrl: formData.get("youtubeUrl") || null,
      furniture: formData.get("furniture"),
      appliances: formData.get("appliances"),
      airconCount: formData.get("airconCount"),
      waterHeaterCount: formData.get("waterHeaterCount"),
      parkingCount: formData.get("parkingCount"),
      petsAllowed: formData.get("petsAllowed"),
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

  const inputClass = "w-full px-5 py-3.5 rounded-2xl bg-primary-50/30 text-primary-950 border border-primary-100 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all placeholder:text-primary-300 font-medium text-sm lg:text-base";
  const labelClass = "text-xs font-bold uppercase tracking-wider text-primary-400 ml-1 mb-2 block";
  const sectionCardClass = "bg-white p-8 lg:p-10 rounded-[40px] border border-primary-100 shadow-sm space-y-8";
  const sectionTitleClass = "text-xl font-bold text-primary-950 flex items-center gap-3 mb-2";

  return (
    <form onSubmit={handleSubmit} className="max-w-5xl mx-auto space-y-10 pb-20">
      
      {/* Header Info */}
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
        <div>
          <div className="flex items-center gap-2 text-primary-600 font-black uppercase tracking-widest text-[10px] mb-2">
             <div className="w-8 h-[2px] bg-primary-600"></div>
             Publish Listing
          </div>
          <h1 className="text-4xl font-bold text-primary-950 tracking-tight">
             {isEditing ? "แก้ไขประกาศ" : "สร้างประกาศใหม่"}
          </h1>
        </div>
        <Link href="/admin/properties" className="flex items-center gap-2 text-primary-400 hover:text-primary-900 font-black uppercase tracking-widest text-[10px] bg-white px-6 py-3.5 rounded-2xl border border-primary-50 transition-all shadow-sm">
           <ArrowLeft size={16} /> Back to Directory
        </Link>
      </div>

      {/* === Basic Info === */}
      <section className={sectionCardClass}>
        <div>
          <h3 className={sectionTitleClass}><Info size={22} className="text-primary-600" /> ข้อมูลทั่วไป</h3>
          <p className="text-primary-900/40 text-sm font-bold ml-9">Essential details about the property listing.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="md:col-span-2">
            <label htmlFor="title" className={labelClass}>Property Title *</label>
            <input type="text" id="title" name="title" required defaultValue={initialData?.title} placeholder="e.g. Modern Minimalist Villa in Mae Rim" className={inputClass} />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="description" className={labelClass}>Detailed Description *</label>
            <textarea id="description" name="description" required rows={5} defaultValue={initialData?.description} placeholder="Describe the property's unique selling points, surroundings, and amenities..." className={`${inputClass} resize-none`}></textarea>
          </div>

          <div className="relative group">
            <label htmlFor="price" className={labelClass}>Listing Price (THB) *</label>
            <div className="relative">
               <Banknote size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-primary-200 group-focus-within:text-primary-600 transition-colors" />
               <input type="number" id="price" name="price" required min="0" defaultValue={initialData?.price} placeholder="e.g. 5500000" className={`${inputClass} pl-12`} />
            </div>
          </div>

          <div className="relative group">
            <label htmlFor="location" className={labelClass}>Property Location *</label>
            <div className="relative">
               <MapPin size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-primary-200 group-focus-within:text-primary-600 transition-colors" />
               <input type="text" id="location" name="location" required defaultValue={initialData?.location} placeholder="e.g. Nimman, Chiang Mai" className={`${inputClass} pl-12`} />
            </div>
          </div>

          <div className="relative group">
            <label htmlFor="type" className={labelClass}>Property Type *</label>
            <select id="type" name="type" required defaultValue={initialData?.type || "House"} aria-label="Property Type" className={inputClass}>
              <option value="House">บ้านเดี่ยว (House)</option>
              <option value="Townhouse">ทาวน์โฮม (Townhouse)</option>
              <option value="Condo">คอนโด (Condo)</option>
              <option value="Villa">วิลล่า (Villa)</option>
              <option value="Land">ที่ดิน (Land)</option>
              <option value="Commercial">อาคารพาณิชย์ (Commercial)</option>
            </select>
          </div>

          <div className="relative group">
            <label htmlFor="status" className={labelClass}>Listing Status *</label>
            <select id="status" name="status" required defaultValue={initialData?.status || "For Sale"} aria-label="Status" className={inputClass}>
              <option value="For Sale">🏡 สำหรับขาย (For Sale)</option>
              <option value="For Rent">🔑 สำหรับเช่า (For Rent)</option>
              <option value="Sold">🔴 ขายแล้ว (Sold)</option>
              <option value="Rented">🔵 เช่าแล้ว (Rented)</option>
            </select>
          </div>
        </div>
      </section>

      {/* === Room & Size === */}
      <section className={sectionCardClass}>
        <div>
          <h3 className={sectionTitleClass}><Layout size={22} className="text-primary-600" /> ขนาดและพื้นที่</h3>
          <p className="text-primary-900/40 text-sm font-bold ml-9">Layout specifications and measurement details.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="relative group">
            <label htmlFor="bedrooms" className={labelClass}>Bedrooms *</label>
            <div className="relative">
               <Bed size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-primary-200 group-focus-within:text-primary-600 transition-colors" />
               <input type="number" id="bedrooms" name="bedrooms" required min="0" defaultValue={initialData?.bedrooms || 0} className={`${inputClass} pl-12`} />
            </div>
          </div>

          <div className="relative group">
            <label htmlFor="bathrooms" className={labelClass}>Bathrooms *</label>
            <div className="relative">
               <Droplets size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-primary-200 group-focus-within:text-primary-600 transition-colors" />
               <input type="number" id="bathrooms" name="bathrooms" required min="0" defaultValue={initialData?.bathrooms || 0} className={`${inputClass} pl-12`} />
            </div>
          </div>

          <div className="relative group">
            <label htmlFor="area" className={labelClass}>Living Area (SQM)</label>
            <div className="relative">
               <Ruler size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-primary-200 group-focus-within:text-primary-600 transition-colors" />
               <input type="number" id="area" name="area" min="0" defaultValue={initialData?.area} placeholder="e.g. 180" className={`${inputClass} pl-12`} />
            </div>
          </div>
        </div>
      </section>

      {/* === Facilities === */}
      <section className={sectionCardClass}>
        <div>
          <h3 className={sectionTitleClass}><Sofa size={22} className="text-primary-600" /> สิ่งอำนวยความสะดวก</h3>
          <p className="text-primary-900/40 text-sm font-bold ml-9">Furniture, appliances, and utility counts.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label htmlFor="furniture" className={labelClass}>เฟอร์นิเจอร์ (Furniture)</label>
            <select id="furniture" name="furniture" defaultValue={initialData?.furniture || "none"} className={inputClass}>
              <option value="full">มีเฟอร์นิเจอร์ครบ (Fully Furnished)</option>
              <option value="partial">มีบางส่วน (Partially Furnished)</option>
              <option value="none">ไม่มี (Unfurnished)</option>
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="appliances" className={labelClass}>เครื่องใช้ไฟฟ้า (Appliances)</label>
            <select id="appliances" name="appliances" defaultValue={initialData?.appliances || "none"} className={inputClass}>
              <option value="full">มีครบ (Full Appliances)</option>
              <option value="partial">มีบางส่วน (Partial)</option>
              <option value="none">ไม่มี (None)</option>
            </select>
          </div>

          <div className="relative group">
            <label htmlFor="airconCount" className={labelClass}>Air Conditioners (Units)</label>
            <div className="relative flex items-center">
               <input type="number" id="airconCount" name="airconCount" min="0" defaultValue={initialData?.airconCount || 0} className={inputClass} />
               <Wind size={18} className="absolute right-5 text-primary-200" />
            </div>
          </div>

          <div className="relative group">
            <label htmlFor="waterHeaterCount" className={labelClass}>Water Heaters (Units)</label>
            <div className="relative flex items-center">
               <input type="number" id="waterHeaterCount" name="waterHeaterCount" min="0" defaultValue={initialData?.waterHeaterCount || 0} className={inputClass} />
               <Droplets size={18} className="absolute right-5 text-primary-200" />
            </div>
          </div>

          <div className="relative group">
            <label htmlFor="parkingCount" className={labelClass}>Parking Spaces</label>
            <div className="relative flex items-center">
               <input type="number" id="parkingCount" name="parkingCount" min="0" defaultValue={initialData?.parkingCount || 0} className={inputClass} />
               <Car size={18} className="absolute right-5 text-primary-200" />
            </div>
          </div>

          <div className="relative group">
            <label htmlFor="petsAllowed" className={labelClass}>Pet Allowance Policy</label>
            <div className="relative flex items-center">
               <input type="number" id="petsAllowed" name="petsAllowed" min="0" defaultValue={initialData?.petsAllowed || 0} className={inputClass} />
               <PawPrint size={18} className="absolute right-5 text-primary-200" />
            </div>
            <p className="text-[10px] text-primary-300 font-bold uppercase mt-2 ml-1">0 = No Pets allowed</p>
          </div>
        </div>
      </section>

      {/* === Maps & Video === */}
      <section className={sectionCardClass}>
        <div>
          <h3 className={sectionTitleClass}><MapPin size={22} className="text-primary-600" /> พิกัดที่ตั้ง และวิดีโอ</h3>
          <p className="text-primary-900/40 text-sm font-bold ml-9">Link to the property's exact location on Google Maps and YouTube tour.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="relative group">
             <label htmlFor="googleMapsUrl" className={labelClass}>Google Maps URL</label>
             <input type="url" id="googleMapsUrl" name="googleMapsUrl" defaultValue={initialData?.googleMapsUrl || ""} placeholder="https://maps.google.com/..." className={inputClass} />
          </div>
          <div className="relative group">
             <label htmlFor="youtubeUrl" className={labelClass}>YouTube Video URL</label>
             <input type="url" id="youtubeUrl" name="youtubeUrl" defaultValue={initialData?.youtubeUrl || ""} placeholder="https://youtube.com/watch?v=..." className={inputClass} />
          </div>
        </div>
      </section>

      {/* === Image Upload === */}
      <section className={sectionCardClass}>
        <div>
          <h3 className={sectionTitleClass}>📸 แกลเลอรี่รูปภาพ</h3>
          <p className="text-primary-900/40 text-sm font-bold ml-9">Upload high-quality images. The first image will be the cover.</p>
        </div>
        <ImageUpload value={uploadedImages} onChange={setUploadedImages} />
      </section>

      {/* === Submit Bar === */}
      <div className="sticky bottom-6 z-20 px-8 py-6 bg-primary-950/90 backdrop-blur-xl rounded-[32px] border border-white/10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] flex flex-col sm:flex-row gap-4 items-center">
        <div className="flex-grow">
           <p className="text-primary-100 font-bold text-sm tracking-tight">{isEditing ? "Currently editing listing" : "Ready to publish new listing"}</p>
           <p className="text-primary-400 text-[10px] font-black uppercase tracking-widest">{isEditing ? initialData?.title : "Chiang Mai Real Estate Portal"}</p>
        </div>
        <div className="flex gap-4 w-full sm:w-auto">
          <Link href="/admin/properties" className="flex-1 sm:flex-none px-10 py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center">
             ยกเลิก
          </Link>
          <button type="submit" disabled={isSubmitting} className="flex-1 sm:flex-none bg-primary-600 hover:bg-primary-700 text-white font-black px-12 py-4 rounded-2xl transition-all flex items-center justify-center gap-3 disabled:opacity-70 shadow-lg shadow-primary-600/30">
            {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <><Save size={18} /> {isEditing ? "อัปเดตข้อมูล" : "สร้างประกาศ"}</>}
          </button>
        </div>
      </div>
    </form>
  );
}

