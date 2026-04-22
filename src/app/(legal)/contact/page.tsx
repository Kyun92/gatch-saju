import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "고객센터 | 갓챠사주",
  description: "갓챠사주 고객센터 안내 및 자주 묻는 질문",
  robots: { index: true, follow: true },
};

export default function ContactPage() {
  return (
    <div className="legal-doc">
      <h1 className="legal-title">고객센터</h1>
      <p className="legal-meta">문의는 이메일로 접수해 주세요</p>

      <section className="legal-section">
        <h2 className="legal-h2">연락처 안내</h2>
        <div className="legal-callout">
          <p>· 담당자: 임승균</p>
          <p>· 이메일: <a href="mailto:lsk9105@gmail.com" className="legal-link">lsk9105@gmail.com</a></p>
          <p>· 운영시간: 평일 10:00 ~ 18:00 (주말·공휴일 제외)</p>
          <p>· 답변 소요: 영업일 기준 1~2일 내 회신</p>
        </div>
        <p className="mt-2">
          운영시간 외에 접수된 문의는 다음 영업일에 순차적으로 처리됩니다.
          신속한 확인을 위해 <strong>주문번호</strong> 또는 <strong>결제일시</strong>를
          함께 기재해 주시면 도움이 됩니다.
        </p>
      </section>

      <section className="legal-section">
        <h2 className="legal-h2">운영 주체</h2>
        <table className="legal-table">
          <tbody>
            <tr>
              <th>상호</th>
              <td>온아토</td>
            </tr>
            <tr>
              <th>대표자</th>
              <td>임승균</td>
            </tr>
            <tr>
              <th>사업자등록번호</th>
              <td>607-29-96690</td>
            </tr>
            <tr>
              <th>사업장 주소</th>
              <td>경기도 용인시 기흥구 신정로 25, 108동 2205호</td>
            </tr>
            <tr>
              <th>이메일</th>
              <td>lsk9105@gmail.com</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className="legal-section">
        <h2 className="legal-h2">자주 묻는 질문</h2>

        <div className="mb-4">
          <p className="font-[family-name:var(--font-pixel)] text-[0.8125rem] text-[#7a5830] mb-1">Q. 결제는 어떻게 이루어지나요?</p>
          <p>토스페이먼츠를 통해 신용카드·체크카드·간편결제 등으로 결제할 수 있으며, 결제 즉시 해당 콘텐츠가 제공됩니다.</p>
        </div>

        <div className="mb-4">
          <p className="font-[family-name:var(--font-pixel)] text-[0.8125rem] text-[#7a5830] mb-1">Q. 환불이 가능한가요?</p>
          <p>
            콘텐츠 제공이 개시되기 전이거나 서비스 오류로 콘텐츠가 정상 제공되지
            않은 경우 환불이 가능합니다. 자세한 내용은 <a href="/refund" className="legal-link">환불정책</a>을 확인해 주세요.
          </p>
        </div>

        <div className="mb-4">
          <p className="font-[family-name:var(--font-pixel)] text-[0.8125rem] text-[#7a5830] mb-1">Q. 캐릭터는 몇 개까지 만들 수 있나요?</p>
          <p>1개 계정으로 본인, 가족, 지인 등 여러 캐릭터를 등록할 수 있습니다. 타인의 생년월일시를 등록하실 때는 반드시 본인 동의를 받으셔야 합니다.</p>
        </div>

        <div className="mb-4">
          <p className="font-[family-name:var(--font-pixel)] text-[0.8125rem] text-[#7a5830] mb-1">Q. 출생 시각을 모를 때는 어떻게 하나요?</p>
          <p>시각을 모를 경우 정오(12시)를 기준으로 추정하거나, 시각을 명시하지 않고 조회할 수 있습니다. 시각이 정확하지 않을 경우 일부 해석 정확도가 낮아질 수 있습니다.</p>
        </div>

        <div className="mb-4">
          <p className="font-[family-name:var(--font-pixel)] text-[0.8125rem] text-[#7a5830] mb-1">Q. 계정을 삭제하고 싶습니다.</p>
          <p>마이페이지에서 직접 탈퇴하실 수 있습니다. 탈퇴 시 회원 정보와 캐릭터 데이터는 개인정보처리방침에 따라 즉시 파기됩니다.</p>
        </div>

        <div className="mb-4">
          <p className="font-[family-name:var(--font-pixel)] text-[0.8125rem] text-[#7a5830] mb-1">Q. 결과를 저장하거나 공유할 수 있나요?</p>
          <p>계정에 로그인하시면 이전에 생성한 결과를 언제든 다시 열람하실 수 있습니다.</p>
        </div>

        <div>
          <p className="font-[family-name:var(--font-pixel)] text-[0.8125rem] text-[#7a5830] mb-1">Q. 개인정보는 안전하게 보호되나요?</p>
          <p>
            접근 통제, 전송 구간 암호화(HTTPS) 등 안전성 확보 조치를 시행하고
            있으며, 자세한 처리 방침은 <a href="/privacy" className="legal-link">개인정보처리방침</a>에서 확인하실 수 있습니다.
          </p>
        </div>
      </section>
    </div>
  );
}
