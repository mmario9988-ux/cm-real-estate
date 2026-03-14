"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function TermsPage() {
  const { t, language } = useLanguage();

  return (
    <div className="bg-background min-h-screen py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-8 text-center">
          {t("footer.terms")}
        </h1>
        
        <div className="bg-white dark:bg-primary-900/10 p-8 md:p-12 rounded-3xl shadow-xl shadow-primary-900/5 border border-primary-100 dark:border-primary-800/50">
          <div className="prose prose-lg dark:prose-invert max-w-none text-foreground/80">
            {language === "th" ? (
              <div className="space-y-6">
                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">1. ข้อกำหนดการใช้งาน</h2>
                  <p>การเข้าถึงและใช้งานเว็บไซต์นี้แสดงว่าคุณยอมรับข้อกำหนดและเงื่อนไขเหล่านี้ในกรณีที่คุณไม่ยอมรับข้อควรหยุดใช้งานเว็บไซต์ทันที</p>
                </section>
                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">2. สิทธิในทรัพย์สินทางปัญญา</h2>
                  <p>เนื้อหาทั้งหมดบนเว็บไซต์นี้ รวมถึงข้อความ กราฟิก โลโก้ และรูปภาพ เป็นทรัพย์สินของ Chiang Mai Estates หรือผู้ให้สัญญา และได้รับการคุ้มครองโดยกฎหมายทรัพย์สินทางปัญญา</p>
                </section>
                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">3. ข้อควรระวัง</h2>
                  <p>ข้อมูลเกี่ยวกับอสังหาริมทรัพย์บนเว็บไซต์นี้มีวัตถุประสงค์เพื่อให้ข้อมูลเบื้องต้นเท่านั้น เราพยายามให้ข้อมูลที่ถูกต้องที่สุด แต่อาจมีการเปลี่ยนแปลงได้โดยไม่ต้องแจ้งให้ทราบล่วงหน้า</p>
                </section>
              </div>
            ) : (
              <div className="space-y-6">
                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">1. Acceptance of Terms</h2>
                  <p>By accessing and using this website, you accept and agree to be bound by these Terms and Conditions. If you do not agree, please refrain from using the site.</p>
                </section>
                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">2. Intellectual Property</h2>
                  <p>All content on this website, including text, graphics, logos, and images, is the property of Chiang Mai Estates or its licensors and is protected by intellectual property laws.</p>
                </section>
                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">3. Disclaimer</h2>
                  <p>Property information provided on this website is for general informational purposes only. While we strive for accuracy, details are subject to change without notice.</p>
                </section>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
