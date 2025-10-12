import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const API_URL = "https://back-system.cecagem.com/api/v1";

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

  if (!cookieHeader) {
    return redirectToLogin(request, pathname);
  }

  let isAuthenticated = false;

  try {
    const authRes = await fetch(`${API_URL}/auth/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
      credentials: "include",
      cache: "no-store",
    });

    if (authRes.ok) {
      isAuthenticated = true;
    } else if (authRes.status === 401) {
      const refreshRes = await fetch(`${API_URL}/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieHeader,
        },
        credentials: "include",
      });

      if (refreshRes.ok) {
        const setCookie = refreshRes.headers.get("set-cookie");
        if (setCookie) {
          const retryRes = await fetch(`${API_URL}/auth/me`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Cookie: setCookie
                .split(",")
                .map((c) => c.split(";")[0])
                .join("; "),
            },
            credentials: "include",
          });

          if (retryRes.ok) {
            const response = NextResponse.next();
            const cookies = setCookie.split(",");
            cookies.forEach((cookie, i) => {
              if (i === 0) response.headers.set("Set-Cookie", cookie.trim());
              else response.headers.append("Set-Cookie", cookie.trim());
            });
            return response;
          }
        }
      }
    }
  } catch (error) {
    console.error("Middleware error:", error);
  }

  if (isAuthenticated) {
    if (pathname === "/" || pathname === "/login") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

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
