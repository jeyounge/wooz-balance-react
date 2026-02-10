
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) process.exit(1);

const supabase = createClient(supabaseUrl, supabaseKey);

async function testCategories() {
  const categories = ['extreme', 'power', 'debate'];
  
  for (const cat of categories) {
    console.log(`Testing insert for category: '${cat}'...`);
    
    const { data, error } = await supabase
      .from('balance_questions')
      .insert([{
          category: cat,
          title: `Test ${cat}`,
          option_a: 'A',
          option_b: 'B',
          count_a: 0,
          count_b: 0
      }])
      .select();

    if (error) {
      console.error(`❌ Failed '${cat}':`, error.message);
    } else {
      console.log(`✅ Success '${cat}'`);
      // Cleanup
      await supabase.from('balance_questions').delete().eq('id', data[0].id);
    }
  }
}

testCategories();
