
SELECT 
    c.conname AS constraint_name, 
    pg_get_constraintdef(c.oid) AS constraint_definition
FROM pg_constraint c
WHERE c.conrelid = 'balance_questions'::regclass;

SELECT 
    t.tgname AS trigger_name
FROM pg_trigger t
WHERE t.tgrelid = 'balance_questions'::regclass;
