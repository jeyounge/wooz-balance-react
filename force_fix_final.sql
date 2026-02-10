
-- 1. 제약 조건 삭제 (이전 이름이 남아있을 수 있으므로)
ALTER TABLE balance_questions DROP CONSTRAINT IF EXISTS balance_questions_category_check;

-- 2. 컬럼 타입 강제 지정 (ENUM 문제 방지)
ALTER TABLE balance_questions ALTER COLUMN category TYPE text;

-- 3. 올바른 제약 조건 다시 추가 (모든 카테고리 포함)
ALTER TABLE balance_questions ADD CONSTRAINT balance_questions_category_check 
CHECK (category IN ('food', 'love', 'work', 'extreme', 'power', 'debate', 'all'));

-- 4. 캐시 리로드
NOTIFY pgrst, 'reload config';
