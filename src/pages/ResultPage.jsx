import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { MessageSquareQuote, ArrowRight, Share2, Home, User, Calendar, Brain } from 'lucide-react';
import CommentList from '../components/CommentList';
import CommentForm from '../components/CommentForm';
import { Helmet } from 'react-helmet-async';

export default function ResultPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [q, setQ] = useState(null);
    const [stats, setStats] = useState(null);
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

            // Fetch Demographic Stats
            const { data: votes } = await supabase
                .from('balance_votes')
                .select('*')
                .eq('question_id', id);

            if (votes && votes.length > 0) {
                const newStats = {
                    male: { a: 0, b: 0, total: 0 },
                    female: { a: 0, b: 0, total: 0 },
                    age: {},
                    mbti: {}
                };

                votes.forEach(v => {
                    // Gender
                    if (v.gender === 'M') {
                        newStats.male.total++;
                        if (v.choice === 'A') newStats.male.a++; else newStats.male.b++;
                    } else if (v.gender === 'F') {
                        newStats.female.total++;
                        if (v.choice === 'A') newStats.female.a++; else newStats.female.b++;
                    }

                    // Age
                    if (v.age_group) {
                        if (!newStats.age[v.age_group]) newStats.age[v.age_group] = { a: 0, b: 0, total: 0 };
                        newStats.age[v.age_group].total++;
                        if (v.choice === 'A') newStats.age[v.age_group].a++; else newStats.age[v.age_group].b++;
                    }

                    // MBTI
                    if (v.mbti) {
                        if (!newStats.mbti[v.mbti]) newStats.mbti[v.mbti] = { a: 0, b: 0, total: 0 };
                        newStats.mbti[v.mbti].total++;
                        if (v.choice === 'A') newStats.mbti[v.mbti].a++; else newStats.mbti[v.mbti].b++;
                    }
                });
                setStats(newStats);
            }
        };
        fetchData();
    }, [id]);

    if (!q) return <div className="p-10 text-center">Analysing...</div>;

    const total = (q.count_a || 0) + (q.count_b || 0);
    const pA = total === 0 ? 50 : Math.round((q.count_a / total) * 100);
    const pB = 100 - pA;

    // Dynamic Commentary Logic
    const generateDynamicCommentary = (question, statistics) => {
        if (!statistics) return question.ai_commentary;

        const totalVotes = statistics.male.total + statistics.female.total;
        if (totalVotes === 0) return "아직 데이터가 부족해요! 😅 첫 번째 투표자가 되어주세요.";

        const pA = Math.round((question.count_a / (question.count_a + question.count_b)) * 100);
        const winner = pA >= 50 ? 'A' : 'B';
        const winnerText = winner === 'A' ? question.option_a : question.option_b;
        const loserText = winner === 'A' ? question.option_b : question.option_a;
        
        // Random Picker
        const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

        // 1. Winner Analysis
        let commentary = "";
        const diff = Math.abs(pA - (100 - pA));
        
        if (diff < 10) {
            commentary = pick([
                `와... 이거 실화인가요? 😱 ${winnerText} vs ${loserText}, 정말 박빙입니다! `,
                `진짜 50:50 가나요? 팽팽한 접전이 펼쳐지고 있어요! 🔥 `,
                `우열을 가리기 힘든 난제네요. 표 차이가 거의 없습니다. 🤔 `,
                `여러분의 선택이 승패를 가릅니다! 정말 치열하네요. ⚔️ `
            ]);
        } else if (diff > 40) {
            commentary = pick([
                `압도적입니다! 😲 ${winnerText} 쪽으로 여론이 확실히 기울었네요. `,
                `게임 끝! 🚫 ${winnerText}의 완승 분위기입니다. `,
                `대다수의 분들이 ${winnerText}를 선택해주셨네요. 고민의 여지가 없나요? 😎 `,
                `이건 뭐... ${winnerText}의 독주 체제네요. 🏃‍♂️ `
            ]);
        } else {
            commentary = pick([
                `전체적으로는 ${winnerText}를 선호하는 경향이 있습니다. 👌 `,
                `음~ ${winnerText} 쪽이 조금 더 우세하군요! `,
                `대세는 ${winnerText}인 것 같습니다. 여러분의 생각은 어떠신가요? `,
                `${winnerText}를 고른 분들이 더 많네요! 👍 `
            ]);
        }

        // 2. Gender Insight
        const malePA = statistics.male.total > 0 ? Math.round((statistics.male.a / statistics.male.total) * 100) : 50;
        const femalePA = statistics.female.total > 0 ? Math.round((statistics.female.a / statistics.female.total) * 100) : 50;
        
        const maleWinner = malePA >= 50 ? 'A' : 'B';
        const femaleWinner = femalePA >= 50 ? 'A' : 'B';

        if (statistics.male.total > 0 && statistics.female.total > 0 && maleWinner !== femaleWinner) {
             const maleChoice = maleWinner === 'A' ? 'A' : 'B';
             const femaleChoice = femaleWinner === 'A' ? 'A' : 'B';
             commentary += pick([
                 `재밌는 점! 남자는 ${maleChoice}, 여자는 ${femaleChoice}를 더 선호해요. 화성에서 온 남자, 금성에서 온 여자? 🚀 `,
                 `성별에 따라 선택이 갈렸네요! 남성분들은 ${maleChoice}, 여성분들은 ${femaleChoice} 쪽이 우세합니다. `,
                 `남녀의 마음이 엇갈렸습니다. 💔 남성 선호: ${maleChoice}, 여성 선호: ${femaleChoice}! `,
                 `이 주제, 남녀 시각차이가 뚜렷하군요. (남: ${maleChoice} vs 여: ${femaleChoice}) 👀 `
             ]);
        }

        // 3. Age Insight (Find strongest supporter group)
        let maxAgeSupport = 0;
        let maxAgeGroup = "";
        Object.entries(statistics.age).forEach(([age, data]) => {
            if (data.total > 0) {
                const supportRate = winner === 'A' ? (data.a / data.total) : (data.b / data.total);
                if (supportRate > maxAgeSupport) {
                    maxAgeSupport = supportRate;
                    maxAgeGroup = age;
                }
            }
        });

        if (maxAgeGroup && maxAgeSupport > 0.6) {
             const ageText = maxAgeGroup === '40s+' ? '40대 이상' : maxAgeGroup.replace('s', '대');
             const percent = Math.round(maxAgeSupport * 100);
             commentary += pick([
                 `특히 ${ageText} 분들이 이 선택을 강력하게(${percent}%) 지지하고 있습니다. 💪`,
                 `${ageText}의 몰표가 눈에 띄네요! (${percent}%) 트렌드인가요? ✨`,
                 `${ageText} 분들에게는 이견이 없는 것 같습니다. (${percent}% 지지) 🙌`,
                 `데이터를 보니 ${ageText} 취향 저격이네요! 🎯 (${percent}%)`
             ]);
        }

        // 4. MBTI Insight (Find strongest supporter type)
        let maxMbtiSupport = 0;
        let maxMbtiType = "";
        Object.entries(statistics.mbti).forEach(([type, data]) => {
             if (data.total > 0) {
                const supportRate = winner === 'A' ? (data.a / data.total) : (data.b / data.total);
                if (supportRate > maxMbtiSupport) {
                    maxMbtiSupport = supportRate;
                    maxMbtiType = type;
                }
             }
        });

        if (maxMbtiType && maxMbtiSupport > 0.65) {
             commentary += pick([
                 ` MBTI 중에서는 ${maxMbtiType} 유형이 가장 확신에 차 있네요! 🧠`,
                 ` 흥미로운 건, ${maxMbtiType} 분들이 유독 이 쪽을 좋아한다는 거예요. 🤔`,
                 ` 혹시 ${maxMbtiType}이신가요? 통계적으로 이 선택을 좋아할 확률이 높습니다! 🔮`
             ]);
        }

        return commentary || question.ai_commentary;
    };

    const displayCommentary = (q && stats) ? generateDynamicCommentary(q, stats) : (q?.ai_commentary || "이 주제는 정말 박빙이네요! 사람들의 가치관이 뚜렷하게 갈리는 흥미로운 문제입니다.");

    return (
        <div className="flex flex-col gap-3 animate-fade-in-up">
           <Helmet>
                <title>{q.title ? `${q.title} 결과 - Wooz Balance` : '투표 결과 - Wooz Balance'}</title>
                <meta name="description" content={`현재 ${total.toLocaleString()}명 참여 중! 결과가 궁금하신가요?`} />
           </Helmet>
           
           {/* Chart */}
           <div className="card p-4 flex flex-col gap-3">
                <div className="text-center">
                    <h3 className="font-bold text-gray-600">투표 결과</h3>
                    <p className="text-xs text-gray-400 mt-1">총 {total.toLocaleString()}명 참여</p>
                </div>
                
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

                <div className="flex w-full mt-2 relative">
                     {/* Divider Line */}
                     <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-200 -translate-x-1/2"></div>
                     
                     <div className="w-1/2 pr-4 text-left flex items-start">
                        <span className="text-primary font-bold text-sm leading-tight break-keep block">{q.option_a}</span>
                     </div>
                     <div className="w-1/2 pl-4 text-right flex items-start justify-end">
                        <span className="text-secondary font-bold text-sm leading-tight break-keep block">{q.option_b}</span>
                     </div>
                </div>
           </div>

            {/* Demographic Analysis */}
            {stats && (
                <div className="card p-4 flex flex-col gap-4 animate-fade-in-up delay-100">
                    <h3 className="font-bold text-gray-700 flex items-center gap-2">
                        <Brain className="w-5 h-5 text-gray-500" />
                        투표 상세 분석
                    </h3>

                    {/* Gender Stats */}
                    <div className="flex gap-4">
                        <div className="flex-1 bg-blue-50 p-3 rounded-xl border border-blue-100">
                            <div className="flex items-center gap-1 mb-2">
                                <User className="w-4 h-4 text-blue-500" />
                                <span className="text-xs font-bold text-blue-600">남성 선택</span>
                            </div>
                            <div className="text-xs space-y-1">
                                <div className="flex justify-between">
                                    <span>A: {stats.male.total > 0 ? Math.round(stats.male.a / stats.male.total * 100) : 0}%</span>
                                    <span>B: {stats.male.total > 0 ? Math.round(stats.male.b / stats.male.total * 100) : 0}%</span>
                                </div>
                                <div className="w-full h-2 bg-blue-200 rounded-full overflow-hidden flex">
                                    <div style={{width: `${stats.male.total > 0 ? (stats.male.a / stats.male.total * 100) : 50}%`}} className="bg-primary h-full"></div>
                                    <div style={{width: `${stats.male.total > 0 ? (stats.male.b / stats.male.total * 100) : 50}%`}} className="bg-secondary h-full"></div>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 bg-pink-50 p-3 rounded-xl border border-pink-100">
                            <div className="flex items-center gap-1 mb-2">
                                <User className="w-4 h-4 text-pink-500" />
                                <span className="text-xs font-bold text-pink-600">여성 선택</span>
                            </div>
                            <div className="text-xs space-y-1">
                                <div className="flex justify-between">
                                    <span>A: {stats.female.total > 0 ? Math.round(stats.female.a / stats.female.total * 100) : 0}%</span>
                                    <span>B: {stats.female.total > 0 ? Math.round(stats.female.b / stats.female.total * 100) : 0}%</span>
                                </div>
                                <div className="w-full h-2 bg-pink-200 rounded-full overflow-hidden flex">
                                    <div style={{width: `${stats.female.total > 0 ? (stats.female.a / stats.female.total * 100) : 50}%`}} className="bg-primary h-full"></div>
                                    <div style={{width: `${stats.female.total > 0 ? (stats.female.b / stats.female.total * 100) : 50}%`}} className="bg-secondary h-full"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Age Highlight */}
                    <div className="bg-green-50 p-3 rounded-xl border border-green-100">
                        <div className="flex items-center gap-1 mb-2">
                            <Calendar className="w-4 h-4 text-green-500" />
                            <span className="text-xs font-bold text-green-600">세대별 선택</span>
                        </div>
                        <div className="space-y-2">
                            {Object.entries(stats.age)
                                .sort(([a], [b]) => a.localeCompare(b))
                                .map(([age, data]) => (
                                <div key={age} className="flex items-center justify-between text-xs">
                                    <span className="font-bold w-10">{age === '40s+' ? '40대+' : age.replace('s', '대')}</span>
                                    <div className="flex-1 mx-2 h-2 bg-gray-200 rounded-full overflow-hidden flex">
                                        <div style={{width: `${data.a / data.total * 100}%`}} className="bg-primary h-full"></div>
                                        <div style={{width: `${data.b / data.total * 100}%`}} className="bg-secondary h-full"></div>
                                    </div>
                                    <div className="flex gap-2 text-[10px] text-gray-500 w-16 justify-end">
                                        <span className="text-primary">{Math.round(data.a / data.total * 100)}%</span>
                                        <span className="text-secondary">{Math.round(data.b / data.total * 100)}%</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* MBTI Highlight */}
                    <div className="bg-purple-50 p-3 rounded-xl border border-purple-100">
                        <div className="flex items-center gap-1 mb-2">
                            <Brain className="w-4 h-4 text-purple-500" />
                            <span className="text-xs font-bold text-purple-600">MBTI별 성향 (Top 3)</span>
                        </div>
                        <div className="space-y-2">
                            {Object.entries(stats.mbti)
                                .sort(([,a], [,b]) => b.total - a.total)
                                .slice(0, 3)
                                .map(([type, data]) => (
                                <div key={type} className="flex items-center justify-between text-xs">
                                    <span className="font-bold w-10">{type}</span>
                                    <div className="flex-1 mx-2 h-2 bg-gray-200 rounded-full overflow-hidden flex">
                                        <div style={{width: `${data.a / data.total * 100}%`}} className="bg-primary h-full"></div>
                                        <div style={{width: `${data.b / data.total * 100}%`}} className="bg-secondary h-full"></div>
                                    </div>
                                    <div className="flex gap-2 text-[10px] text-gray-500 w-16 justify-end">
                                        <span className="text-primary">{Math.round(data.a / data.total * 100)}%</span>
                                        <span className="text-secondary">{Math.round(data.b / data.total * 100)}%</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
            
            {/* AI Result Analysis */}
           <div className="card p-5 bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 flex flex-col gap-2">
                <div className="flex items-center gap-2 mb-1">
                    <MessageSquareQuote className="w-5 h-5 text-indigo-500" />
                    <h3 className="font-bold text-indigo-700">AI 분석 코멘트</h3>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed font-medium break-keep">
                    {displayCommentary}
                </p>
           </div>

            {/* Next or Start (Shared Mode) */}
            {!new URLSearchParams(location.search).get('shared') ? (
                <button 
                     onClick={() => {
                         // Check Profile
                         const profile = localStorage.getItem('wooz_balance_profile');
                         if (!profile) {
                             alert("더 정확한 분석을 위해\n성별과 나이를 먼저 알려주세요! 🙇‍♂️");
                             navigate('/setup');
                             return;
                         }
    
                         const category = q.category || 'all';
                         const indexKey = `wooz_index_${category}`;
                         const currentIndex = parseInt(sessionStorage.getItem(indexKey) || '0');
                         sessionStorage.setItem(indexKey, currentIndex + 1);
                         navigate(`/question/${category}`);
                     }}
                     className="btn-primary w-full flex items-center justify-center gap-2 bg-black hover:bg-gray-800"
                >
                     다음 문제 풀기
                     <ArrowRight className="w-5 h-5" />
                </button>
            ) : (
                <button 
                     onClick={() => navigate('/')}
                     className="btn-primary w-full flex items-center justify-center gap-2 bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:opacity-90 animate-pulse"
                >
                     나도 밸런스 게임 시작하기 🎮
                     <ArrowRight className="w-5 h-5" />
                </button>
            )}

           {/* Share */}
           <button 
                onClick={() => {
                    const url = new URL(window.location.href);
                    url.searchParams.set('shared', 'true');
                    const shareUrl = url.toString();

                    if (navigator.share) {
                        navigator.share({
                            title: 'Wooz Balance',
                            text: '이 문제 어떻게 생각해? 투표해줘!',
                            url: shareUrl,
                        }).catch((error) => console.log('Sharing failed', error));
                    } else {
                        navigator.clipboard.writeText(shareUrl);
                        alert('링크가 복사되었습니다!');
                    }
                }}
                className="btn-secondary w-full flex items-center justify-center gap-2 bg-yellow-400 text-black hover:bg-yellow-500"
            >
                <Share2 className="w-5 h-5" />
                친구에게 공유하기
           </button>

           {/* Home */}
           <button 
                onClick={() => navigate('/')}
                className="w-full flex items-center justify-center gap-2 text-gray-400 font-bold py-3 hover:text-gray-600 transition-colors"
            >
                <Home className="w-4 h-4" />
                다른 주제 풀러가기
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
