import Navbar from '../components/Navbar';
import { ShieldCheck } from 'lucide-react';

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-dark">
            <Navbar />
            
            <div className="max-w-4xl mx-auto px-6 pt-32 pb-20">
                <div className="text-center mb-16">
                    <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-primary/20 to-purple-600/20 mb-6 border border-white/10">
                        <ShieldCheck className="w-8 h-8 text-primary" />
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-4">개인정보처리방침</h1>
                    <p className="text-gray-400 text-lg">
                        회원님의 소중한 개인정보를 안전하게 보호합니다.
                    </p>
                </div>

                <div className="prose prose-invert max-w-none prose-p:text-gray-400 prose-headings:text-white prose-strong:text-white">
                    <div className="p-8 rounded-3xl bg-white/5 border border-white/10 space-y-8">
                        <section>
                            <h3 className="text-xl font-bold mb-4">1. 개인정보의 수집 및 이용 목적</h3>
                            <p>
                                회사는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.
                            </p>
                            <ul className="list-disc pl-5 space-y-2 mt-2 text-gray-400">
                                <li>회원 가입 및 관리: 회원 가입 의사 확인, 회원제 서비스 제공에 따른 본인 식별·인증</li>
                                <li>서비스 제공: 여행 계획 저장, 멤버 초대, 콘텐츠 공유 등 서비스 핵심 기능 제공</li>
                            </ul>
                        </section>

                        <section>
                            <h3 className="text-xl font-bold mb-4">2. 수집하는 개인정보의 항목</h3>
                            <p>
                                회사는 회원가입, 서비스 이용 등을 위해 아래와 같은 개인정보를 수집하고 있습니다.
                            </p>
                            <ul className="list-disc pl-5 space-y-2 mt-2 text-gray-400">
                                <li>필수항목: 이메일 주소, 비밀번호, 닉네임</li>
                                <li>자동수집항목: 서비스 이용 기록, 접속 로그, 쿠키, 접속 IP 정보</li>
                            </ul>
                        </section>

                        <section>
                            <h3 className="text-xl font-bold mb-4">3. 개인정보의 보유 및 이용 기간</h3>
                            <p>
                                회사는 법령에 따른 개인정보 보유·이용 기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은 개인정보 보유·이용 기간 내에서 개인정보를 처리·보유합니다.
                            </p>
                            <ul className="list-disc pl-5 space-y-2 mt-2 text-gray-400">
                                <li>회원 탈퇴 시까지 (단, 관계 법령 위반에 따른 수사·조사 등이 진행 중인 경우에는 해당 수사·조사 종료 시까지)</li>
                            </ul>
                        </section>

                        <section>
                            <h3 className="text-xl font-bold mb-4">4. 개인정보의 파기</h3>
                            <p>
                                회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체 없이 해당 개인정보를 파기합니다.
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
