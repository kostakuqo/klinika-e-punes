import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "./i18n/routing";

const intl = createMiddleware(routing);

export function proxy(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  // Old WordPress links like /?page_id=12 or /?p=34 → clean URL
  if (searchParams.has("page_id") || searchParams.has("p")) {
    const url = request.nextUrl.clone();
    url.search = "";
    return NextResponse.redirect(url, 301);
  }

  return intl(request);
}

export const config = {
  // Skip API, admin, Next internals and files with an extension
  matcher: ["/((?!api|admin|_next|_vercel|.*\\..*).*)"],
};
