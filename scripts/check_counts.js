
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing env vars");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkCounts() {
  console.log("Checking Question Counts by Category...");

  // Get all questions
  const { data, error } = await supabase
    .from('balance_questions')
    .select('category');

  if (error) {
    console.error("Error querying DB:", error);
    return;
  }

  const counts = {};
  data.forEach(q => {
    counts[q.category] = (counts[q.category] || 0) + 1;
  });

  console.log("Counts:", counts);
}

checkCounts();
