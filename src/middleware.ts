import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const STATIC_PATHS = [
  "/api/auth",
  "/_next",
  "/fonts",
  "/favicon.ico",
  "/terms",
  "/privacy",
  "/refund",
  "/contact",
  "/pricing",
];

const DEV_ONLY_PATHS = ["/dev", "/api/dev"];

export default auth(async (req) => {
  const { pathname } = req.nextUrl;

  // Dev 전용 경로는 프로덕션에서 차단
  if (DEV_ONLY_PATHS.some((p) => pathname.startsWith(p))) {
    if (process.env.NODE_ENV === "production") {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
  }

  // Static/API paths — always pass through
  if (STATIC_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const isAuthenticated = !!req.auth;
  const userId = req.auth?.user?.userId;

  // --- 비로그인 사용자 ---
  if (!isAuthenticated) {
    // /login, /landing 허용, 나머지는 /landing으로
    if (pathname === "/login" || pathname === "/landing") return NextResponse.next();
    const landingUrl = new URL("/landing", req.url);
    landingUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(landingUrl);
  }

  // /login, /landing은 항상 허용 (무한 리다이렉트 방지)
  if (pathname === "/login" || pathname === "/landing") return NextResponse.next();

  // --- 로그인된 사용자: DB에 user가 존재하는지 확인 ---
  const supabase = createServerSupabaseClient();
  const { data: userExists } = await supabase
    .from("users")
    .select("id")
    .eq("id", userId)
    .single();

  // JWT의 userId가 DB에 없음 → 세션 무효, 로그인으로
  if (!userExists) {
    const loginUrl = new URL("/login", req.url);
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete("next-auth.session-token");
    response.cookies.delete("__Secure-next-auth.session-token");
    return response;
  }

  // characters 존재 여부 체크
  const { data: hasCharacter } = await supabase
    .from("characters")
    .select("id")
    .eq("user_id", userId)
    .limit(1)
    .single();

  // 캐릭터 없음 → /onboarding만 허용
  if (!hasCharacter) {
    if (pathname === "/onboarding") return NextResponse.next();
    return NextResponse.redirect(new URL("/onboarding", req.url));
  }

  // 캐릭터 있음 → /onboarding, /login, /landing 접근 시 허브(/)로
  if (pathname === "/onboarding" || pathname === "/login" || pathname === "/landing") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|fonts|characters).*)"],
};
