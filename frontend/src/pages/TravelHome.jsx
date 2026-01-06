import { useState, useEffect } from 'react';
import { Copy, Users, Clock, MapPin, Check } from 'lucide-react';

function TravelHome({ travel, onUpdate }) {
    const [dDay, setDDay] = useState(0);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        // D-Day 계산
        const startDate = new Date(travel.startDate);
        const today = new Date();
        const diffTime = startDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        setDDay(diffDays);
    }, [travel.startDate]);

    const copyInviteCode = () => {
        navigator.clipboard.writeText(travel.inviteCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // 임시 멤버 데이터 (나중에 API로 대체)
    const members = [
        { id: 1, name: '김민지', email: 'minji@example.com', online: true },
        { id: 2, name: '박준호', email: 'junho@example.com', online: true },
        { id: 3, name: '이서연', email: 'seoyeon@example.com', online: false },
    ];

    return (
        <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-6">
                    {/* D-Day Counter */}
                    <div className="relative p-8 rounded-3xl bg-gradient-to-br from-primary/20 via-purple-600/20 to-pink-600/10 border border-primary/30 overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
                        <div className="relative">
                            <div className="flex items-center gap-3 mb-4">
                                <Clock className="w-6 h-6 text-primary" />
                                <h2 className="text-xl font-bold text-white">여행까지</h2>
                            </div>
                            <div className="flex items-baseline gap-4">
                                {dDay > 0 ? (
                                    <>
                                        <span className="text-7xl font-bold bg-gradient-to-r from-primary via-purple-400 to-pink-400 bg-clip-text text-transparent">
                                            D-{dDay}
                                        </span>
                                        <span className="text-2xl text-gray-400">
                                            {dDay === 1 ? '내일이에요!' : `${dDay}일 남았어요!`}
                                        </span>
                                    </>
                                ) : dDay === 0 ? (
                                    <span className="text-6xl font-bold text-primary animate-pulse">
                                        오늘이에요! 🎉
                                    </span>
                                ) : (
                                    <span className="text-4xl font-bold text-gray-400">
                                        여행이 종료되었습니다
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Travel Info */}
                    <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-primary" />
                            여행 정보
                        </h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400">출발일</span>
                                <span className="text-white font-semibold">{travel.startDate}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400">종료일</span>
                                <span className="text-white font-semibold">{travel.endDate}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400">여행 기간</span>
                                <span className="text-white font-semibold">
                                    {Math.ceil((new Date(travel.endDate) - new Date(travel.startDate)) / (1000 * 60 * 60 * 24)) + 1}일
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    {/* Invite Code */}
                    <div className="p-6 rounded-3xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10">
                        <h3 className="text-lg font-bold text-white mb-4">초대 코드</h3>
                        <div className="p-6 rounded-2xl bg-gradient-to-r from-primary/20 to-purple-600/20 border-2 border-primary/30 mb-4">
                            <p className="text-sm text-gray-400 mb-2 text-center">친구들과 공유하세요</p>
                            <p className="text-4xl font-bold text-center text-primary tracking-wider mb-4">
                                {travel.inviteCode}
                            </p>
                        </div>
                        <button
                            onClick={copyInviteCode}
                            className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                                copied
                                    ? 'bg-green-500/20 border-2 border-green-500/50 text-green-400'
                                    : 'bg-white/5 border-2 border-white/10 text-white hover:bg-white/10'
                            }`}
                        >
                            {copied ? (
                                <>
                                    <Check className="w-5 h-5" />
                                    <span>복사됨!</span>
                                </>
                            ) : (
                                <>
                                    <Copy className="w-5 h-5" />
                                    <span>코드 복사</span>
                                </>
                            )}
                        </button>
                    </div>

                    {/* Members */}
                    <div className="p-6 rounded-3xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <Users className="w-5 h-5 text-primary" />
                                참여 멤버
                            </h3>
                            <span className="px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-primary text-sm font-semibold">
                                {members.length}명
                            </span>
                        </div>
                        <div className="space-y-3">
                            {members.map((member) => (
                                <div
                                    key={member.id}
                                    className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all"
                                >
                                    <div className="relative">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-semibold">
                                            {member.name.charAt(0)}
                                        </div>
                                        <div
                                            className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-dark ${
                                                member.online ? 'bg-green-500' : 'bg-gray-500'
                                            }`}
                                        ></div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-white font-semibold truncate">{member.name}</p>
                                        <p className="text-xs text-gray-500 truncate">{member.email}</p>
                                    </div>
                                    <div
                                        className={`text-xs px-2 py-1 rounded-full ${
                                            member.online
                                                ? 'bg-green-500/20 text-green-400'
                                                : 'bg-gray-500/20 text-gray-400'
                                        }`}
                                    >
                                        {member.online ? '온라인' : '오프라인'}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TravelHome;
