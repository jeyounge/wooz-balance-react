
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing env vars");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  console.log("Checking DB connection to:", supabaseUrl);

  // 1. Try to fetch the 'extreme' category test question
  const { data, error } = await supabase
    .from('balance_questions')
    .select('*')
    .eq('category', 'extreme');

  if (error) {
    console.error("Error querying DB:", error);
  } else {
    console.log("Query Result:", data);
    if (data.length > 0) {
      console.log("✅ FOUND the test question! We are connected to the same DB.");
      console.log("The constraint MUST be gone if this row exists.");
    } else {
      console.log("❌ Could NOT find any 'extreme' questions.");
      console.log("Possibilities: Different DB, or User didn't actually insert it, or RLS hiding it.");
    }
  }

  // 2. Check simple connection
  const { count, error: countError } = await supabase
    .from('balance_questions')
    .select('*', { count: 'exact', head: true });
  
  console.log(`Total rows in table: ${count}`);
}

check();
