import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { Send } from 'lucide-react';

export default function CommentForm({ questionId, onCommentAdded }) {
    const [nickname, setNickname] = useState('ㅇㅇ');
    const [password, setPassword] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim() || !password.trim()) {
            alert("내용과 비밀번호를 입력해주세요!");
            return;
        }

        setLoading(true);

        try {
            // 1. Get Client IP (Simple Public API)
            const ipRes = await fetch('https://api.ipify.org?format=json');
            const ipData = await ipRes.json();
            const rawIp = ipData.ip;
            
            // 2. Mask IP (123.456.789.0 -> 123.456.***.***)
            const ipParts = rawIp.split('.');
            const maskedIp = ipParts.length === 4 
                ? `${ipParts[0]}.${ipParts[1]}.***.***` 
                : '***.***.***.***'; // Fallback for weird IPs

            // 3. Insert to DB
            const { error } = await supabase
                .from('balance_comments')
                .insert({
                    question_id: questionId,
                    nickname: nickname || 'ㅇㅇ',
                    password: password,
                    content: content,
                    ip_address: maskedIp
                });

            if (error) throw error;

            // Success
            setContent('');
            setPassword('');
            onCommentAdded(); // Refresh list

        } catch (err) {
            console.error(err);
            alert('댓글 작성 실패: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="card bg-gray-50 p-4 border border-gray-200">
            <h4 className="text-sm font-bold text-gray-600 mb-2">댓글 남기기</h4>
            
            <div className="flex flex-col sm:flex-row gap-2 mb-2">
                <input 
                    type="text" 
                    placeholder="닉네임"
                    value={nickname}
                    onChange={e => setNickname(e.target.value)}
                    className="flex-1 p-2 text-sm border rounded focus:outline-primary"
                    maxLength={10}
                />
                <input 
                    type="password" 
                    placeholder="비밀번호"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="flex-1 p-2 text-sm border rounded focus:outline-primary font-mono"
                    maxLength={20}
                    required
                />
            </div>

            <div className="flex gap-2">
                <input 
                    type="text" 
                    placeholder="내용을 입력하세요..."
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    className="flex-grow p-2 text-sm border rounded focus:outline-primary"
                    required
                />
                <button 
                    type="submit" 
                    disabled={loading}
                    className="btn-primary min-w-[60px] flex items-center justify-center bg-gray-800 hover:bg-black"
                >
                    {loading ? '...' : <Send className="w-4 h-4" />}
                </button>
            </div>
        </form>
    );
}
