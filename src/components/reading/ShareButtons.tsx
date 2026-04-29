"use client";

import { useState } from "react";

type Props = {
  readingId: string;
  characterName: string;
};

export default function ShareButtons({ readingId, characterName }: Props) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url =
      typeof window !== "undefined"
        ? `${window.location.origin}/reading/${readingId}`
        : "";
    const title = `${characterName}님의 운명 풀이`;

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // 사용자 취소 무시
      }
      return;
    }

    if (typeof navigator !== "undefined" && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2200);
      } catch {
        // 권한 거부 등
      }
    }
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      aria-label="결과 공유하기"
      className="share-button"
    >
      <span className="share-button-icon" aria-hidden="true">
        ↗
      </span>
      <span>{copied ? "링크가 복사됐어요" : "결과 공유하기"}</span>
    </button>
  );
}
