import Link from "next/link";
import CoinSvg from "@/components/ui/CoinSvg";
import {
  COIN_PRICE_DISPLAY,
  formatCoinCount,
} from "@/lib/copy/gacha-terms";

export default function SamplePreview() {
  const ctaLabel = "내 스탯 확인하기";
  return (
    <div className="pixel-frame-accent p-5 mt-6">
      <p className="text-center mb-3 font-[family-name:var(--font-pixel)] text-xs text-[#9a7040]">
        종합 감정 미리보기
      </p>

      {/* Blurred sample stats */}
      <div className="blur-preview mb-4" aria-hidden="true">
        <div className="flex flex-col gap-2">
          {[
            { label: "종합운", value: 82, color: "#c8a020" },
            { label: "연애운", value: 65, color: "#d06890" },
            { label: "재물운", value: 74, color: "#2e8b4e" },
            { label: "건강운", value: 90, color: "#3070c0" },
          ].map((stat) => (
            <div key={stat.label} className="flex items-center gap-2">
              <span className="font-[family-name:var(--font-pixel)] text-[0.625rem] text-[#8a8070] w-14">
                {stat.label}
              </span>
              <div className="stat-bar-track flex-1">
                <div
                  className="stat-bar-fill"
                  style={{ width: `${stat.value}%`, backgroundColor: stat.color }}
                />
              </div>
              <span
                className="font-[family-name:var(--font-pixel)] text-[0.625rem] w-6 text-right"
                style={{ color: stat.color }}
              >
                {stat.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <Link
        href="/reading/new"
        className="gacha-coin-btn w-full justify-center"
        aria-label={`${ctaLabel} ${COIN_PRICE_DISPLAY} (${formatCoinCount(1)})`}
      >
        <CoinSvg size={24} className="animate-spin-coin" />
        <span>{`${ctaLabel} — ${COIN_PRICE_DISPLAY}`}</span>
      </Link>
    </div>
  );
}
