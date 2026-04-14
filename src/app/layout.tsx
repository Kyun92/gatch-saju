import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import SessionProvider from "@/components/providers/SessionProvider";
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
  title: "천명 | 운명의 RPG 사주풀이",
  description:
    "사주명리학을 RPG 스타일로 풀어드리는 천명입니다. 생년월일로 나만의 캐릭터를 만들고, 오행 운세·직업운·연애운·건강운을 확인하세요.",
  keywords: [
    "사주",
    "사주풀이",
    "운세",
    "RPG 사주",
    "오행",
    "명리학",
    "천명",
    "사주 캐릭터",
    "일간",
    "2024 운세",
    "무료 사주",
  ],
  authors: [{ name: "천명" }],
  openGraph: {
    title: "천명 | 운명의 RPG 사주풀이",
    description: "나만의 RPG 사주 캐릭터를 만들어 운명을 탐험하세요.",
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
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
