
-- Create a new table for individual votes
CREATE TABLE IF NOT EXISTS balance_votes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    question_id BIGINT REFERENCES balance_questions(id) ON DELETE CASCADE,
    choice TEXT CHECK (choice IN ('A', 'B')),
    gender TEXT CHECK (gender IN ('M', 'F')),
    age_group TEXT CHECK (age_group IN ('10s', '20s', '30s', '40s+')),
    mbti TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable RLS
ALTER TABLE balance_votes ENABLE ROW LEVEL SECURITY;

-- Allow public insert (for voting)
CREATE POLICY "Allow public insert votes" 
ON balance_votes FOR INSERT 
TO public 
WITH CHECK (true);

-- Allow public read (for stats)
CREATE POLICY "Allow public select votes" 
ON balance_votes FOR SELECT 
TO public 
USING (true);

-- Functions to get stats (Optional, but useful for performance)
-- You can query directly too, but RPC might be cleaner for intricate grouping.
-- For now, we will query directly in the frontend for flexibility.
