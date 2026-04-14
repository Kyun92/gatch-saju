import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const STATIC_PATHS = ["/api/auth", "/dev", "/_next", "/fonts", "/characters", "/favicon.ico"];

export default auth(async (req) => {
  const { pathname } = req.nextUrl;

  // Static/API paths — always pass through
  if (STATIC_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const isAuthenticated = !!req.auth;
  const userId = req.auth?.user?.userId;

  // --- 비로그인 사용자 ---
  if (!isAuthenticated) {
    // /login만 허용, 나머지는 전부 /login으로
    if (pathname === "/login") return NextResponse.next();
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // --- 로그인된 사용자: profileComplete 체크 (DB 직접 조회) ---
  const supabase = createServerSupabaseClient();
  const { data: user } = await supabase
    .from("users")
    .select("profile_complete")
    .eq("id", userId)
    .single();

  const profileComplete = user?.profile_complete ?? false;

  // 프로필 미완성 → /onboarding만 허용
  if (!profileComplete) {
    if (pathname === "/onboarding") return NextResponse.next();
    return NextResponse.redirect(new URL("/onboarding", req.url));
  }

  // 프로필 완성 → /onboarding, /login 접근 시 허브(/)로
  if (pathname === "/onboarding" || pathname === "/login") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|fonts|characters).*)"],
};
