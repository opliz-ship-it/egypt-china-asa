import { NextResponse, type NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/") {
    return NextResponse.redirect(new URL("/ar", request.url));
  }

  if (pathname === "/downloads") {
    return NextResponse.redirect(new URL("/ar/about#downloads", request.url));
  }

  const locale = pathname === "/en" || pathname.startsWith("/en/") ? "en" : "ar";
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-locale", locale);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|assets|favicon.ico).*)"],
};
