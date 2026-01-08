import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, MapPin, Clock } from 'lucide-react';
import PlaceSearch from './PlaceSearch';
import AlertModal from '../components/AlertModal';
import DayRouteMap from './DayRouteMap';

function Schedule({ travel }) {
    const [schedules, setSchedules] = useState([]);
    const [selectedDay, setSelectedDay] = useState(1);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isMapOpen, setIsMapOpen] = useState(false);
    
    // Alert State
    const [alertState, setAlertState] = useState({
        isOpen: false,
        title: '',
        message: '',
        type: 'success',
        onClose: () => {}
    });

    const showAlert = (title, message, type = 'success') => {
        setAlertState({
            isOpen: true,
            title,
            message,
            type,
            onClose: () => setAlertState(prev => ({ ...prev, isOpen: false }))
        });
    };

    const [newSchedule, setNewSchedule] = useState({
        time: '',
        title: '',
        type: 'activity',
        placeName: '',
        address: '',
        x: 0.0,
        y: 0.0
    });

    useEffect(() => {
        if (travel && travel.travelId) {
            fetchSchedules();
        }
    }, [travel, selectedDay]);

    const fetchSchedules = () => {
        axios.get(`http://localhost:8080/api/schedules/${travel.travelId}/day/${selectedDay}`)
            .then(res => setSchedules(res.data))
            .catch(err => console.error(err));
    };

    const handlePlaceSelect = (place) => {
        setNewSchedule({
            ...newSchedule,
            placeName: place.placeName,
            address: place.address,
            x: place.x,
            y: place.y,
            title: newSchedule.title || place.placeName // 제목이 비어있으면 장소명으로 채움
        });
    };

    const addSchedule = () => {
        if (!newSchedule.time || !newSchedule.title) {
            showAlert('알림', '시간과 제목을 입력하세요!', 'error');
            return;
        }

        axios.post(`http://localhost:8080/api/schedules/${travel.travelId}`, {
            day: selectedDay,
            ...newSchedule
        })
            .then(() => {
                fetchSchedules();
                setNewSchedule({
                    time: '',
                    title: '',
                    type: 'activity',
                    placeName: '',
                    address: '',
                    x: 0.0,
                    y: 0.0
                });
            })
            .catch(err => console.error(err));
    };

    const deleteSchedule = (scheduleId) => {
        if (!window.confirm('삭제하시겠습니까?')) return;
        
        axios.delete(`http://localhost:8080/api/schedules/${scheduleId}`)
            .then(() => fetchSchedules())
            .catch(err => console.error(err));
    };

    // 여행 기간 계산 (travel이 유효할 때만)
    if (!travel) return null;
    
    const diffDate = Math.ceil((new Date(travel.endDate) - new Date(travel.startDate)) / (1000 * 60 * 60 * 24)) + 1;
    const days = Array.from({ length: Math.max(1, isNaN(diffDate) ? 1 : diffDate) }, (_, i) => i + 1);

    return (
        <div className="max-w-6xl mx-auto px-6 py-8 relative">
            <AlertModal
                isOpen={alertState.isOpen}
                onClose={alertState.onClose}
                title={alertState.title}
                message={alertState.message}
                type={alertState.type}
            />

            {/* Day Selection - 컴팩트 */}
            <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide mb-6">
                {days.map(day => (
                    <button
                        key={day}
                        onClick={() => setSelectedDay(day)}
                        className={`flex-shrink-0 px-5 py-2 rounded-lg text-sm font-bold transition-all ${
                            selectedDay === day
                                ? 'bg-gradient-to-r from-primary to-purple-600 text-white shadow-lg shadow-primary/30'
                                : 'bg-white/5 text-gray-400 hover:bg-white/10'
                        }`}
                    >
                        Day {day}
                    </button>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Schedule List - 컴팩트 */}
                <div className="lg:col-span-2 space-y-3">
                    {schedules.map((schedule) => (
                        <div
                            key={schedule.id}
                            className="group relative p-4 rounded-xl bg-white/5 border border-white/10 hover:border-primary/50 transition-all"
                        >
                            <div className="flex items-start gap-3">
                                <div className="px-3 py-1 rounded-lg bg-primary/20 text-primary font-bold text-sm">
                                    {schedule.time}
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-white mb-1">{schedule.title}</h3>
                                    {schedule.placeName && (
                                        <p className="text-xs text-gray-400 flex items-center gap-1 mb-1">
                                            <MapPin className="w-3 h-3 text-primary" />
                                            {schedule.placeName}
                                            <span className="text-xs text-gray-500">({schedule.address})</span>
                                        </p>
                                    )}
                                    <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-gray-400 border border-white/5">
                                        {schedule.type}
                                    </span>
                                </div>
                                <button
                                    onClick={() => deleteSchedule(schedule.id)}
                                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                    ))}

                    {schedules.length === 0 && (
                        <div className="text-center py-12 bg-white/5 rounded-2xl border border-white/10 border-dashed">
                            <p className="text-sm text-gray-400">아직 일정이 없습니다</p>
                            <p className="text-xs text-gray-500 mt-1">우측의 '새 일정 추가' 폼을 이용해 일정을 등록하세요!</p>
                        </div>
                    )}
                </div>

                {/* Add Schedule Form - 컴팩트 */}
                <div className="lg:col-span-1">
                    <div className="sticky top-32 space-y-4">
                        <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-xl">
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <Plus className="w-4 h-4 text-primary" />
                                새 일정 추가
                            </h3>

                            <div className="space-y-3">
                                <div>
                                    <label className="text-xs text-gray-400 mb-1 block">시간</label>
                                    <input
                                        type="time"
                                        value={newSchedule.time}
                                        onChange={(e) => setNewSchedule({ ...newSchedule, time: e.target.value })}
                                        className="w-full px-3 py-2.5 text-sm rounded-lg bg-dark border border-white/10 text-white focus:border-primary/50 outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs text-gray-400 mb-1 block">장소</label>
                                    <button
                                        onClick={() => setIsSearchOpen(true)}
                                        className="w-full px-3 py-2.5 text-sm rounded-lg bg-dark border border-white/10 text-left text-gray-400 hover:border-primary/50 hover:text-white transition-all flex items-center justify-between group"
                                    >
                                        <span className={newSchedule.placeName ? 'text-white' : ''}>
                                            {newSchedule.placeName || '장소 검색'}
                                        </span>
                                        <MapPin className="w-3.5 h-3.5 group-hover:text-primary transition-colors" />
                                    </button>
                                    {newSchedule.address && (
                                        <p className="text-xs text-gray-500 mt-1 ml-1 truncate">📍 {newSchedule.address}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="text-xs text-gray-400 mb-1 block">제목</label>
                                    <input
                                        type="text"
                                        value={newSchedule.title}
                                        onChange={(e) => setNewSchedule({ ...newSchedule, title: e.target.value })}
                                        placeholder="일정 제목"
                                        className="w-full px-3 py-2.5 text-sm rounded-lg bg-dark border border-white/10 text-white focus:border-primary/50 outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs text-gray-400 mb-1 block">유형</label>
                                    <select
                                        value={newSchedule.type}
                                        onChange={(e) => setNewSchedule({ ...newSchedule, type: e.target.value })}
                                        className="w-full px-3 py-2.5 text-sm rounded-lg bg-dark border border-white/10 text-white focus:border-primary/50 outline-none"
                                    >
                                        <option value="activity">활동</option>
                                        <option value="meal">식사</option>
                                        <option value="travel">이동</option>
                                        <option value="accommodation">숙소</option>
                                    </select>
                                </div>

                                <button
                                    onClick={addSchedule}
                                    className="w-full py-3 text-sm rounded-lg bg-gradient-to-r from-primary to-purple-600 text-white font-bold hover:shadow-lg hover:shadow-primary/30 transition-all mt-2 active:scale-95"
                                >
                                    일정 추가하기
                                </button>
                            </div>
                        </div>

                        {/* 지도 보기 버튼을 일정 추가 폼 바로 아래로 이동 */}
                        <button
                            onClick={() => setIsMapOpen(true)}
                            className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white px-4 py-3.5 rounded-2xl border border-white/10 transition-all text-sm font-bold shadow-lg group"
                        >
                            <span className="group-hover:scale-110 transition-transform">🗺️</span>
                            지도로 동선 보기
                        </button>
                    </div>
                </div>
            </div>

            {/* Place Search Modal */}
            {isSearchOpen && (
                <PlaceSearch
                    onClose={() => setIsSearchOpen(false)}
                    onSelect={handlePlaceSelect}
                />
            )}

            {/* 동선 지도 모달 */}
            {isMapOpen && (
                <DayRouteMap
                    schedules={schedules}
                    onClose={() => setIsMapOpen(false)}
                    selectedDay={selectedDay}
                />
            )}
        </div>
    );
}

export default Schedule;