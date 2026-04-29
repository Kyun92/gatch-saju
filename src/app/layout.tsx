import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import SessionProvider from "@/components/providers/SessionProvider";
import Footer from "@/components/layout/Footer";
import "./globals.css";

const notoSansKR = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

// NeoDungGeunMo pixel font is loaded via @font-face in globals.css.
// Place the font file at /public/fonts/NeoDungGeunMo.woff2 to activate it.
// The CSS variable --font-pixel is declared in globals.css with a monospace fallback.

export const metadata: Metadata = {
  title: "갓챠사주 | 운명의 RPG 사주풀이",
  description:
    "사주 × 자미두수 × 서양점성술 3체계 교차분석. 나만의 RPG 캐릭터를 만들고 운명을 탐험하세요. 990원부터.",
  keywords: [
    "사주",
    "사주풀이",
    "운세",
    "RPG 사주",
    "오행",
    "명리학",
    "갓챠사주",
    "사주 캐릭터",
    "자미두수",
    "서양점성술",
    "무료 사주",
  ],
  authors: [{ name: "갓챠사주" }],
  openGraph: {
    title: "갓챠사주 | 운명의 RPG 사주풀이",
    description: "사주 × 자미두수 × 서양점성술 3체계 교차분석. 990원부터.",
    locale: "ko_KR",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${notoSansKR.variable} h-full color-scheme-light`}
    >
      <body className="min-h-screen flex flex-col antialiased app-body">
        <SessionProvider>
          {/* flex-1로 짧은 페이지에서도 Footer가 viewport 바닥에 붙도록.
              스크롤은 window가 받는다 (SubPageHeader sticky top-0 → window 기준). */}
          <div className="flex-1 flex flex-col">{children}</div>
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}
