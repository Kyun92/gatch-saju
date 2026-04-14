"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PixelFrame from "@/components/ui/PixelFrame";
import PixelButton from "@/components/ui/PixelButton";
import { getAllCities } from "@/lib/data/cities";
import { completeOnboarding } from "./actions";

const MBTI_TYPES = [
  "INTJ","INTP","ENTJ","ENTP",
  "INFJ","INFP","ENFJ","ENFP",
  "ISTJ","ISFJ","ESTJ","ESFJ",
  "ISTP","ISFP","ESTP","ESFP",
];

const BIRTH_HOURS = [
  "모름",
  "00:00","01:00","02:00","03:00","04:00","05:00",
  "06:00","07:00","08:00","09:00","10:00","11:00",
  "12:00","13:00","14:00","15:00","16:00","17:00",
  "18:00","19:00","20:00","21:00","22:00","23:00",
];

const cities = getAllCities();

type ElementType = "wood" | "fire" | "earth" | "metal" | "water";

function getElementFromMonth(month: number): ElementType {
  if (month >= 2 && month <= 4) return "wood";
  if (month >= 5 && month <= 7) return "fire";
  if (month >= 8 && month <= 10) return "metal";
  return "water";
}

const ELEMENT_LABEL: Record<ElementType, string> = {
  wood: "목(木)",
  fire: "화(火)",
  earth: "토(土)",
  metal: "금(金)",
  water: "수(水)",
};

const ELEMENT_COLOR: Record<ElementType, string> = {
  wood: "#2e8b4e",
  fire: "#d04040",
  earth: "#c09050",
  metal: "#b0b8c8",
  water: "#3070c0",
};

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Form state
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [birthTime, setBirthTime] = useState("모름");
  const [birthCity, setBirthCity] = useState("서울");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [mbti, setMbti] = useState<string>("");

  const canProceedStep1 = name.trim().length > 0;
  const canProceedStep2 = birthDate.length > 0;

  const month = birthDate ? parseInt(birthDate.split("-")[1], 10) : 1;
  const element = getElementFromMonth(month);

  async function handleSubmit() {
    setLoading(true);
    setError(null);
    try {
      const result = await completeOnboarding({
        name: name.trim(),
        birthDate,
        birthTime: birthTime === "모름" ? "12:00" : birthTime,
        birthCity,
        gender,
        mbti: mbti || null,
      });
      if (result?.success) {
        // Hard navigate로 새 JWT 발급받기
        window.location.href = "/daily";
        return;
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "오류가 발생했습니다.");
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center px-4 py-8"
      style={{ backgroundColor: "#f5f0e8" }}
    >
      {/* Header */}
      <h1
        className="text-2xl mb-6"
        style={{ fontFamily: "var(--font-pixel)", color: "#b8883c" }}
      >
        ⚔️ 캐릭터 생성
      </h1>

      {/* Progress Dots */}
      <div className="flex gap-3 mb-8">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className="w-3 h-3"
            style={{
              backgroundColor: s <= step ? "#c8a020" : "#d4c4a0",
              border: "1px solid #b8944c",
            }}
          />
        ))}
      </div>

      <PixelFrame variant="accent" className="w-full max-w-md p-6">
        {/* Step 1: Name */}
        {step === 1 && (
          <div className="flex flex-col gap-4">
            <label
              className="text-sm"
              style={{ fontFamily: "var(--font-pixel)", color: "#9a7040" }}
            >
              이름을 입력하세요
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="홍길동"
              maxLength={20}
              className="w-full px-4 py-3 text-sm"
              style={{
                fontFamily: "var(--font-pixel)",
                backgroundColor: "#faf7f2",
                color: "#2c2418",
                border: "2px solid #b8944c",
                borderRadius: 0,
                outline: "none",
              }}
            />
            <PixelButton
              disabled={!canProceedStep1}
              onClick={() => setStep(2)}
              size="lg"
              className="w-full mt-2"
            >
              다음 →
            </PixelButton>
          </div>
        )}

        {/* Step 2: Birth Info */}
        {step === 2 && (
          <div className="flex flex-col gap-4">
            <label
              className="text-sm"
              style={{ fontFamily: "var(--font-pixel)", color: "#9a7040" }}
            >
              생년월일
            </label>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full px-4 py-3 text-sm"
              style={{
                fontFamily: "var(--font-pixel)",
                backgroundColor: "#faf7f2",
                color: "#2c2418",
                border: "2px solid #b8944c",
                borderRadius: 0,
                outline: "none",
              }}
            />

            <label
              className="text-sm"
              style={{ fontFamily: "var(--font-pixel)", color: "#9a7040" }}
            >
              태어난 시간
            </label>
            <select
              value={birthTime}
              onChange={(e) => setBirthTime(e.target.value)}
              className="w-full px-4 py-3 text-sm"
              style={{
                fontFamily: "var(--font-pixel)",
                backgroundColor: "#faf7f2",
                color: "#2c2418",
                border: "2px solid #b8944c",
                borderRadius: 0,
                outline: "none",
              }}
            >
              {BIRTH_HOURS.map((h) => (
                <option key={h} value={h}>
                  {h}
                </option>
              ))}
            </select>

            <label
              className="text-sm"
              style={{ fontFamily: "var(--font-pixel)", color: "#9a7040" }}
            >
              출생지
            </label>
            <select
              value={birthCity}
              onChange={(e) => setBirthCity(e.target.value)}
              className="w-full px-4 py-3 text-sm"
              style={{
                fontFamily: "var(--font-pixel)",
                backgroundColor: "#faf7f2",
                color: "#2c2418",
                border: "2px solid #b8944c",
                borderRadius: 0,
                outline: "none",
              }}
            >
              {cities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <label
              className="text-sm"
              style={{ fontFamily: "var(--font-pixel)", color: "#9a7040" }}
            >
              성별
            </label>
            <div className="flex gap-4">
              {(["male", "female"] as const).map((g) => (
                <label key={g} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value={g}
                    checked={gender === g}
                    onChange={() => setGender(g)}
                    style={{ accentColor: "#9a7040" }}
                  />
                  <span
                    className="text-sm"
                    style={{ fontFamily: "var(--font-pixel)", color: "#2c2418" }}
                  >
                    {g === "male" ? "남성" : "여성"}
                  </span>
                </label>
              ))}
            </div>

            <label
              className="text-sm"
              style={{ fontFamily: "var(--font-pixel)", color: "#9a7040" }}
            >
              MBTI (선택사항)
            </label>
            <select
              value={mbti}
              onChange={(e) => setMbti(e.target.value)}
              className="w-full px-4 py-3 text-sm"
              style={{
                fontFamily: "var(--font-pixel)",
                backgroundColor: "#faf7f2",
                color: "#2c2418",
                border: "2px solid #b8944c",
                borderRadius: 0,
                outline: "none",
              }}
            >
              <option value="">모르겠어요</option>
              {MBTI_TYPES.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>

            <div className="flex gap-3 mt-2">
              <PixelButton
                variant="secondary"
                onClick={() => setStep(1)}
                size="md"
                className="flex-1"
              >
                ← 이전
              </PixelButton>
              <PixelButton
                disabled={!canProceedStep2}
                onClick={() => setStep(3)}
                size="md"
                className="flex-1"
              >
                다음 →
              </PixelButton>
            </div>
          </div>
        )}

        {/* Step 3: Preview */}
        {step === 3 && (
          <div className="flex flex-col gap-5 items-center">
            <p
              className="text-sm text-center"
              style={{ fontFamily: "var(--font-pixel)", color: "#4a3e2c" }}
            >
              당신의 캐릭터를 확인하세요
            </p>

            {/* Character Preview */}
            <div
              className="pixel-frame-accent p-4 w-full flex flex-col items-center gap-3"
            >
              <div
                className="w-20 h-20 pixel-frame-simple flex items-center justify-center"
                style={{
                  backgroundColor: "#faf7f2",
                  fontSize: "2.5rem",
                }}
              >
                ⚔️
              </div>
              <div
                className="text-xl"
                style={{ fontFamily: "var(--font-pixel)", color: "#b8883c" }}
              >
                {name}
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`tag-base tag-${element}`}
                  style={{
                    padding: "4px 10px",
                    fontSize: "0.8125rem",
                    fontFamily: "var(--font-pixel)",
                  }}
                >
                  {ELEMENT_LABEL[element]}
                </span>
                {mbti && (
                  <span
                    className="text-xs px-2 py-1"
                    style={{
                      fontFamily: "var(--font-pixel)",
                      color: "#9a7040",
                      border: "1px solid #b8944c",
                      backgroundColor: "rgba(184,148,76,0.1)",
                    }}
                  >
                    {mbti}
                  </span>
                )}
              </div>
              <p
                className="text-xs text-center"
                style={{ color: "#8a8070" }}
              >
                {birthDate} | {birthCity} | {gender === "male" ? "남" : "여"}
              </p>
            </div>

            {error && (
              <p
                className="text-sm text-center"
                style={{ fontFamily: "var(--font-pixel)", color: "#d04040" }}
              >
                {error}
              </p>
            )}

            <div className="flex gap-3 w-full mt-2">
              <PixelButton
                variant="secondary"
                onClick={() => setStep(2)}
                size="md"
                className="flex-1"
                disabled={loading}
              >
                ← 이전
              </PixelButton>
              <PixelButton
                onClick={handleSubmit}
                size="md"
                className="flex-1"
                disabled={loading}
              >
                {loading ? "생성 중..." : "모험 시작! ⚔️"}
              </PixelButton>
            </div>
          </div>
        )}
      </PixelFrame>
    </div>
  );
}
