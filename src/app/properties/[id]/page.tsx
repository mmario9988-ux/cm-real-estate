import { notFound } from "next/navigation";
import Image from "next/image";
import prisma from "@/lib/prisma";
import { Bed, Bath, Square, MapPin, Check } from "lucide-react";
import InquiryForm from "@/components/InquiryForm";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const property = await prisma.property.findUnique({
    where: { id: resolvedParams.id }
  });

  if (!property) return { title: "Property Not Found" };

  return {
    title: `${property.title} | Chiang Mai Estates`,
    description: property.description.substring(0, 160) + "...",
  };
}

export default async function PropertyDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const property = await prisma.property.findUnique({
    where: { id: resolvedParams.id }
  });

  if (!property) {
    notFound();
  }

  // Parse images and features safely
  let images: string[] = [];
  try { images = JSON.parse(property.images) || []; } catch(e) {}
  if (images.length === 0) images = ["/placeholder-property.jpg"];

  let features: string[] = [];
  try { features = JSON.parse(property.features) || []; } catch(e) {}

  const formattedPrice = new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
    maximumFractionDigits: 0
  }).format(property.price);

  return (
    <div className="bg-background min-h-screen pb-20">
      {/* Hero Cover Image */}
      <div className="w-full h-[40vh] md:h-[50vh] relative bg-primary-100 mt-0">
        <div className="absolute inset-0 bg-black/20 z-10"></div>
        {images[0].startsWith("http") ? (
          <Image src={images[0]} alt={property.title} fill className="object-cover" priority />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-primary-200">
             <span className="text-primary-800/50">Property Image Placeholder</span>
          </div>
        )}
      </div>

      {/* Image Gallery Grid */}
      {images.length > 1 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <h3 className="text-lg font-bold text-foreground mb-3">📸 รูปภาพทั้งหมด ({images.length} รูป)</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {images.map((img, idx) => (
              img.startsWith("http") && (
                <div key={idx} className="relative aspect-video rounded-xl overflow-hidden border border-gray-200 hover:border-primary-500 transition-all hover:shadow-lg group">
                  <Image src={img} alt={`${property.title} - ${idx + 1}`} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                  {idx === 0 && (
                    <span className="absolute top-2 left-2 bg-primary-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">COVER</span>
                  )}
                </div>
              )
            ))}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-10">
            <div>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-semibold">
                  {property.type}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  property.status === 'Available' ? 'bg-primary-500 text-white' : 
                  property.status === 'Sold' ? 'bg-red-500 text-white' : 
                  'bg-accent-500 text-white'
                }`}>
                  {property.status}
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4 leading-tight">{property.title}</h1>
              <div className="flex items-center text-foreground/70 text-lg">
                <MapPin className="mr-2 text-accent-500" />
                <span>{property.location}</span>
              </div>
            </div>

            {/* Price (Mobile) */}
            <div className="lg:hidden text-3xl font-bold text-primary-600 border-y border-primary-100 py-6">
              {formattedPrice}
            </div>

            {/* Key Stats */}
            <div className="grid grid-cols-3 gap-4 border-y border-primary-100 py-8">
              <div className="flex items-center gap-4">
                <div className="bg-primary-50 p-3 rounded-xl text-primary-600"><Bed size={24} /></div>
                <div>
                  <div className="text-2xl font-bold text-foreground">{property.bedrooms}</div>
                  <div className="text-sm text-foreground/60">Bedrooms</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-primary-50 p-3 rounded-xl text-primary-600"><Bath size={24} /></div>
                <div>
                  <div className="text-2xl font-bold text-foreground">{property.bathrooms}</div>
                  <div className="text-sm text-foreground/60">Bathrooms</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-primary-50 p-3 rounded-xl text-primary-600"><Square size={24} /></div>
                <div>
                  <div className="text-2xl font-bold text-foreground">{property.area || '-'}</div>
                  <div className="text-sm text-foreground/60">Sqm Area</div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">Description</h2>
              <div className="text-foreground/80 leading-relaxed whitespace-pre-line text-lg">
                {property.description}
              </div>
            </div>

            {/* Facilities */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">สิ่งอำนวยความสะดวก</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Furniture */}
                <div className="flex items-center gap-3 p-4 rounded-xl bg-primary-50 dark:bg-primary-900/30">
                  <span className="text-2xl">🛋️</span>
                  <div>
                    <div className="text-sm text-foreground/60">เฟอร์นิเจอร์</div>
                    <div className="font-semibold text-foreground">
                      {property.furniture === 'full' ? 'มีครบ' : property.furniture === 'partial' ? 'มีบางส่วน' : 'ไม่มี'}
                    </div>
                  </div>
                </div>

                {/* Appliances */}
                <div className="flex items-center gap-3 p-4 rounded-xl bg-primary-50 dark:bg-primary-900/30">
                  <span className="text-2xl">⚡</span>
                  <div>
                    <div className="text-sm text-foreground/60">เครื่องใช้ไฟฟ้า</div>
                    <div className="font-semibold text-foreground">
                      {property.appliances === 'full' ? 'มีครบ' : property.appliances === 'partial' ? 'มีบางส่วน' : 'ไม่มี'}
                    </div>
                  </div>
                </div>

                {/* AC */}
                <div className="flex items-center gap-3 p-4 rounded-xl bg-primary-50 dark:bg-primary-900/30">
                  <span className="text-2xl">❄️</span>
                  <div>
                    <div className="text-sm text-foreground/60">แอร์</div>
                    <div className="font-semibold text-foreground">
                      {property.airconCount > 0 ? `มี ${property.airconCount} เครื่อง` : 'ไม่มี'}
                    </div>
                  </div>
                </div>

                {/* Water Heater */}
                <div className="flex items-center gap-3 p-4 rounded-xl bg-primary-50 dark:bg-primary-900/30">
                  <span className="text-2xl">🚿</span>
                  <div>
                    <div className="text-sm text-foreground/60">เครื่องทำน้ำอุ่น</div>
                    <div className="font-semibold text-foreground">
                      {property.waterHeaterCount > 0 ? `มี ${property.waterHeaterCount} เครื่อง` : 'ไม่มี'}
                    </div>
                  </div>
                </div>

                {/* Parking */}
                <div className="flex items-center gap-3 p-4 rounded-xl bg-primary-50 dark:bg-primary-900/30">
                  <span className="text-2xl">🚗</span>
                  <div>
                    <div className="text-sm text-foreground/60">ที่จอดรถ</div>
                    <div className="font-semibold text-foreground">
                      {property.parkingCount > 0 ? `มี ${property.parkingCount} คัน` : 'ไม่มี'}
                    </div>
                  </div>
                </div>

                {/* Pets */}
                <div className="flex items-center gap-3 p-4 rounded-xl bg-primary-50 dark:bg-primary-900/30">
                  <span className="text-2xl">🐾</span>
                  <div>
                    <div className="text-sm text-foreground/60">สัตว์เลี้ยง</div>
                    <div className="font-semibold text-foreground">
                      {property.petsAllowed > 0 ? `รับได้ ${property.petsAllowed} ตัว` : 'ไม่รับ'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Maps */}
            {property.googleMapsUrl && (
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">📍 ตำแหน่งที่ตั้ง</h2>
                <a
                  href={property.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-sm"
                >
                  <MapPin size={18} />
                  ดูใน Google Maps
                </a>
              </div>
            )}

            {/* Features */}
            {features.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-6">Property Features</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-foreground/80">
                  {features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="bg-primary-100 p-1 rounded-full text-primary-600">
                        <Check size={16} />
                      </div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar / Inquiry Form */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white dark:bg-primary-900/20 p-8 rounded-3xl shadow-xl shadow-primary-900/5 border border-primary-100 dark:border-primary-800">
              <div className="hidden lg:block mb-8 pb-8 border-b border-primary-100 dark:border-primary-800/50">
                <div className="text-sm text-foreground/60 uppercase tracking-wider font-semibold mb-2">Asking Price</div>
                <div className="text-4xl font-bold text-primary-600">{formattedPrice}</div>
              </div>
              
              <h3 className="text-xl font-bold text-foreground mb-6">Interested in this property?</h3>
              <p className="text-sm text-foreground/70 mb-6">
                Contact our local agents to schedule a viewing or ask any questions.
              </p>
              
              <InquiryForm propertyId={property.id} propertyTitle={property.title} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
