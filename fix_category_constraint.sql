
-- Drop the old constraint that only allowed 'food', 'love', 'work'
ALTER TABLE balance_questions DROP CONSTRAINT IF EXISTS balance_questions_category_check;

-- Add new constraint including 'extreme', 'power', 'debate'
ALTER TABLE balance_questions ADD CONSTRAINT balance_questions_category_check 
CHECK (category IN ('food', 'love', 'work', 'extreme', 'power', 'debate'));

-- Or simpler: just drop it to allow any category in future
-- ALTER TABLE balance_questions DROP CONSTRAINT IF EXISTS balance_questions_category_check;
