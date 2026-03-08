import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';

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
