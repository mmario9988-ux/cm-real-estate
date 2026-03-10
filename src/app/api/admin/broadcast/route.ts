import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { subject, message, propertyUrl, imageUrl } = await request.json();

    if (!subject || !message) {
      return NextResponse.json(
        { error: "Subject and message are required" },
        { status: 400 }
      );
    }

    // Fetch all active subscribers
    const subscribers = await prisma.subscriber.findMany({
      where: { active: true },
    });

    if (subscribers.length === 0) {
      return NextResponse.json(
        { message: "No active subscribers found." },
        { status: 200 }
      );
    }

    const emailPromises = subscribers.map(sub => {
      return resend.emails.send({
        from: 'Chiang Mai Estates <onboarding@resend.dev>',
        to: sub.email,
        subject: subject,
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <style>
                body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; margin: 0; padding: 0; background-color: #f9f9f9; }
                .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.05); }
                .header { background-color: #950000; padding: 40px 20px; text-align: center; }
                .logo { color: #ffffff; font-size: 28px; font-weight: 800; letter-spacing: -0.5px; margin: 0; }
                .featured-image { width: 100%; height: auto; display: block; border-bottom: 5px solid #950000; }
                .content { padding: 40px; }
                .subject { font-size: 24px; font-weight: 800; color: #1a1a1a; margin-bottom: 24px; line-height: 1.2; }
                .message { font-size: 16px; line-height: 1.8; color: #444444; margin-bottom: 32px; white-space: pre-wrap; }
                .button-container { text-align: center; margin-bottom: 40px; }
                .button { background-color: #950000; color: #ffffff !important; padding: 18px 36px; border-radius: 16px; text-decoration: none; font-weight: 800; font-size: 16px; display: inline-block; transition: all 0.3s; box-shadow: 0 10px 20px rgba(149, 0, 0, 0.2); }
                .footer { padding: 40px; background-color: #f4f4f4; text-align: center; border-top: 1px solid #eeeeee; }
                .footer-text { font-size: 12px; color: #999999; margin: 0 0 10px 0; }
                .brand-name { font-weight: 800; color: #666666; margin-bottom: 20px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1 class="logo">Chiang Mai Estates</h1>
                </div>
                
                ${imageUrl ? `<img src="${imageUrl}" class="featured-image" alt="Featured News">` : ''}
                
                <div class="content">
                  <h2 class="subject">${subject}</h2>
                  <div class="message">${message.replace(/\n/g, '<br/>')}</div>
                  
                  <div class="button-container">
                    <a href="https://cm-real-estate.vercel.app" class="button">Visit Our Website</a>
                  </div>
                </div>
                
                <div class="footer">
                  <p class="brand-name">CHIANG MAI ESTATES</p>
                  <p class="footer-text">Don't want to receive these emails? <a href="#" style="color: #950000;">Unsubscribe</a></p>
                  <p class="footer-text">&copy; 2026 Chiang Mai Estates. All rights reserved.</p>
                </div>
              </div>
            </body>
          </html>
        `
      });
    });

    await Promise.all(emailPromises);

    return NextResponse.json(
      { message: `ส่งข่าวสารไปยังสมาชิก ${subscribers.length} รายเรียบร้อยแล้ว!` },
      { status: 200 }
    );
  } catch (error) {
    console.error("Broadcast error:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการส่งข่าวสาร" },
      { status: 500 }
    );
  }
}
