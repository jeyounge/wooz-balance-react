
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) process.exit(1);

const supabase = createClient(supabaseUrl, supabaseKey);

async function testBehavior() {
  console.log("--- Testing DB Behavior ---");

  // 1. Test 'food' (Should Pass)
  console.log("1. Attempting 'food' insert...");
  const { data: foodData, error: foodError } = await supabase
    .from('balance_questions')
    .insert([{
        category: 'food',
        title: 'Test Food',
        option_a: 'A', option_b: 'B', count_a: 0, count_b: 0
    }])
    .select();

  if (foodError) {
    console.error("❌ 'food' Failed:", foodError.message);
  } else {
    console.log("✅ 'food' Success");
    await supabase.from('balance_questions').delete().eq('id', foodData[0].id);
  }

  // 2. Test 'extreme' (Should Pass if constraint is gone)
  console.log("2. Attempting 'extreme' insert...");
  const { data: extData, error: extError } = await supabase
    .from('balance_questions')
    .insert([{
        category: 'extreme',
        title: 'Test Extreme',
        option_a: 'A', option_b: 'B', count_a: 0, count_b: 0
    }])
    .select();

  if (extError) {
    console.error("❌ 'extreme' Failed:", extError.message);
    if (extError.message.includes('check constraint')) {
        console.log("   -> CONFIRMED: The DB still thinks the constraint exists.");
    }
  } else {
    console.log("✅ 'extreme' Success (Constraint is gone!)");
    await supabase.from('balance_questions').delete().eq('id', extData[0].id);
  }
}

testBehavior();
