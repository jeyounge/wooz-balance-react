
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing env vars");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function cleanupAndSeed() {
  console.log("Cleaning up test data...");
  
  // 1. Delete the test question
  const { error: deleteError } = await supabase
    .from('balance_questions')
    .delete()
    .eq('title', '테스트 질문');

  if (deleteError) {
    console.error("Error deleting test question:", deleteError);
  } else {
    console.log("✅ Deleted '테스트 질문'");
  }

  // 2. Run the seed process (we can just import the seed function if we modify seed_v3.js, 
  // but running it as a separate process is fine too. 
  // actually, let's just trigger seed_v3.js from here or run it via command line.
  // I will just exit and let the agent run seed_v3.js
}

cleanupAndSeed();
