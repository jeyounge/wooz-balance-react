
-- 강력한 스키마 복구 함수
CREATE OR REPLACE FUNCTION admin_fix_schema()
RETURNS text
LANGUAGE plpgsql
AS $$
BEGIN
    -- 1. 제약 조건 삭제 (존재한다면)
    BEGIN
        ALTER TABLE balance_questions DROP CONSTRAINT balance_questions_category_check;
    EXCEPTION WHEN undefined_object THEN
        -- 존재하지 않으면 무시
        NULL;
    END;

    -- 2. 컬럼 타입 정리
    ALTER TABLE balance_questions ALTER COLUMN category TYPE text;

    -- 3. 제약 조건 재설정 (모든 카테고리 허용)
    ALTER TABLE balance_questions ADD CONSTRAINT balance_questions_category_check 
    CHECK (category IN ('food', 'love', 'work', 'extreme', 'power', 'debate', 'all'));

    RETURN 'Schema Fixed Successfully';
END;
$$;
