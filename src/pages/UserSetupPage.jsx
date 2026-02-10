import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Check } from 'lucide-react';

export default function UserSetupPage() {
    const navigate = useNavigate();
    const [profile, setProfile] = useState({
        gender: '',
        age: '',
        mbti: ''
    });

    useEffect(() => {
        const saved = localStorage.getItem('wooz_balance_profile');
        if (saved) {
            setProfile(JSON.parse(saved));
        }
    }, []);

    const mbtiTypes = [
        'ISTJ', 'ISFJ', 'INFJ', 'INTJ',
        'ISTP', 'ISFP', 'INFP', 'INTP',
        'ESTP', 'ESFP', 'ENFP', 'ENTP',
        'ESTJ', 'ESFJ', 'ENFJ', 'ENTJ'
    ];

    const handleSave = () => {
        if (!profile.gender || !profile.age || !profile.mbti) return;
        localStorage.setItem('wooz_balance_profile', JSON.stringify(profile));
        navigate('/');
    };

    return (
        <div className="flex flex-col gap-6 animate-fade-in-up py-4">
            <div className="text-center">
                <h2 className="text-xl font-bold text-gray-800">잠깐! 누구신가요?</h2>
                <p className="text-gray-400 text-sm">정확한 통계 분석을 위해 알려주세요!</p>
            </div>

            {/* Gender */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-sm font-bold text-gray-600 mb-3 flex items-center gap-2">
                    <User className="w-4 h-4" /> 성별
                </h3>
                <div className="flex gap-2">
                    {['M', 'F'].map(g => (
                        <button
                            key={g}
                            onClick={() => setProfile({...profile, gender: g})}
                            className={`flex-1 py-3 rounded-xl font-bold transition-all ${
                                profile.gender === g 
                                ? 'bg-black text-white shadow-md scale-[1.02]' 
                                : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                            }`}
                        >
                            {g === 'M' ? '남성' : '여성'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Age */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-sm font-bold text-gray-600 mb-3">나이대</h3>
                <div className="grid grid-cols-4 gap-2">
                    {['10s', '20s', '30s', '40s+'].map(a => (
                        <button
                            key={a}
                            onClick={() => setProfile({...profile, age: a})}
                            className={`py-2 rounded-xl text-sm font-bold transition-all ${
                                profile.age === a 
                                ? 'bg-black text-white shadow-md' 
                                : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                            }`}
                        >
                            {a === '40s+' ? '40대+' : `${a.replace('s', '대')}`}
                        </button>
                    ))}
                </div>
            </div>

            {/* MBTI */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-sm font-bold text-gray-600 mb-3">MBTI</h3>
                <div className="grid grid-cols-4 gap-2">
                    {mbtiTypes.map(m => (
                        <button
                            key={m}
                            onClick={() => setProfile({...profile, mbti: m})}
                            className={`py-2 rounded-lg text-xs font-bold transition-all ${
                                profile.mbti === m 
                                ? 'bg-primary text-white shadow-md transform scale-105' 
                                : 'bg-gray-50 text-gray-400 hover:bg-gray-100 border border-gray-100'
                            }`}
                        >
                            {m}
                        </button>
                    ))}
                </div>
            </div>

            <button
                disabled={!profile.gender || !profile.age || !profile.mbti}
                onClick={handleSave}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                    (!profile.gender || !profile.age || !profile.mbti)
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'btn-primary bg-black text-white hover:bg-gray-800 shadow-lg'
                }`}
            >
                시작하기
            </button>
        </div>
    );
}
