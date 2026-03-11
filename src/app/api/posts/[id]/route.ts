import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const post = await prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error("Failed to fetch post:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, excerpt, content, image, published, slug } = body;

    const post = await prisma.post.update({
      where: { id },
      data: {
        title,
        excerpt,
        content,
        image,
        published,
        slug,
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error("Failed to update post:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.post.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Failed to delete post:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
