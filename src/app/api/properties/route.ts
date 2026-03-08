import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';

export async function GET() {
  try {
    const properties = await prisma.property.findMany({ 
      orderBy: { createdAt: 'desc' } 
    });
    return NextResponse.json(properties);
  } catch(error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch properties" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const property = await prisma.property.create({ 
      data: {
        title: body.title,
        description: body.description,
        price: Number(body.price),
        location: body.location,
        bedrooms: Number(body.bedrooms),
        bathrooms: Number(body.bathrooms),
        area: body.area ? Number(body.area) : null,
        type: body.type,
        status: body.status || "Available",
        images: body.images || "[]",
        features: body.features || "[]"
      } 
    });
    return NextResponse.json(property, { status: 201 });
  } catch(error: any) {
    return NextResponse.json({ error: error.message || "Failed to create property" }, { status: 500 });
  }
}
