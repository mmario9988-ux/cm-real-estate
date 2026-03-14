"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function PrivacyPage() {
  const { t, language } = useLanguage();

  return (
    <div className="bg-background min-h-screen py-20 uppercase-titles">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-8 text-center">
          {t("footer.privacy")}
        </h1>
        
        <div className="bg-white dark:bg-primary-900/10 p-8 md:p-12 rounded-3xl shadow-xl shadow-primary-900/5 border border-primary-100 dark:border-primary-800/50">
          <div className="prose prose-lg dark:prose-invert max-w-none text-foreground/80">
            {language === "th" ? (
              <div className="space-y-6">
                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">1. การเก็บรวบรวมข้อมูลส่วนบุคคล</h2>
                  <p>เรามีการเก็บรวบรวมข้อมูลส่วนบุคคลที่คุณให้ไว้กับเราโดยสมัครใจ เมื่อคุณสมัครรับจดหมายข่าว หรือส่งคำสอบถามข้อมูลเกี่ยวกับอสังหาริมทรัพย์ ข้อมูลเหล่านี้รวมถึง ชื่อ อีเมล และเบอร์โทรศัพท์</p>
                </section>
                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">2. การใช้ข้อมูล</h2>
                  <p>เราใช้ข้อมูลของคุณเพื่อ:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>ตอบกลับคำสอบถามและให้ข้อมูลที่คุณขอ</li>
                    <li>ส่งข่าวสารและข้อเสนอพิเศษกรณีที่คุณได้สมัครรับจดหมายข่าว</li>
                    <li>ปรับปรุงการบริการและความพึงพอใจของผู้ใช้งาน</li>
                  </ul>
                </section>
                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">3. การคุ้มครองข้อมูล</h2>
                  <p>เราใช้มาตรการความปลอดภัยที่เหมาะสมเพื่อป้องกันการเข้าถึง การเปลี่ยนแปลง หรือการเปิดเผยข้อมูลส่วนบุคคลของคุณโดยไม่ได้รับอนุญาต</p>
                </section>
              </div>
            ) : (
              <div className="space-y-6">
                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">1. Collection of Personal Information</h2>
                  <p>We collect personal information that you voluntarily provide to us when you subscribe to our newsletter or send an inquiry about a property. This information includes your name, email, and phone number.</p>
                </section>
                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">2. Use of Information</h2>
                  <p>We use your information to:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Respond to your inquiries and provide requested information.</li>
                    <li>Send newsletter and special offers if you have subscribed.</li>
                    <li>Improve our services and user experience.</li>
                  </ul>
                </section>
                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">3. Data Protection</h2>
                  <p>We implement appropriate security measures to protect against unauthorized access, alteration, or disclosure of your personal information.</p>
                </section>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
