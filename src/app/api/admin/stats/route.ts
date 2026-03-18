import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';
import { isAuthorizedAdmin } from '@/lib/auth-utils';
import { corsResponse, corsOptions } from '@/lib/cors';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const session = await auth();
    const adminEmail = req.headers.get('x-admin-email');
    
    // For mobile app compatibility, we allow an explicit admin email header
    const isAuthorized = isAuthorizedAdmin(session) || 
                         (adminEmail && isAuthorizedAdmin({ user: { email: adminEmail.trim() } }));

    if (!isAuthorized) {
      return corsResponse({ error: "Unauthorized" }, 401);
    }

    const [
      propertyCount,
      inquiryCount,
      pendingInquiries,
      subscriberCount,
      postCount,
      recentInquiries,
      topProperties
    ] = await Promise.all([
      prisma.property.count(),
      prisma.inquiry.count(),
      prisma.inquiry.count({ where: { status: 'Pending' } }),
      prisma.subscriber.count({ where: { active: true } }),
      prisma.post.count(),
      prisma.inquiry.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.property.findMany({
        take: 5,
        orderBy: { viewCount: 'desc' },
        where: { viewCount: { gt: 0 } }
      })
    ]);

    return corsResponse({
      stats: {
        properties: propertyCount,
        inquiries: inquiryCount,
        pending: pendingInquiries,
        subscribers: subscriberCount,
        posts: postCount,
      },
      recentInquiries,
      topProperties
    });
  } catch (error: any) {
    console.error('STATS_INTERNAL_ERROR:', error);
    return corsResponse({ error: error.message || "Internal Server Error" }, 500);
  }
}

export async function OPTIONS() {
  return corsOptions();
}
