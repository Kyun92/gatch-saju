/**
 * 개발 환경 전용 Mock 데이터
 * 임승균 캐릭터의 실제 감정 결과를 기반으로 생성됨
 *
 * ⚠️ 프로덕션 배포 시 USE_MOCK_READINGS=true가 아닌지 반드시 확인할 것
 */

export const MOCK_STAT_SCORES = {
  title: "심연제왕",
  love_score: 65,
  luck_score: 60,
  career_score: 88,
  health_score: 58,
  wealth_score: 90,
  vitality_score: 75,
};

const MOCK_COMPREHENSIVE = `<section class="reading-section" id="intro">
  <h2>인사 및 전체 요약</h2>
  <p>당신의 운명 지도를 가만히 들여다보면, <strong>마치 고요하고 깊은 밤바다를 홀로 항해하는 거대한 범선</strong>이 떠오릅니다.</p>
  <div class="highlight-box">
    <p><strong>[핵심 키워드]</strong> 심연의 철학자, 숨겨진 제왕의 별, 이상과 현실의 줄다리기</p>
  </div>
  <p>[개발 모드] 이 내용은 테스트용 mock 데이터입니다. 실제 Gemini API 호출 없이 UI 테스트 용도로 사용됩니다.</p>
</section>
<section class="reading-section" id="saju-analysis">
  <h2>사주 원국 분석</h2>
  <p>깊은 에너지를 일간으로 품고 태어났습니다. 이 바다는 웬만한 돌멩이가 던져져도 파동조차 일으키지 않을 만큼 속이 깊고 스케일이 큽니다.</p>
  <table class="fortune-table">
    <thead><tr><th>구분</th><th>천간</th><th>지지</th><th>십성</th></tr></thead>
    <tbody>
      <tr><td>시주</td><td>신(辛)</td><td>축(丑)</td><td>정인</td></tr>
      <tr><td>일주</td><td>임(壬)</td><td>인(寅)</td><td>식신</td></tr>
      <tr><td>월주</td><td>기(己)</td><td>유(酉)</td><td>정관</td></tr>
      <tr><td>연주</td><td>임(壬)</td><td>신(申)</td><td>비견</td></tr>
    </tbody>
  </table>
</section>
<section class="reading-section" id="five-elements">
  <h2>오행 분석</h2>
  <table class="fortune-table">
    <thead><tr><th>오행</th><th>개수</th><th>상태</th></tr></thead>
    <tbody>
      <tr><td><span class="tag tag-fire">火</span></td><td>0개</td><td>결핍</td></tr>
      <tr><td><span class="tag tag-water">水</span></td><td>2개</td><td>강함</td></tr>
      <tr><td><span class="tag tag-wood">木</span></td><td>1개</td><td>핵심 통로</td></tr>
      <tr><td><span class="tag tag-metal">金</span></td><td>3개</td><td>과다</td></tr>
      <tr><td><span class="tag tag-earth">土</span></td><td>2개</td><td>안정적</td></tr>
    </tbody>
  </table>
</section>`;

const MOCK_YEARLY = `<section id="yearly-summary">
  <h2>올해의 운세 요약</h2>
  <div class="warmth-box">
    <p>올해는 <strong>'얼음과 불꽃의 웅장한 교차'</strong>가 일어나는 역동적인 한 해입니다.</p>
  </div>
  <p>[개발 모드] 테스트용 년운 데이터입니다.</p>
</section>
<section id="yearly-monthly">
  <h2>12개월 월별 운세</h2>
  <h3>1월</h3><p>새로운 시작의 기운이 꿈틀거립니다.</p>
  <h3>2월</h3><p>대인관계에서 소소한 즐거움이 피어납니다.</p>
  <h3>3월</h3><p>에너지가 응축되며 묘한 긴장감이 흐릅니다.</p>
</section>`;

const MOCK_LOVE = `<section class="reading-section" id="love-overview">
  <h2>연애 종합 분석</h2>
  <p><strong>"잔잔하고 깊은 바다 속에 숨겨진 뜨거운 로맨티시스트"</strong></p>
  <p>[개발 모드] 테스트용 연애운 데이터입니다.</p>
</section>
<section class="reading-section" id="love-pattern">
  <h2>연애 패턴</h2>
  <p>'무한한 수용'으로 시작해 '소리 없는 상처'로 곪아갈 위험을 안고 있습니다.</p>
</section>`;

const MOCK_CAREER = `<section class="reading-section" id="career-overview">
  <h2>직업 종합 분석</h2>
  <p>세 가지 운명학의 렌즈로 들여다보면, <strong>'가을날의 깊고 지적인 바다'</strong>입니다.</p>
  <p>[개발 모드] 테스트용 직업운 데이터입니다.</p>
</section>
<section class="reading-section" id="career-fit">
  <h2>적성 업종</h2>
  <table class="fortune-table">
    <thead><tr><th>추천 직종</th><th>적합도</th></tr></thead>
    <tbody>
      <tr><td>콘텐츠 크리에이터</td><td>95%</td></tr>
      <tr><td>UX/UI 기획자</td><td>90%</td></tr>
      <tr><td>심리 상담가</td><td>85%</td></tr>
    </tbody>
  </table>
</section>`;

const MOCK_WEALTH = `<section class="reading-section" id="wealth-overview">
  <h2>재물 종합 분석</h2>
  <p>겉으로 보기엔 돈에 큰 욕심이 없는 고결한 이상주의자 같지만, 내면의 금고에는 황제의 보물이 숨겨져 있는 형국입니다.</p>
  <p>[개발 모드] 테스트용 금전운 데이터입니다.</p>
</section>`;

const MOCK_HEALTH = `<section class="reading-section" id="health-overview">
  <h2>건강 종합 분석</h2>
  <p>타고난 체질은 금수(金水) 기운이 강해 차가운 편입니다. 심혈관과 비뇨기계를 유의하세요.</p>
  <p>[개발 모드] 테스트용 건강운 데이터입니다.</p>
</section>`;

const MOCK_STUDY = `<section class="reading-section" id="study-overview">
  <h2>학업 종합 분석</h2>
  <p>깊은 사색형 학습자로, 혼자 집중할 수 있는 환경에서 능력이 극대화됩니다.</p>
  <p>[개발 모드] 테스트용 학업운 데이터입니다.</p>
</section>`;

const MOCK_COMPATIBILITY = `<section id="compat-summary">
  <h2>첫인상과 전체 요약</h2>
  <div class="highlight-box">
    <strong>종합 궁합 점수: 88점 / 100점</strong><br>
    "깊고 고요한 강물과 그 위를 비추는 따뜻한 달빛의 완벽한 조화"
  </div>
  <p>[개발 모드] 테스트용 궁합 데이터입니다.</p>
</section>`;

export const MOCK_READINGS: Record<string, string> = {
  comprehensive: MOCK_COMPREHENSIVE,
  yearly: MOCK_YEARLY,
  love: MOCK_LOVE,
  career: MOCK_CAREER,
  wealth: MOCK_WEALTH,
  health: MOCK_HEALTH,
  study: MOCK_STUDY,
  compatibility: MOCK_COMPATIBILITY,
};
