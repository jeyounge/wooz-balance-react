-- 1. Create Comments Table
CREATE TABLE IF NOT EXISTS balance_comments (
    id bigint generated always as identity primary key,
    question_id bigint not null references balance_questions(id) on delete cascade,
    content text not null,
    nickname text default 'ㅇㅇ',
    password text not null, -- Required for deletion
    ip_address text,        -- Masked IP (e.g. 123.456.***.***)
    created_at timestamptz default now()
);

-- 2. Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_balance_comments_question_id 
ON balance_comments(question_id);

-- 3. RPC: Verify Password and Delete
-- This function allows safe deletion from client-side by checking password
CREATE OR REPLACE FUNCTION verify_and_delete_comment(
    target_id bigint, 
    input_password text
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    deleted_count int;
BEGIN
    DELETE FROM balance_comments
    WHERE id = target_id 
      AND password = input_password;
      
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    
    RETURN deleted_count > 0;
END;
$$;
