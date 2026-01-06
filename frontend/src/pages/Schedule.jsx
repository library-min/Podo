import { useState } from 'react';
import { Plus, Clock, MapPin, Utensils, Camera } from 'lucide-react';

function Schedule({ travel }) {
    const [selectedDay, setSelectedDay] = useState(1);

    // 여행 일수 계산
    const totalDays = Math.ceil((new Date(travel.endDate) - new Date(travel.startDate)) / (1000 * 60 * 60 * 24)) + 1;
    const days = Array.from({ length: totalDays }, (_, i) => i + 1);

    // 임시 일정 데이터
    const schedule = {
        1: [
            { id: 1, time: '09:00', type: 'travel', title: '출발!', location: '서울역', icon: MapPin, color: 'blue' },
            { id: 2, time: '12:00', type: 'meal', title: '점심 식사', location: '맛집', icon: Utensils, color: 'orange' },
            { id: 3, time: '14:00', type: 'activity', title: '관광', location: '명소 A', icon: Camera, color: 'purple' },
            { id: 4, time: '18:00', type: 'meal', title: '저녁 식사', location: '현지 맛집', icon: Utensils, color: 'orange' },
        ],
        2: [
            { id: 5, time: '10:00', type: 'activity', title: '아침 산책', location: '해변', icon: MapPin, color: 'blue' },
            { id: 6, time: '13:00', type: 'meal', title: '브런치', location: '카페', icon: Utensils, color: 'orange' },
            { id: 7, time: '15:00', type: 'activity', title: '수상 스포츠', location: '해변', icon: Camera, color: 'purple' },
        ],
        3: [
            { id: 8, time: '11:00', type: 'travel', title: '귀가', location: '집', icon: MapPin, color: 'blue' },
        ]
    };

    const daySchedule = schedule[selectedDay] || [];

    return (
        <div className="max-w-7xl mx-auto px-6 py-12">
            {/* Day Tabs */}
            <div className="mb-8 flex gap-3 overflow-x-auto scrollbar-hide pb-2">
                {days.map(day => (
                    <button
                        key={day}
                        onClick={() => setSelectedDay(day)}
                        className={`px-6 py-3 rounded-xl font-semibold whitespace-nowrap transition-all duration-300 ${
                            selectedDay === day
                                ? 'bg-gradient-to-r from-primary to-purple-600 text-white shadow-lg shadow-primary/30'
                                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
                        }`}
                    >
                        {day}일차
                    </button>
                ))}
                <button className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 hover:text-white transition-all whitespace-nowrap flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    일정 추가
                </button>
            </div>

            {/* Timeline */}
            {daySchedule.length === 0 ? (
                <div className="text-center py-20 px-6 rounded-3xl bg-white/5 border border-white/10 border-dashed">
                    <div className="inline-flex p-6 rounded-full bg-gradient-to-br from-primary/20 to-purple-600/20 mb-6">
                        <Clock className="w-12 h-12 text-primary" />
                    </div>
                    <h4 className="text-2xl font-bold text-white mb-3">
                        아직 일정이 없어요
                    </h4>
                    <p className="text-gray-400 mb-8">
                        {selectedDay}일차 일정을 추가해보세요
                    </p>
                    <button className="px-8 py-4 bg-gradient-to-r from-primary to-purple-600 rounded-xl text-white font-semibold hover:shadow-2xl hover:shadow-primary/50 transition-all duration-300 hover:scale-105 flex items-center gap-2 mx-auto">
                        <Plus className="w-5 h-5" />
                        첫 일정 추가하기
                    </button>
                </div>
            ) : (
                <div className="relative">
                    {/* Timeline Line */}
                    <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-purple-600 to-pink-600"></div>

                    {/* Timeline Items */}
                    <div className="space-y-6">
                        {daySchedule.map((item, index) => {
                            const Icon = item.icon;
                            const colorClasses = {
                                blue: 'from-blue-500 to-cyan-500',
                                orange: 'from-orange-500 to-amber-500',
                                purple: 'from-primary to-purple-600',
                            };

                            return (
                                <div key={item.id} className="relative flex gap-6 group">
                                    {/* Timeline Dot */}
                                    <div className="relative z-10">
                                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${colorClasses[item.color]} p-3 shadow-lg group-hover:scale-110 transition-transform`}>
                                            <Icon className="w-full h-full text-white" />
                                        </div>
                                    </div>

                                    {/* Content Card */}
                                    <div className="flex-1 pb-6">
                                        <div className="p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 hover:border-primary/30 transition-all group-hover:scale-[1.02]">
                                            <div className="flex items-start justify-between mb-3">
                                                <div>
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <span className="px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-primary text-sm font-semibold flex items-center gap-1">
                                                            <Clock className="w-3 h-3" />
                                                            {item.time}
                                                        </span>
                                                        <span className={`px-3 py-1 rounded-full bg-gradient-to-r ${colorClasses[item.color]} text-white text-xs font-semibold`}>
                                                            {item.type === 'travel' ? '이동' : item.type === 'meal' ? '식사' : '활동'}
                                                        </span>
                                                    </div>
                                                    <h4 className="text-2xl font-bold text-white mb-2">{item.title}</h4>
                                                    <p className="text-gray-400 flex items-center gap-2">
                                                        <MapPin className="w-4 h-4" />
                                                        {item.location}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Add More Button */}
                    <div className="relative flex gap-6 mt-6">
                        <div className="w-16"></div>
                        <button className="flex-1 p-6 rounded-2xl border-2 border-dashed border-white/20 hover:border-primary/50 bg-white/5 hover:bg-white/10 transition-all text-gray-400 hover:text-white flex items-center justify-center gap-2">
                            <Plus className="w-5 h-5" />
                            <span className="font-semibold">일정 추가하기</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Schedule;
