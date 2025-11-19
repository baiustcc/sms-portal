import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/session-token";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuthRoute = pathname.startsWith("/signin");
  const isProtected = pathname.startsWith("/dashboard") || pathname.startsWith("/sms");
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = await verifySessionToken(token);

  if (!session && isProtected) {
    const url = new URL("/signin", request.url);
    return NextResponse.redirect(url);
  }

  if (session && isAuthRoute) {
    const url = new URL("/dashboard", request.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/sms/:path*", "/signin"],
};

