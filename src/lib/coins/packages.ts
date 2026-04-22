export type CoinPackageId = "coin_1" | "coin_3" | "coin_5" | "coin_10";

export interface CoinPackage {
  id: CoinPackageId;
  quantity: number;
  price: number;
  perCoin: number;
  discountPct: number;
  label: string;
  orderName: string;
}

export const COIN_PACKAGES: readonly CoinPackage[] = [
  {
    id: "coin_1",
    quantity: 1,
    price: 990,
    perCoin: 990,
    discountPct: 0,
    label: "1코인",
    orderName: "갓챠사주 코인 1개",
  },
  {
    id: "coin_3",
    quantity: 3,
    price: 2_700,
    perCoin: 900,
    discountPct: 9,
    label: "3코인",
    orderName: "갓챠사주 코인 3개",
  },
  {
    id: "coin_5",
    quantity: 5,
    price: 4_200,
    perCoin: 840,
    discountPct: 15,
    label: "5코인",
    orderName: "갓챠사주 코인 5개",
  },
  {
    id: "coin_10",
    quantity: 10,
    price: 7_900,
    perCoin: 790,
    discountPct: 20,
    label: "10코인",
    orderName: "갓챠사주 코인 10개",
  },
] as const;

export function getCoinPackage(id: string): CoinPackage | null {
  return COIN_PACKAGES.find((p) => p.id === id) ?? null;
}

export function formatWon(n: number): string {
  return n.toLocaleString("ko-KR") + "원";
}

export const COINS_PER_READING = 1;
export const REFUND_WINDOW_DAYS = 7;
