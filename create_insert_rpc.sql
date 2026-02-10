
-- 직접 데이터를 넣는 함수 생성 (API 캐시 우회용)
CREATE OR REPLACE FUNCTION insert_question_v3(
    p_category text,
    p_title text,
    p_option_a text,
    p_option_b text,
    p_ai_comment_a text,
    p_ai_comment_b text,
    p_ai_commentary text
)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO balance_questions (
        category, title, option_a, option_b, 
        count_a, count_b, 
        ai_comment_a, ai_comment_b, ai_commentary
    ) VALUES (
        p_category, p_title, p_option_a, p_option_b, 
        0, 0, 
        p_ai_comment_a, p_ai_comment_b, p_ai_commentary
    );
END;
$$;
