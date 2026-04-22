import CoinSvg from "@/components/ui/CoinSvg";
import { COPY } from "@/lib/copy/gacha-terms";

interface CollectionCounterProps {
  count: number;
}

/**
 * 허브/마이페이지 상단 표시용 — "내 명부 · 캡슐 N개 보유".
 * COPY 상수를 소비해 네이밍 변경 단일 지점 관리.
 */
export default function CollectionCounter({ count }: CollectionCounterProps) {
  return (
    <div className="collection-counter" role="status" aria-live="polite">
      <CoinSvg size={14} />
      <span className="collection-counter-label">{COPY.collection.label}</span>
      <span aria-hidden="true">·</span>
      <span className="collection-counter-count">
        {COPY.collection.counter(count)}
      </span>
    </div>
  );
}
