import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { Bed, Bath, Square, MapPin, Check } from "lucide-react";
import InquiryForm from "@/components/InquiryForm";
import ImageGallery from "@/components/ImageGallery";
import ViewTracker from "@/components/ViewTracker";
import JsonLd from "@/components/JsonLd";
import SimilarProperties from "@/components/SimilarProperties";
import ShareButtons from "@/components/ShareButtons";
import { getTranslation, getLanguage } from "@/lib/i18n-server";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const property = await prisma.property.findUnique({
    where: { id: resolvedParams.id }
  });

  if (!property) return { title: "Property Not Found" };

  const lang = await getLanguage();

  const formattedPrice = new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
    maximumFractionDigits: 0
  }).format(property.price);

  // Dynamic Keyword Logic
  const isThai = lang === 'th';
  
  // Type translations
  const typeMap: Record<string, { th: string, en: string }> = {
    'House': { th: 'บ้านเดี่ยว', en: 'House' },
    'Condo': { th: 'คอนโด', en: 'Condo' },
    'Townhouse': { th: 'ทาวน์โฮม', en: 'Townhouse' },
    'Land': { th: 'ที่ดิน', en: 'Land' }
  };
  
  const typeStr = typeMap[property.type]?.[isThai ? 'th' : 'en'] || property.type;
  
  // Status translations
  const statusStr = property.status === 'For Sale' 
    ? (isThai ? 'ขาย' : 'For Sale') 
    : (isThai ? 'ให้เช่า' : 'For Rent');

  const seoPrefix = isThai 
    ? `[${statusStr}${typeStr}]` 
    : `[${typeStr} ${statusStr}]`;

  const seoTitle = `${seoPrefix} ${property.title} ${property.location} ${isThai ? 'ราคา' : '-'} ${formattedPrice} | Chiang Mai Estates`;

  let images: string[] = [];
  try { images = JSON.parse(property.images) || []; } catch(e) {}
  const ogImage = images.length > 0 ? images[0] : "/hero-bg.jpg";

  return {
    title: seoTitle,
    description: `${property.title} ${isThai ? 'ราคา' : 'Price'} ${formattedPrice} ${isThai ? 'ตั้งอยู่ที่' : 'located in'} ${property.location}. ${property.description.substring(0, 150)}...`,
    alternates: {
      canonical: `/properties/${resolvedParams.id}`,
      languages: {
        'th': `/properties/${resolvedParams.id}`,
        'en': `/en/properties/${resolvedParams.id}`,
      },
    },
    openGraph: {
      title: seoTitle,
      description: property.description.substring(0, 160) + "...",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${seoPrefix} ${property.title}`,
        }
      ]
    }
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

  const t = await getTranslation();
  const lang = await getLanguage();

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

  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    "name": property.title,
    "description": property.description,
    "url": `https://cm-real-estate.vercel.app/properties/${property.id}`,
    "image": images,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": property.location,
      "addressRegion": "Chiang Mai",
      "addressCountry": "TH"
    },
    "offer": {
      "@type": "Offer",
      "price": property.price,
      "priceCurrency": "THB",
      "availability": property.status === "Available" ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
    }
  };

  // Translate status and type
  const displayStatus = property.status === "For Rent" ? t("filters.rent") : 
                        property.status === "For Sale" ? t("filters.sale") : 
                        property.status;
  
  const displayType = property.type === "House" ? t("property.house") :
                      property.type === "Condo" ? t("property.condo") :
                      property.type === "Townhouse" ? t("property.townhouse") :
                      property.type === "Land" ? t("property.land") :
                      property.type;

  return (
    <div className="bg-background min-h-screen pb-20">
      <JsonLd data={jsonLdData} />
      <ViewTracker propertyId={property.id} />
      
      {/* Image Gallery */}
      <ImageGallery images={images} title={property.title} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-10">
            <div>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-white text-gray-800 px-3 py-1 rounded-full text-sm font-semibold shadow-sm border border-gray-100">
                  {displayType}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold shadow-sm ${
                  property.status === 'For Sale' ? 'bg-amber-500 text-white' : 
                  property.status === 'For Rent' ? 'bg-blue-500 text-white' : 
                  property.status === 'Sold' ? 'bg-red-500 text-white' : 
                  property.status === 'Rented' ? 'bg-gray-500 text-white' : 
                  'bg-primary-500 text-white'
                }`}>
                  {displayStatus}
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4 leading-tight">{property.title}</h1>
              <div className="flex items-center text-foreground/70 text-lg">
                <MapPin className="mr-2 text-accent-500" />
                <span>{property.location}</span>
              </div>
            </div>

            {/* Price (Mobile) */}
            <div className="lg:hidden border-y border-primary-100 py-6">
              <div className="text-sm text-foreground/60 uppercase tracking-wider font-semibold mb-1">{t("property.askingPrice")}</div>
              <div className="text-3xl font-bold text-primary-600">{formattedPrice}</div>
            </div>

            {/* Key Stats */}
            <div className="grid grid-cols-3 gap-4 border-y border-primary-100 py-8">
              <div className="flex items-center gap-4">
                <div className="bg-primary-50 p-3 rounded-xl text-primary-600"><Bed size={24} /></div>
                <div>
                  <div className="text-2xl font-bold text-foreground">{property.bedrooms}</div>
                  <div className="text-sm text-foreground/60">{t("property.bedrooms")}</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-primary-50 p-3 rounded-xl text-primary-600"><Bath size={24} /></div>
                <div>
                  <div className="text-2xl font-bold text-foreground">{property.bathrooms}</div>
                  <div className="text-sm text-foreground/60">{t("property.bathrooms")}</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-primary-50 p-3 rounded-xl text-primary-600"><Square size={24} /></div>
                <div>
                  <div className="text-2xl font-bold text-foreground">{property.area || '-'}</div>
                  <div className="text-sm text-foreground/60">{t("property.area")} ({t("property.sqm")})</div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">{t("property.description")}</h2>
              <div className="text-foreground/80 leading-relaxed whitespace-pre-line text-lg">
                {property.description}
              </div>
            </div>

            {/* Share Buttons */}
            <ShareButtons 
              url={`https://cm-real-estate.vercel.app/properties/${property.id}`} 
              title={property.title} 
            />

            {/* Facilities */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">{t("property.facilities")}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Furniture */}
                <div className="flex items-center gap-3 p-4 rounded-xl bg-primary-50 dark:bg-primary-900/30">
                  <span className="text-2xl">🛋️</span>
                  <div>
                    <div className="text-sm text-foreground/60">{t("property.furniture")}</div>
                    <div className="font-semibold text-foreground">
                      {property.furniture === 'full' ? t("property.full") : property.furniture === 'partial' ? t("property.partial") : t("property.none")}
                    </div>
                  </div>
                </div>

                {/* Appliances */}
                <div className="flex items-center gap-3 p-4 rounded-xl bg-primary-50 dark:bg-primary-900/30">
                  <span className="text-2xl">⚡</span>
                  <div>
                    <div className="text-sm text-foreground/60">{t("property.appliances")}</div>
                    <div className="font-semibold text-foreground">
                      {property.appliances === 'full' ? t("property.full") : property.appliances === 'partial' ? t("property.partial") : t("property.none")}
                    </div>
                  </div>
                </div>

                {/* AC */}
                <div className="flex items-center gap-3 p-4 rounded-xl bg-primary-50 dark:bg-primary-900/30">
                  <span className="text-2xl">❄️</span>
                  <div>
                    <div className="text-sm text-foreground/60">{t("property.aircon")}</div>
                    <div className="font-semibold text-foreground">
                      {property.airconCount > 0 ? `${t("property.full")} ${property.airconCount} ${t("property.units")}` : t("property.none")}
                    </div>
                  </div>
                </div>

                {/* Water Heater */}
                <div className="flex items-center gap-3 p-4 rounded-xl bg-primary-50 dark:bg-primary-900/30">
                  <span className="text-2xl">🚿</span>
                  <div>
                    <div className="text-sm text-foreground/60">{t("property.waterHeater")}</div>
                    <div className="font-semibold text-foreground">
                      {property.waterHeaterCount > 0 ? `${t("property.full")} ${property.waterHeaterCount} ${t("property.units")}` : t("property.none")}
                    </div>
                  </div>
                </div>

                {/* Parking */}
                <div className="flex items-center gap-3 p-4 rounded-xl bg-primary-50 dark:bg-primary-900/30">
                  <span className="text-2xl">🚗</span>
                  <div>
                    <div className="text-sm text-foreground/60">{t("property.parking")}</div>
                    <div className="font-semibold text-foreground">
                      {property.parkingCount > 0 ? `${property.parkingCount} ${t("property.cars")}` : t("property.none")}
                    </div>
                  </div>
                </div>

                {/* Pets */}
                <div className="flex items-center gap-3 p-4 rounded-xl bg-primary-50 dark:bg-primary-900/30">
                  <span className="text-2xl">🐾</span>
                  <div>
                    <div className="text-sm text-foreground/60">{t("property.pets")}</div>
                    <div className="font-semibold text-foreground">
                      {property.petsAllowed > 0 ? `${t("property.allowed")} ${property.petsAllowed} ${t("property.petsCount")}` : t("property.notAllowed")}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Maps Embed */}
            {property.googleMapsUrl && (
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">📍 {t("property.location")}</h2>
                
                {/* Embedded Map */}
                <div className="w-full h-80 md:h-[400px] rounded-2xl overflow-hidden shadow-sm border border-gray-100 mb-4 bg-gray-50 relative">
                  <iframe
                    title={`${property.title} - Location Map`}
                    src={property.googleMapsUrl.includes('<iframe') 
                          ? undefined 
                          : `https://maps.google.com/maps?q=${encodeURIComponent(property.location)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                    className="absolute inset-0 w-full h-full border-0"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
                
                {/* Fallback Link */}
                <a
                  href={property.googleMapsUrl.includes('<iframe') ? '#' : property.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-sm"
                >
                  <MapPin size={18} />
                  {t("property.viewInGoogleMaps")}
                </a>
              </div>
            )}

            {/* YouTube Video Embed */}
            {property.youtubeUrl && (
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">▶️ {t("property.videoTour") || "Video Tour"}</h2>
                <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-sm border border-gray-100 mb-4 bg-gray-50 relative">
                  {/* Extract Video ID if standard watch?v= format or youtu.be/ format */}
                  <iframe 
                    title={`${property.title} - YouTube Video Tour`}
                    className="absolute inset-0 w-full h-full border-0"
                    src={(() => {
                      const url = property.youtubeUrl;
                      let videoId = "";
                      if (url.includes("v=")) {
                        videoId = url.split("v=")[1].substring(0, 11);
                      } else if (url.includes("youtu.be/")) {
                        videoId = url.split("youtu.be/")[1].substring(0, 11);
                      } else if (url.includes("embed/")) {
                        videoId = url.split("embed/")[1].substring(0, 11);
                      }
                      return videoId ? `https://www.youtube.com/embed/${videoId}?rel=0` : url;
                    })()}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            )}

            {/* Features */}
            {features.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-6">{t("property.features")}</h2>
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
                <div className="text-sm text-foreground/60 uppercase tracking-wider font-semibold mb-2">{t("property.askingPrice")}</div>
                <div className="text-4xl font-bold text-primary-600">{formattedPrice}</div>
              </div>
              
              <h3 className="text-xl font-bold text-foreground mb-6">{t("property.interested")}</h3>
              <p className="text-sm text-foreground/70 mb-6">
                {t("property.contactAgent")}
              </p>
              
              <InquiryForm propertyId={property.id} propertyTitle={property.title} />
            </div>
          </div>
        </div>
        
        {/* Similar Properties Section */}
        <SimilarProperties 
          currentPropertyId={property.id}
          location={property.location}
          price={property.price}
          type={property.type}
        />
      </div>
    </div>
  );
}
