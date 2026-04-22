import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "갓챠사주 | 운명의 RPG 사주풀이",
    short_name: "갓챠사주",
    description:
      "사주 × 자미두수 × 서양점성술 3체계 교차분석. 나만의 RPG 캐릭터를 만들고 운명을 탐험하세요.",
    start_url: "/",
    display: "standalone",
    background_color: "#f5f0e8",
    theme_color: "#9a7040",
    lang: "ko-KR",
    icons: [
      { src: "/icons/favicon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/favicon-512.png", sizes: "512x512", type: "image/png" },
      {
        src: "/icons/favicon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
