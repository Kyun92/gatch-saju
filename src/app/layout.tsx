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
      className={`${notoSansKR.variable} h-full`}
      style={{ colorScheme: "light" }}
    >
      <body
        className="min-h-full flex flex-col antialiased"
        style={{
          backgroundColor: "#f5f0e8",
          color: "#2c2418",
          fontFamily: "var(--font-body)",
        }}
      >
        <SessionProvider>
          <div className="flex-1 flex flex-col">{children}</div>
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}
