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
    <footer className="py-6 px-4 text-center border-t border-[#e8e0d0] bg-[#f5f0e8]">
      <nav className="flex flex-wrap justify-center gap-x-3 gap-y-1 mb-3">
        {LEGAL_LINKS.map(([href, label]) => (
          <Link
            key={href}
            href={href}
            className="font-[family-name:var(--font-pixel)] text-[0.625rem] text-[#9a7040] hover:text-[#4a3e2c] no-underline"
          >
            {label}
          </Link>
        ))}
      </nav>
      <p className="font-[family-name:var(--font-pixel)] text-[0.5625rem] text-[#b8a890] mb-1">
        {BUSINESS_INFO.tradeName} | 대표 {BUSINESS_INFO.representative} | 사업자등록번호{" "}
        {BUSINESS_INFO.businessRegistrationNumber}
      </p>
      <p className="text-[0.5rem] text-[#c8c0b0] mb-1">
        {BUSINESS_INFO.address}
      </p>
      <p className="text-[0.5rem] text-[#c8c0b0]">
        고객센터{" "}
        <a href={CUSTOMER_SUPPORT.phoneHref} className="text-[#c8c0b0] no-underline">
          {CUSTOMER_SUPPORT.phone}
        </a>
        {" · "}
        <a href={CUSTOMER_SUPPORT.emailHref} className="text-[#c8c0b0] no-underline">
          {CUSTOMER_SUPPORT.email}
        </a>
      </p>
    </footer>
  );
}
