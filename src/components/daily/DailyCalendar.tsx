"use client";

import { useState, useMemo } from "react";
import PixelFrame from "@/components/ui/PixelFrame";
import DailyFortuneDetail from "./DailyFortuneDetail";
import styles from "./DailyCalendar.module.css";

interface FortuneDate {
  id: string;
  title: string | null;
  content: string;
  score: number; // 0-100 운세 점수
}

interface DailyCalendarProps {
  characterId: string;
  fortuneDates: Record<string, FortuneDate>;
  initialMonth: string; // "2026-04"
}

const DAY_LABELS = ["월", "화", "수", "목", "금", "토", "일"];

/** 점수 → 배경색 + 텍스트색 (레퍼런스: 진한 대비, 네이비/크림/머스타드/코랄/핑크) */
function scoreToColors(score: number): { bg: string; text: string } {
  if (score >= 90) return { bg: "#e63946", text: "#ffffff" }; // 코랄레드 — 대길
  if (score >= 75) return { bg: "#e8a020", text: "#2c2418" }; // 머스타드 — 길
  if (score >= 60) return { bg: "#f4e4c1", text: "#2c2418" }; // 크림 — 소길
  if (score >= 45) return { bg: "#e8917a", text: "#ffffff" }; // 살몬핑크 — 보통
  if (score >= 30) return { bg: "#1d3557", text: "#ffffff" }; // 네이비 — 소흉
  return { bg: "#2c2418", text: "#ffffff" }; // 다크브라운 — 흉
}

function getCalendarDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startDow = (firstDay.getDay() + 6) % 7;
  const cells: (number | null)[] = [];
  for (let i = 0; i < startDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  return cells;
}

function formatMonthKey(year: number, month: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}`;
}

function formatDateKey(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export default function DailyCalendar({
  fortuneDates,
  initialMonth,
}: DailyCalendarProps) {
  const [initialYear, initialMon] = initialMonth.split("-").map(Number);
  const [year, setYear] = useState(initialYear);
  const [month, setMonth] = useState(initialMon - 1);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const todayStr = useMemo(() => {
    const now = new Date();
    return formatDateKey(now.getFullYear(), now.getMonth(), now.getDate());
  }, []);

  const currentMonthKey = formatMonthKey(year, month);
  const isInitialMonth = currentMonthKey === initialMonth;
  const cells = useMemo(() => getCalendarDays(year, month), [year, month]);
  const monthLabel = `${month + 1}월 ${year}`;

  function goPrev() {
    setSelectedDate(null);
    if (month === 0) { setYear((y) => y - 1); setMonth(11); }
    else setMonth((m) => m - 1);
  }

  function goNext() {
    setSelectedDate(null);
    if (month === 11) { setYear((y) => y + 1); setMonth(0); }
    else setMonth((m) => m + 1);
  }

  function handleCellClick(day: number) {
    const dateKey = formatDateKey(year, month, day);
    if (fortuneDates[dateKey]) {
      setSelectedDate((prev) => (prev === dateKey ? null : dateKey));
    }
  }

  const selectedFortune = selectedDate ? fortuneDates[selectedDate] : null;

  return (
    <div style={{ marginTop: "24px" }}>
      <PixelFrame variant="default" className="p-4">
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
          <button onClick={goPrev} className={styles.navBtn} aria-label="이전 달">◀</button>
          <h2 className={styles.monthLabel}>{monthLabel}</h2>
          <button onClick={goNext} className={styles.navBtn} aria-label="다음 달">▶</button>
        </div>

        {/* Day headers */}
        <div className={styles.grid}>
          {DAY_LABELS.map((label) => (
            <div key={label} className={styles.headerCell}>{label}</div>
          ))}
        </div>

        {/* Calendar body */}
        {isInitialMonth ? (
          <div className={styles.grid}>
            {cells.map((day, idx) => {
              if (day === null) {
                return <div key={`empty-${idx}`} className={`${styles.cell} ${styles.empty}`} />;
              }

              const dateKey = formatDateKey(year, month, day);
              const fortune = fortuneDates[dateKey];
              const hasFortune = !!fortune;
              const isToday = dateKey === todayStr;
              const isFuture = dateKey > todayStr;
              const isSelected = dateKey === selectedDate;

              const classes = [
                styles.cell,
                hasFortune ? styles.fortune : "",
                isToday ? styles.today : "",
                isFuture && !hasFortune ? styles.future : "",
                isSelected ? styles.selected : "",
              ].filter(Boolean).join(" ");

              // 점수 기반 배경색 + 텍스트색
              const colors = hasFortune ? scoreToColors(fortune.score) : undefined;

              return (
                <div
                  key={dateKey}
                  className={classes}
                  style={colors ? { backgroundColor: colors.bg, color: colors.text } : undefined}
                  onClick={() => handleCellClick(day)}
                  role={hasFortune ? "button" : undefined}
                  tabIndex={hasFortune ? 0 : undefined}
                  onKeyDown={hasFortune ? (e) => {
                    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleCellClick(day); }
                  } : undefined}
                  aria-label={hasFortune ? `${month + 1}월 ${day}일 운세 (${fortune.score}점)` : undefined}
                >
                  {day}
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ padding: "32px 0", textAlign: "center", fontFamily: "var(--font-pixel)", fontSize: "0.75rem", color: "#8a8070" }}>
            이 달의 데이터는 아직 로드되지 않았습니다
          </div>
        )}

        {/* 범례 */}
        <div style={{ display: "flex", gap: "8px", justifyContent: "center", marginTop: "12px", flexWrap: "wrap" }}>
          {[
            { label: "대길", color: "#e63946" },
            { label: "길", color: "#e8a020" },
            { label: "소길", color: "#f4e4c1" },
            { label: "보통", color: "#e8917a" },
            { label: "소흉", color: "#1d3557" },
            { label: "흉", color: "#2c2418" },
          ].map((item) => (
            <div key={item.label} style={{ display: "flex", alignItems: "center", gap: "3px" }}>
              <div style={{ width: "10px", height: "10px", backgroundColor: item.color }} />
              <span style={{ fontFamily: "var(--font-pixel)", fontSize: "0.5rem", color: "#8a8070" }}>{item.label}</span>
            </div>
          ))}
        </div>
      </PixelFrame>

      {/* Selected fortune detail */}
      {selectedFortune && selectedDate && (
        <DailyFortuneDetail
          date={selectedDate}
          title={selectedFortune.title}
          content={selectedFortune.content}
          onClose={() => setSelectedDate(null)}
        />
      )}
    </div>
  );
}
