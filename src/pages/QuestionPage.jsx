
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { Swords, Shuffle, MessageSquareQuote } from 'lucide-react';


export default function QuestionPage() {
    const { category } = useParams(); // 'all', 'food', 'love', 'work'
    const [question, setQuestion] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const skipQuestion = () => {
        const indexKey = `wooz_index_${category}`;
        let index = parseInt(sessionStorage.getItem(indexKey) || '0');
        sessionStorage.setItem(indexKey, index + 1);
        fetchQuestionQueue();
    };

    const fetchQuestionQueue = async () => {
        setLoading(true);
        try {
            const queueKey = `wooz_queue_${category}`;
            const indexKey = `wooz_index_${category}`;
            
            let queue = JSON.parse(sessionStorage.getItem(queueKey));
            let index = parseInt(sessionStorage.getItem(indexKey) || '0');

            // Fetch & Shuffle if no queue
            if (!queue || queue.length === 0) {
                let query = supabase.from('balance_questions').select('*');
                if (category && category !== 'all') {
                    query = query.eq('category', category);
                }
                const { data, error } = await query;

                if (error) {
                    console.error('Fetch error:', error);
                    return;
                }

                if (data && data.length > 0) {
                    // Fisher-Yates Shuffle
                    for (let i = data.length - 1; i > 0; i--) {
                        const j = Math.floor(Math.random() * (i + 1));
                        [data[i], data[j]] = [data[j], data[i]];
                    }
                    queue = data;
                } else {
                    queue = [];
                }

                sessionStorage.setItem(queueKey, JSON.stringify(queue));
                sessionStorage.setItem(indexKey, '0');
                index = 0;
            }

            // Set Question
            if (queue && index < queue.length) {
                setQuestion(queue[index]);
            } else {
                setQuestion('DONE'); // Special flag for end of list
            }

        } catch (error) {
            console.error("Error fetching question:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setQuestion(null); // Reset on category change
        fetchQuestionQueue();
    }, [category]);

    const handleVote = async (choice) => {
        if (!question.id) return navigate(`/result/0`); // Mock handling

        // 1. Optimistic Update (Skip for now, just navigate)
        // 2. DB Update
        // 2. DB Update (Aggregate) & insert individual vote
        const { error } = await supabase.rpc('balance_increment_vote', { 
            row_id: question.id, 
            choice: choice 
        });
        
        if (error) {
            console.warn('RPC failed, trying direct update...', error);
            const field = choice === 'A' ? 'count_a' : 'count_b';
            await supabase
                .from('balance_questions')
                .update({ [field]: question[field] + 1 })
                .eq('id', question.id);
        }

        // Insert Detailed Vote
        const profile = JSON.parse(localStorage.getItem('wooz_balance_profile') || '{}');
        if (profile.gender) {
            await supabase.from('balance_votes').insert([{
                question_id: question.id,
                choice: choice,
                gender: profile.gender,
                age_group: profile.age,
                mbti: profile.mbti
            }]);
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
    
    if (question === 'DONE') {
        return (
            <div className="text-center p-10 flex flex-col items-center gap-4 animate-fade-in-up">
                <div className="text-6xl">🎉</div>
                <h2 className="text-2xl font-bold text-gray-800">모든 질문을 완료했어요!</h2>
                <p className="text-gray-500">이 주제의 모든 도파민을 소모하셨습니다.</p>
                <button 
                    onClick={() => navigate('/')}
                    className="btn-primary w-full max-w-xs"
                >
                    다른 주제 고르러 가기
                </button>
            </div>
        );
    }

    if (!question) return <div className="text-center p-10">질문을 불러올 수 없습니다.</div>;

    return (
        <div className="flex flex-col gap-3 animate-fade-in-up">
            <h2 className="text-2xl font-bold text-center text-gray-800 break-keep">
                {question.title}
            </h2>

            <div className="flex flex-col gap-4">
                {/* Option A */}
                <div className="flex flex-col gap-2">
                    {question.ai_comment_a && (
                        <div className="bg-red-50 p-3 rounded-lg border border-red-100 relative">
                            <MessageSquareQuote className="w-4 h-4 text-red-400 absolute -top-2 -left-1 bg-white rounded-full" />
                            <p className="text-xs text-red-800 break-keep pl-2">
                                "{question.ai_comment_a}"
                            </p>
                        </div>
                    )}
                    <button 
                        onClick={() => handleVote('A')}
                        className="btn-primary flex flex-col items-center justify-center gap-1 h-32 bg-gradient-to-br from-red-400 to-red-500 w-full"
                    >
                        <span className="text-3xl">🅰️</span>
                        <span className="text-lg break-keep">{question.option_a}</span>
                    </button>
                </div>

                {/* VS Badge */}
                <div className="self-center -my-8 z-10 bg-white rounded-full p-2 border-4 border-gray-100 shadow-sm">
                    <Swords className="w-8 h-8 text-gray-400" />
                </div>

                {/* Option B */}
                <div className="flex flex-col gap-2">
                    {question.ai_comment_b && (
                        <div className="bg-teal-50 p-3 rounded-lg border border-teal-100 relative text-right">
                            <MessageSquareQuote className="w-4 h-4 text-teal-400 absolute -top-2 -right-1 bg-white rounded-full" />
                            <p className="text-xs text-teal-800 break-keep pr-2">
                                "{question.ai_comment_b}"
                            </p>
                        </div>
                    )}
                    <button 
                        onClick={() => handleVote('B')}
                        className="btn-secondary flex flex-col items-center justify-center gap-1 h-32 bg-gradient-to-br from-teal-400 to-teal-500 w-full"
                    >
                        <span className="text-3xl">🅱️</span>
                        <span className="text-lg break-keep">{question.option_b}</span>
                    </button>
                </div>
            </div>

            <button 
                onClick={skipQuestion}
                className="mt-4 flex items-center justify-center gap-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
                <Shuffle className="w-4 h-4" />
                다른 질문 패스하기
            </button>
        </div>
    );
}
