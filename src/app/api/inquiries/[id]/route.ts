import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { status } = await req.json();
    const resolvedParams = await params;
    
    if (!status) {
      return NextResponse.json({ error: "Missing status" }, { status: 400 });
    }

    const inquiry = await prisma.inquiry.update({
      where: { id: resolvedParams.id },
      data: { status }
    });

    return NextResponse.json(inquiry);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update inquiry" }, { status: 500 });
  }
}
