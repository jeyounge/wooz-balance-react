
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { MessageSquareQuote, ArrowRight, Share2 } from 'lucide-react';
import CommentList from '../components/CommentList';
import CommentForm from '../components/CommentForm';

export default function ResultPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [q, setQ] = useState(null);
    const [commentTrigger, setCommentTrigger] = useState(0);
    
    useEffect(() => {
        const fetchData = async () => {
            if (id == 0) { // Mock
                setQ({
                    title: "DB가 비어있어요!",
                    option_a: "라면", option_b: "닭가슴살",
                    count_a: 11, count_b: 5,
                    ai_commentary: "AI 분석: 아직 투표 데이터가 없어서 제가 지어낸 분석입니다. 라면이 최고죠."
                });
                return;
            }

            const { data } = await supabase
                .from('balance_questions')
                .select('*')
                .eq('id', id)
                .single();
            setQ(data);
        };
        fetchData();
    }, [id]);

    if (!q) return <div className="p-10 text-center">Analysing...</div>;

    const total = (q.count_a || 0) + (q.count_b || 0);
    const pA = total === 0 ? 50 : Math.round((q.count_a / total) * 100);
    const pB = 100 - pA;

    return (
        <div className="flex flex-col gap-6 animate-fade-in-up">
           
           {/* Chart */}
           <div className="card p-6 flex flex-col gap-4">
                <h3 className="text-center font-bold text-gray-600">투표 결과</h3>
                
                <div className="relative w-full h-12 bg-gray-200 rounded-full overflow-hidden flex font-bold text-white text-sm">
                    <div 
                        style={{ width: `${pA}%` }} 
                        className="bg-primary flex items-center justify-start px-4 transition-all duration-1000"
                    >
                        {pA}%
                    </div>
                    <div 
                        style={{ width: `${pB}%` }} 
                        className="bg-secondary flex items-center justify-end px-4 transition-all duration-1000"
                    >
                        {pB}%
                    </div>
                </div>

                <div className="flex justify-between text-sm font-bold">
                    <span className="text-primary">{q.option_a}</span>
                    <span className="text-secondary">{q.option_b}</span>
                </div>
           </div>

           {/* AI Commentary */}
           <div className="rounded-3xl shadow-xl border-4 bg-gray-900 border-gray-800 text-white p-6 relative">
                <div className="absolute -top-3 -left-2 bg-yellow-400 text-black text-xs font-black px-2 py-1 rounded rotate-[-5deg] shadow-sm">
                    WOOZ AI SAYS
                </div>
                <div className="flex gap-3">
                    <MessageSquareQuote className="w-8 h-8 text-gray-500 shrink-0" />
                    <p className="text-sm leading-relaxed text-gray-100 font-mono font-bold">
                        {q.ai_commentary || "데이터가 부족해서 아직 분석할 수 없습니다. 하지만 당신의 선택은 존중합니다."}
                    </p>
                </div>
           </div>

           {/* Next */}
           <button 
                onClick={() => navigate('/')}
                className="btn-primary w-full flex items-center justify-center gap-2 bg-black hover:bg-gray-800"
            >
                다음 문제 풀기
                <ArrowRight className="w-5 h-5" />
           </button>

           {/* Share */}
           <button 
                onClick={() => {
                    const url = window.location.href;
                    if (navigator.share) {
                        navigator.share({
                            title: 'Wooz Balance',
                            text: '이 문제 어떻게 생각해? 투표해줘!',
                            url: url,
                        }).catch((error) => console.log('Sharing failed', error));
                    } else {
                        navigator.clipboard.writeText(url);
                        alert('링크가 복사되었습니다!');
                    }
                }}
                className="btn-secondary w-full flex items-center justify-center gap-2 bg-yellow-400 text-black hover:bg-yellow-500"
            >
                <Share2 className="w-5 h-5" />
                친구에게 공유하기
           </button>

           {/* Comments Section */}
           <div className="border-t border-gray-200 pt-6 mt-2 flex flex-col gap-4">
                <h3 className="font-bold text-gray-700 flex items-center gap-2">
                    <MessageSquareQuote className="w-5 h-5" />
                    댓글
                </h3>
                
                <CommentForm 
                    questionId={id} 
                    onCommentAdded={() => setCommentTrigger(prev => prev + 1)} 
                />
                
                <CommentList 
                    questionId={id} 
                    keyTrigger={commentTrigger} 
                />
           </div>
        </div>
    );
}
