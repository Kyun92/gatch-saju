---
name: db-migration
description: 갓챠사주 Supabase PostgreSQL 스키마 변경 가이드. supabase/schema.sql 수정, 무손실 마이그레이션, RLS·CASCADE·인덱스 정책, JSONB 필드 추가, 1계정 N캐릭터 FK 보존 규칙. db-migrator 에이전트가 "테이블 추가", "컬럼 추가", "스키마 변경", "마이그레이션 작성" 요청을 받았을 때 반드시 사용한다.
---

# 갓챠사주 DB 마이그레이션 가이드

## 핵심 모델 (절대 깨뜨리지 말 것)

```
users (id, name, email, image)
  ↓
characters (id, user_id, name, birth_*, gender, mbti, is_self, unlocked, free_stat_scores, free_summary)
  ↓ FK + CASCADE
charts (id, character_id, type, data JSONB)
readings (id, character_id, type, status, content, stat_scores, character_title, year, character_id_2)
payment_log (id, user_id, character_id, amount, payment_key, order_id, reading_id)
```

- **모든 캐릭터 종속 데이터는 `character_id` FK + `ON DELETE CASCADE`**.
- 궁합은 `readings.character_id_2`로 두 번째 캐릭터 참조.
- `payment_log`는 절대 삭제하지 않는다 (감사 추적). 캐릭터 삭제 시 `character_id`만 NULL 처리하거나 archive.

## 마이그레이션 패턴

### 1. 새 테이블 추가
```sql
CREATE TABLE IF NOT EXISTS new_table (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  character_id UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  -- ...
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_new_table_character_id ON new_table(character_id);
```

### 2. 새 컬럼 추가 (NOT NULL은 2단계로)

**1단계 — nullable로 추가:**
```sql
ALTER TABLE characters ADD COLUMN new_field TEXT;
UPDATE characters SET new_field = 'default_value';
```

**2단계 — 다음 배포에서 NOT NULL 적용:**
```sql
ALTER TABLE characters ALTER COLUMN new_field SET NOT NULL;
```

> 한 번에 NOT NULL을 거는 변경은 기존 행이 있는 한 실패한다. 반드시 분리.

### 3. JSONB 필드에 키 추가

JSONB는 스키마 변경이 아니므로 SQL 변경 없음. 단,

- `_workspace/03_db_changes.md`에 **"JSONB 필드 X에 키 Y 추가"**를 명시
- TypeScript 타입을 갱신해야 하므로 `api-builder`에게 알린다
- 기존 row의 JSONB에 키가 없을 수 있으므로 읽기 시 옵셔널로 처리해야 한다고 메모

### 4. 인덱스 추가

쿼리 패턴이 `WHERE character_id = ? AND type = ?` 같은 조합이면 복합 인덱스:
```sql
CREATE INDEX idx_readings_character_type ON readings(character_id, type);
```

## 변경 요약 (`03_db_changes.md`) 템플릿

```markdown
# DB 변경 요약: {기능명}

## 변경 항목
| 종류 | 대상 | 설명 |
|---|---|---|
| ADD COLUMN | characters.new_field | TEXT, nullable (1단계) |
| NEW TABLE | new_table | character 종속, CASCADE |

## 마이그레이션 단계
1. {SQL 1}
2. {SQL 2}

## 롤백 절차
- {DROP COLUMN, DROP TABLE 순서}

## 후속 작업 요청
- api-builder: TypeScript 타입 갱신 필요 (`src/types/...`)
- integration-qa: FK CASCADE 동작 확인
```

## 데이터 무결성 체크리스트

- [ ] FK + CASCADE 설정
- [ ] NOT NULL 추가는 2단계로 분리
- [ ] 인덱스: 자주 쓰이는 WHERE 절 컬럼
- [ ] payment_log / readings는 영구 보존 (soft delete만)
- [ ] 마이그레이션 SQL은 idempotent (`IF NOT EXISTS` / `IF EXISTS`)
- [ ] JSONB 필드 변경 시 읽기 측 옵셔널 처리 메모

## 금지 사항

- **기존 컬럼 삭제는 2단계로:** 1) 사용처 모두 제거 → 2) 다음 배포에서 DROP. 한 번에 DROP 금지.
- **컬럼 타입 변경은 신중:** 호환되지 않는 타입 변경(TEXT → INT 등)은 새 컬럼 추가 후 마이그레이션, 이전 컬럼 DROP의 3단계 작업.
- **service_role_key 노출 가능 코드는 작성하지 않는다.** 마이그레이션 SQL은 항상 서버 사이드 실행.
