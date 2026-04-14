"""
오행 × 성별 10종 캐릭터 일괄 생성 (현대 직업 테마)
모델: gemini-3.1-flash-image-preview
"""

import os
import sys
import time
from io import BytesIO
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parent.parent / ".env")

from google import genai
from google.genai.types import GenerateContentConfig, Part
from PIL import Image

API_KEY = os.environ.get("GOOGLE_API_KEY")
if not API_KEY:
    print("GOOGLE_API_KEY not found in .env")
    sys.exit(1)

client = genai.Client(api_key=API_KEY)

BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_DIR = BASE_DIR / "model"
OUTPUT_DIR = BASE_DIR / "fortune-web" / "public" / "characters"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# 베이스 이미지 로드
bases = {}
for gender in ["male", "female"]:
    path = MODEL_DIR / f"{gender}.png"
    with open(path, "rb") as f:
        bases[gender] = f.read()

STYLE_INSTRUCTION = """첨부한 캐릭터를 기반으로 변형해줘.
그림체, 등신 비율, 픽셀 스타일은 완전히 동일하게 유지.
배경색은 반드시 #f5f0e8 (따뜻한 크림색)으로 통일."""

# 10종 캐릭터 정의 (현대 직업 테마)
CHARACTERS = [
    {
        "name": "wood-male",
        "gender": "male",
        "prompt": f"""{STYLE_INSTRUCTION}

변경 사항만:
- 직업: 건축가/디자이너
- 머리: 자연스러운 갈색 머리, 약간 헝클어진 예술가풍
- 의상: 초록색(#4caf72) 포인트의 깔끔한 캐주얼 셔츠 + 연갈색 앞치마/조끼
- 소품: 한 손에 설계 도면 롤, 다른 손에 연필
- 발밑 이펙트: 작은 나뭇잎, 연필 부스러기 파티클
- 색상 톤: 초록/갈색/크림 계열
- 배경색: #f5f0e8"""
    },
    {
        "name": "wood-female",
        "gender": "female",
        "prompt": f"""{STYLE_INSTRUCTION}

변경 사항만:
- 직업: 플로리스트/가드너
- 머리: 초록빛 갈색 긴 머리, 작은 꽃 머리핀
- 의상: 초록색(#4caf72) 앞치마 + 흰 블라우스 + 갈색 장화
- 소품: 한 손에 꽃다발, 다른 손에 작은 화분
- 발밑 이펙트: 꽃잎, 작은 풀잎 파티클
- 색상 톤: 초록/갈색/연두 계열
- 배경색: #f5f0e8"""
    },
    {
        "name": "fire-male",
        "gender": "male",
        "prompt": f"""{STYLE_INSTRUCTION}

변경 사항만:
- 직업: CEO/사업가
- 머리: 짧고 단정한 검은색-적갈색 머리, 뒤로 넘김
- 의상: 붉은색(#e05555) 넥타이 + 검은 정장 슈트 + 금색 커프스
- 소품: 한 손에 서류 가방, 자신감 있는 포즈
- 발밑 이펙트: 작은 불꽃/스파크 파티클
- 색상 톤: 빨강/검정/금색 계열
- 배경색: #f5f0e8"""
    },
    {
        "name": "fire-female",
        "gender": "female",
        "prompt": f"""{STYLE_INSTRUCTION}

변경 사항만:
- 직업: 셰프/요리사
- 머리: 붉은 갈색 머리, 단정하게 묶음
- 의상: 흰 셰프 코트 + 붉은색(#e05555) 앞치마 + 셰프 모자
- 소품: 한 손에 프라이팬, 다른 손에 국자
- 발밑 이펙트: 작은 불꽃, 증기 파티클
- 색상 톤: 빨강/흰색/금색 계열
- 배경색: #f5f0e8"""
    },
    {
        "name": "earth-male",
        "gender": "male",
        "prompt": f"""{STYLE_INSTRUCTION}

변경 사항만:
- 직업: 의사
- 머리: 단정한 갈색 짧은 머리
- 의상: 흰 가운 + 갈색/황토색(#c09050) 셔츠 + 청진기
- 소품: 한 손에 클립보드, 목에 청진기
- 발밑 이펙트: 작은 반짝이는 십자 파티클
- 색상 톤: 흰색/갈색/황토 계열
- 배경색: #f5f0e8"""
    },
    {
        "name": "earth-female",
        "gender": "female",
        "prompt": f"""{STYLE_INSTRUCTION}

변경 사항만:
- 직업: 교사/상담사
- 머리: 갈색 단발머리, 따뜻한 인상
- 의상: 갈색/황토색(#c09050) 카디건 + 흰 블라우스 + 체크 스커트
- 소품: 한 손에 책, 다른 손에 사과
- 발밑 이펙트: 작은 별, 하트 파티클
- 색상 톤: 갈색/황토/크림 계열
- 배경색: #f5f0e8"""
    },
    {
        "name": "metal-male",
        "gender": "male",
        "prompt": f"""{STYLE_INSTRUCTION}

변경 사항만:
- 직업: 변호사/검사
- 머리: 은회색 빛도는 짧은 머리, 단정하게 빗어 넘김
- 의상: 은회색(#b0b8c8) 정장 슈트 + 흰 셔츠 + 진한 네이비 넥타이
- 소품: 한 손에 법전 책, 근엄한 포즈
- 발밑 이펙트: 작은 별빛, 은빛 반짝임 파티클
- 색상 톤: 은색/네이비/흰색 계열
- 배경색: #f5f0e8"""
    },
    {
        "name": "metal-female",
        "gender": "female",
        "prompt": f"""{STYLE_INSTRUCTION}

변경 사항만:
- 직업: 엔지니어/과학자
- 머리: 은빛 긴 머리, 깔끔하게 포니테일
- 의상: 흰 연구 가운 + 은회색(#b0b8c8) 이너 + 보호 안경을 머리 위에
- 소품: 한 손에 태블릿/설계도, 다른 손에 렌치 또는 시험관
- 발밑 이펙트: 작은 톱니바퀴, 은빛 파티클
- 색상 톤: 은색/흰색/연파랑 계열
- 배경색: #f5f0e8"""
    },
    {
        "name": "water-male",
        "gender": "male",
        "prompt": f"""{STYLE_INSTRUCTION}

변경 사항만:
- 직업: 학자/교수
- 머리: 진한 남색 머리, 약간 긴 지적인 스타일
- 의상: 남색(#4a8fe0) 트위드 재킷 + 안경 + 갈색 조끼
- 소품: 한 손에 두꺼운 고서, 다른 손에 돋보기
- 발밑 이펙트: 작은 물방울, 별빛 파티클
- 색상 톤: 남색/갈색/크림 계열
- 배경색: #f5f0e8"""
    },
    {
        "name": "water-female",
        "gender": "female",
        "prompt": f"""{STYLE_INSTRUCTION}

변경 사항만:
- 직업: 점술사/작가
- 머리: 진한 남색 웨이브 긴 머리
- 의상: 남색/아쿠아(#4a8fe0) 숄 + 보헤미안 원피스 + 달 목걸이
- 소품: 한 손에 수정 구슬, 다른 손에 깃펜
- 발밑 이펙트: 물방울, 작은 별 파티클
- 색상 톤: 남색/아쿠아/크림 계열
- 배경색: #f5f0e8"""
    },
]


def generate_character(char):
    name = char["name"]
    gender = char["gender"]
    output_path = OUTPUT_DIR / f"{name}.png"

    if output_path.exists():
        print(f"  SKIP {name} (already exists)")
        return True

    print(f"  Generating {name}...")

    for attempt in range(3):
        try:
            response = client.models.generate_content(
                model="gemini-2.5-flash-image",
                contents=[
                    Part.from_bytes(data=bases[gender], mime_type="image/png"),
                    char["prompt"],
                ],
                config=GenerateContentConfig(
                    response_modalities=["IMAGE"],
                ),
            )

            for part in response.candidates[0].content.parts:
                if part.inline_data is not None:
                    img = Image.open(BytesIO(part.inline_data.data))
                    img.save(output_path)
                    print(f"  OK {name} ({img.size})")
                    return True

            print(f"  FAIL {name} — no image in response")
            return False

        except Exception as e:
            print(f"  ERROR {name} (attempt {attempt + 1}/3): {e}")
            if attempt < 2:
                wait = 10 * (attempt + 1)
                print(f"  Retrying in {wait}s...")
                time.sleep(wait)

    return False


if __name__ == "__main__":
    print(f"Output: {OUTPUT_DIR}")
    print(f"Model: gemini-2.5-flash-image")
    print(f"Total: {len(CHARACTERS)} characters\n")

    success = 0
    fail = 0

    for char in CHARACTERS:
        if generate_character(char):
            success += 1
        else:
            fail += 1

    print(f"\nDone: {success} success, {fail} fail")
