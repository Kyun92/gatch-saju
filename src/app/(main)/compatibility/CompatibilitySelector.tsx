"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PixelFrame from "@/components/ui/PixelFrame";
import PixelButton from "@/components/ui/PixelButton";
import type { CharacterOption } from "./page";

interface CompatibilitySelectorProps {
  characters: CharacterOption[];
}

export default function CompatibilitySelector({
  characters,
}: CompatibilitySelectorProps) {
  const router = useRouter();
  const [selected1, setSelected1] = useState<string | null>(null);
  const [selected2, setSelected2] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const unlockedCharacters = characters.filter((c) => c.unlocked);

  const char1 = characters.find((c) => c.id === selected1);
  const char2 = characters.find((c) => c.id === selected2);

  const canSubmit =
    selected1 && selected2 && selected1 !== selected2 && !loading;

  async function handleGenerate() {
    if (!selected1 || !selected2) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/reading/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          characterId: selected1,
          characterId2: selected2,
          type: "compatibility",
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "궁합 분석 생성에 실패했습니다");
      }

      router.push(`/reading/generating/${data.readingId}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "오류가 발생했습니다");
      setLoading(false);
    }
  }

  if (unlockedCharacters.length < 2) {
    return (
      <PixelFrame variant="accent" className="p-6 text-center">
        <div className="text-3xl mb-4">{"🔒"}</div>
        <h2 className="text-base mb-3 font-[family-name:var(--font-pixel)] text-[#4a3e2c]">
          캐릭터 2명 이상 해금 필요
        </h2>
        <p className="text-sm text-[#8a8070] mb-4">
          궁합 분석을 위해서는 종합감정을 받은 캐릭터가 2명 이상 필요합니다.
        </p>
        <PixelButton onClick={() => router.push("/")}>
          캐릭터 관리로 이동
        </PixelButton>
      </PixelFrame>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* VS Header */}
      <PixelFrame variant="accent" className="p-5 text-center">
        <div className="flex items-center justify-center gap-4 mb-3">
          {/* Character 1 slot */}
          <div className="flex flex-col items-center gap-1">
            <div
              className="w-16 h-16 border-2 flex items-center justify-center bg-[#faf7f2]"
              style={{
                borderColor: char1 ? "#b8944c" : "#d4cfc8",
              }}
            >
              {char1 ? (
                <img
                  src={`/characters/${char1.element}-${char1.gender}.png`}
                  alt={char1.name}
                  className="w-14 h-14 object-contain"
                  style={{ imageRendering: "pixelated" }}
                />
              ) : (
                <span className="text-xl text-[#d4cfc8]">{"?"}</span>
              )}
            </div>
            <span className="text-xs font-[family-name:var(--font-pixel)] text-[#4a3e2c]">
              {char1?.name ?? "선택"}
            </span>
          </div>

          <span className="text-2xl font-[family-name:var(--font-pixel)] text-[#d04040]">
            VS
          </span>

          {/* Character 2 slot */}
          <div className="flex flex-col items-center gap-1">
            <div
              className="w-16 h-16 border-2 flex items-center justify-center bg-[#faf7f2]"
              style={{
                borderColor: char2 ? "#b8944c" : "#d4cfc8",
              }}
            >
              {char2 ? (
                <img
                  src={`/characters/${char2.element}-${char2.gender}.png`}
                  alt={char2.name}
                  className="w-14 h-14 object-contain"
                  style={{ imageRendering: "pixelated" }}
                />
              ) : (
                <span className="text-xl text-[#d4cfc8]">{"?"}</span>
              )}
            </div>
            <span className="text-xs font-[family-name:var(--font-pixel)] text-[#4a3e2c]">
              {char2?.name ?? "선택"}
            </span>
          </div>
        </div>
        <p className="text-sm font-[family-name:var(--font-pixel)] text-[#8a8070]">
          궁합을 볼 캐릭터 2명을 선택하세요
        </p>
      </PixelFrame>

      {/* Character 1 selection */}
      <PixelFrame className="p-4">
        <h3 className="text-sm mb-3 font-[family-name:var(--font-pixel)] text-[#9a7040]">
          첫 번째 캐릭터
        </h3>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {unlockedCharacters.map((char) => (
            <button
              key={char.id}
              onClick={() => {
                setSelected1(char.id);
                if (selected2 === char.id) setSelected2(null);
              }}
              className="flex-shrink-0 flex flex-col items-center gap-1 p-2 transition-colors"
              style={{
                border: `2px solid ${selected1 === char.id ? "#9a7040" : "#e8e0d0"}`,
                backgroundColor:
                  selected1 === char.id
                    ? "rgba(200,160,32,0.12)"
                    : "#ffffff",
                opacity: selected2 === char.id ? 0.4 : 1,
                minWidth: "72px",
              }}
              disabled={selected2 === char.id}
            >
              <div className="w-12 h-12 flex items-center justify-center">
                <img
                  src={`/characters/${char.element}-${char.gender}.png`}
                  alt={char.name}
                  className="w-10 h-10 object-contain"
                  style={{ imageRendering: "pixelated" }}
                />
              </div>
              <span className="text-[0.625rem] font-[family-name:var(--font-pixel)] text-[#4a3e2c] truncate max-w-[64px]">
                {char.name}
              </span>
              <span className="text-[0.5rem] font-[family-name:var(--font-pixel)] text-[#8a8070]">
                Lv.{char.level}
              </span>
            </button>
          ))}
        </div>
      </PixelFrame>

      {/* Character 2 selection */}
      <PixelFrame className="p-4">
        <h3 className="text-sm mb-3 font-[family-name:var(--font-pixel)] text-[#9a7040]">
          두 번째 캐릭터
        </h3>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {unlockedCharacters.map((char) => (
            <button
              key={char.id}
              onClick={() => {
                setSelected2(char.id);
                if (selected1 === char.id) setSelected1(null);
              }}
              className="flex-shrink-0 flex flex-col items-center gap-1 p-2 transition-colors"
              style={{
                border: `2px solid ${selected2 === char.id ? "#9a7040" : "#e8e0d0"}`,
                backgroundColor:
                  selected2 === char.id
                    ? "rgba(200,160,32,0.12)"
                    : "#ffffff",
                opacity: selected1 === char.id ? 0.4 : 1,
                minWidth: "72px",
              }}
              disabled={selected1 === char.id}
            >
              <div className="w-12 h-12 flex items-center justify-center">
                <img
                  src={`/characters/${char.element}-${char.gender}.png`}
                  alt={char.name}
                  className="w-10 h-10 object-contain"
                  style={{ imageRendering: "pixelated" }}
                />
              </div>
              <span className="text-[0.625rem] font-[family-name:var(--font-pixel)] text-[#4a3e2c] truncate max-w-[64px]">
                {char.name}
              </span>
              <span className="text-[0.5rem] font-[family-name:var(--font-pixel)] text-[#8a8070]">
                Lv.{char.level}
              </span>
            </button>
          ))}
        </div>
      </PixelFrame>

      {/* Error message */}
      {error && (
        <p className="text-sm font-[family-name:var(--font-pixel)] text-[#d04040] text-center">
          {error}
        </p>
      )}

      {/* Generate button */}
      <PixelButton
        size="lg"
        className="w-full"
        onClick={handleGenerate}
        disabled={!canSubmit}
      >
        {loading
          ? "궁합 분석 중..."
          : "💑 궁합 분석하기 — 990원"}
      </PixelButton>

      <p className="text-xs text-center text-[#8a8070]">
        결제 연동 전 테스트 모드 (무료)
      </p>

      {/* Bottom nav spacer */}
      <div className="h-16" />
    </div>
  );
}
