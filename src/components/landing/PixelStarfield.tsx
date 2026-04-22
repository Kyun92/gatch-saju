type Star = {
  top: string;
  left: string;
  size: number;
  color: string;
  delay: string;
};

const STARS: Star[] = [
  { top: "6%",  left: "12%", size: 2, color: "#d4b070", delay: "0.0s" },
  { top: "11%", left: "78%", size: 2, color: "#ffffff", delay: "1.3s" },
  { top: "14%", left: "34%", size: 1, color: "#ffffff", delay: "0.6s" },
  { top: "19%", left: "64%", size: 2, color: "#d4b070", delay: "1.9s" },
  { top: "23%", left: "8%",  size: 1, color: "#ffffff", delay: "0.3s" },
  { top: "27%", left: "88%", size: 2, color: "#d4b070", delay: "0.9s" },
  { top: "33%", left: "22%", size: 1, color: "#d4b070", delay: "1.5s" },
  { top: "38%", left: "70%", size: 2, color: "#ffffff", delay: "0.2s" },
  { top: "44%", left: "46%", size: 1, color: "#ffffff", delay: "1.7s" },
  { top: "49%", left: "4%",  size: 2, color: "#d4b070", delay: "0.7s" },
  { top: "53%", left: "92%", size: 1, color: "#ffffff", delay: "1.1s" },
  { top: "58%", left: "28%", size: 2, color: "#d4b070", delay: "0.4s" },
  { top: "63%", left: "74%", size: 1, color: "#d4b070", delay: "1.4s" },
  { top: "68%", left: "14%", size: 2, color: "#ffffff", delay: "0.8s" },
  { top: "73%", left: "58%", size: 1, color: "#ffffff", delay: "1.8s" },
  { top: "78%", left: "82%", size: 2, color: "#d4b070", delay: "0.5s" },
  { top: "83%", left: "38%", size: 1, color: "#d4b070", delay: "1.2s" },
  { top: "88%", left: "68%", size: 2, color: "#ffffff", delay: "0.1s" },
  { top: "92%", left: "16%", size: 1, color: "#ffffff", delay: "1.6s" },
  { top: "95%", left: "86%", size: 2, color: "#d4b070", delay: "1.0s" },
];

export default function PixelStarfield() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-0"
      aria-hidden="true"
    >
      {STARS.map((s, i) => (
        <span
          key={i}
          className="animate-twinkle absolute block"
          style={{
            top: s.top,
            left: s.left,
            width: s.size,
            height: s.size,
            backgroundColor: s.color,
            animationDelay: s.delay,
            imageRendering: "pixelated",
          }}
        />
      ))}
    </div>
  );
}
