"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, MapPin, Sofa, Zap, Wind, Droplets, Car, PawPrint } from "lucide-react";
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

  const inputClass = "w-full px-4 py-2.5 rounded-lg bg-white text-gray-900 border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all placeholder:text-gray-400";
  const labelClass = "block text-sm font-semibold text-gray-700 mb-2";
  const sectionTitleClass = "text-lg font-bold text-gray-800 mb-4 flex items-center gap-2";

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 max-w-4xl space-y-8">
      
      {/* === Basic Info === */}
      <div>
        <h3 className={sectionTitleClass}>📋 ข้อมูลทั่วไป</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label htmlFor="title" className={labelClass}>ชื่อประกาศ *</label>
            <input type="text" id="title" name="title" required defaultValue={initialData?.title} placeholder="e.g. Modern Villa in Chiang Mai" className={inputClass} />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="description" className={labelClass}>รายละเอียด *</label>
            <textarea id="description" name="description" required rows={4} defaultValue={initialData?.description} placeholder="อธิบายรายละเอียดของทรัพย์สิน..." className={`${inputClass} resize-none`}></textarea>
          </div>

          <div>
            <label htmlFor="price" className={labelClass}>ราคา (บาท) *</label>
            <input type="number" id="price" name="price" required min="0" defaultValue={initialData?.price} placeholder="e.g. 5000000" className={inputClass} />
          </div>

          <div>
            <label htmlFor="location" className={labelClass}>ที่ตั้ง *</label>
            <input type="text" id="location" name="location" required defaultValue={initialData?.location} placeholder="e.g. Nimman, Chiang Mai" className={inputClass} />
          </div>

          <div>
            <label htmlFor="type" className={labelClass}>ประเภท *</label>
            <select id="type" name="type" required defaultValue={initialData?.type || "House"} aria-label="Property Type" className={inputClass}>
              <option value="House">บ้าน (House)</option>
              <option value="Townhouse">ทาวน์เฮ้าส์ (Townhouse)</option>
              <option value="Condo">คอนโด (Condo)</option>
              <option value="Villa">วิลล่า (Villa)</option>
              <option value="Land">ที่ดิน (Land)</option>
              <option value="Commercial">พาณิชย์ (Commercial)</option>
            </select>
          </div>

          <div>
            <label htmlFor="status" className={labelClass}>สถานะ *</label>
            <select id="status" name="status" required defaultValue={initialData?.status || "Available"} aria-label="Status" className={inputClass}>
              <option value="For Sale">ขาย (For Sale)</option>
              <option value="For Rent">ให้เช่า (For Rent)</option>
              <option value="Sold">ขายแล้ว (Sold)</option>
              <option value="Rented">ปล่อยเช่าแล้ว (Rented)</option>
            </select>
          </div>
        </div>
      </div>

      {/* === Room & Size === */}
      <div className="pt-6 border-t border-gray-200">
        <h3 className={sectionTitleClass}>🏠 ขนาดและห้อง</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label htmlFor="bedrooms" className={labelClass}>ห้องนอน *</label>
            <input type="number" id="bedrooms" name="bedrooms" required min="0" defaultValue={initialData?.bedrooms || 0} className={inputClass} />
          </div>

          <div>
            <label htmlFor="bathrooms" className={labelClass}>ห้องน้ำ *</label>
            <input type="number" id="bathrooms" name="bathrooms" required min="0" defaultValue={initialData?.bathrooms || 0} className={inputClass} />
          </div>

          <div>
            <label htmlFor="area" className={labelClass}>พื้นที่ (ตร.ม.)</label>
            <input type="number" id="area" name="area" min="0" defaultValue={initialData?.area} placeholder="e.g. 250" className={inputClass} />
          </div>
        </div>
      </div>

      {/* === Facilities === */}
      <div className="pt-6 border-t border-gray-200">
        <h3 className={sectionTitleClass}>🛋️ สิ่งอำนวยความสะดวก</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="furniture" className={labelClass}>
              <span className="flex items-center gap-2"><Sofa size={16} className="text-primary-600" /> เฟอร์นิเจอร์</span>
            </label>
            <select id="furniture" name="furniture" defaultValue={initialData?.furniture || "none"} className={inputClass}>
              <option value="full">มีครบ</option>
              <option value="partial">มีบางส่วน</option>
              <option value="none">ไม่มี</option>
            </select>
          </div>

          <div>
            <label htmlFor="appliances" className={labelClass}>
              <span className="flex items-center gap-2"><Zap size={16} className="text-primary-600" /> เครื่องใช้ไฟฟ้า</span>
            </label>
            <select id="appliances" name="appliances" defaultValue={initialData?.appliances || "none"} className={inputClass}>
              <option value="full">มีครบ</option>
              <option value="partial">มีบางส่วน</option>
              <option value="none">ไม่มี</option>
            </select>
          </div>

          <div>
            <label htmlFor="airconCount" className={labelClass}>
              <span className="flex items-center gap-2"><Wind size={16} className="text-primary-600" /> แอร์ (จำนวน)</span>
            </label>
            <input type="number" id="airconCount" name="airconCount" min="0" defaultValue={initialData?.airconCount || 0} className={inputClass} />
            <p className="text-xs text-gray-400 mt-1">ใส่ 0 = ไม่มี</p>
          </div>

          <div>
            <label htmlFor="waterHeaterCount" className={labelClass}>
              <span className="flex items-center gap-2"><Droplets size={16} className="text-primary-600" /> เครื่องทำน้ำอุ่น (จำนวน)</span>
            </label>
            <input type="number" id="waterHeaterCount" name="waterHeaterCount" min="0" defaultValue={initialData?.waterHeaterCount || 0} className={inputClass} />
            <p className="text-xs text-gray-400 mt-1">ใส่ 0 = ไม่มี</p>
          </div>

          <div>
            <label htmlFor="parkingCount" className={labelClass}>
              <span className="flex items-center gap-2"><Car size={16} className="text-primary-600" /> ที่จอดรถ (จำนวน)</span>
            </label>
            <input type="number" id="parkingCount" name="parkingCount" min="0" defaultValue={initialData?.parkingCount || 0} className={inputClass} />
            <p className="text-xs text-gray-400 mt-1">ใส่ 0 = ไม่มี</p>
          </div>

          <div>
            <label htmlFor="petsAllowed" className={labelClass}>
              <span className="flex items-center gap-2"><PawPrint size={16} className="text-primary-600" /> สัตว์เลี้ยง (จำนวนที่รับ)</span>
            </label>
            <input type="number" id="petsAllowed" name="petsAllowed" min="0" defaultValue={initialData?.petsAllowed || 0} className={inputClass} />
            <p className="text-xs text-gray-400 mt-1">ใส่ 0 = ไม่รับสัตว์เลี้ยง</p>
          </div>
        </div>
      </div>

      {/* === Google Maps === */}
      <div className="pt-6 border-t border-gray-200">
        <h3 className={sectionTitleClass}><MapPin size={20} className="text-primary-600" /> พิกัดที่ตั้ง</h3>
        <div>
          <label htmlFor="googleMapsUrl" className={labelClass}>Google Maps Link</label>
          <input type="url" id="googleMapsUrl" name="googleMapsUrl" defaultValue={initialData?.googleMapsUrl || ""} placeholder="https://maps.google.com/..." className={inputClass} />
          <p className="text-xs text-gray-400 mt-1">วางลิงก์จาก Google Maps เพื่อให้ลูกค้าดูตำแหน่ง</p>
        </div>
      </div>

      {/* === Image Upload === */}
      <div className="pt-6 border-t border-gray-200">
        <h3 className={sectionTitleClass}>📸 รูปภาพ</h3>
        <p className="text-sm text-gray-500 mb-3">อัปโหลดได้ไม่จำกัด — รูปแรกจะเป็น <span className="font-bold text-primary-600">รูปปก</span> แสดงในหน้าแรก</p>
        <ImageUpload value={uploadedImages} onChange={setUploadedImages} />
      </div>

      {/* === Submit === */}
      <div className="flex gap-4 pt-6 border-t border-gray-200">
        <button type="submit" disabled={isSubmitting} className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70 shadow-sm">
          {isSubmitting ? "กำลังบันทึก..." : <><Save size={18} /> {isEditing ? "อัปเดตข้อมูล" : "สร้างประกาศ"}</>}
        </button>
        <Link href="/admin/properties" className="flex-1 bg-gray-100 border border-gray-300 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2">
          ยกเลิก
        </Link>
      </div>
    </form>
  );
}
