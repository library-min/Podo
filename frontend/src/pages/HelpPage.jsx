import Navbar from '../components/Navbar';
import { HelpCircle, MessageCircle, FileQuestion } from 'lucide-react';

export default function HelpPage() {
    const faqs = [
        {
            question: "여행 초대는 어떻게 하나요?",
            answer: "여행 방에 들어간 후 우측 상단의 '초대하기' 버튼을 클릭하여 친구의 이메일을 입력하면 초대장을 보낼 수 있습니다."
        },
        {
            question: "여행 일정을 수정하고 싶어요.",
            answer: "여행 워크스페이스의 '일정' 탭에서 자유롭게 일정을 추가, 수정, 삭제할 수 있습니다. 드래그 앤 드롭으로 순서를 변경할 수도 있습니다."
        },
        {
            question: "패킹 리스트는 공유되나요?",
            answer: "네, 패킹 리스트는 모든 여행 멤버와 실시간으로 공유됩니다. 누가 어떤 물건을 챙겼는지 체크할 수 있어 중복을 방지할 수 있습니다."
        },
        {
            question: "탈퇴하고 싶어요.",
            answer: "마이페이지 하단의 '회원 탈퇴' 버튼을 통해 탈퇴할 수 있습니다. (현재 기능 준비 중입니다)"
        }
    ];

    return (
        <div className="min-h-screen bg-dark">
            <Navbar />
            
            <div className="max-w-4xl mx-auto px-6 pt-32 pb-20">
                <div className="text-center mb-16">
                    <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-primary/20 to-purple-600/20 mb-6 border border-white/10">
                        <HelpCircle className="w-8 h-8 text-primary" />
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-4">도움말 센터</h1>
                    <p className="text-gray-400 text-lg">
                        궁금한 점이 있으신가요? 자주 묻는 질문들을 확인해보세요.
                    </p>
                </div>

                <div className="grid gap-6">
                    {faqs.map((faq, index) => (
                        <div key={index} className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                            <h3 className="text-xl font-bold text-white mb-3 flex items-start gap-3">
                                <MessageCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                                {faq.question}
                            </h3>
                            <p className="text-gray-400 ml-9 leading-relaxed">
                                {faq.answer}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="mt-16 p-8 rounded-3xl bg-gradient-to-r from-primary/10 to-purple-600/10 border border-white/10 text-center">
                    <h3 className="text-xl font-bold text-white mb-2">찾으시는 답변이 없나요?</h3>
                    <p className="text-gray-400 mb-6">고객센터로 문의주시면 친절하게 안내해 드리겠습니다.</p>
                    <button className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold transition-all">
                        문의하기
                    </button>
                </div>
            </div>
        </div>
    );
}
