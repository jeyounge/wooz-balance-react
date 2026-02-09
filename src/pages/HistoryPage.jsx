import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Trash2 } from 'lucide-react';

export default function HistoryPage() {
    const navigate = useNavigate();
    const [history, setHistory] = useState([]);

    useEffect(() => {
        const stored = localStorage.getItem('wooz_balance_history');
        if (stored) {
            setHistory(JSON.parse(stored));
        }
    }, []);

    const clearHistory = () => {
        if (confirm('정말 모든 기록을 삭제하시겠습니까?')) {
            localStorage.removeItem('wooz_balance_history');
            setHistory([]);
        }
    };

    return (
        <div className="flex flex-col gap-6 animate-fade-in-up">
            <header className="flex items-center justify-between">
                <button 
                    onClick={() => navigate(-1)} 
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-full"
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <h2 className="text-xl font-bold text-gray-800">내 투표 기록</h2>
                <div className="w-10"></div> {/* Spacer */}
            </header>

            {history.length === 0 ? (
                <div className="text-center py-20 text-gray-400">
                    <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>아직 투표한 기록이 없습니다.</p>
                    <button 
                        onClick={() => navigate('/')}
                        className="mt-4 text-primary font-bold hover:underline"
                    >
                        문제 풀러 가기
                    </button>
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {history.map((item, index) => (
                        <div 
                            key={index}
                            onClick={() => navigate(`/result/${item.id}`)}
                            className="bg-white p-4 rounded-2xl shadow-sm border-2 border-transparent hover:border-primary cursor-pointer transition-all active:scale-95"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <span className={`text-xs font-bold px-2 py-1 rounded ${item.choice === 'A' ? 'bg-red-100 text-red-500' : 'bg-teal-100 text-teal-500'}`}>
                                    {item.choice === 'A' ? '🅰️ 선택함' : '🅱️ 선택함'}
                                </span>
                                <span className="text-xs text-gray-400">
                                    {new Date(item.timestamp).toLocaleDateString()}
                                </span>
                            </div>
                            <h3 className="font-bold text-gray-800 line-clamp-2">
                                {item.title}
                            </h3>
                        </div>
                    ))}
                    
                    <button 
                        onClick={clearHistory}
                        className="mt-4 flex items-center justify-center gap-2 text-gray-400 text-sm hover:text-red-500 transition-colors"
                    >
                        <Trash2 className="w-4 h-4" />
                        기록 전체 삭제
                    </button>
                </div>
            )}
        </div>
    );
}
