
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing env vars");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  const dataPath = path.join(__dirname, '../src/data/questions_v3.json');
  const rawData = fs.readFileSync(dataPath, 'utf8');
  const questions = JSON.parse(rawData);

  console.log(`🚀 Seeding ${questions.length} questions via RPC...`);

  let successCount = 0;
  for (const q of questions) {
    // Check if exists first to avoid dupes (optional, but good)
    const { data: existing } = await supabase
        .from('balance_questions')
        .select('id')
        .eq('title', q.title)
        .single();
    
    if (existing) {
        console.log(`⚠️ Skipped (Exists): ${q.title}`);
        continue;
    }

    const { error } = await supabase.rpc('insert_question_v3', {
        p_category: q.category,
        p_title: q.title,
        p_option_a: q.option_a,
        p_option_b: q.option_b,
        p_ai_comment_a: q.ai_comment_a,
        p_ai_comment_b: q.ai_comment_b,
        p_ai_commentary: q.ai_commentary
    });

    if (error) {
      console.error(`❌ Failed: ${q.title}`, error.message);
    } else {
      console.log(`✅ Added: ${q.title}`);
      successCount++;
    }
  }

  console.log(`✨ Done! Successfully added ${successCount} questions.`);
}

seed();
