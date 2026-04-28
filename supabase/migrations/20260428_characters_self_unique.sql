-- 2026-04-28: characters.is_self partial unique index
--
-- 목적: "1메인(본인) + N타인" 정체성에서 user당 본인 캐릭터(is_self=true)는
-- 1명만 존재해야 한다. onboarding/actions.ts의 silent 가드와 함께 이중 방어.
--
-- partial unique index는 is_self=TRUE인 행에 대해서만 user_id 유니크를 강제한다.
-- 타인 캐릭터(is_self=FALSE)는 N개 허용.
--
-- 안전성: IF NOT EXISTS — 기존 데이터에 이미 user당 본인 캐릭터 1명만
-- 있으면 무중단 적용. 만약 기존 데이터에 본인 캐릭터가 2개 이상인 user가
-- 있다면 인덱스 생성이 실패하므로, 적용 전에 다음 쿼리로 점검:
--
--   SELECT user_id, COUNT(*)
--   FROM characters
--   WHERE is_self = TRUE
--   GROUP BY user_id
--   HAVING COUNT(*) > 1;
--
-- 결과가 0행이면 안전하게 적용 가능.

CREATE UNIQUE INDEX IF NOT EXISTS idx_characters_user_self_unique
  ON characters(user_id)
  WHERE is_self = TRUE;

-- 롤백:
--   DROP INDEX IF EXISTS idx_characters_user_self_unique;
