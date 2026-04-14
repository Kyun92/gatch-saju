export function nowKST(): Date {
  return new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Seoul" })
  );
}

export function todayKSTString(): string {
  const d = nowKST();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function parseTimeIndex(birthTime: string): number {
  const [h] = birthTime.split(":").map(Number);
  // 자미두수 시진 인덱스: 子(23-1)=0, 丑(1-3)=1, ..., 亥(21-23)=11
  if (h >= 23 || h < 1) return 0;
  return Math.floor((h + 1) / 2);
}
