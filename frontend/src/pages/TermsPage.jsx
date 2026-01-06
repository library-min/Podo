import Navbar from '../components/Navbar';
import { ScrollText } from 'lucide-react';

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-dark">
            <Navbar />
            
            <div className="max-w-4xl mx-auto px-6 pt-32 pb-20">
                <div className="text-center mb-16">
                    <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-primary/20 to-purple-600/20 mb-6 border border-white/10">
                        <ScrollText className="w-8 h-8 text-primary" />
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-4">이용약관</h1>
                    <p className="text-gray-400 text-lg">
                        Podo 서비스 이용과 관련된 약관입니다.
                    </p>
                </div>

                <div className="prose prose-invert max-w-none prose-p:text-gray-400 prose-headings:text-white prose-strong:text-white">
                    <div className="p-8 rounded-3xl bg-white/5 border border-white/10 space-y-8">
                        <section>
                            <h3 className="text-xl font-bold mb-4">제1조 (목적)</h3>
                            <p>
                                본 약관은 Podo(이하 "회사")가 제공하는 여행 계획 및 공유 서비스(이하 "서비스")의 이용과 관련하여 회사와 회원 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.
                            </p>
                        </section>

                        <section>
                            <h3 className="text-xl font-bold mb-4">제2조 (용어의 정의)</h3>
                            <ul className="list-disc pl-5 space-y-2 text-gray-400">
                                <li>"서비스"라 함은 구현되는 단말기(PC, 휴대형단말기 등 각종 유무선 장치를 포함)와 상관없이 회원이 이용할 수 있는 Podo 관련 제반 서비스를 의미합니다.</li>
                                <li>"회원"이라 함은 회사의 서비스에 접속하여 본 약관에 따라 회사와 이용계약을 체결하고 회사가 제공하는 서비스를 이용하는 고객을 말합니다.</li>
                            </ul>
                        </section>

                        <section>
                            <h3 className="text-xl font-bold mb-4">제3조 (약관의 게시와 개정)</h3>
                            <p>
                                회사는 본 약관의 내용을 회원이 쉽게 알 수 있도록 서비스 초기 화면에 게시합니다. 회사는 "약관의 규제에 관한 법률", "정보통신망 이용촉진 및 정보보호 등에 관한 법률" 등 관련법을 위배하지 않는 범위에서 본 약관을 개정할 수 있습니다.
                            </p>
                        </section>

                        <section>
                            <h3 className="text-xl font-bold mb-4">제4조 (서비스의 제공)</h3>
                            <p>
                                회사는 다음과 같은 서비스를 제공합니다.
                            </p>
                            <ul className="list-disc pl-5 space-y-2 mt-2 text-gray-400">
                                <li>여행 일정 계획 및 관리 기능</li>
                                <li>여행 멤버 초대 및 공유 기능</li>
                                <li>패킹 리스트 및 체크리스트 기능</li>
                                <li>기타 회사가 추가 개발하거나 제휴 등을 통해 회원에게 제공하는 일체의 서비스</li>
                            </ul>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
