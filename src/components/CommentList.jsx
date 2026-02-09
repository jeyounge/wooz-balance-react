import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Trash2, Lock } from 'lucide-react';

export default function CommentList({ questionId, keyTrigger }) { // keyTrigger to force reload
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchComments = async () => {
            if (!questionId) return;
            setLoading(true);
            const { data, error } = await supabase
                .from('balance_comments')
                .select('*')
                .eq('question_id', questionId)
                .order('created_at', { ascending: false });

            if (!error) {
                setComments(data || []);
            }
            setLoading(false);
        };
        fetchComments();
    }, [questionId, keyTrigger]);

    const handleDelete = async (commentId) => {
        const password = prompt("비밀번호를 입력하세요:");
        if (!password) return;

        const { data, error } = await supabase.rpc('verify_and_delete_comment', {
            target_id: commentId,
            input_password: password
        });

        if (error) {
            alert('오류가 발생했습니다: ' + error.message);
        } else if (data === true) {
            alert('삭제되었습니다.');
            setComments(comments.filter(c => c.id !== commentId));
        } else {
            alert('비밀번호가 틀렸습니다.');
        }
    };

    if (loading) return <div className="text-center text-gray-400 py-4">Loading comments...</div>;

    return (
        <div className="flex flex-col gap-3">
            {comments.length === 0 ? (
                <div className="text-center text-gray-400 py-4 text-sm">
                    아직 댓글이 없습니다. 첫 번째 댓글을 남겨주세요!
                </div>
            ) : (
                comments.map(c => (
                    <div key={c.id} className="bg-white border border-gray-100 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-1">
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-gray-700 text-sm">{c.nickname}</span>
                                <span className="text-xs text-gray-400">({c.ip_address})</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-300">
                                    {new Date(c.created_at).toLocaleDateString()}
                                </span>
                                <button 
                                    onClick={() => handleDelete(c.id)}
                                    className="text-gray-300 hover:text-red-500 transition-colors"
                                    title="삭제"
                                >
                                    <Trash2 className="w-3 h-3" />
                                </button>
                            </div>
                        </div>
                        <p className="text-gray-800 text-sm whitespace-pre-wrap leading-relaxed">
                            {c.content}
                        </p>
                    </div>
                ))
            )}
        </div>
    );
}
