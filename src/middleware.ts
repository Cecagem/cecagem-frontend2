import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  console.log(`Middleware: ${pathname}`);
  console.log(`Cookies: ${request.headers.get("cookie")}`);

  const ignoredRoutes = [
    "/.well-known",
    "/_next",
    "/favicon.ico",
    "/robots.txt",
    "/sitemap.xml",
    "/sw.js",
    "/workbox-",
    "/manifest.json",
    "/api",
    "/image",
    "/public",
  ];

  if (ignoredRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  if (pathname === "/login") {
    return NextResponse.next();
  }

  const cookieHeader = request.headers.get("cookie");

  const hasAccessToken = cookieHeader?.includes("access_token=");
  const hasRefreshToken = cookieHeader?.includes("refresh_token=");

  if (hasAccessToken || hasRefreshToken) {
    if (pathname === "/" || pathname === "/login") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  console.log("Usuario sin token, redirigiendo al login...");
  return redirectToLogin(request, pathname);
}

function redirectToLogin(request: NextRequest, pathname: string) {
  const loginUrl = new URL("/login", request.url);
  if (pathname && pathname !== "/") {
    loginUrl.searchParams.set("redirect", pathname);
  }
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|sw.js|workbox|manifest.json|api|image|public|.well-known).*)",
  ],
};
