-- Migration: Dual AI Commentary
-- 1. Add new columns for balanced commentary
ALTER TABLE balance_questions 
ADD COLUMN IF NOT EXISTS ai_comment_a text,
ADD COLUMN IF NOT EXISTS ai_comment_b text;

-- 2. Migrate existing data (Optional: move old content to A or B temporarily)
-- UPDATE balance_questions SET ai_comment_a = ai_commentary WHERE ai_comment_a IS NULL;

-- 3. Drop old column (If you want to clean up, but keeping it for backup is safer)
-- ALTER TABLE balance_questions DROP COLUMN ai_commentary;
