import Link from "next/link";
import { BUSINESS_INFO, CUSTOMER_SUPPORT } from "@/lib/copy/contact";

const LEGAL_LINKS: [string, string][] = [
  ["/terms", "이용약관"],
  ["/privacy", "개인정보처리방침"],
  ["/refund", "환불정책"],
  ["/contact", "고객센터"],
];

export default function Footer() {
  return (
    <footer className="py-8 px-4 text-center border-t-2 border-[#b8944c] bg-[#ebe3d1]">
      <nav className="flex flex-wrap justify-center gap-x-4 gap-y-2 mb-5">
        {LEGAL_LINKS.map(([href, label]) => (
          <Link
            key={href}
            href={href}
            className="font-[family-name:var(--font-pixel)] text-xs text-[#4a3e2c] hover:text-[#9a7040] no-underline"
          >
            {label}
          </Link>
        ))}
      </nav>
      <div className="font-[family-name:var(--font-body)] text-[#4a3e2c] max-w-md mx-auto space-y-1.5">
        <p className="text-xs leading-relaxed">
          <span className="font-medium">{BUSINESS_INFO.tradeName}</span>
          <span className="text-[#8a7858]"> · </span>
          대표 {BUSINESS_INFO.representative}
          <br />
          사업자등록번호 {BUSINESS_INFO.businessRegistrationNumber}
        </p>
        <p className="text-[0.6875rem] text-[#6a5e4c] leading-relaxed">
          {BUSINESS_INFO.address}
        </p>
        <p className="text-[0.6875rem] text-[#6a5e4c] leading-relaxed pt-1">
          고객센터{" "}
          <a
            href={CUSTOMER_SUPPORT.phoneHref}
            className="text-[#4a3e2c] hover:text-[#9a7040] underline underline-offset-2"
          >
            {CUSTOMER_SUPPORT.phone}
          </a>
          <span className="text-[#8a7858]"> · </span>
          <a
            href={CUSTOMER_SUPPORT.emailHref}
            className="text-[#4a3e2c] hover:text-[#9a7040] underline underline-offset-2"
          >
            {CUSTOMER_SUPPORT.email}
          </a>
        </p>
      </div>
    </footer>
  );
}
