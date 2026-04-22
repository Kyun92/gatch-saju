import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "개인정보처리방침 | 갓챠사주",
  description: "갓챠사주 개인정보처리방침",
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (
    <div className="legal-doc">
      <h1 className="legal-title">개인정보처리방침</h1>
      <p className="legal-meta">시행일: 2026년 4월 20일</p>

      <section className="legal-section">
        <p>
          온아토(이하 &ldquo;회사&rdquo;)는 「개인정보 보호법」, 「정보통신망
          이용촉진 및 정보보호 등에 관한 법률」 등 관련 법령을 준수하며,
          이용자의 개인정보를 안전하게 처리하기 위해 본 개인정보처리방침을
          수립·공개합니다.
        </p>
      </section>

      <section className="legal-section">
        <h2 className="legal-h2">1. 수집하는 개인정보 항목</h2>
        <table className="legal-table">
          <thead>
            <tr>
              <th>구분</th>
              <th>항목</th>
              <th>수집 방법</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>필수 (소셜 로그인)</td>
              <td>소셜 계정 식별자, 이름, 이메일, 프로필 이미지</td>
              <td>카카오/네이버/구글 OAuth</td>
            </tr>
            <tr>
              <td>필수 (캐릭터 생성)</td>
              <td>생년월일, 출생 시각, 출생지, 성별, 캐릭터명</td>
              <td>이용자 직접 입력</td>
            </tr>
            <tr>
              <td>선택</td>
              <td>MBTI</td>
              <td>이용자 직접 입력</td>
            </tr>
            <tr>
              <td>결제</td>
              <td>주문번호, 결제수단, 결제금액, 결제일시, 결제승인정보</td>
              <td>토스페이먼츠 결제 과정</td>
            </tr>
            <tr>
              <td>자동 수집</td>
              <td>접속 로그, 접속 IP, 쿠키, 서비스 이용 기록</td>
              <td>서비스 이용 과정</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className="legal-section">
        <h2 className="legal-h2">2. 수집·이용 목적</h2>
        <ol className="legal-ol">
          <li>회원 식별 및 계정 관리</li>
          <li>운세 해석 콘텐츠 산출 및 제공</li>
          <li>유료 콘텐츠 결제 처리 및 환불</li>
          <li>서비스 이용 통계 분석 및 품질 개선</li>
          <li>부정 이용 방지 및 법적 분쟁 대응</li>
          <li>고객 문의 응대</li>
        </ol>
      </section>

      <section className="legal-section">
        <h2 className="legal-h2">3. 보유·이용 기간</h2>
        <ol className="legal-ol">
          <li>회원 정보: 회원 탈퇴 시까지. 단, 관계 법령에 따라 보존할 필요가 있는 경우 해당 기간 동안 보관합니다.</li>
          <li>결제 및 전자상거래 관련 기록:
            <ul className="legal-ul mt-1">
              <li>계약 또는 청약철회 기록: 5년 (전자상거래법)</li>
              <li>대금결제 및 재화 공급 기록: 5년 (전자상거래법)</li>
              <li>소비자 불만 또는 분쟁처리 기록: 3년 (전자상거래법)</li>
              <li>접속 로그 기록: 3개월 (통신비밀보호법)</li>
            </ul>
          </li>
          <li>캐릭터 데이터 및 조회 이력: 회원 탈퇴 시 즉시 파기</li>
        </ol>
      </section>

      <section className="legal-section">
        <h2 className="legal-h2">4. 제3자 제공</h2>
        <p>
          회사는 이용자의 개인정보를 원칙적으로 제3자에게 제공하지 않습니다.
          다만, 다음 각 호의 경우에는 예외로 합니다.
        </p>
        <ol className="legal-ol mt-2">
          <li>이용자가 사전에 동의한 경우</li>
          <li>법령의 규정에 따라 수사기관 또는 감독기관의 요구가 있는 경우</li>
        </ol>
      </section>

      <section className="legal-section">
        <h2 className="legal-h2">5. 처리 위탁</h2>
        <p>원활한 서비스 제공을 위하여 아래와 같이 개인정보 처리 업무를 위탁하고 있습니다.</p>
        <table className="legal-table">
          <thead>
            <tr>
              <th>수탁자</th>
              <th>위탁 업무</th>
              <th>위탁 정보</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>(주)토스페이먼츠</td>
              <td>결제 처리 및 환불</td>
              <td>결제 관련 정보</td>
            </tr>
            <tr>
              <td>Supabase, Inc.</td>
              <td>데이터베이스 운영</td>
              <td>회원 정보 및 캐릭터 데이터</td>
            </tr>
            <tr>
              <td>Vercel Inc.</td>
              <td>서버 호스팅 및 인프라 운영</td>
              <td>서비스 이용 데이터</td>
            </tr>
            <tr>
              <td>Google LLC</td>
              <td>클라우드 기반 콘텐츠 산출</td>
              <td>캐릭터의 생년월일시 및 출생지 (이름·연락처·결제정보 미포함)</td>
            </tr>
            <tr>
              <td>카카오/네이버/구글</td>
              <td>소셜 로그인 인증</td>
              <td>OAuth 인증 정보</td>
            </tr>
          </tbody>
        </table>
        <p className="mt-2 text-xs text-[#8a8070]">
          일부 수탁자는 해외에 소재할 수 있으며(미국 등), 위탁 목적 달성 후 지체 없이 파기됩니다.
        </p>
      </section>

      <section className="legal-section">
        <h2 className="legal-h2">6. 이용자의 권리</h2>
        <ol className="legal-ol">
          <li>이용자는 언제든지 개인정보 열람·정정·삭제·처리정지를 요구할 수 있습니다.</li>
          <li>서비스 내 마이페이지에서 계정 및 캐릭터 정보를 직접 수정·삭제할 수 있습니다.</li>
          <li>위 권리 행사와 관련된 문의는 개인정보보호책임자에게 요청할 수 있습니다.</li>
        </ol>
      </section>

      <section className="legal-section">
        <h2 className="legal-h2">7. 개인정보의 파기</h2>
        <ol className="legal-ol">
          <li>보유기간 경과, 처리목적 달성 등 개인정보가 불필요하게 된 경우 지체 없이 파기합니다.</li>
          <li>전자적 파일 형태의 정보는 복구 불가능한 방법으로 영구 삭제하며, 종이에 출력된 개인정보는 분쇄하거나 소각합니다.</li>
        </ol>
      </section>

      <section className="legal-section">
        <h2 className="legal-h2">8. 쿠키의 운영</h2>
        <p>
          회사는 로그인 상태 유지 및 서비스 이용 편의 제공을 위해 쿠키를 사용합니다.
          이용자는 브라우저 설정을 통해 쿠키 저장을 거부할 수 있으나,
          이 경우 일부 서비스 이용이 제한될 수 있습니다.
        </p>
      </section>

      <section className="legal-section">
        <h2 className="legal-h2">9. 개인정보의 안전성 확보 조치</h2>
        <ol className="legal-ol">
          <li>관리적 조치: 내부관리계획 수립·시행, 접근 권한 최소화</li>
          <li>기술적 조치: 전송 구간 암호화(HTTPS/TLS), 데이터베이스 접근통제, 보안 패치 적용</li>
          <li>물리적 조치: 서버 및 데이터 센터 보안 관리 (위탁사 정책 준수)</li>
        </ol>
      </section>

      <section className="legal-section">
        <h2 className="legal-h2">10. 개인정보보호책임자</h2>
        <div className="legal-callout">
          <p>· 책임자: 임승균</p>
          <p>· 전화: 010-6889-8909</p>
          <p>· 이메일: lsk9105@gmail.com</p>
          <p>· 담당 업무: 개인정보 처리 관련 민원 접수 및 처리</p>
        </div>
        <p className="mt-2">
          개인정보 침해에 대한 신고·상담이 필요하신 경우 아래 기관에 문의하실 수 있습니다.
        </p>
        <ul className="legal-ul mt-2">
          <li>개인정보침해신고센터 (privacy.kisa.or.kr / 국번없이 118)</li>
          <li>개인정보 분쟁조정위원회 (kopico.go.kr / 1833-6972)</li>
          <li>대검찰청 사이버수사과 (spo.go.kr / 국번없이 1301)</li>
          <li>경찰청 사이버수사국 (ecrm.cyber.go.kr / 국번없이 182)</li>
        </ul>
      </section>

      <section className="legal-section">
        <h2 className="legal-h2">11. 개정 고지</h2>
        <p>
          본 개인정보처리방침이 변경되는 경우 시행일 최소 7일 전부터 서비스 내
          공지사항을 통해 고지합니다. 다만 이용자의 권리에 중대한 변경이 있는
          경우 최소 30일 전에 고지합니다.
        </p>
      </section>
    </div>
  );
}
