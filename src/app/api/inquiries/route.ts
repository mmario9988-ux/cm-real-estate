import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, message, propertyId } = body;
    
    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    
    const inquiry = await prisma.inquiry.create({
      data: { name, email, phone, message, propertyId }
    });

    // Send Auto-Responder Email
    try {
      await resend.emails.send({
        from: 'Chiang Mai Estates <m.mario9988@gmail.com>',
        to: email,
        subject: 'ขอบคุณที่สนใจโครงการจาก Chiang Mai Estates (Inquiry Confirmation)',
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <style>
                body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; margin: 0; padding: 0; background-color: #f6f9fc; }
                .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 15px 35px rgba(50,50,93,.1), 0 5px 15px rgba(0,0,0,.07); }
                .header { background-color: #950000; padding: 40px 20px; text-align: center; }
                .logo { color: #ffffff; font-size: 26px; font-weight: 800; letter-spacing: -0.5px; margin: 0; text-transform: uppercase; }
                .content { padding: 48px; }
                .greeting { font-size: 22px; font-weight: 700; color: #1a1f36; margin-bottom: 24px; }
                .body-text { font-size: 16px; line-height: 1.8; color: #4f566b; margin-bottom: 32px; }
                
                /* Digital Business Card */
                .card { background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 20px; padding: 32px; margin-top: 40px; position: relative; overflow: hidden; }
                .card::before { content: ""; position: absolute; top: 0; left: 0; width: 4px; height: 100%; background-color: #950000; }
                .card-title { font-size: 12px; font-weight: 800; color: #950000; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 16px; display: block; }
                .agent-info { display: flex; align-items: center; gap: 20px; }
                .agent-details h3 { font-size: 18px; font-weight: 800; color: #1a1f36; margin: 0 0 4px 0; }
                .agent-details p { font-size: 14px; color: #697386; margin: 0; }
                .contact-links { margin-top: 24px; border-top: 1px solid #e2e8f0; pt: 20px; }
                .contact-item { display: flex; align-items: center; margin-bottom: 12px; font-size: 14px; color: #4f566b; text-decoration: none; }
                .contact-item span { font-weight: 700; color: #1a1f36; min-width: 80px; }
                
                .footer { padding: 32px; background-color: #f6f9fc; text-align: center; border-top: 1px solid #e6ebf1; }
                .footer-text { font-size: 12px; color: #8898aa; margin: 0; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1 class="logo">Chiang Mai Estates</h1>
                </div>
                
                <div class="content">
                  <div class="greeting">สวัสดีคุณ ${name},</div>
                  <div class="body-text">
                    ขอบคุณที่ให้ความสนใจโครงการกับเรา ทีมงานได้รับข้อความของคุณเรียบร้อยแล้ว และจะรีบดำเนินการตรวจสอบและติดต่อกลับหานะครับ<br><br>
                    ในระหว่างนี้ หากคุณมีคำถามเพิ่มเติมหรือต้องการนัดชมบ้าน สามารถติดต่อเราได้โดยตรงผ่านช่องทางด้านล่างนี้เลยครับ
                  </div>
                  
                  <div class="card">
                    <span class="card-title">Digital Business Card</span>
                    <div class="agent-info">
                      <div class="agent-details">
                        <h3>Chiang Mai Estates Support</h3>
                        <p>Property Consultant Team</p>
                      </div>
                    </div>
                    
                    <div style="margin-top: 24px; border-top: 1px solid #e2e8f0; padding-top: 20px;">
                      <a href="https://line.me" class="contact-item">
                        <span>Line ID:</span> @cmestates
                      </a>
                      <a href="tel:+66812345678" class="contact-item">
                        <span>WhatsApp:</span> +66 81 234 5678
                      </a>
                      <a href="https://cm-real-estate.vercel.app" class="contact-item">
                        <span>Website:</span> cm-real-estate.vercel.app
                      </a>
                    </div>
                  </div>
                </div>
                
                <div class="footer">
                  <p class="footer-text">&copy; 2026 Chiang Mai Estates. All rights reserved.</p>
                </div>
              </div>
            </body>
          </html>
        `
      });
    } catch (emailError) {
      console.error("Auto-responder email failed:", emailError);
    }

    // Send Admin Notification Email
    try {
      await resend.emails.send({
        from: 'Chiang Mai Estates <m.mario9988@gmail.com>',
        to: 'm.mario9988@gmail.com',
        subject: `New Inquiry from ${name}`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #950000;">New Inquiry Received</h2>
            <p><strong>Customer Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone || '-'}</p>
            <p><strong>Message:</strong></p>
            <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; white-space: pre-wrap;">${message}</div>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="font-size: 12px; color: #666;">This is an automated notification from Chiang Mai Estates.</p>
          </div>
        `
      });
    } catch (adminEmailError) {
      console.error("Admin notification email failed:", adminEmailError);
    }
    
    // Send LINE Notification to Admin (Instant Alert)
    try {
      const lineToken = process.env.LINE_NOTIFY_TOKEN;
      if (lineToken) {
        const lineMessage = `\n🔔 New Website Inquiry!\n\n👤 Name: ${name}\n📞 Phone: ${phone || '-'}\n📧 Email: ${email}\n\n💬 Message: ${message}`;
        
        await fetch('https://notify-api.line.me/api/notify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Bearer ${lineToken}`
          },
          body: new URLSearchParams({ message: lineMessage })
        });
      }
    } catch (lineError) {
      console.error("LINE notification failed:", lineError);
    }
    
    return NextResponse.json(inquiry, { status: 201 });
  } catch(error: any) {
    return NextResponse.json({ error: error.message || "Failed to submit inquiry" }, { status: 500 });
  }
}

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  try {
    const inquiries = await prisma.inquiry.findMany({ 
      orderBy: { createdAt: 'desc' } 
    });
    return NextResponse.json(inquiries);
  } catch(error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch inquiries" }, { status: 500 });
  }
}
