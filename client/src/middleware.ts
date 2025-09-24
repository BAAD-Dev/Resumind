import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  // console.log(token, "<<< ini token");

  const { pathname } = req.nextUrl;

  if (
    token &&
    (pathname.startsWith("/login") || pathname.startsWith("/register"))
  ) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (
    !token &&
    (pathname.startsWith("/myresume") ||
      pathname.startsWith("/myresume/profile") ||
      pathname.startsWith("/myresume/resume") ||
      pathname.startsWith("/myresume/job-matcher") ||
      pathname.startsWith("/payment"))
  ) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/register", "/myresume/:path*", "/payment"],
};
