import type { Metadata } from "next";
import { REFUND_WINDOW_DAYS } from "@/lib/coins/packages";
import { COIN_LABEL, formatPrice } from "@/lib/copy/gacha-terms";

export const metadata: Metadata = {
  title: "환불정책 | 갓챠사주",
  description: `갓챠사주 ${COIN_LABEL} 환불 기준 및 절차 안내`,
  robots: { index: true, follow: true },
};

export default function RefundPage() {
  return (
    <div className="legal-doc">
      <h1 className="legal-title">환불정책</h1>
      <p className="legal-meta">시행일: 2026년 4월 22일</p>

      <section className="legal-section">
        <p>
          온아토(이하 &ldquo;회사&rdquo;)는 「전자상거래 등에서의 소비자보호에
          관한 법률」 및 관련 법령에 따라 이용자의 정당한 권익을 보호하기 위해
          다음과 같이 환불정책을 운영합니다.
        </p>
      </section>

      <section className="legal-section">
        <h2 className="legal-h2">1. {COIN_LABEL} 결제 구조 개요</h2>
        <p>
          갓챠사주는 이용자가 패키지 단위로 {COIN_LABEL}을 충전하고, 보유 {COIN_LABEL}으로 유료
          감정(종합감정, 년운, 궁합, 카테고리별 해석 등)을 이용하는 구조입니다.
          일일운세·캐릭터 생성 등 무료 서비스는 환불 대상이 아닙니다.
        </p>
      </section>

      <section className="legal-section">
        <h2 className="legal-h2">2. 환불 가능 사유</h2>
        <ol className="legal-ol">
          <li><strong>결제일 기준 {REFUND_WINDOW_DAYS}일 이내의 미사용 {COIN_LABEL}</strong>: 결제일로부터 {REFUND_WINDOW_DAYS}일 이내에 요청하시면, 해당 결제에서 아직 사용되지 않은 {COIN_LABEL}에 한해 전액 환불됩니다.</li>
          <li><strong>서비스 오류로 콘텐츠가 정상 제공되지 않은 경우</strong>: 회사의 귀책으로 감정 결과가 생성되지 않았거나, 열람 불가능한 상태로 제공된 경우 해당 감정에 사용된 {COIN_LABEL}을 복구하거나 그에 상응하는 금액을 환불합니다.</li>
          <li><strong>중복 결제 또는 결제 시스템 오류</strong>: 중복·오류 결제가 확인되는 경우 해당 금액을 환불합니다.</li>
          <li><strong>관련 법령에서 정한 청약철회 사유에 해당하는 경우</strong>: 법령이 정하는 바에 따릅니다.</li>
        </ol>
      </section>

      <section className="legal-section">
        <h2 className="legal-h2">3. 환불 제한 사유</h2>
        <p>
          다음의 경우에는 「전자상거래 등에서의 소비자보호에 관한 법률」 제17조
          제2항에 따라 청약철회 및 환불이 제한될 수 있습니다.
        </p>
        <ol className="legal-ol mt-2">
          <li><strong>이미 사용된 {COIN_LABEL}</strong> — 감정 생성에 사용된 {COIN_LABEL}은 해당 콘텐츠가 제공된 것으로 보아 환불이 제한됩니다 (동법 제17조 제2항 제5호: 용역 또는 재화의 제공이 개시된 디지털 콘텐츠).</li>
          <li><strong>결제일로부터 {REFUND_WINDOW_DAYS}일이 경과한 {COIN_LABEL}</strong> — 서비스 오류로 인한 경우는 예외.</li>
          <li>이용자의 귀책사유로 회사가 환불을 이행할 수 없는 경우.</li>
        </ol>
        <div className="legal-callout mt-3">
          한 번 사용된 {COIN_LABEL}으로 생성된 감정 결과물은 반복 열람과 복제가 가능하므로,
          <strong> 사용된 {COIN_LABEL}에 대한 단순 변심 환불은 제한</strong>됩니다. 충전 전 상품과 가격을
          충분히 확인해 주시기 바랍니다.
        </div>
      </section>

      <section className="legal-section">
        <h2 className="legal-h2">4. {COIN_LABEL}의 유효기간</h2>
        <p>
          충전한 {COIN_LABEL}에는 <strong>유효기간이 없습니다</strong>. 회원 상태가 유지되는 한
          언제든지 사용하실 수 있습니다. 단, 회원 탈퇴 시 보유 {COIN_LABEL}은 모두 소멸되며
          환불 대상에서 제외됩니다.
        </p>
      </section>

      <section className="legal-section">
        <h2 className="legal-h2">5. 부분 환불</h2>
        <p>
          하나의 결제 건에서 일부 {COIN_LABEL}이 이미 사용된 경우, <strong>사용되지 않은 나머지
          {COIN_LABEL}에 한해 부분 환불</strong>이 가능합니다. 환불 금액은 다음과 같이 계산됩니다.
        </p>
        <div className="legal-callout mt-2">
          환불 금액 = 결제 금액 × (남은 {COIN_LABEL} 수 / 구매한 {COIN_LABEL} 수)
          <br />
          예) 5{COIN_LABEL} {formatPrice(4200)} 패키지 구매 후 2{COIN_LABEL} 사용 → 남은 3{COIN_LABEL} 환불,
          환불 금액 4,200 × 3/5 = {formatPrice(2520)}
        </div>
      </section>

      <section className="legal-section">
        <h2 className="legal-h2">6. 환불 절차</h2>
        <ol className="legal-ol">
          <li>마이페이지의 &ldquo;환불 요청&rdquo; 링크 또는 고객센터(010-6889-8909 / lsk9105@gmail.com)로 환불을 요청합니다.</li>
          <li>요청 시 다음 정보를 함께 전달해 주시기 바랍니다.
            <ul className="legal-ul mt-1">
              <li>가입 이메일</li>
              <li>환불 요청 주문번호(결제일 {REFUND_WINDOW_DAYS}일 이내)</li>
              <li>환불 사유</li>
            </ul>
          </li>
          <li>회사는 접수 후 영업일 기준 3일 이내에 환불 가능 여부를 확인하여 회신하며, 가능한 경우 토스페이먼츠를 통해 원결제 수단으로 환불 처리합니다.</li>
          <li>결제 수단별 환불 소요 기간
            <ul className="legal-ul mt-1">
              <li>신용카드·체크카드: 카드사 정책에 따라 영업일 기준 3~7일</li>
              <li>간편결제: 제공사 정책에 따라 영업일 기준 1~5일</li>
              <li>계좌이체: 영업일 기준 1~3일 내 환불 계좌로 입금</li>
            </ul>
          </li>
        </ol>
      </section>

      <section className="legal-section">
        <h2 className="legal-h2">7. 미성년자 결제</h2>
        <p>
          만 19세 미만 미성년자가 법정대리인의 동의 없이 결제한 경우, 본인 또는
          법정대리인은 결제를 취소할 수 있습니다. 이 경우 관련 입증 서류(가족관계
          증명서 등)를 요청할 수 있습니다.
        </p>
      </section>

      <section className="legal-section">
        <h2 className="legal-h2">8. 환불 문의</h2>
        <div className="legal-callout">
          <p>· 담당자: 임승균</p>
          <p>· 전화: 010-6889-8909</p>
          <p>· 이메일: lsk9105@gmail.com</p>
          <p>· 운영시간: 평일 10:00 ~ 18:00 (주말·공휴일 제외)</p>
          <p>· 처리 소요: 영업일 기준 1~3일</p>
        </div>
      </section>
    </div>
  );
}
