import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';
import { isAuthorizedAdmin } from '@/lib/auth-utils';
import { broadcastNewProperty } from '@/lib/notifications';
import { corsResponse, corsOptions } from '@/lib/cors';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q');
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    const location = searchParams.get('location');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const bedrooms = searchParams.get('bedrooms');

    const where: any = {};

    if (status) where.status = status;
    if (type) where.type = type;
    if (location) {
      where.location = { contains: location, mode: 'insensitive' };
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = Number(minPrice);
      if (maxPrice) where.price.lte = Number(maxPrice);
    }

    if (bedrooms) {
      where.bedrooms = { gte: Number(bedrooms) };
    }

    if (q) {
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
        { location: { contains: q, mode: 'insensitive' } },
      ];
    }

    const properties = await prisma.property.findMany({ 
      where,
      orderBy: { createdAt: 'desc' } 
    });
    return corsResponse(properties);
  } catch(error: any) {
    return corsResponse({ error: error.message || "Failed to fetch properties" }, 500);
  }
}

export async function OPTIONS() {
  return corsOptions();
}

export async function POST(req: Request) {
  const session = await auth();
  const adminEmail = req.headers.get('x-admin-email');
  
  const isAuthorized = isAuthorizedAdmin(session) || 
                       (adminEmail && isAuthorizedAdmin({ user: { email: adminEmail.trim() } }));

  if (!isAuthorized) {
    return corsResponse({ error: "Unauthorized" }, 401);
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
        features: body.features || "[]",
        googleMapsUrl: body.googleMapsUrl || null,
        youtubeUrl: body.youtubeUrl || null,
        furniture: body.furniture || "none",
        appliances: body.appliances || "none",
        airconCount: Number(body.airconCount) || 0,
        waterHeaterCount: Number(body.waterHeaterCount) || 0,
        parkingCount: Number(body.parkingCount) || 0,
        petsAllowed: Number(body.petsAllowed) || 0,
        lat: body.lat ? Number(body.lat) : null,
        lng: body.lng ? Number(body.lng) : null,
        isFeatured: Boolean(body.isFeatured),
      } 
    });

    // Trigger Mobile Push Notifications
    await broadcastNewProperty(property);

    return corsResponse(property, 201);
  } catch(error: any) {
    return corsResponse({ error: error.message || "Failed to create property" }, 500);
  }
}
