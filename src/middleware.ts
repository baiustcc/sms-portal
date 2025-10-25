import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = new URL(request.url);

  const isAuthRoute = pathname.startsWith("/signin");
  const isSetupRoute = pathname.startsWith("/setup");
  const isProtected = pathname.startsWith("/dashboard") || pathname.startsWith("/admin") || pathname.startsWith("/sms");

  if (isSetupRoute) return NextResponse.next();

  const hasSession = Boolean(
    request.cookies.get("next-auth.session-token") || request.cookies.get("__Secure-next-auth.session-token")
  );

  if (!hasSession && isProtected) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  if (hasSession && isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/sms/:path*", "/signin"],
};
