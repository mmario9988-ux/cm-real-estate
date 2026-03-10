import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { email, name } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "กรุณากรอกอีเมลที่ถูกต้อง" },
        { status: 400 }
      );
    }

    // Check if already subscribed
    const existing = await prisma.subscriber.findUnique({
      where: { email },
    });

    if (existing) {
      if (existing.active) {
        return NextResponse.json(
          { message: "อีเมลนี้สมัครรับข่าวสารอยู่แล้ว ขอบคุณครับ!" },
          { status: 200 }
        );
      } else {
        // Reactivate if previously unsubscribed
        await prisma.subscriber.update({
          where: { email },
          data: { active: true },
        });
        return NextResponse.json(
          { message: "ยินดีต้อนรับกลับมา! เราได้เปิดการรับข่าวสารให้คุณอีกครั้งแล้ว" },
          { status: 200 }
        );
      }
    }

    // Create new subscriber
    await prisma.subscriber.create({
      data: {
        email,
        name: name || null,
      },
    });

    return NextResponse.json(
      { message: "สมัครรับข่าวสารเรียบร้อยแล้ว ขอบคุณครับ!" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Subscription error:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาด กรุณาลองใหม่ภายหลัง" },
      { status: 500 }
    );
  }
}
