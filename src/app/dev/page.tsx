/* eslint-disable react-hooks/purity */
// dev 프리뷰 페이지 — 프로덕션 배포 대상 아님. 렌더링 순도 규칙 완화.
"use client";

import { useState } from "react";
import PixelFrame from "@/components/ui/PixelFrame";
import PixelButton from "@/components/ui/PixelButton";
import StatBar from "@/components/ui/StatBar";
import ElementTag from "@/components/ui/ElementTag";
import PixelDivider from "@/components/ui/PixelDivider";
import CharacterCard from "@/components/character/CharacterCard";
import ReadingStatSheet from "@/components/reading/ReadingStatSheet";
import ReadingTabNav from "@/components/reading/ReadingTabNav";
import PixelPageWrapper from "@/components/layout/PixelPageWrapper";

// ─── Dummy Data ─────────────────────────────────────────

const DUMMY_STATS = {
  health_score: 67,
  wealth_score: 42,
  love_score: 78,
  career_score: 85,
  vitality_score: 55,
  luck_score: 91,
  title: "달빛 현자",
};

const DUMMY_HTML = `
<section class="reading-section" id="intro">
  <h2>인사 및 전체 요약</h2>
  <p>당신은 마치 깊은 밤바다를 홀로 항해하는 등대지기입니다. 끝없는 어둠 속에서도 흔들리지 않는 빛을 지니고 있지만, 정작 자신은 그 빛이 얼마나 밝은지 모르고 있죠.</p>
  <div class="highlight-box">
    <p><strong>핵심 키워드:</strong> 깊은 직관 · 숨겨진 리더십 · 감성 지능</p>
    <p>세 체계가 공통으로 가리키는 것: 당신은 겉으로는 조용하지만 내면에 폭풍 같은 에너지를 품고 있는 사람입니다.</p>
  </div>
  <p>깊은 바다 타입(壬水)의 기운과 INFP라는 기질은 서로 자연스럽게 연결됩니다. 태어나면서부터 이 기질을 타고난 구조라고 볼 수 있어요.</p>
</section>

<section class="reading-section" id="saju-analysis">
  <h2>사주 원국 분석</h2>
  <p>당신의 타고난 기운은 '깊은 바다' 타입(壬水)입니다. 끝이 보이지 않는 수면 아래에 상상할 수 없을 만큼 복잡하고 풍부한 내면 세계가 펼쳐져 있어요.</p>
  <table class="fortune-table">
    <thead><tr><th>구분</th><th>천간</th><th>지지</th><th>십성</th><th>의미</th></tr></thead>
    <tbody>
      <tr><td>시주</td><td>庚</td><td>子</td><td>편인</td><td>직관과 영감의 원천</td></tr>
      <tr><td>일주</td><td>壬</td><td>寅</td><td>일주</td><td>당신의 본질 — 깊은 바다</td></tr>
      <tr><td>월주</td><td>己</td><td>酉</td><td>정관</td><td>사회적 책임감</td></tr>
      <tr><td>연주</td><td>壬</td><td>申</td><td>비견</td><td>독립심과 자존감</td></tr>
    </tbody>
  </table>
  <p>나무 기운(寅)이 바다 기운(壬)과 만나 성장 에너지가 넘치는 구조입니다. 단, 불꽃 기운(火)이 부족하여 행동력이 떨어질 수 있어요.</p>
</section>

<section class="reading-section" id="five-elements">
  <h2>오행 분석</h2>
  <p>끝없이 펼쳐진 깊은 바다와 같은 사주입니다. 물 기운이 넘치고, 불꽃 기운이 부족한 구조예요.</p>
  <table class="fortune-table">
    <thead><tr><th>오행</th><th>개수</th><th>비중</th><th>상태</th><th>영향</th></tr></thead>
    <tbody>
      <tr><td><span class="tag tag-fire">火</span></td><td>0</td><td>0%</td><td>부족</td><td>열정/실행력 약함</td></tr>
      <tr><td><span class="tag tag-water">水</span></td><td>3</td><td>38%</td><td>과다</td><td>지혜/감성 강함</td></tr>
      <tr><td><span class="tag tag-wood">木</span></td><td>1</td><td>12%</td><td>적정</td><td>성장 에너지</td></tr>
      <tr><td><span class="tag tag-metal">金</span></td><td>3</td><td>38%</td><td>과다</td><td>결단력/날카로움</td></tr>
      <tr><td><span class="tag tag-earth">土</span></td><td>1</td><td>12%</td><td>부족</td><td>안정감 부족</td></tr>
    </tbody>
  </table>
  <div class="advice-card">
    <p><strong>개운법:</strong> 붉은 계열 옷이나 소품으로 부족한 불꽃 기운을 보충하세요. 남쪽 방향이 길하고, 매운 음식이 도움됩니다.</p>
  </div>
</section>

<section class="reading-section" id="day-pillar">
  <h2>일주(日柱) 분석</h2>
  <p>깊은 바다 + 호랑이(壬寅 일주) — 고요한 바다 위를 성큼성큼 걷는 호랑이의 이미지예요. 겉으로는 온화하지만 내면에는 야생의 에너지가 살아 숨 쉬고 있습니다.</p>
  <p>INFP의 내향 감정(Fi) 기능과 이 일주의 관조적 성향이 시너지를 이루고 있어요. 깊은 감정의 바다에서 진짜 보물을 건져올리는 능력이 있습니다.</p>
  <blockquote class="wisdom-quote">
    <p>"고요한 바다가 실력 있는 항해사를 만들지는 않는다."</p>
  </blockquote>
</section>

<section class="reading-section" id="frank-truth">
  <h2>팩트 폭격: 솔직한 조언</h2>
  <div class="frank-box">
    <p>솔직히 말씀드리면, 생각만 하다가 날이 새는 패턴이 이 사주에 고스란히 보입니다.</p>
    <ul>
      <li><strong>우유부단함:</strong> 물 기운 과다 + INFP의 P(인식) 성향이 결합되어, 결정을 끝없이 미루는 경향</li>
      <li><strong>현실 도피:</strong> 불꽃 기운 부재로 실행력이 떨어지고, 이상 세계에 머무르려는 성향</li>
      <li><strong>자기 희생:</strong> 쇠 기운(金)의 날카로움이 자신이 아닌 타인을 위해 쓰이는 구조</li>
    </ul>
  </div>
  <div class="advice-card">
    <p><strong>처방전:</strong> 1) 매일 아침 30분 산책으로 불꽃 기운 보충 2) 결정 시한을 정하는 습관 3) '나를 위한 시간'을 반드시 확보하세요</p>
  </div>
</section>

<section class="reading-section" id="warmth">
  <h2>따뜻한 위로</h2>
  <div class="warmth-box">
    <p>여기까지 오느라 정말 수고했어요. 당신의 사주를 보면, 남들보다 훨씬 더 많은 것을 느끼고, 더 깊이 고민하고, 더 오래 상처받는 구조입니다. 그런데도 여전히 여기 서 있다는 것 자체가 대단한 거예요.</p>
  </div>
  <blockquote class="wisdom-quote">
    <p>"당신이 감당해온 깊이만큼, 당신은 이미 충분히 강한 사람입니다."</p>
  </blockquote>
</section>

<section class="reading-section" id="personality">
  <h2>성격 분석</h2>
  <p>타고난 성격의 빛: 깊은 공감 능력, 예술적 감수성, 직관적 통찰력</p>
  <p>타고난 성격의 그림자: 우유부단함, 완벽주의에 의한 마비, 감정 과부하</p>
  <p>INFP로 표현되는 당신의 성격은 사주가 이미 가리키고 있던 방향의 자연스러운 귀결입니다. 세 체계 모두 "깊이 있는 내면의 탐험가"를 가리키고 있어요.</p>
  <blockquote class="wisdom-quote">
    <p>"감정이라는 바다를 항해할 수 있는 것은, 그 바다를 가진 사람만의 특권이다."</p>
  </blockquote>
</section>

<section class="reading-section" id="career">
  <h2>직업운과 적성</h2>
  <p>커리어 하우스에 '문학과 예술의 별'이 빛나고 있어요. 여기에 INFP의 창의성이 더해지면 글쓰기/상담/예술 분야에서 강력한 교집합이 만들어집니다.</p>
  <table class="fortune-table">
    <thead><tr><th>분야</th><th>구체적 직종</th><th>적합도</th></tr></thead>
    <tbody>
      <tr><td>창작/예술</td><td>작가, 디자이너, 음악가</td><td>★★★★★</td></tr>
      <tr><td>상담/교육</td><td>심리상담사, 코치, 교사</td><td>★★★★☆</td></tr>
      <tr><td>기획/전략</td><td>콘텐츠 기획, 마케터</td><td>★★★☆☆</td></tr>
      <tr><td>피해야 할 분야</td><td>영업, 현장 관리직</td><td></td></tr>
    </tbody>
  </table>
  <div class="advice-card">
    <p><strong>커리어 팁:</strong> 지금 당장 매일 30분씩 글을 쓰세요. 블로그든, 일기든, 소설이든. 문학의 별이 이미 빛나고 있으니 연료만 넣어주면 됩니다.</p>
  </div>
</section>

<section class="reading-section" id="wealth">
  <h2>재물운</h2>
  <p>재물 하우스에 안정적인 에너지가 흐르고 있어요. 큰 부자보다는 안정적인 수입을 만드는 구조입니다.</p>
  <table class="fortune-table">
    <thead><tr><th>항목</th><th>추천</th><th>비추천</th></tr></thead>
    <tbody>
      <tr><td>투자 방식</td><td>적립식, 장기 투자</td><td>단타, 레버리지</td></tr>
      <tr><td>자산 관리</td><td>부동산, 저축</td><td>투기성 자산</td></tr>
      <tr><td>재물 개운</td><td>파란색 지갑</td><td>빨간색 지갑</td></tr>
    </tbody>
  </table>
  <blockquote class="wisdom-quote">
    <p>"물은 낮은 곳으로 흐르듯, 당신의 재물도 겸손한 곳에서 모입니다."</p>
  </blockquote>
</section>

<section class="reading-section" id="relationships">
  <h2>️ 이성운과 인간관계</h2>
  <p>배우자 하우스에 따뜻한 에너지가 자리잡고 있어요. 깊은 정서적 교감을 나눌 수 있는 파트너를 만날 운명입니다.</p>
  <table class="fortune-table">
    <thead><tr><th>관계</th><th>특징</th><th>조언</th></tr></thead>
    <tbody>
      <tr><td>이성/배우자</td><td>깊은 교감형</td><td>ENFJ가 사주적 귀인 — 부족한 불꽃 기운을 보충</td></tr>
      <tr><td>귀인 인연</td><td>나이 많은 멘토</td><td>윗사람의 조언을 경청하세요</td></tr>
      <tr><td>피해야 할 인연</td><td>에너지 뱀파이어</td><td>과도한 감정 소모를 요구하는 관계 주의</td></tr>
    </tbody>
  </table>
</section>

<section class="reading-section" id="health">
  <h2>건강 · 방위 · 거주</h2>
  <p>물 기운 과다로 신장과 방광 계통에 주의가 필요합니다. 손발이 차가운 체질이에요.</p>
  <table class="fortune-table">
    <thead><tr><th>항목</th><th>길(吉)</th><th>흉(凶)</th></tr></thead>
    <tbody>
      <tr><td>방위</td><td>남쪽, 동쪽</td><td>북쪽</td></tr>
      <tr><td>거주 환경</td><td>햇볕 잘 드는 곳</td><td>습하고 어두운 곳</td></tr>
      <tr><td>주의 건강</td><td>족욕, 반신욕</td><td>찬 음식 과다 섭취</td></tr>
    </tbody>
  </table>
</section>

<section class="reading-section" id="guide">
  <h2>종합 개운법</h2>
  <div class="warmth-box">
    <p>당신은 이미 깊은 바다를 품고 있는 사람입니다. 이제 필요한 건 그 바다에 불꽃 하나를 띄우는 것뿐이에요.</p>
  </div>
  <table class="fortune-table">
    <thead><tr><th>항목</th><th>개운 키워드</th></tr></thead>
    <tbody>
      <tr><td>행운의 색</td><td>빨강, 주황 (부족한 불꽃 기운 보충)</td></tr>
      <tr><td>행운의 숫자</td><td>3, 7</td></tr>
      <tr><td>행운의 방향</td><td>남쪽</td></tr>
      <tr><td>일상 개운</td><td>매일 아침 산책, 매운 음식</td></tr>
      <tr><td>마음 개운</td><td>매일 감사일기 3줄 쓰기</td></tr>
      <tr><td>재물 개운</td><td>파란 지갑에 빨간 참 달기</td></tr>
      <tr><td>관계 개운</td><td>에너지 높은 친구와 주 1회 만남</td></tr>
    </tbody>
  </table>
  <blockquote class="wisdom-quote">
    <p>"오늘 한 걸음이 운명을 바꿉니다. 당신은 이미 충분히 준비되어 있어요."</p>
  </blockquote>
</section>
`;

// ─── Page Sections ──────────────────────────────────────

type Section = "components" | "login" | "reading" | "daily" | "onboarding";

export default function DevPreviewPage() {
  const [section, setSection] = useState<Section>("reading");

  return (
    <div style={{ backgroundColor: "#f5f0e8", minHeight: "100vh" }}>
      {/* Dev Nav */}
      <div
        className="sticky top-0 z-50 flex gap-2 p-3 overflow-x-auto"
        style={{ backgroundColor: "#f5f0e8", borderBottom: "2px solid #b8944c" }}
      >
        {(
          [
            ["reading", "📊 종합감정"],
            ["daily", "일일운세"],
            ["login", "🏠 로그인"],
            ["onboarding", "온보딩"],
            ["components", "🧩 컴포넌트"],
          ] as [Section, string][]
        ).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setSection(key)}
            className="shrink-0 px-3 py-1.5 text-xs"
            style={{
              fontFamily: "var(--font-pixel)",
              color: section === key ? "#b8883c" : "#8a8070",
              backgroundColor: section === key ? "rgba(184,136,60,0.12)" : "transparent",
              border: section === key ? "2px solid #b8883c" : "2px solid #d4c4a0",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {section === "reading" && <ReadingPreview />}
      {section === "daily" && <DailyPreview />}
      {section === "login" && <LoginPreview />}
      {section === "onboarding" && <OnboardingPreview />}
      {section === "components" && <ComponentGallery />}
    </div>
  );
}

// ─── Reading Preview ────────────────────────────────────

function ReadingPreview() {
  return (
    <PixelPageWrapper>
      <div className="flex flex-col gap-6 py-6">
        {/* Header */}
        <div className="text-center">
          <p style={{ fontFamily: "var(--font-pixel)", color: "#8a8070", fontSize: "0.75rem" }}>
            2026.04.13 종합 사주감정
          </p>
          <h1 style={{ fontFamily: "var(--font-pixel)", color: "#b8883c", fontSize: "1.25rem" }}>
            홍길동님의 운명의 서
          </h1>
        </div>

        {/* Stat Sheet with character image */}
        <ReadingStatSheet
          statScores={DUMMY_STATS}
          characterTitle="달빛 현자"
          dayMaster="壬水"
          level={32}
          gender="male"
          element="water"
        />

        {/* Female variant example */}
        <PixelDivider label="여성 캐릭터 예시" />
        <ReadingStatSheet
          statScores={{ ...DUMMY_STATS, love_score: 92, career_score: 68, title: "불꽃 마법사" }}
          characterTitle="불꽃 마법사"
          dayMaster="丙火"
          level={28}
          gender="female"
          element="fire"
        />

        {/* Tabs + Content */}
        <PixelFrame variant="default" className="p-4">
          <ReadingTabNav htmlContent={DUMMY_HTML} />
        </PixelFrame>
      </div>
    </PixelPageWrapper>
  );
}

// ─── Daily Preview ──────────────────────────────────────

function DailyPreview() {
  return (
    <PixelPageWrapper>
      <div className="flex flex-col gap-4 py-6">
        <div className="text-center">
          <h1 style={{ fontFamily: "var(--font-pixel)", color: "#b8883c", fontSize: "1.25rem" }}>
            오늘의 퀘스트
          </h1>
          <p style={{ fontFamily: "var(--font-pixel)", color: "#8a8070", fontSize: "0.75rem" }}>
            2026년 4월 13일 (일) · 丙午일
          </p>
        </div>

        <PixelFrame variant="accent" className="p-5">
          <div className="flex flex-col gap-4">
            <div>
              <h3 style={{ fontFamily: "var(--font-pixel)", color: "#d04040", fontSize: "0.85rem" }}>
                오늘의 기운
              </h3>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: "#2c2418" }}>
                활활 타오르는 불꽃 기운이 당신의 행동력을 끌어올리는 날입니다. 평소 미뤄왔던 일을 시작하기에 최적의 타이밍이에요.
              </p>
            </div>

            <PixelDivider />

            <div>
              <h3 style={{ fontFamily: "var(--font-pixel)", color: "#c8a020", fontSize: "0.85rem" }}>
                주의할 점
              </h3>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: "#2c2418" }}>
                급한 결정은 피하세요. 불꽃이 강한 날이라 감정적으로 치우칠 수 있어요. INFP인 당신에게는 특히 혼자 정리하는 시간이 필요합니다.
              </p>
            </div>

            <PixelDivider />

            {/* Lucky Items */}
            <div>
              <h3 style={{ fontFamily: "var(--font-pixel)", color: "#2e8b4e", fontSize: "0.85rem" }}>
                행운 아이템
              </h3>
              <div className="grid grid-cols-3 gap-2 mt-3">
                {[
                  { icon: "🔴", label: "행운의 색", value: "빨강" },
                  { icon: "🧭", label: "행운의 방위", value: "남쪽" },
                  { icon: "🔢", label: "행운의 숫자", value: "7" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="pixel-frame-simple p-3 text-center"
                    style={{ backgroundColor: "#faf7f2" }}
                  >
                    <div className="text-2xl mb-1">{item.icon}</div>
                    <div style={{ fontFamily: "var(--font-pixel)", color: "#8a8070", fontSize: "0.6rem" }}>
                      {item.label}
                    </div>
                    <div style={{ fontFamily: "var(--font-pixel)", color: "#b8883c", fontSize: "0.75rem" }}>
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <PixelDivider />

            <div>
              <h3 style={{ fontFamily: "var(--font-pixel)", color: "#6858b8", fontSize: "0.85rem" }}>
                💡 오늘의 실천 팁
              </h3>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: "#2c2418" }}>
                점심에 따뜻한 차를 한 잔 마시면서 오늘 하루의 우선순위 3개만 적어보세요. 작은 불꽃 하나가 큰 변화를 만듭니다.
              </p>
            </div>
          </div>
        </PixelFrame>

        {/* CTA */}
        <PixelFrame variant="simple" className="p-4 text-center">
          <p style={{ fontFamily: "var(--font-pixel)", color: "#9a7040", fontSize: "0.8rem" }}>
            더 깊은 운명의 서를 펼쳐보세요
          </p>
          <p className="text-xs mt-1" style={{ color: "#8a8070" }}>
            종합 사주감정 — 990원
          </p>
          <PixelButton variant="primary" className="mt-3">
            종합감정 받기
          </PixelButton>
        </PixelFrame>
      </div>
    </PixelPageWrapper>
  );
}

// ─── Login Preview ──────────────────────────────────────

function LoginPreview() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="text-center mb-12">
        <h1
          className="text-4xl mb-3 inline-block px-6 py-2"
          style={{
            fontFamily: "var(--font-pixel)",
            color: "#c8a020",
            textShadow: "0 0 16px rgba(200,160,32,0.5), 0 0 32px rgba(200,160,32,0.25)",
          }}
        >
          갓챠사주
        </h1>
        <p style={{ fontFamily: "var(--font-pixel)", color: "#9a7040", fontSize: "1.1rem" }}>
          네 운명, 한 판 뽑아봐
        </p>
      </div>

      <PixelFrame variant="accent" className="w-full max-w-sm p-6">
        <div className="flex flex-col gap-4">
          <p className="text-center text-sm mb-2" style={{ fontFamily: "var(--font-pixel)", color: "#4a3e2c" }}>
            캡슐을 뽑으려면 로그인하세요
          </p>

          <button
            className="pixel-btn w-full px-5 py-3 text-sm"
            style={{
              fontFamily: "var(--font-pixel)",
              backgroundColor: "#FEE500", color: "#191919",
              border: "2px solid #E5CF00", borderBottomWidth: "4px",
            }}
          >
            카카오로 시작하기
          </button>

          <button
            className="pixel-btn w-full px-5 py-3 text-sm"
            style={{
              fontFamily: "var(--font-pixel)",
              backgroundColor: "#03C75A", color: "#FFFFFF",
              border: "2px solid #02A84C", borderBottomWidth: "4px",
            }}
          >
            네이버로 시작하기
          </button>

          <button
            className="pixel-btn w-full px-5 py-3 text-sm"
            style={{
              fontFamily: "var(--font-pixel)",
              backgroundColor: "#FFFFFF", color: "#333333",
              border: "2px solid #DDDDDD", borderBottomWidth: "4px",
            }}
          >
            Google로 시작하기
          </button>
        </div>
      </PixelFrame>

      <p
        className="mt-10 text-sm"
        style={{
          fontFamily: "var(--font-pixel)", color: "#8a8070",
          animation: "blink 1.2s step-end infinite",
        }}
      >
        다음 캡슐엔 뭐가 들었을까
      </p>
    </div>
  );
}

// ─── Onboarding Preview ─────────────────────────────────

function OnboardingPreview() {
  const [step, setStep] = useState(1);

  return (
    <PixelPageWrapper>
      <div className="flex flex-col gap-6 py-6">
        <PixelFrame variant="accent" className="p-4 text-center">
          <h1 style={{ fontFamily: "var(--font-pixel)", color: "#b8883c", fontSize: "1.1rem" }}>
            캐릭터 생성
          </h1>
        </PixelFrame>

        {/* Progress */}
        <div className="flex items-center justify-center gap-3">
          {[1, 2, 3].map((s) => (
            <button
              key={s}
              onClick={() => setStep(s)}
              className="flex items-center gap-1"
            >
              <span
                className="w-4 h-4 flex items-center justify-center text-xs"
                style={{
                  fontFamily: "var(--font-pixel)",
                  color: step >= s ? "#b8883c" : "#a09888",
                  border: `2px solid ${step >= s ? "#b8883c" : "#a09888"}`,
                  backgroundColor: step === s ? "rgba(184,136,60,0.15)" : "transparent",
                }}
              >
                {s}
              </span>
              <span style={{ fontFamily: "var(--font-pixel)", color: step >= s ? "#4a3e2c" : "#a09888", fontSize: "0.65rem" }}>
                {s === 1 ? "이름" : s === 2 ? "탄생" : "확인"}
              </span>
            </button>
          ))}
        </div>

        <PixelFrame variant="default" className="p-5">
          {step === 1 && (
            <div className="flex flex-col gap-4">
              <label style={{ fontFamily: "var(--font-pixel)", color: "#9a7040", fontSize: "0.8rem" }}>
                모험가의 이름
              </label>
              <input
                type="text"
                placeholder="이름을 입력하세요"
                defaultValue="홍길동"
                className="w-full px-4 py-3 text-sm"
                style={{
                  fontFamily: "var(--font-pixel)",
                  backgroundColor: "#f0ebe0",
                  color: "#2c2418",
                  border: "2px solid #b8944c",
                  outline: "none",
                }}
              />
              <PixelButton variant="primary" onClick={() => setStep(2)} className="mt-2">
                다음 →
              </PixelButton>
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col gap-4">
              <label style={{ fontFamily: "var(--font-pixel)", color: "#9a7040", fontSize: "0.8rem" }}>
                탄생의 시간
              </label>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="block text-xs mb-1" style={{ color: "#8a8070" }}>생년월일</span>
                  <input
                    type="date"
                    defaultValue="1992-09-23"
                    className="w-full px-3 py-2 text-xs"
                    style={{ fontFamily: "var(--font-pixel)", backgroundColor: "#f0ebe0", color: "#2c2418", border: "2px solid #b8944c" }}
                  />
                </div>
                <div>
                  <span className="block text-xs mb-1" style={{ color: "#8a8070" }}>출생시간</span>
                  <select
                    defaultValue="01:00"
                    className="w-full px-3 py-2 text-xs"
                    style={{ fontFamily: "var(--font-pixel)", backgroundColor: "#f0ebe0", color: "#2c2418", border: "2px solid #b8944c" }}
                  >
                    <option value="01:00">01:00 (축시)</option>
                    <option value="06:00">06:00 (묘시)</option>
                    <option value="12:00">12:00 (오시)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="block text-xs mb-1" style={{ color: "#8a8070" }}>출생도시</span>
                  <select
                    defaultValue="서울"
                    className="w-full px-3 py-2 text-xs"
                    style={{ fontFamily: "var(--font-pixel)", backgroundColor: "#f0ebe0", color: "#2c2418", border: "2px solid #b8944c" }}
                  >
                    <option>서울</option>
                    <option>부산</option>
                    <option>대구</option>
                  </select>
                </div>
                <div>
                  <span className="block text-xs mb-1" style={{ color: "#8a8070" }}>성별</span>
                  <div className="flex gap-3 mt-1">
                    <label className="flex items-center gap-1 text-xs" style={{ fontFamily: "var(--font-pixel)", color: "#2c2418" }}>
                      <input type="radio" name="gender" defaultChecked /> 남
                    </label>
                    <label className="flex items-center gap-1 text-xs" style={{ fontFamily: "var(--font-pixel)", color: "#2c2418" }}>
                      <input type="radio" name="gender" /> 여
                    </label>
                  </div>
                </div>
              </div>

              {/* MBTI */}
              <div>
                <span className="block text-xs mb-1" style={{ color: "#8a8070" }}>MBTI (선택)</span>
                <select
                  defaultValue="INFP"
                  className="w-full px-3 py-2 text-xs"
                  style={{ fontFamily: "var(--font-pixel)", backgroundColor: "#f0ebe0", color: "#2c2418", border: "2px solid #b8944c" }}
                >
                  <option value="">모르겠어요</option>
                  {["INFP","INFJ","INTP","INTJ","ISFP","ISFJ","ISTP","ISTJ","ENFP","ENFJ","ENTP","ENTJ","ESFP","ESFJ","ESTP","ESTJ"].map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2 mt-2">
                <PixelButton variant="secondary" onClick={() => setStep(1)}>
                  ← 이전
                </PixelButton>
                <PixelButton variant="primary" onClick={() => setStep(3)} className="flex-1">
                  다음 →
                </PixelButton>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col gap-4 items-center">
              <p style={{ fontFamily: "var(--font-pixel)", color: "#9a7040", fontSize: "0.8rem" }}>
                당신의 운명이 밝혀졌습니다
              </p>

              <CharacterCard
                avatarUrl="/characters/water-male.png"
                dayMaster="壬水"
                level={32}
                title="물결의 점술사"
                element="water"
              />

              <p className="text-center text-sm" style={{ color: "#4a3e2c" }}>
                깊은 바다 타입 · INFP
              </p>
              <p className="text-center text-xs" style={{ color: "#8a8070" }}>
                &quot;당신의 모험이 시작됩니다&quot;
              </p>

              <div className="flex gap-2 w-full mt-2">
                <PixelButton variant="secondary" onClick={() => setStep(2)}>
                  ← 이전
                </PixelButton>
                <PixelButton variant="primary" className="flex-1">
                  ▶ 모험 시작하기
                </PixelButton>
              </div>
            </div>
          )}
        </PixelFrame>
      </div>
    </PixelPageWrapper>
  );
}

// ─── Component Gallery ──────────────────────────────────

function ComponentGallery() {
  return (
    <PixelPageWrapper>
      <div className="flex flex-col gap-8 py-6">
        <h1 style={{ fontFamily: "var(--font-pixel)", color: "#b8883c", fontSize: "1.25rem" }}>
          🧩 컴포넌트 갤러리
        </h1>

        {/* Pixel Frames */}
        <section>
          <h2 style={{ fontFamily: "var(--font-pixel)", color: "#9a7040", fontSize: "0.9rem", marginBottom: 12 }}>
            PixelFrame
          </h2>
          <div className="flex flex-col gap-4">
            <PixelFrame variant="default" className="p-4">
              <p style={{ color: "#2c2418", fontSize: "0.85rem" }}>Default Frame — 기본 프레임</p>
            </PixelFrame>
            <PixelFrame variant="accent" className="p-4">
              <p style={{ color: "#2c2418", fontSize: "0.85rem" }}>Accent Frame — 강조 프레임</p>
            </PixelFrame>
            <PixelFrame variant="simple" className="p-4">
              <p style={{ color: "#2c2418", fontSize: "0.85rem" }}>Simple Frame — 심플 프레임</p>
            </PixelFrame>
          </div>
        </section>

        {/* Buttons */}
        <section>
          <h2 style={{ fontFamily: "var(--font-pixel)", color: "#9a7040", fontSize: "0.9rem", marginBottom: 12 }}>
            PixelButton
          </h2>
          <div className="flex flex-wrap gap-3">
            <PixelButton variant="primary">Primary</PixelButton>
            <PixelButton variant="secondary">Secondary</PixelButton>
            <PixelButton variant="danger">Danger</PixelButton>
            <PixelButton variant="wood">木</PixelButton>
            <PixelButton variant="fire">火</PixelButton>
            <PixelButton variant="earth">土</PixelButton>
            <PixelButton variant="metal">金</PixelButton>
            <PixelButton variant="water">水</PixelButton>
          </div>
          <div className="flex flex-wrap gap-3 mt-3">
            <PixelButton variant="primary" size="sm">Small</PixelButton>
            <PixelButton variant="primary" size="md">Medium</PixelButton>
            <PixelButton variant="primary" size="lg">Large</PixelButton>
            <PixelButton variant="primary" disabled>Disabled</PixelButton>
          </div>
        </section>

        {/* Stat Bars */}
        <section>
          <h2 style={{ fontFamily: "var(--font-pixel)", color: "#9a7040", fontSize: "0.9rem", marginBottom: 12 }}>
            StatBar
          </h2>
          <PixelFrame variant="default" className="p-4">
            <div className="flex flex-col gap-3">
              <StatBar icon="" label="생명력" value={67} color="#d04040" />
              <StatBar icon="" label="재물운" value={42} color="#3070c0" />
              <StatBar icon="" label="연애운" value={78} color="#d06890" />
              <StatBar icon="" label="직업운" value={85} color="#6858b8" />
              <StatBar icon="" label="건강" value={55} color="#2e8b4e" />
              <StatBar icon="" label="행운" value={91} color="#c8a020" />
            </div>
          </PixelFrame>
        </section>

        {/* Element Tags */}
        <section>
          <h2 style={{ fontFamily: "var(--font-pixel)", color: "#9a7040", fontSize: "0.9rem", marginBottom: 12 }}>
            ElementTag
          </h2>
          <div className="flex flex-wrap gap-3">
            <ElementTag element="wood" />
            <ElementTag element="fire" />
            <ElementTag element="earth" />
            <ElementTag element="metal" />
            <ElementTag element="water" />
          </div>
          <div className="flex flex-wrap gap-3 mt-2">
            <ElementTag element="wood" size="sm" />
            <ElementTag element="fire" size="sm" />
            <ElementTag element="earth" size="sm" />
            <ElementTag element="metal" size="sm" />
            <ElementTag element="water" size="sm" />
          </div>
        </section>

        {/* Character Card */}
        <section>
          <h2 style={{ fontFamily: "var(--font-pixel)", color: "#9a7040", fontSize: "0.9rem", marginBottom: 12 }}>
            CharacterCard
          </h2>
          <div className="flex flex-col gap-4">
            <CharacterCard avatarUrl="/characters/water-male.png" dayMaster="壬水" level={32} title="바다의 마법사" element="water" />
            <CharacterCard avatarUrl="/characters/fire-female.png" dayMaster="丙火" level={28} title="불꽃 마법사" element="fire" />
            <CharacterCard avatarUrl="/characters/wood-female.png" dayMaster="甲木" level={45} title="숲의 드루이드" element="wood" />
            <CharacterCard avatarUrl="/characters/metal-male.png" dayMaster="庚金" level={19} title="강철 검사" element="metal" />
            <CharacterCard avatarUrl="/characters/earth-male.png" dayMaster="戊土" level={37} title="대지의 기사" element="earth" />
          </div>
          <h3 className="mt-4" style={{ fontFamily: "var(--font-pixel)", color: "#8a8070", fontSize: "0.75rem" }}>
            전체 10종
          </h3>
          <div className="grid grid-cols-2 gap-3 mt-2">
            {([
              { el: "wood", g: "male", dm: "甲木", t: "숲의 궁수" },
              { el: "wood", g: "female", dm: "乙木", t: "숲의 드루이드" },
              { el: "fire", g: "male", dm: "丙火", t: "불꽃 전사" },
              { el: "fire", g: "female", dm: "丁火", t: "불꽃 마법사" },
              { el: "earth", g: "male", dm: "戊土", t: "대지의 기사" },
              { el: "earth", g: "female", dm: "己土", t: "대지의 현자" },
              { el: "metal", g: "male", dm: "庚金", t: "강철 검사" },
              { el: "metal", g: "female", dm: "辛金", t: "백은 성기사" },
              { el: "water", g: "male", dm: "壬水", t: "바다의 마법사" },
              { el: "water", g: "female", dm: "癸水", t: "물결의 점술사" },
            ] as const).map((c) => (
              <CharacterCard
                key={`${c.el}-${c.g}`}
                avatarUrl={`/characters/${c.el}-${c.g}.png`}
                dayMaster={c.dm}
                level={Math.floor(Math.random() * 30) + 20}
                title={c.t}
                element={c.el}
              />
            ))}
          </div>
        </section>

        {/* Divider */}
        <section>
          <h2 style={{ fontFamily: "var(--font-pixel)", color: "#9a7040", fontSize: "0.9rem", marginBottom: 12 }}>
            PixelDivider
          </h2>
          <PixelDivider />
          <div className="my-3" />
          <PixelDivider label="또는" />
        </section>
      </div>
    </PixelPageWrapper>
  );
}
