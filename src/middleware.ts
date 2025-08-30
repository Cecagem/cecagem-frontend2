import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  console.log("Middleware triggered for:");

  const systemRoutes = [
    "/.well-known",
    "/_next",
    "/favicon.ico",
    "/robots.txt",
    "/sitemap.xml",
    "/sw.js",
    "/workbox-",
    "/manifest.json",
  ];
  if (systemRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  const publicRoutes = ["/image", "/api"];
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  if (pathname === "/login") {
    return NextResponse.next();
  }

  const cookieHeader = request.headers.get("cookie");

  let isAuthenticated = false;

  if (cookieHeader) {
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      };

      const authResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/me`,
        {
          method: "GET",
          headers,
        }
      );

      if (authResponse.ok) {
        isAuthenticated = true;
      } else if (authResponse.status === 401) {
        const refreshResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
          {
            method: "POST",
            headers,
          }
        );

        if (refreshResponse.ok) {
          const setCookieHeaders = refreshResponse.headers.get("set-cookie");

          if (setCookieHeaders) {
            const cookies = setCookieHeaders
              .split(",")
              .map((cookie) => cookie.split(";")[0])
              .join("; ");

            const newHeaders = {
              ...headers,
              Cookie: cookies,
            };

            const retryAuthResponse = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/auth/me`,
              {
                method: "GET",
                headers: newHeaders,
              }
            );

            if (retryAuthResponse.ok) {
              isAuthenticated = true;

              let response: NextResponse;

              if (pathname === "/login" || pathname === "/") {
                response = NextResponse.redirect(
                  new URL("/dashboard", request.url)
                );
              } else {
                response = NextResponse.next();
              }

              const cookieArray = setCookieHeaders.split(",");
              cookieArray.forEach((cookie, index) => {
                if (index === 0) {
                  response.headers.set("Set-Cookie", cookie.trim());
                } else {
                  response.headers.append("Set-Cookie", cookie.trim());
                }
              });

              return response;
            }
          }
        }

        isAuthenticated = false;
      } else {
        await authResponse.text();
        isAuthenticated = false;
      }
    } catch {
      isAuthenticated = false;
    }
  }

  console.log("User is authenticated:", isAuthenticated);

  if (isAuthenticated) {
    if (pathname === "/" || pathname === "/login") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
  } else {
    const loginUrl = new URL("/login", request.url);
    if (pathname !== "/") {
      loginUrl.searchParams.set("redirect", pathname);
    }
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: [
    /*
     *  Solo interceptar rutas de la aplicación:
     * - Rutas de estudiante: /dashboard, /profile, /calendario, etc.
     * - Rutas de auth: /login
     * - Excluir: archivos estáticos, API routes, recursos del sistema
     */
    "/((?!_next/static|_next/image|favicon.ico|public|api|image|.well-known|robots.txt|sitemap.xml|sw.js|workbox|manifest.json).*)",
  ],
};
