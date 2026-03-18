import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const lat = parseFloat(searchParams.get('lat') || '');
    const lng = parseFloat(searchParams.get('lng') || '');
    const radius = parseFloat(searchParams.get('radius') || '10'); // radius in km

    if (isNaN(lat) || isNaN(lng)) {
      return NextResponse.json({ error: "Invalid coordinates" }, { status: 400 });
    }

    // Basic bounding box calculation for efficiency
    // 1 degree of latitude is approximately 111km
    const latDelta = radius / 111;
    const lngDelta = radius / (111 * Math.cos(lat * (Math.PI / 180)));

    const properties = await prisma.property.findMany({
      where: {
        lat: {
          gte: lat - latDelta,
          lte: lat + latDelta,
        },
        lng: {
          gte: lng - lngDelta,
          lte: lng + lngDelta,
        },
        status: "Available"
      },
      take: 20,
    });

    // Optional: Sort by actual distance here if needed
    
    return NextResponse.json(properties);
  } catch (error: any) {
    console.error("Failed to fetch nearby properties:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch nearby properties" }, { status: 500 });
  }
}
