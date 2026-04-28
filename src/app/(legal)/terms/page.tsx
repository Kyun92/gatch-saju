import type { Metadata } from "next";
import { REFUND_WINDOW_DAYS } from "@/lib/coins/packages";
import { COIN_LABEL } from "@/lib/copy/gacha-terms";

export const metadata: Metadata = {
  title: "이용약관 | 갓챠사주",
  description: "갓챠사주 서비스 이용약관",
  robots: { index: true, follow: true },
};

export default function TermsPage() {
  return (
    <div className="legal-doc">
      <h1 className="legal-title">이용약관</h1>
      <p className="legal-meta">시행일: 2026년 4월 20일</p>

      <section className="legal-section">
        <h2 className="legal-h2">제1조 (목적)</h2>
        <p>
          본 약관은 온아토(이하 &ldquo;회사&rdquo;)가 제공하는 &ldquo;갓챠사주&rdquo;
          서비스(이하 &ldquo;서비스&rdquo;)의 이용과 관련하여 회사와 이용자의
          권리·의무 및 책임사항을 규정함을 목적으로 합니다.
        </p>
      </section>

      <section className="legal-section">
        <h2 className="legal-h2">제2조 (정의)</h2>
        <ol className="legal-ol">
          <li>&ldquo;서비스&rdquo;란 회사가 제공하는 사주·명리 기반의 운세 해석 콘텐츠 제공 서비스를 말합니다.</li>
          <li>&ldquo;이용자&rdquo;란 본 약관에 동의하고 서비스를 이용하는 회원을 말합니다.</li>
          <li>&ldquo;캐릭터&rdquo;란 이용자가 등록한 생년월일시 기반으로 생성되는 운세 대상 프로필을 말합니다.</li>
          <li>&ldquo;유료 콘텐츠&rdquo;란 결제를 통해 제공되는 종합감정, 년운, 궁합, 카테고리별 상세 해석 등을 말합니다.</li>
        </ol>
      </section>

      <section className="legal-section">
        <h2 className="legal-h2">제3조 (약관의 효력 및 변경)</h2>
        <ol className="legal-ol">
          <li>본 약관은 서비스 화면에 게시함으로써 효력이 발생합니다.</li>
          <li>회사는 관련 법령에 위배되지 않는 범위에서 본 약관을 개정할 수 있으며, 개정 시 적용일자 및 개정사유를 명시하여 최소 7일 전(이용자에게 불리한 변경의 경우 30일 전)에 공지합니다.</li>
          <li>이용자가 개정 약관에 동의하지 않을 경우 서비스 이용을 중단하고 탈퇴할 수 있습니다.</li>
        </ol>
      </section>

      <section className="legal-section">
        <h2 className="legal-h2">제4조 (회원가입 및 계정)</h2>
        <ol className="legal-ol">
          <li>이용자는 카카오, 네이버, 구글 계정을 통한 소셜 로그인으로 회원가입할 수 있습니다.</li>
          <li>이용자는 1개의 계정으로 최대 N개의 캐릭터를 등록하여 본인 및 가족·지인의 운세를 조회할 수 있습니다.</li>
          <li>이용자는 탈퇴를 통해 언제든지 계정을 삭제할 수 있으며, 탈퇴 시 개인정보처리방침에 따라 개인정보가 파기됩니다.</li>
        </ol>
      </section>

      <section className="legal-section">
        <h2 className="legal-h2">제5조 (서비스 제공)</h2>
        <ol className="legal-ol">
          <li>회사는 연중무휴 24시간 서비스를 제공함을 원칙으로 합니다. 다만, 시스템 점검·장애·천재지변 등의 사유로 일시 중단될 수 있습니다.</li>
          <li>일일운세 등 일부 서비스는 무료로 제공되며, 종합감정·년운·궁합 등 유료 콘텐츠는 건별 결제를 통해 제공됩니다.</li>
          <li>회사는 서비스 개선을 위하여 상품 구성, 가격, UI 등을 변경할 수 있으며, 변경사항은 서비스 내 공지합니다.</li>
        </ol>
      </section>

      <section className="legal-section">
        <h2 className="legal-h2">제6조 (유료 서비스 및 {COIN_LABEL} 결제)</h2>
        <ol className="legal-ol">
          <li>유료 콘텐츠는 &ldquo;{COIN_LABEL}&rdquo;을 소비하는 방식으로 제공됩니다. 이용자는 회사가 제공하는 {COIN_LABEL} 패키지(1{COIN_LABEL}·3{COIN_LABEL}·5{COIN_LABEL}·10{COIN_LABEL}) 중 하나를 선택하여 결제한 뒤, 충전된 {COIN_LABEL}으로 유료 감정을 이용할 수 있습니다.</li>
          <li>{COIN_LABEL} 패키지는 수량이 커질수록 개당 단가가 낮아지는 차등 구조로 제공되며, 각 패키지의 금액과 할인율은 결제 화면에 표시됩니다.</li>
          <li>결제는 토스페이먼츠(Toss Payments)를 통해 처리되며, 신용카드·체크카드·간편결제 등 토스페이먼츠가 지원하는 수단을 이용할 수 있습니다.</li>
          <li>결제 완료 즉시 해당 수량의 {COIN_LABEL}이 이용자의 계정 잔액에 추가되며, 유료 감정 1건 생성 시 1{COIN_LABEL}이 차감됩니다. 일일운세 등 무료 서비스는 {COIN_LABEL}을 소비하지 않습니다.</li>
          <li>충전된 {COIN_LABEL}에는 유효기간이 없으며, 회원 탈퇴 시 잔여 {COIN_LABEL}은 소멸됩니다.</li>
        </ol>
      </section>

      <section className="legal-section">
        <h2 className="legal-h2">제7조 (청약철회 및 환불)</h2>
        <ol className="legal-ol">
          <li>결제일로부터 {REFUND_WINDOW_DAYS}일 이내에 사용되지 않은 {COIN_LABEL}에 한해 전액 환불이 가능합니다.</li>
          <li>이미 사용된 {COIN_LABEL}에 대해서는 디지털 콘텐츠 제공이 개시된 것으로 보아 「전자상거래 등에서의 소비자보호에 관한 법률」 제17조 제2항 제5호에 따라 청약철회 및 환불이 제한됩니다.</li>
          <li>하나의 결제 건에서 일부 {COIN_LABEL}만 사용된 경우, 남은 {COIN_LABEL} 비율만큼 부분 환불이 가능합니다.</li>
          <li>서비스 오류로 인해 감정이 정상 제공되지 않은 경우 해당 감정에 사용된 {COIN_LABEL}을 복구하거나 그에 상응하는 금액을 환불합니다.</li>
          <li>구체적인 환불 기준·절차·계산식은 별도의 <a href="/refund" className="legal-link">환불정책</a>에서 정합니다.</li>
        </ol>
      </section>

      <section className="legal-section">
        <h2 className="legal-h2">제8조 (이용자의 의무)</h2>
        <ol className="legal-ol">
          <li>이용자는 타인의 개인정보(생년월일시 등)를 본인의 동의 없이 등록해서는 안 됩니다.</li>
          <li>이용자는 서비스를 이용함에 있어 관련 법령, 본 약관, 공지사항을 준수하여야 하며, 회사의 업무에 방해되는 행위를 해서는 안 됩니다.</li>
          <li>이용자는 계정 정보를 타인에게 양도·대여할 수 없습니다.</li>
        </ol>
      </section>

      <section className="legal-section">
        <h2 className="legal-h2">제9조 (콘텐츠의 성격 및 면책)</h2>
        <ol className="legal-ol">
          <li>서비스가 제공하는 운세 해석 콘텐츠는 전통 명리학·점성학 이론에 기반한 <strong>오락 및 참고 목적</strong>의 정보이며, 의료·법률·투자·진로 등 전문적 자문을 대체하지 않습니다.</li>
          <li>이용자가 콘텐츠를 참고하여 내린 의사결정 및 그 결과에 대한 책임은 이용자 본인에게 있으며, 회사는 이에 대해 어떠한 법적 책임도 지지 않습니다.</li>
          <li>회사는 천재지변, 전시, 사변, 정전, 이용자의 귀책사유 등 회사의 고의 또는 중과실이 없는 사유로 인한 서비스 장애에 대해 책임을 지지 않습니다.</li>
        </ol>
      </section>

      <section className="legal-section">
        <h2 className="legal-h2">제10조 (개인정보 보호)</h2>
        <p>
          회사는 이용자의 개인정보를 관련 법령 및 <a href="/privacy" className="legal-link">개인정보처리방침</a>에 따라 보호하며, 이용자의 동의 없이 제3자에게 제공하지 않습니다.
        </p>
      </section>

      <section className="legal-section">
        <h2 className="legal-h2">제11조 (분쟁해결 및 관할)</h2>
        <ol className="legal-ol">
          <li>회사와 이용자 간 발생한 분쟁은 상호 신의성실의 원칙에 따라 해결함을 원칙으로 합니다.</li>
          <li>협의가 이루어지지 않을 경우 전자상거래 등에서의 소비자보호에 관한 법률 및 민사소송법에 따라 관할 법원에서 해결합니다.</li>
          <li>본 약관과 관련된 분쟁은 대한민국 법령에 따릅니다.</li>
        </ol>
      </section>

      <section className="legal-section">
        <h2 className="legal-h2">부칙</h2>
        <p>본 약관은 2026년 4월 20일부터 시행합니다.</p>
      </section>
    </div>
  );
}
