
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ES Module dirname fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Supabase (Use VITE props if available, otherwise process.env)
// Note: Hardcoding or reading from .env is needed here since it's a node script
// I will attempt to read the values from the existing src/supabaseClient.js or use placeholders
// For now, I will assume the user has these in .env.local or I need to provide them.
// Actually, to make it seamless, let's grab the URL/KEY from the file if possible, 
// but parsing JS is hard.
// Let's assume standard VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY env vars are present or I can pass them.

// For this environment, I'll read from .env if it exists, otherwise I might fail.
// IMPORTANT: I need the actual keys to run this.
// I can view the .env file first? No, security.
// I will try to use the VITE_ env vars which are usually exposable.

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Error: Missing env vars VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY");
  console.log("Usage: VITE_SUPABASE_URL=... VITE_SUPABASE_ANON_KEY=... node scripts/seed_v3.js");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  const dataPath = path.join(__dirname, '../src/data/questions_v3.json');
  const rawData = fs.readFileSync(dataPath, 'utf8');
  const questions = JSON.parse(rawData);

  console.log(`🚀 Seeding ${questions.length} questions...`);

  let successCount = 0;
  for (const q of questions) {
    const { data, error } = await supabase
      .from('balance_questions')
      .insert([{
        category: q.category,
        title: q.title,
        option_a: q.option_a,
        option_b: q.option_b,
        ai_comment_a: q.ai_comment_a,
        ai_comment_b: q.ai_comment_b,
        ai_commentary: q.ai_commentary, // Added
        count_a: 0,
        count_b: 0
      }]);

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
