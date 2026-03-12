import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';
import { isAuthorizedAdmin } from '@/lib/auth-utils';

export async function GET(
  req: Request, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const property = await prisma.property.findUnique({ 
      where: { id: resolvedParams.id } 
    });
    
    if (!property) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    
    return NextResponse.json(property);
  } catch(error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(
  req: Request, 
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const resolvedParams = await params;
    const body = await req.json();
    
    const updateData = {
      ...body,
      // Ensure numeric fields remain numbers
      ...(body.price !== undefined && { price: Number(body.price) }),
      ...(body.bedrooms !== undefined && { bedrooms: Number(body.bedrooms) }),
      ...(body.bathrooms !== undefined && { bathrooms: Number(body.bathrooms) }),
      ...(body.area !== undefined && { area: body.area ? Number(body.area) : null }),
      ...(body.airconCount !== undefined && { airconCount: Number(body.airconCount) }),
      ...(body.waterHeaterCount !== undefined && { waterHeaterCount: Number(body.waterHeaterCount) }),
      ...(body.parkingCount !== undefined && { parkingCount: Number(body.parkingCount) }),
      ...(body.petsAllowed !== undefined && { petsAllowed: Number(body.petsAllowed) }),
    };

    const property = await prisma.property.update({ 
      where: { id: resolvedParams.id }, 
      data: updateData 
    });
    
    return NextResponse.json(property);
  } catch(error: any) {
    return NextResponse.json({ error: error.message || "Failed to update property" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request, 
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const resolvedParams = await params;
    await prisma.property.delete({ 
      where: { id: resolvedParams.id } 
    });
    return NextResponse.json({ success: true });
  } catch(error: any) {
    return NextResponse.json({ error: error.message || "Failed to delete property" }, { status: 500 });
  }
}
