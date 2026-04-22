"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface FortuneTipCardProps {
  character: {
    name: string;
    mbti: string | null;
    free_summary: string | null;
  } | null;
}

type Tip = {
  kind: "personal" | "saju" | "ziwei" | "western";
  label: string;
  body: string;
};

const KIND_STYLE: Record<Tip["kind"], { badge: string; accent: string }> = {
  personal: { badge: "#d04040", accent: "#fff4ed" },
  saju: { badge: "#9a7040", accent: "#fff6e0" },
  ziwei: { badge: "#6858b8", accent: "#f1edff" },
  western: { badge: "#3070c0", accent: "#e6f0fc" },
};

const KIND_LABEL: Record<Tip["kind"], string> = {
  personal: "YOUR DATA",
  saju: "사주 상식",
  ziwei: "자미두수",
  western: "서양 점성술",
};

const GENERAL_TIPS: Tip[] = [
  {
    kind: "saju",
    label: "사주 8글자",
    body: "사주 8글자 중 가장 중요한 건 단 1글자, '일간(日干)'. 태어난 날의 하늘 기운이 곧 나의 본성이에요.",
  },
  {
    kind: "saju",
    label: "오행의 순환",
    body: "목(木)→화(火)→토(土)→금(金)→수(水). 이 흐름이 막힘없이 돌아야 운이 잘 풀린다고 봐요.",
  },
  {
    kind: "ziwei",
    label: "자미두수의 기원",
    body: "북송 시대 도사 진단(陳摶)이 창시. 14개 주성(主星)이 12궁을 돌며 내 인생 지도를 그려요.",
  },
  {
    kind: "ziwei",
    label: "명궁과 신궁",
    body: "자미두수에서 '명궁'은 타고난 본질, '신궁'은 중년 이후 실제 삶. 둘이 다르면 후반기 변화가 커요.",
  },
  {
    kind: "western",
    label: "어센던트(ASC)",
    body: "태어난 순간 동쪽 지평선에 떠오른 별자리. 내가 남에게 보이는 첫인상, 사회적 가면이에요.",
  },
  {
    kind: "western",
    label: "태양·달·상승",
    body: "서양 점성술의 3대 축. 태양은 정체성, 달은 감정, 상승은 외면. 이 셋이 섞여 '나'가 완성돼요.",
  },
  {
    kind: "saju",
    label: "대운과 세운",
    body: "대운은 10년 단위 큰 흐름, 세운은 올해의 기운. 둘이 겹치는 해엔 반드시 큰 일이 생겨요.",
  },
];

function buildPersonalTips(character: FortuneTipCardProps["character"]): Tip[] {
  if (!character) return [];
  const tips: Tip[] = [];

  if (character.name) {
    tips.push({
      kind: "personal",
      label: "분석 대상",
      body: `'${character.name}'님의 차트를 정밀하게 풀이하는 중이에요. 잠시만 기다려주세요.`,
    });
  }

  if (character.free_summary) {
    tips.push({
      kind: "personal",
      label: "첫인상 요약",
      body: `${character.free_summary} — 이 운명의 결을 지금 세밀하게 풀어내는 중이에요.`,
    });
  }

  if (character.mbti) {
    tips.push({
      kind: "personal",
      label: `MBTI ${character.mbti}`,
      body: `MBTI ${character.mbti} 기질을 사주·자미·점성과 교차시켜 4축 해석에 반영하고 있어요.`,
    });
  }

  return tips;
}

const ROTATE_INTERVAL_MS = 8000;

export default function FortuneTipCard({ character }: FortuneTipCardProps) {
  const allTips = useMemo<Tip[]>(() => {
    const personal = buildPersonalTips(character);
    // 개인화 카드를 앞쪽에 섞고, 나머지를 일반 상식과 교차
    const merged: Tip[] = [];
    const maxLen = Math.max(personal.length, GENERAL_TIPS.length);
    for (let i = 0; i < maxLen; i++) {
      if (i < personal.length) merged.push(personal[i]);
      if (i < GENERAL_TIPS.length) merged.push(GENERAL_TIPS[i]);
    }
    return merged.length ? merged : GENERAL_TIPS;
  }, [character]);

  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIdx((prev) => (prev + 1) % allTips.length);
    }, ROTATE_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [allTips.length]);

  const tip = allTips[idx];
  if (!tip) return null;

  const style = KIND_STYLE[tip.kind];

  return (
    <div className="w-full max-w-sm">
      <AnimatePresence mode="wait">
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="relative p-4 border-2"
          style={{
            backgroundColor: style.accent,
            borderColor: style.badge,
            boxShadow: "3px 3px 0 rgba(0,0,0,0.08)",
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <span
              className="font-[family-name:var(--font-pixel)] text-[0.5rem] text-white px-1.5 py-[2px] tracking-wider"
              style={{ backgroundColor: style.badge }}
            >
              {KIND_LABEL[tip.kind]}
            </span>
            <span
              className="font-[family-name:var(--font-pixel)] text-[0.625rem]"
              style={{ color: style.badge }}
            >
              {tip.label}
            </span>
          </div>
          <p className="font-[family-name:var(--font-body)] text-xs leading-relaxed text-[#2c2418]">
            {tip.body}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
