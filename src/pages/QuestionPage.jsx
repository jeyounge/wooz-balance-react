
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { Swords, Shuffle } from 'lucide-react';

export default function QuestionPage() {
    const [question, setQuestion] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchRandomQuestion = async () => {
        setLoading(true);
        // Simple random fetch: Get first 100 then pick one
        // For production, use RPC 'get_random_question' or cleaner logic
        const { data, error } = await supabase
            .from('balance_questions')
            .select('*')
            .limit(20);

        if (error || !data || data.length === 0) {
            console.error('Fetch error:', error);
            // Fallback for demo if DB empty
            setQuestion({
                id: 0,
                title: "DB가 비어있어요! 예시 질문입니다.",
                option_a: "평생 라면만 먹기 (김치X)",
                option_b: "평생 닭가슴살만 먹기 (소스X)",
                count_a: 10,
                count_b: 5
            });
        } else {
            // Pick random
            const randomQ = data[Math.floor(Math.random() * data.length)];
            setQuestion(randomQ);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchRandomQuestion();
    }, []);

    const handleVote = async (choice) => {
        if (!question.id) return navigate(`/result/0`); // Mock handling

        // 1. Optimistic Update (Skip for now, just navigate)
        // 2. DB Update
        const { error } = await supabase.rpc('balance_increment_vote', { 
            row_id: question.id, 
            choice: choice 
        });
        
        // If RPC missing (user didn't run SQL yet), fallback to client-side increment (unsafe but works for demo)
        if (error) {
            console.warn('RPC failed, trying direct update...', error);
            // Fallback: Read -> Increment -> Write (Not atomic)
            const field = choice === 'A' ? 'count_a' : 'count_b';
            await supabase
                .from('balance_questions')
                .update({ [field]: question[field] + 1 })
                .eq('id', question.id);
        }

        // Save to History (Local Storage)
        const historyItem = {
            id: question.id,
            title: question.title,
            choice: choice, // 'A' or 'B'
            timestamp: new Date().toISOString()
        };

        const existingHistory = JSON.parse(localStorage.getItem('wooz_balance_history') || '[]');
        // Avoid duplicates (optional, or allow multi-voting tracking)
        const newHistory = [historyItem, ...existingHistory].slice(0, 50); // Keep last 50
        localStorage.setItem('wooz_balance_history', JSON.stringify(newHistory));

        navigate(`/result/${question.id}`);
    };

    if (loading) return <div className="text-center p-10 animate-pulse">Loading Fun...</div>;

    return (
        <div className="flex flex-col gap-6 animate-fade-in-up">
            <h2 className="text-2xl font-bold text-center text-gray-800 break-keep">
                {question.title}
            </h2>

            <div className="flex flex-col gap-4">
                {/* Option A */}
                <button 
                    onClick={() => handleVote('A')}
                    className="btn-primary flex flex-col items-center justify-center gap-2 h-40 bg-gradient-to-br from-red-400 to-red-500"
                >
                    <span className="text-4xl">🅰️</span>
                    <span className="text-xl break-keep">{question.option_a}</span>
                </button>

                {/* VS Badge */}
                <div className="self-center -my-8 z-10 bg-white rounded-full p-2 border-4 border-gray-100 shadow-sm">
                    <Swords className="w-8 h-8 text-gray-400" />
                </div>

                {/* Option B */}
                <button 
                    onClick={() => handleVote('B')}
                    className="btn-secondary flex flex-col items-center justify-center gap-2 h-40 bg-gradient-to-br from-teal-400 to-teal-500"
                >
                    <span className="text-4xl">🅱️</span>
                    <span className="text-xl break-keep">{question.option_b}</span>
                </button>
            </div>

            <button 
                onClick={fetchRandomQuestion}
                className="mt-4 flex items-center justify-center gap-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
                <Shuffle className="w-4 h-4" />
                다른 질문 패스하기
            </button>
        </div>
    );
}
