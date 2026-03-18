import { auth } from "@/auth";
import { isAuthorizedAdmin } from "@/lib/auth-utils";
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const proxy = auth((req) => {
  const { pathname } = req.nextUrl;
  
  // --- Security Logic ---
  const isAdminPath = pathname.startsWith("/admin");
  const isApiAdminPath = pathname.startsWith("/api/admin");

  // Allow OPTIONS requests (CORS preflight) to skip security checks
  if ((isAdminPath || isApiAdminPath) && req.method !== 'OPTIONS') {
    const adminEmail = req.headers.get('x-admin-email');
    const isMobileAuthorized = adminEmail && isAuthorizedAdmin({ user: { email: adminEmail } });

    if (!req.auth && !isMobileAuthorized) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    
    if (req.auth && !isAuthorizedAdmin(req.auth)) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }
  // ----------------------

  // Skip API routes, Next internal routes, and static files
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Handle URL paths like /en/properties or /th/properties
  const matches = pathname.match(/^\/(en|th)(\/.*)?$/);
  
  if (matches) {
    const lang = matches[1];
    const restPath = matches[2] || '/';
    
    // Rewrite the URL to remove the language prefix (e.g. /en/properties -> /properties)
    const url = req.nextUrl.clone();
    url.pathname = restPath;
    
    const response = NextResponse.rewrite(url);
    
    // Set the language in a custom header so server components can access it
    response.headers.set('x-language', lang);
    return response;
  }

  return NextResponse.next();
});

// For compatibility with scripts/tools that might expect default export
export default proxy;
