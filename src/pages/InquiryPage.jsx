import React, { useState, useRef } from 'react';
import { Send, ArrowLeft, Mail, CheckCircle, AlertCircle, Flame } from 'lucide-react';
import { Link } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import { Helmet } from 'react-helmet-async';

export default function InquiryPage() {
    const form = useRef();
    const [status, setStatus] = useState('idle');

    const sendEmail = (e) => {
        e.preventDefault();
        setStatus('sending');

        // Add Service Name to subject for clarity
        const currentSubject = form.current.subject.value;
        form.current.subject.value = `[Balance] ${currentSubject}`;

        emailjs.sendForm('service_2vjma3d', 'template_eozapdl', form.current, 'cZQf4Tev6rhPpsGcI')
            .then((result) => {
                setStatus('success');
                form.current.reset();
            }, (error) => {
                console.log(error.text);
                setStatus('error');
            });
    };

    return (
        <div className="w-full max-w-md mx-auto p-4 animate-fade-in-up">
            <Helmet>
                <title>문의하기 - Wooz Balance</title>
            </Helmet>

            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border-4 border-gray-100">
                <div className="bg-primary/10 p-6 border-b border-primary/10">
                    <div className="flex items-center gap-3">
                        <Link to="/" className="p-2 -ml-2 hover:bg-white/50 rounded-full transition-colors">
                            <ArrowLeft className="w-6 h-6 text-gray-600" />
                        </Link>
                        <h1 className="text-xl font-black text-gray-800 flex items-center gap-2">
                            <Mail className="w-6 h-6 text-primary" />
                            문의하기
                        </h1>
                    </div>
                </div>

                <div className="p-6">
                    {status === 'success' ? (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                                <CheckCircle className="w-8 h-8" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-800 mb-2">접수 완료!</h2>
                            <p className="text-gray-500 text-sm mb-8">
                                소중한 의견 감사합니다.<br/>
                                빠르게 확인하고 답장 드릴게요! 🚀
                            </p>
                            <button 
                                onClick={() => setStatus('idle')}
                                className="w-full bg-primary text-white py-3 rounded-xl font-bold shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all"
                            >
                                추가 문의하기
                            </button>
                        </div>
                    ) : (
                        <form ref={form} onSubmit={sendEmail} className="space-y-4">
                            <div className="text-sm text-gray-500 mb-4 bg-gray-50 p-3 rounded-xl border border-gray-100">
                                게임 제안, 버그 신고, 혹은 그냥 하고 싶은 말!<br/>
                                무엇이든 자유롭게 남겨주세요. 🔥
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-400 mb-1 ml-1">문의 유형</label>
                                <select name="category" className="w-full bg-gray-50 rounded-xl border border-gray-200 p-3 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" required>
                                    <option value="밸런스게임 제안">💡 게임 주제 제안</option>
                                    <option value="버그제보">🐛 버그 신고</option>
                                    <option value="기타문의">💬 기타 문의</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-400 mb-1 ml-1">이메일 (답변 받으실 곳)</label>
                                <input 
                                    type="email" 
                                    name="user_email" 
                                    placeholder="name@example.com"
                                    className="w-full bg-gray-50 rounded-xl border border-gray-200 p-3 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" 
                                    required 
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-400 mb-1 ml-1">제목</label>
                                <input 
                                    type="text" 
                                    name="subject" 
                                    placeholder="핵심만 간단히!"
                                    className="w-full bg-gray-50 rounded-xl border border-gray-200 p-3 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" 
                                    required 
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-400 mb-1 ml-1">내용</label>
                                <textarea 
                                    name="message" 
                                    rows="5"
                                    placeholder="자세히 적어주시면 더 좋아요!"
                                    className="w-full bg-gray-50 rounded-xl border border-gray-200 p-3 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all resize-none" 
                                    required 
                                ></textarea>
                            </div>

                            {status === 'error' && (
                                <div className="flex items-center gap-2 text-red-500 text-xs bg-red-50 p-3 rounded-lg">
                                    <AlertCircle className="w-4 h-4" />
                                    전송 실패! 잠시 후 다시 시도해주세요.
                                </div>
                            )}

                            <button 
                                type="submit" 
                                disabled={status === 'sending'}
                                className={`w-full bg-gradient-to-r from-primary to-rose-400 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-primary/30 flex items-center justify-center gap-2 transition-transform active:scale-95 ${status === 'sending' ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-1'}`}
                            >
                                {status === 'sending' ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        <Send className="w-5 h-5" />
                                        보내기
                                    </>
                                )}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
