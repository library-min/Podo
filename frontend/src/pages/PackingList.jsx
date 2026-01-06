import { useState, useEffect } from 'react';
import { Plus, Trash2, User, Sparkles } from 'lucide-react';
import axios from 'axios';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

function PackingList({ travelId }) {
    const [items, setItems] = useState([]);
    const [newItem, setNewItem] = useState({ category: '음식', name: '' });
    const [showPresetModal, setShowPresetModal] = useState(false);
    const [loading, setLoading] = useState(true);

    const categories = ['음식', '장비', '개인용품', '기타'];
    const currentUser = localStorage.getItem('userEmail') || 'user@example.com';

    // 데이터 불러오기 + 웹소켓 실시간 연결
    useEffect(() => {
        // 먼저 기존 데이터 가져오기
        fetchItems();

        // 웹소켓 연결 시작 🔌
        const socket = new SockJS('http://localhost:8080/ws-stomp');
        const stompClient = Stomp.over(socket);

        // 연결 시도
        stompClient.connect({}, () => {
            console.log('✅ 웹소켓 연결 성공! 실시간 업데이트 시작');

            // "이 방(/topic/travel/방번호)에서 일어나는 일을 구독할게!"
            stompClient.subscribe(`/topic/travel/${travelId}`, (message) => {
                // 누가 짐을 추가하거나 체크하면 서버가 이 메시지를 보냄
                if (message.body === 'UPDATE') {
                    console.log("📦 누군가 패킹 리스트를 수정했습니다! 목록을 갱신합니다.");
                    fetchItems(); // 화면 새로고침 없이 목록만 싹 갱신!
                }
            });
        }, (error) => {
            console.error('❌ 웹소켓 연결 실패:', error);
        });

        // 화면 나갈 때 연결 끊기 (뒷정리)
        return () => {
            if (stompClient && stompClient.connected) {
                stompClient.disconnect();
                console.log('🔌 웹소켓 연결 종료');
            }
        };
    }, [travelId]);

    const fetchItems = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/items/${travelId}`);
            setItems(response.data);
        } catch (error) {
            console.error('아이템 불러오기 실패:', error);
        } finally {
            setLoading(false);
        }
    };

    // 진행률 계산
    const progress = items.length > 0 ? Math.round((items.filter(item => item.isChecked).length / items.length) * 100) : 0;

    const toggleCheck = async (id) => {
        try {
            const item = items.find(i => i.id === id);
            await axios.patch(`http://localhost:8080/api/items/${id}/check`, {
                checker: currentUser
            });
            fetchItems(); // 다시 불러오기
        } catch (error) {
            console.error('체크 토글 실패:', error);
        }
    };

    const assignToMe = async (id) => {
        try {
            const item = items.find(i => i.id === id);
            await axios.patch(`http://localhost:8080/api/items/${id}/assignee`, {
                checker: currentUser
            });
            fetchItems(); // 다시 불러오기
        } catch (error) {
            console.error('담당자 지정 실패:', error);
        }
    };

    const deleteItem = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/api/items/${id}`);
            fetchItems(); // 다시 불러오기
        } catch (error) {
            console.error('삭제 실패:', error);
        }
    };

    const addItem = async () => {
        if (!newItem.name.trim()) return;

        try {
            await axios.post(`http://localhost:8080/api/items/${travelId}`, {
                name: newItem.name,
                category: newItem.category
            });
            setNewItem({ category: '음식', name: '' });
            fetchItems(); // 다시 불러오기
        } catch (error) {
            console.error('아이템 추가 실패:', error);
        }
    };

    const loadPreset = async (presetName) => {
        // 프리셋 데이터
        const presets = {
            '바베큐 파티': [
                { category: '음식', name: '고기 (3kg)' },
                { category: '음식', name: '야채 모둠' },
                { category: '음식', name: '소시지' },
                { category: '음식', name: '음료수' },
                { category: '장비', name: '바비큐 그릴' },
                { category: '장비', name: '숯 (2봉지)' },
                { category: '장비', name: '집게' },
                { category: '장비', name: '불판' },
                { category: '개인용품', name: '접시/수저' },
                { category: '개인용품', name: '휴지' },
            ],
            '캠핑': [
                { category: '장비', name: '텐트' },
                { category: '장비', name: '침낭' },
                { category: '장비', name: '랜턴' },
                { category: '음식', name: '라면' },
                { category: '음식', name: '물' },
                { category: '개인용품', name: '세면도구' },
            ],
            '호캉스': [
                { category: '개인용품', name: '수영복' },
                { category: '개인용품', name: '선크림' },
                { category: '개인용품', name: '샌들' },
                { category: '기타', name: '책' },
                { category: '기타', name: '카메라' },
            ]
        };

        const presetItems = presets[presetName] || [];

        try {
            // 모든 아이템을 순차적으로 추가
            for (const item of presetItems) {
                await axios.post(`http://localhost:8080/api/items/${travelId}`, {
                    name: item.name,
                    category: item.category
                });
            }
            fetchItems(); // 다시 불러오기
            setShowPresetModal(false);
        } catch (error) {
            console.error('프리셋 로드 실패:', error);
        }
    };

    // 카테고리별로 아이템 그룹화
    const groupedItems = categories.reduce((acc, category) => {
        acc[category] = items.filter(item => item.category === category);
        return acc;
    }, {});

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-6 py-12 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-400">패킹 리스트를 불러오는 중...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-6 py-12">
            {/* Progress Bar */}
            <div className="mb-8 p-6 rounded-3xl bg-gradient-to-br from-primary/10 to-purple-600/10 border border-primary/20">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-bold text-white">준비 진행률</h3>
                    <span className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                        {progress}%
                    </span>
                </div>
                <div className="h-4 bg-white/10 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-primary to-purple-600 transition-all duration-500 rounded-full"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
                <p className="text-sm text-gray-400 mt-2">
                    {items.filter(i => i.isChecked).length} / {items.length} 항목 완료
                </p>
            </div>

            {/* Empty State or Preset Loader */}
            {items.length === 0 && (
                <div className="text-center py-20 px-6 rounded-3xl bg-white/5 border border-white/10 border-dashed mb-8">
                    <div className="inline-flex p-6 rounded-full bg-gradient-to-br from-primary/20 to-purple-600/20 mb-6">
                        <Sparkles className="w-12 h-12 text-primary" />
                    </div>
                    <h4 className="text-2xl font-bold text-white mb-3">
                        빈 화면입니다
                    </h4>
                    <p className="text-gray-400 mb-8">
                        프리셋을 불러오거나 직접 항목을 추가해보세요
                    </p>
                    <button
                        onClick={() => setShowPresetModal(true)}
                        className="px-8 py-4 bg-gradient-to-r from-primary to-purple-600 rounded-xl text-white font-semibold hover:shadow-2xl hover:shadow-primary/50 transition-all duration-300 hover:scale-105"
                    >
                        프리셋 불러오기
                    </button>
                </div>
            )}

            {/* Add New Item */}
            <div className="mb-8 p-6 rounded-3xl bg-white/5 border border-white/10">
                <h3 className="text-lg font-bold text-white mb-4">새 항목 추가</h3>
                <div className="flex gap-3">
                    <select
                        value={newItem.category}
                        onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                        className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-all"
                    >
                        {categories.map(cat => (
                            <option key={cat} value={cat} className="bg-dark">{cat}</option>
                        ))}
                    </select>
                    <input
                        type="text"
                        value={newItem.name}
                        onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                        onKeyPress={(e) => e.key === 'Enter' && addItem()}
                        placeholder="항목 이름을 입력하세요"
                        className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-primary/50 transition-all"
                    />
                    <button
                        onClick={addItem}
                        className="px-6 py-3 bg-gradient-to-r from-primary to-purple-600 rounded-xl text-white font-semibold hover:shadow-lg hover:shadow-primary/50 transition-all duration-300 hover:scale-105 flex items-center gap-2"
                    >
                        <Plus className="w-5 h-5" />
                        추가
                    </button>
                </div>
            </div>

            {/* Packing List by Category */}
            <div className="space-y-6">
                {categories.map(category => {
                    const categoryItems = groupedItems[category];
                    if (categoryItems.length === 0) return null;

                    return (
                        <div key={category} className="p-6 rounded-3xl bg-white/5 border border-white/10">
                            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <span className="px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-primary text-sm">
                                    {category}
                                </span>
                                <span className="text-gray-500 text-sm">
                                    ({categoryItems.filter(i => i.isChecked).length}/{categoryItems.length})
                                </span>
                            </h3>
                            <div className="space-y-2">
                                {categoryItems.map(item => (
                                    <div
                                        key={item.id}
                                        className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                                            item.isChecked
                                                ? 'bg-primary/5 border-primary/30'
                                                : 'bg-white/5 border-white/10 hover:bg-white/10'
                                        }`}
                                    >
                                        {/* Checkbox */}
                                        <button
                                            onClick={() => toggleCheck(item.id)}
                                            className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                                                item.isChecked
                                                    ? 'bg-primary border-primary'
                                                    : 'border-gray-600 hover:border-primary'
                                            }`}
                                        >
                                            {item.isChecked && (
                                                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                        </button>

                                        {/* Item Name */}
                                        <span className={`flex-1 ${item.isChecked ? 'text-gray-500 line-through' : 'text-white'}`}>
                                            {item.name}
                                        </span>

                                        {/* Assignee Button */}
                                        <button
                                            onClick={() => assignToMe(item.id)}
                                            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all flex items-center gap-2 ${
                                                item.checker
                                                    ? 'bg-primary/20 border-2 border-primary/50 text-primary'
                                                    : 'bg-white/5 border-2 border-white/10 text-gray-400 hover:border-primary/30 hover:text-white'
                                            }`}
                                        >
                                            <User className="w-4 h-4" />
                                            <span>{item.checker || '담당자 지정'}</span>
                                        </button>

                                        {/* Delete Button */}
                                        <button
                                            onClick={() => deleteItem(item.id)}
                                            className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Preset Modal */}
            {showPresetModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm" onClick={() => setShowPresetModal(false)}>
                    <div className="bg-dark border border-white/10 rounded-3xl p-8 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
                        <h3 className="text-2xl font-bold text-white mb-6">프리셋 선택</h3>
                        <div className="grid grid-cols-2 gap-4">
                            {['바베큐 파티', '캠핑', '호캉스'].map(preset => (
                                <button
                                    key={preset}
                                    onClick={() => loadPreset(preset)}
                                    className="p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 hover:border-primary/30 hover:from-primary/10 hover:to-purple-600/10 transition-all text-white font-semibold text-lg"
                                >
                                    {preset}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => setShowPresetModal(false)}
                            className="w-full mt-6 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 hover:text-white transition-all"
                        >
                            취소
                        </button>
                    </div>
                </div>
            )}

            {/* Load Preset Button (always show) */}
            {items.length > 0 && (
                <div className="mt-8 text-center">
                    <button
                        onClick={() => setShowPresetModal(true)}
                        className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 hover:text-white hover:border-primary/30 transition-all"
                    >
                        프리셋 불러오기
                    </button>
                </div>
            )}
        </div>
    );
}

export default PackingList;
