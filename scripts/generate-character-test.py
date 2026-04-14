"""
wood-female 캐릭터 1종 테스트 생성
베이스 여성 이미지 + 프롬프트 → Gemini 2.5 Flash Image
"""

import os
import sys
from io import BytesIO
from pathlib import Path
from dotenv import load_dotenv

# .env 로드
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

# 베이스 여성 이미지 로드
base_image_path = MODEL_DIR / "female.png"
with open(base_image_path, "rb") as f:
    base_image_bytes = f.read()

prompt = """첨부한 캐릭터를 기반으로 숲/자연 테마로 변형해줘.
그림체, 등신 비율, 배경, 픽셀 스타일은 완전히 동일하게 유지.

변경 사항만:
- 머리: 초록색 긴 머리, 꽃 화관
- 의상: 초록/갈색 드루이드 로브
- 장비: 왼손에 나무 지팡이 (끝에 초록 빛 구슬)
- 어깨 근처에 작은 정령 동물 (하얀 토끼/사슴 등)
- 발밑 이펙트: 풀잎, 꽃, 반짝이는 파티클
- 색상 톤: 초록(#4caf72)/갈색/연두 계열"""

print("Generating wood-female...")
print(f"Model: gemini-3.1-flash-image-preview")
print(f"Base image: {base_image_path}")

response = client.models.generate_content(
    model="gemini-2.5-flash-image",
    contents=[
        Part.from_bytes(data=base_image_bytes, mime_type="image/png"),
        prompt,
    ],
    config=GenerateContentConfig(
        response_modalities=["IMAGE"],
    ),
)

# 결과 이미지 저장
saved = False
for part in response.candidates[0].content.parts:
    if part.inline_data is not None:
        output_path = OUTPUT_DIR / "wood-female-2.5.png"
        img = Image.open(BytesIO(part.inline_data.data))
        img.save(output_path)
        print(f"Saved: {output_path}")
        print(f"Size: {img.size}")
        saved = True

if not saved:
    print("No image generated. Response:")
    for part in response.candidates[0].content.parts:
        if part.text:
            print(part.text)
