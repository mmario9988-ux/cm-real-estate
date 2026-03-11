import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
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
    const url = request.nextUrl.clone();
    url.pathname = restPath;
    
    const response = NextResponse.rewrite(url);
    
    // Set the language in a custom header so server components can access it
    response.headers.set('x-language', lang);
    return response;
  }

  return NextResponse.next();
}
