import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';

export async function POST(req: Request) {
  try {
    const session = await auth();
    const body = await req.json();
    const { token, platform } = body;

    if (!token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 });
    }

    const pushToken = await prisma.pushToken.upsert({
      where: { token },
      update: {
        userId: session?.user?.id || null,
        platform: platform || null,
      },
      create: {
        token,
        userId: session?.user?.id || null,
        platform: platform || null,
      },
    });

    return NextResponse.json(pushToken, { status: 201 });
  } catch (error: any) {
    console.error("Failed to register push token:", error);
    return NextResponse.json({ error: error.message || "Failed to register push token" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 });
    }

    await prisma.pushToken.delete({
      where: { token },
    });

    return NextResponse.json({ message: "Token deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to delete push token" }, { status: 500 });
  }
}
