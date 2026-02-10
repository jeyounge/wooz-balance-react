import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Utensils, Heart, Briefcase, Dices, Flame, Zap, Swords } from 'lucide-react';

export default function CategoryPage() {
    const navigate = useNavigate();

    useEffect(() => {
        const profile = localStorage.getItem('wooz_balance_profile');
        if (!profile) {
            navigate('/setup');
        }
    }, []);

    const categories = [
        { id: 'all', name: '전체 랜덤', icon: <Dices className="w-8 h-8"/>, color: 'bg-purple-100 text-purple-600', border: 'border-purple-200' },
        { id: 'debate', name: 'VS 놀이 (논쟁)', icon: <Swords className="w-8 h-8"/>, color: 'bg-indigo-100 text-indigo-600', border: 'border-indigo-200' },
        { id: 'extreme', name: '극한의 밸런스', icon: <Flame className="w-8 h-8"/>, color: 'bg-red-100 text-red-600', border: 'border-red-200' },
        { id: 'power', name: '초능력/만약에', icon: <Zap className="w-8 h-8"/>, color: 'bg-yellow-100 text-yellow-600', border: 'border-yellow-200' },
        { id: 'food', name: '음식/야식', icon: <Utensils className="w-8 h-8"/>, color: 'bg-orange-100 text-orange-600', border: 'border-orange-200' },
        { id: 'love', name: '연애/사랑', icon: <Heart className="w-8 h-8"/>, color: 'bg-pink-100 text-pink-600', border: 'border-pink-200' },
        { id: 'work', name: '직장/사회', icon: <Briefcase className="w-8 h-8"/>, color: 'bg-blue-100 text-blue-600', border: 'border-blue-200' },
    ];

    return (
        <div className="flex flex-col gap-3 animate-fade-in-up py-4">
            <div className="text-center mb-4">
                <h2 className="text-xl font-bold text-gray-700">오늘의 주제는?</h2>
                <p className="text-gray-400 text-sm">원하는 테마를 선택해보세요!</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => {
                            sessionStorage.removeItem(`wooz_queue_${cat.id}`);
                            sessionStorage.removeItem(`wooz_index_${cat.id}`);
                            navigate(`/question/${cat.id}`);
                        }}
                        className={`
                            ${cat.color} ${cat.border} border-2
                            p-4 rounded-3xl shadow-sm hover:shadow-md hover:scale-[1.02] transition-all
                            flex flex-col items-center justify-center gap-3 text-center group aspect-square
                        `}
                    >
                        <div className="bg-white p-3 rounded-full shadow-sm group-hover:rotate-12 transition-transform">
                            {cat.icon}
                        </div>
                        <div>
                            <h3 className="text-lg font-black break-keep">{cat.name}</h3>
                            <p className="text-xs opacity-70 font-bold mt-1">START &rarr;</p>
                        </div>
                    </button>
                ))}
            </div>
            
            <div className="mt-8 p-4 bg-gray-100 rounded-2xl text-center">
                <p className="text-xs text-gray-500 font-bold mb-2">📢 공지사항</p>
                <p className="text-xs text-gray-400">
                    새로운 질문들이 대거 추가되었습니다!<br/>
                    A vs B, 당신의 선택은?
                </p>
            </div>
        </div>
    );
}
