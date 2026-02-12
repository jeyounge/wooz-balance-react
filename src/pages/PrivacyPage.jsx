import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Shield } from 'lucide-react';

export default function PrivacyPage() {
    return (
        <div className="p-4 animate-fade-in-up">
            <Helmet>
                <title>개인정보처리방침 - Wooz Balance</title>
                <meta name="description" content="Wooz Balance의 개인정보처리방침입니다." />
            </Helmet>

            <div className="card p-6 bg-white shadow-md rounded-2xl">
                <div className="flex items-center gap-3 mb-6 border-b pb-4">
                    <Shield className="w-8 h-8 text-primary" />
                    <h1 className="text-2xl font-bold text-gray-800">개인정보처리방침</h1>
                </div>

                <div className="space-y-6 text-sm text-gray-600 leading-relaxed">
                    <section>
                        <h2 className="text-lg font-bold text-gray-800 mb-2">1. 개인정보의 처리 목적</h2>
                        <p>Wooz Balance('balance.z-labs.kr')는 다음의 목적을 위하여 개인정보를 처리하고 있으며, 다음의 목적 이외의 용도로는 이용하지 않습니다.</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>서비스 제공: 밸런스 게임 투표 및 결과 분석 서비스 제공</li>
                            <li>통계 분석: 익명화된 투표 데이터를 활용한 통계 분석</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-gray-800 mb-2">2. 수집하는 개인정보의 항목</h2>
                        <p>서비스 이용 과정에서 다음과 같은 정보들이 수집될 수 있습니다.</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>필수항목: 성별, 연령대 (서비스 이용 시 사용자가 직접 입력)</li>
                            <li>자동수집항목: 접속 IP 정보, 쿠키, 서비스 이용 기록, 접속 기기 정보</li>
                        </ul>
                    </section>
                    
                     <section>
                        <h2 className="text-lg font-bold text-gray-800 mb-2">3. 쿠키(Cookie)의 운용 및 거부</h2>
                         <p>본 서비스는 이용자에게 개별적인 맞춤서비스를 제공하기 위해 이용정보를 저장하고 수시로 불러오는 '쿠키(cookie)'를 사용합니다.</p>
                         <p className="mt-1">이용자는 쿠키 설치에 대한 선택권을 가지고 있으며, 웹브라우저 옵션 설정을 통해 모든 쿠키를 허용하거나, 거부할 수 있습니다.</p>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-gray-800 mb-2">4. 개인정보의 파기</h2>
                        <p>원칙적으로 개인정보 수집 및 이용목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다.</p>
                    </section>
                    
                    <section>
                        <h2 className="text-lg font-bold text-gray-800 mb-2">5. 광고 서비스</h2>
                        <p>본 사이트는 구글 애드센스 등 타사 광고를 포함하고 있습니다. 타사 공급업체는 쿠키를 사용하여 사용자의 이전 웹사이트 방문 실적을 기반으로 광고를 게재할 수 있습니다.</p>
                    </section>

                    <div className="pt-4 border-t text-xs text-gray-400">
                        <p>시행일자: 2026년 2월 12일</p>
                        <p>문의: wooz-balance@example.com</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
