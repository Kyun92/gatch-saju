import PixelFrame from "@/components/ui/PixelFrame";

interface ProfileCardProps {
  name: string;
  birthDate: string;
  birthTime?: string | null;
  gender: string;
  dayMaster: string;
  mbti?: string | null;
}

export default function ProfileCard({
  name,
  birthDate,
  birthTime,
  gender,
  dayMaster,
  mbti,
}: ProfileCardProps) {
  const rows = [
    { label: "이름", value: name },
    { label: "생년월일", value: birthDate },
    { label: "출생시간", value: birthTime ?? "미입력" },
    { label: "성별", value: gender === "male" ? "남" : "여" },
    { label: "일주", value: dayMaster },
    { label: "MBTI", value: mbti ?? "-" },
  ];

  return (
    <PixelFrame className="p-4">
      <h3
        className="text-sm mb-3"
        style={{ fontFamily: "var(--font-pixel)", color: "#9a7040" }}
      >
        📜 모험자 프로필
      </h3>
      <table className="fortune-table">
        <tbody>
          {rows.map((row) => (
            <tr key={row.label}>
              <th>{row.label}</th>
              <td>{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </PixelFrame>
  );
}
