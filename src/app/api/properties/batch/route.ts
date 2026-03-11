import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { ids } = await request.json();

    if (!ids || !Array.isArray(ids)) {
      return NextResponse.json({ error: "Invalid IDs" }, { status: 400 });
    }

    const properties = await prisma.property.findMany({
      where: {
        id: { in: ids },
      },
    });

    // Reorder properties to match the order of IDs (most recently added first)
    const idMap = new Map(properties.map(p => [p.id, p]));
    const sortedProperties = ids
      .map(id => idMap.get(id))
      .filter(p => p !== undefined)
      .reverse(); // Reverse so most recently added is first

    return NextResponse.json(sortedProperties);
  } catch (error) {
    console.error("Batch fetch error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
