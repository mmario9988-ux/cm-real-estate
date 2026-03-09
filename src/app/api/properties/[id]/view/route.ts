import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    
    // Increment the viewCount by 1
    const property = await prisma.property.update({
      where: { id: resolvedParams.id },
      data: {
        viewCount: {
          increment: 1,
        },
      },
    });

    return NextResponse.json({ success: true, viewCount: property.viewCount });
  } catch (error) {
    console.error("Failed to increment view count:", error);
    // Return successfully anyway so we don't break the frontend if counting fails
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
