import type { NextConfig } from "next";

/**
 * 보안 헤더 — 모든 응답에 적용.
 * - X-Frame-Options: clickjacking 방지 (결제 버튼 위장 차단)
 * - X-Content-Type-Options: MIME sniffing 차단
 * - Referrer-Policy: 외부 사이트로 전체 URL path 누출 방지
 * - Permissions-Policy: 브라우저 기능(카메라/마이크 등) 차단
 * - Content-Security-Policy: XSS 발생 시 외부 스크립트 로드 차단
 *
 * CSP 화이트리스트:
 *   - tosspayments.com: 결제창 / 결제 SDK
 *   - supabase.co: DB 연결 (서버 사이드 호출이지만 안전망)
 */
const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.tosspayments.com https://*.tosspayments.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "img-src 'self' data: blob: https:",
      "font-src 'self' data: https://fonts.gstatic.com",
      "connect-src 'self' https://api.tosspayments.com https://*.tosspayments.com https://*.supabase.co",
      "frame-src https://*.tosspayments.com",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self' https://*.tosspayments.com",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  serverExternalPackages: [
    "circular-natal-horoscope-js",
    "lunar-javascript",
    "iztro",
  ],
  images: {
    formats: ["image/webp", "image/avif"],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
