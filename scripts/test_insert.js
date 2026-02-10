
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testInsert() {
  console.log("Testing insert of 'power' category...");

  const { data, error } = await supabase
    .from('balance_questions')
    .insert([{
        category: 'power',
        title: 'Test Power Question',
        option_a: 'A',
        option_b: 'B',
        count_a: 0,
        count_b: 0
    }])
    .select();

  if (error) {
    console.error("❌ Insert Failed:", error);
  } else {
    console.log("✅ Insert Success:", data);
    
    // Cleanup
    await supabase.from('balance_questions').delete().eq('id', data[0].id);
  }
}

testInsert();
