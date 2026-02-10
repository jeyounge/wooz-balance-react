
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) process.exit(1);

const supabase = createClient(supabaseUrl, supabaseKey);

async function testRpc() {
  console.log("Testing RPC with hardcoded 'power'...");

  const { error } = await supabase.rpc('insert_question_v3', {
      p_category: 'power',
      p_title: 'Hardcoded Power Test',
      p_option_a: 'A',
      p_option_b: 'B',
      p_ai_comment_a: 'Comment A',
      p_ai_comment_b: 'Comment B',
      p_ai_commentary: 'Commentary'
  });

  if (error) {
    console.error("❌ RPC Failed:", error.message);
  } else {
    console.log("✅ RPC Success");
    
    // Cleanup
    await supabase.from('balance_questions').delete().eq('title', 'Hardcoded Power Test');
  }
}

testRpc();
