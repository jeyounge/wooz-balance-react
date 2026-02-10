
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

async function run() {
  console.log("🛠️ Triggering Admin Schema Fix...");
  
  const { data, error } = await supabase.rpc('admin_fix_schema');
  
  if (error) {
    console.error("❌ Fix Failed:", error.message);
    // Proceed anyway, maybe it fixed something? 
  } else {
    console.log("✅ Fix Success:", data);
  }

  // Reload config just in case
  // await supabase.rpc('reload_config'); // If such function existed

  console.log("🚀 Starting Seed (v3)...");
  
  const dataPath = path.join(__dirname, '../src/data/questions_v3.json');
  const rawData = fs.readFileSync(dataPath, 'utf8');
  const questions = JSON.parse(rawData);

  let successCount = 0;
  for (const q of questions) {
    // Check existence
    const { data: existing } = await supabase
        .from('balance_questions')
        .select('id')
        .eq('title', q.title)
        .single();
    
    if (existing) {
        // console.log(`Skipped: ${q.title}`);
        continue;
    }

    const { error: insertError } = await supabase
      .from('balance_questions')
      .insert([{
        category: q.category,
        title: q.title,
        option_a: q.option_a,
        option_b: q.option_b,
        ai_comment_a: q.ai_comment_a,
        ai_comment_b: q.ai_comment_b,
        ai_commentary: q.ai_commentary,
        count_a: 0,
        count_b: 0
      }]);

    if (insertError) {
      console.error(`❌ Failed '${q.category}': ${q.title} -> ${insertError.message}`);
    } else {
      console.log(`✅ Added: ${q.title}`);
      successCount++;
    }
  }
  console.log(`✨ DONE! Added ${successCount} questions.`);
}

run();
