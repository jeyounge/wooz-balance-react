
-- 1. 강제로 제약 조건 삭제 (오류가 나도 괜찮습니다, 메시지를 알려주세요)
ALTER TABLE balance_questions DROP CONSTRAINT balance_questions_category_check;

-- 2. 테스트 데이터 넣어보기 (성공해야 합니다)
INSERT INTO balance_questions (category, title, option_a, option_b) 
VALUES ('extreme', '제약조건 확인용 질문', 'A', 'B');

-- 3. 확인 후 테스트 데이터 삭제
DELETE FROM balance_questions WHERE title = '제약조건 확인용 질문';
