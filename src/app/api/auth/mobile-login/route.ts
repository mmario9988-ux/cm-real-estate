import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { isAuthorizedAdmin } from '@/lib/auth-utils';
import { corsResponse, corsOptions } from '@/lib/cors';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return corsResponse({ error: "Email and password are required" }, 400);
    }

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user || !user.password) {
      return corsResponse({ error: "Invalid credentials" }, 401);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return corsResponse({ error: "Invalid credentials" }, 401);
    }

    // Check if user is an admin/agent
    const isAdmin = isAuthorizedAdmin({ user: { email: user.email } });
    
    if (!isAdmin) {
      return corsResponse({ error: "Access denied. Only agents/admins can login here." }, 403);
    }

    // Return user info. In a real app, we'd sign a JWT here.
    // For this prototype, we'll return user data and the mobile app will store it.
    // Since we're using CORS and the mobile app shares the same origin logic,
    // we'll keep it simple.
    return corsResponse({
      id: user.id,
      email: user.email,
      name: user.name,
      image: user.image,
      role: 'admin'
    });
  } catch (error: any) {
    return corsResponse({ error: error.message || "Login failed" }, 500);
  }
}

export async function OPTIONS() {
  return corsOptions();
}
