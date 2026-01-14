import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, MapPin, Clock, Edit2, X, Save } from 'lucide-react';
import PlaceSearch from './PlaceSearch';
import AlertModal from '../components/AlertModal';
import DayRouteMap from './DayRouteMap';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

function Schedule({ travel }) {
    const [schedules, setSchedules] = useState([]);
    const [selectedDay, setSelectedDay] = useState(1);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isMapOpen, setIsMapOpen] = useState(false);
    
    // Edit Modal State
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingSchedule, setEditingSchedule] = useState(null);

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

    const typeMapping = {
        activity: '활동',
        meal: '식사',
        travel: '이동',
        accommodation: '숙소'
    };

    useEffect(() => {
        if (travel && travel.travelId) {
            fetchSchedules();
        }
    }, [travel, selectedDay]);

    // WebSocket connection for real-time schedule updates
    useEffect(() => {
        if (!travel || !travel.travelId) return;

        const socket = new SockJS('http://localhost:8080/ws-stomp');
        const stompClient = Stomp.over(socket);

        stompClient.connect({}, () => {
            stompClient.subscribe(`/topic/travel/${travel.travelId}`, (message) => {
                if (message.body === 'SCHEDULE_OPTIMIZED') {
                    // Refresh schedules when optimization is done
                    fetchSchedules();
                }
            });
        }, (error) => {
            console.error('WebSocket connection error:', error);
        });

        return () => {
            if (stompClient && stompClient.connected) {
                stompClient.disconnect();
            }
        };
    }, [travel]);

    const fetchSchedules = () => {
        axios.get(`http://localhost:8080/api/schedules/${travel.travelId}/${selectedDay}`)
            .then(res => {
                setSchedules(res.data);
            })
            .catch(err => {
                console.error('Failed to fetch schedules:', err.message || 'Unknown error');
                showAlert('오류', '일정을 불러오는데 실패했습니다.', 'error');
            });
    };

    const handlePlaceSelect = (place) => {
        // If editing mode, update editingSchedule state
        if (isEditModalOpen && editingSchedule) {
            setEditingSchedule({
                ...editingSchedule,
                placeName: place.placeName,
                address: place.address,
                x: place.x,
                y: place.y,
                title: editingSchedule.title || place.placeName
            });
        } else {
            // New Schedule mode
            setNewSchedule({
                ...newSchedule,
                placeName: place.placeName,
                address: place.address,
                x: place.x,
                y: place.y,
                title: newSchedule.title || place.placeName 
            });
        }
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
            .catch(err => {
                if (err.response && err.response.status === 409) {
                    showAlert('충돌 감지', '누군가 먼저 수정했습니다. 목록을 새로고침합니다.', 'error');
                    fetchSchedules();
                } else {
                    console.error('Add schedule failed:', err.message);
                }
            });
    };

    // Edit Functionality
    const openEditModal = (schedule) => {
        setEditingSchedule(schedule);
        setIsEditModalOpen(true);
    };

    const handleEditSave = () => {
        if (!editingSchedule.time || !editingSchedule.title) {
            showAlert('알림', '시간과 제목은 필수입니다!', 'error');
            return;
        }

        axios.put(`http://localhost:8080/api/schedules/${editingSchedule.id}`, editingSchedule)
            .then(() => {
                fetchSchedules();
                setIsEditModalOpen(false);
                setEditingSchedule(null);
                showAlert('성공', '일정이 수정되었습니다!');
            })
            .catch(err => {
                console.error('Update schedule failed:', err.message);
                showAlert('실패', '일정 수정에 실패했습니다.', 'error');
            });
    };

    const deleteSchedule = (scheduleId) => {
        if (!window.confirm('삭제하시겠습니까?')) return;
        
        axios.delete(`http://localhost:8080/api/schedules/${scheduleId}`)
            .then(() => fetchSchedules())
            .catch(err => {
                if (err.response && err.response.status === 409) {
                    showAlert('충돌 감지', '누군가 먼저 수정했습니다. 목록을 새로고침합니다.', 'error');
                    fetchSchedules();
                } else {
                    console.error('Delete schedule failed:', err.message);
                }
            });
    };

    const handleOptimize = async () => {
        if (!window.confirm(`${selectedDay}일차 동선을 최적화할까요?\n(거리순으로 정렬되고 시간이 재설정됩니다)`)) return;

        try {
            await axios.post(`http://localhost:8080/api/schedules/${travel.travelId}/${selectedDay}/optimize`);
            fetchSchedules(); 
            showAlert('성공', "동선이 최적화되었습니다! ⚡");
        } catch (err) {
            if (err.response && err.response.status === 409) {
                showAlert('충돌 감지', '누군가 먼저 수정했습니다. 목록을 새로고침합니다.', 'error');
                fetchSchedules();
            } else {
                console.error('Optimize failed:', err.message);
                showAlert('실패', "최적화 실패", 'error');
            }
        }
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
                    {/* Header */}
                    <div className="flex justify-between items-center mb-2 px-1">
                        <h3 className="text-white font-bold text-lg">Day {selectedDay} 일정</h3>
                    </div>

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
                                        {typeMapping[schedule.type] || schedule.type}
                                    </span>
                                </div>
                                
                                {/* Action Buttons */}
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => openEditModal(schedule)}
                                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"
                                    >
                                        <Edit2 className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                        onClick={() => deleteSchedule(schedule.id)}
                                        className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
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
                                        onClick={() => {
                                            // Ensure search modal updates newSchedule
                                            setEditingSchedule(null);
                                            setIsSearchOpen(true);
                                        }}
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

                        {/* 지도로 동선 보기 버튼 */}
                        <button
                            onClick={() => setIsMapOpen(true)}
                            className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white px-4 py-3.5 rounded-2xl border border-white/10 transition-all text-sm font-bold shadow-lg"
                        >
                            지도로 동선 보기
                        </button>

                        {/* 동선 최적화 버튼 */}
                        <button
                            onClick={handleOptimize}
                            className="w-full flex items-center justify-center gap-2 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-500 px-4 py-3.5 rounded-2xl border border-yellow-500/50 transition-all text-sm font-bold shadow-lg"
                        >
                            동선 최적화
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

            {/* ✏️ Edit Schedule Modal */}
            {isEditModalOpen && editingSchedule && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-dark border border-white/10 rounded-2xl shadow-2xl p-6 w-full max-w-md animate-in fade-in zoom-in duration-200">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <Edit2 className="w-4 h-4 text-primary" />
                                일정 수정
                            </h3>
                            <button 
                                onClick={() => {
                                    setIsEditModalOpen(false);
                                    setEditingSchedule(null);
                                }}
                                className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-all"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-xs text-gray-400 mb-1 block">시간</label>
                                <input
                                    type="time"
                                    value={editingSchedule.time}
                                    onChange={(e) => setEditingSchedule({ ...editingSchedule, time: e.target.value })}
                                    className="w-full px-3 py-2.5 text-sm rounded-lg bg-white/5 border border-white/10 text-white focus:border-primary/50 outline-none"
                                />
                            </div>

                            <div>
                                <label className="text-xs text-gray-400 mb-1 block">장소</label>
                                <button
                                    onClick={() => {
                                        setIsEditModalOpen(false); // Temporarily close edit modal
                                        // But we need to keep `editingSchedule` state alive or handle it.
                                        // Better approach: Keep edit modal open, but overlay search modal? 
                                        // Or just close edit, open search, and search callback re-opens edit?
                                        // For simplicity: We will modify PlaceSearch logic to handle 'onSelect' and keep modal state.
                                        // Actually, let's keep edit modal open state true, and render Search ON TOP.
                                        setIsSearchOpen(true);
                                    }}
                                    className="w-full px-3 py-2.5 text-sm rounded-lg bg-white/5 border border-white/10 text-left text-gray-400 hover:border-primary/50 hover:text-white transition-all flex items-center justify-between group"
                                >
                                    <span className={editingSchedule.placeName ? 'text-white' : ''}>
                                        {editingSchedule.placeName || '장소 검색 (클릭하여 변경)'}
                                    </span>
                                    <MapPin className="w-3.5 h-3.5 group-hover:text-primary transition-colors" />
                                </button>
                                {editingSchedule.address && (
                                    <p className="text-xs text-gray-500 mt-1 ml-1 truncate">📍 {editingSchedule.address}</p>
                                )}
                            </div>

                            <div>
                                <label className="text-xs text-gray-400 mb-1 block">제목</label>
                                <input
                                    type="text"
                                    value={editingSchedule.title}
                                    onChange={(e) => setEditingSchedule({ ...editingSchedule, title: e.target.value })}
                                    className="w-full px-3 py-2.5 text-sm rounded-lg bg-white/5 border border-white/10 text-white focus:border-primary/50 outline-none"
                                />
                            </div>

                            <div>
                                <label className="text-xs text-gray-400 mb-1 block">유형</label>
                                <select
                                    value={editingSchedule.type}
                                    onChange={(e) => setEditingSchedule({ ...editingSchedule, type: e.target.value })}
                                    className="w-full px-3 py-2.5 text-sm rounded-lg bg-[#1a1a1a] border border-white/10 text-white focus:border-primary/50 outline-none appearance-none"
                                    style={{
                                        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                                        backgroundPosition: `right 0.5rem center`,
                                        backgroundRepeat: `no-repeat`,
                                        backgroundSize: `1.5em 1.5em`,
                                        paddingRight: `2.5rem`
                                    }}
                                >
                                    <option value="activity" className="bg-[#1a1a1a] text-white">활동</option>
                                    <option value="meal" className="bg-[#1a1a1a] text-white">식사</option>
                                    <option value="travel" className="bg-[#1a1a1a] text-white">이동</option>
                                    <option value="accommodation" className="bg-[#1a1a1a] text-white">숙소</option>
                                </select>
                            </div>

                            <button
                                onClick={handleEditSave}
                                className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-purple-600 text-white font-bold hover:shadow-lg hover:shadow-primary/30 transition-all flex items-center justify-center gap-2"
                            >
                                <Save className="w-4 h-4" />
                                수정 완료
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Schedule;