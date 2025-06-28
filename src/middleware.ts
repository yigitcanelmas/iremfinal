import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Gelen isteğin IP adresini al
  const ip = request.headers.get('x-real-ip') || 
             request.headers.get('x-forwarded-for')?.split(',')[0] || 
             request.headers.get('cf-connecting-ip') ||
             '127.0.0.1';

  // Admin paneli koruması
  if (request.nextUrl.pathname.startsWith('/iw-management')) {
    // Client-side'da authentication kontrolü yapılacak
    // Bu middleware sadece IP tracking için kullanılıyor
  }

  // Yanıtı oluştur ve IP adresini header'a ekle
  const response = NextResponse.next();
  response.headers.set('x-client-ip', ip);

  return response;
}

// Middleware'in çalışacağı path'leri belirt
export const config = {
  matcher: ['/api/:path*', '/iw-management/:path*'],
};
