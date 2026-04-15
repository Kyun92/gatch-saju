"use client";

import { useState } from "react";
import PixelFrame from "@/components/ui/PixelFrame";
import PixelButton from "@/components/ui/PixelButton";
import { getAllCities } from "@/lib/data/cities";

const cities = getAllCities();

const BIRTH_HOURS = [
  "모름",
  "00:00","01:00","02:00","03:00","04:00","05:00",
  "06:00","07:00","08:00","09:00","10:00","11:00",
  "12:00","13:00","14:00","15:00","16:00","17:00",
  "18:00","19:00","20:00","21:00","22:00","23:00",
];

export default function CompatibilityPage() {
  const [partnerName, setPartnerName] = useState("");
  const [partnerBirthDate, setPartnerBirthDate] = useState("");
  const [partnerBirthTime, setPartnerBirthTime] = useState("모름");
  const [partnerCity, setPartnerCity] = useState("서울");
  const [partnerGender, setPartnerGender] = useState<"male" | "female">("female");

  return (
    <div className="w-full mx-auto px-4 py-6 max-w-[768px] min-h-screen">
      <h1 className="text-xl mb-6 font-[family-name:var(--font-pixel)] text-[#b8883c]">
        💕 궁합 분석
      </h1>

      {/* VS Layout */}
      <PixelFrame variant="accent" className="p-5 mb-6 text-center">
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="pixel-frame-simple w-16 h-16 flex items-center justify-center bg-[#faf7f2] text-2xl">
            ⚔️
          </div>
          <span className="text-2xl font-[family-name:var(--font-pixel)] text-[#d04040]">
            VS
          </span>
          <div className="pixel-frame-simple w-16 h-16 flex items-center justify-center bg-[#faf7f2] text-2xl">
            💕
          </div>
        </div>
        <p className="text-sm font-[family-name:var(--font-pixel)] text-[#4a3e2c]">
          상대방의 정보를 입력하세요
        </p>
      </PixelFrame>

      {/* Partner Info Form */}
      <PixelFrame className="p-5">
        <div className="flex flex-col gap-4">
          <label className="text-sm font-[family-name:var(--font-pixel)] text-[#9a7040]">
            상대방 이름
          </label>
          <input
            type="text"
            value={partnerName}
            onChange={(e) => setPartnerName(e.target.value)}
            placeholder="이름"
            className="w-full px-4 py-3 text-sm font-[family-name:var(--font-pixel)] bg-[#faf7f2] text-[#2c2418] border-2 border-[#b8944c] rounded-none outline-none"
          />

          <label className="text-sm font-[family-name:var(--font-pixel)] text-[#9a7040]">
            생년월일
          </label>
          <input
            type="date"
            value={partnerBirthDate}
            onChange={(e) => setPartnerBirthDate(e.target.value)}
            className="w-full px-4 py-3 text-sm font-[family-name:var(--font-pixel)] bg-[#faf7f2] text-[#2c2418] border-2 border-[#b8944c] rounded-none outline-none"
          />

          <label className="text-sm font-[family-name:var(--font-pixel)] text-[#9a7040]">
            태어난 시간
          </label>
          <select
            value={partnerBirthTime}
            onChange={(e) => setPartnerBirthTime(e.target.value)}
            className="w-full px-4 py-3 text-sm font-[family-name:var(--font-pixel)] bg-[#faf7f2] text-[#2c2418] border-2 border-[#b8944c] rounded-none outline-none"
          >
            {BIRTH_HOURS.map((h) => (
              <option key={h} value={h}>{h}</option>
            ))}
          </select>

          <label className="text-sm font-[family-name:var(--font-pixel)] text-[#9a7040]">
            출생지
          </label>
          <select
            value={partnerCity}
            onChange={(e) => setPartnerCity(e.target.value)}
            className="w-full px-4 py-3 text-sm font-[family-name:var(--font-pixel)] bg-[#faf7f2] text-[#2c2418] border-2 border-[#b8944c] rounded-none outline-none"
          >
            {cities.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <label className="text-sm font-[family-name:var(--font-pixel)] text-[#9a7040]">
            성별
          </label>
          <div className="flex gap-4">
            {(["male", "female"] as const).map((g) => (
              <label key={g} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="partnerGender"
                  value={g}
                  checked={partnerGender === g}
                  onChange={() => setPartnerGender(g)}
                  className="accent-[#9a7040]"
                />
                <span className="text-sm font-[family-name:var(--font-pixel)] text-[#2c2418]">
                  {g === "male" ? "남성" : "여성"}
                </span>
              </label>
            ))}
          </div>

          <PixelButton size="lg" className="w-full mt-2">
            ⚔️ 궁합 분석하기 — 990원
          </PixelButton>
        </div>
      </PixelFrame>
    </div>
  );
}
