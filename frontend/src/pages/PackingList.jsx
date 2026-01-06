import { useState, useEffect } from 'react';
import axios from 'axios';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Trash2, Check, Package, Sparkles } from 'lucide-react';
import AlertModal from '../components/AlertModal';

function PackingList({ travelId }) {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [category, setCategory] = useState('음식');
  const [showPresetModal, setShowPresetModal] = useState(false);
  const [loading, setLoading] = useState(true);

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

  // 닉네임 사용 (없으면 이메일, 그것도 없으면 기본값)
  const currentUser = localStorage.getItem('userNickname') || localStorage.getItem('userEmail') || '알 수 없음';

  // 1. 초기 데이터 로드 및 웹소켓 연결
  useEffect(() => {
    fetchItems();

    const socket = new SockJS('http://localhost:8080/ws-stomp');
    const stompClient = Stomp.over(socket);

    stompClient.connect({}, () => {
      console.log('✅ 웹소켓 연결 성공!');
      stompClient.subscribe(`/topic/travel/${travelId}`, (message) => {
        if (message.body === 'UPDATE') {
          console.log('📦 실시간 업데이트!');
          fetchItems();
        }
      });
    }, (error) => {
      console.error('❌ 웹소켓 연결 실패:', error);
    });

    return () => {
      if (stompClient && stompClient.connected) {
        stompClient.disconnect();
        console.log('🔌 웹소켓 연결 종료');
      }
    };
  }, [travelId]);

  const fetchItems = () => {
    axios.get(`http://localhost:8080/api/items/${travelId}`)
      .then(res => {
        setItems(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  // 2. 짐 추가 (카테고리 포함)
  const addItem = () => {
    if (!newItem.trim()) return;
    axios.post(`http://localhost:8080/api/items/${travelId}`, {
      name: newItem,
      category: category
    });
    setNewItem('');
  };

  // 3. 체크 토글
  const toggleCheck = (itemId) => {
    axios.patch(`http://localhost:8080/api/items/${itemId}/check`, {
      checker: currentUser
    });
  };

  // 4. 삭제 기능
  const deleteItem = (itemId) => {
    if (window.confirm("정말 삭제할까요?")) {
      axios.delete(`http://localhost:8080/api/items/${itemId}`);
    }
  };

  // 5. 프리셋 로드
  const loadPreset = async (presetName) => {
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
        { category: '의류', name: '앞치마' },
      ],
      '캠핑': [
        { category: '장비', name: '텐트' },
        { category: '장비', name: '침낭' },
        { category: '장비', name: '랜턴' },
        { category: '음식', name: '라면' },
        { category: '음식', name: '물' },
        { category: '의류', name: '등산화' },
      ],
      '호캉스': [
        { category: '의류', name: '수영복' },
        { category: '의류', name: '선크림' },
        { category: '의류', name: '샌들' },
        { category: '기타', name: '책' },
        { category: '기타', name: '카메라' },
      ]
    };

    const presetItems = presets[presetName] || [];
    try {
      for (const item of presetItems) {
        await axios.post(`http://localhost:8080/api/items/${travelId}`, {
          name: item.name,
          category: item.category
        });
      }
      setShowPresetModal(false);
      showAlert('성공', `${presetName} 프리셋을 불러왔습니다!`);
    } catch (error) {
      console.error('프리셋 로드 실패:', error);
      showAlert('실패', '프리셋을 불러오는 중 오류가 발생했습니다.', 'error');
    }
  };

  // 진행률 계산
  const checkedCount = items.filter(i => i.isChecked).length;
  const progress = items.length > 0 ? Math.round((checkedCount / items.length) * 100) : 0;

  // 카테고리별로 데이터 묶기
  const groupedItems = items.reduce((acc, item) => {
    const cat = item.category || '기타';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  // 카테고리 이모지 매핑
  const categoryEmoji = {
    '음식': '🍔',
    '숙소': '🏠',
    '장비': '📷',
    '의류': '👕',
    '기타': '🎸'
  };

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
    <div className="max-w-6xl mx-auto px-6 py-8">
      <AlertModal
        isOpen={alertState.isOpen}
        onClose={alertState.onClose}
        title={alertState.title}
        message={alertState.message}
        type={alertState.type}
      />
      {/* 헤더 & 진행률 - 컴팩트 */}
      <div className="mb-6 p-5 rounded-2xl bg-gradient-to-br from-primary/10 to-purple-600/10 border border-primary/20">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <Package className="text-primary" size={24} />
            <h1 className="text-2xl font-bold text-white">짐 챙기기</h1>
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
            {progress}%
          </span>
        </div>
        <div className="h-3 bg-white/10 rounded-full overflow-hidden mb-2">
          <div
            className="h-full bg-gradient-to-r from-primary to-purple-600 transition-all duration-500 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-xs text-gray-400">
          {checkedCount} / {items.length} 항목 완료
        </p>
      </div>

      {/* Empty State - 컴팩트 */}
      {items.length === 0 && (
        <div className="text-center py-12 px-6 rounded-2xl bg-white/5 border border-white/10 border-dashed mb-6">
          <div className="inline-flex p-4 rounded-full bg-gradient-to-br from-primary/20 to-purple-600/20 mb-4">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <h4 className="text-xl font-bold text-white mb-2">빈 화면입니다</h4>
          <p className="text-sm text-gray-400 mb-6">프리셋을 불러오거나 직접 항목을 추가해보세요</p>
          <button
            onClick={() => setShowPresetModal(true)}
            className="px-6 py-2.5 bg-gradient-to-r from-primary to-purple-600 rounded-xl text-white text-sm font-semibold hover:shadow-lg hover:shadow-primary/50 transition-all"
          >
            프리셋 불러오기
          </button>
        </div>
      )}

      {/* 입력창 - 컴팩트 */}
      <div className="mb-6 p-4 rounded-2xl bg-white/5 border border-white/10">
        <h3 className="text-sm font-bold text-white mb-3">새 항목 추가</h3>
        <div className="flex gap-2">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-3 py-2.5 text-sm bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary/50 transition-all"
          >
            <option value="음식" className="bg-dark">🍔 음식</option>
            <option value="숙소" className="bg-dark">🏠 숙소</option>
            <option value="장비" className="bg-dark">📷 장비</option>
            <option value="의류" className="bg-dark">👕 의류</option>
            <option value="기타" className="bg-dark">🎸 기타</option>
          </select>
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addItem()}
            placeholder="챙길 물건 입력..."
            className="flex-1 px-3 py-2.5 text-sm bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-primary/50 transition-all"
          />
          <button
            onClick={addItem}
            className="px-5 py-2.5 text-sm bg-gradient-to-r from-primary to-purple-600 rounded-lg text-white font-semibold hover:shadow-lg hover:shadow-primary/50 transition-all"
          >
            추가
          </button>
        </div>
      </div>

      {/* 카테고리별 리스트 - 컴팩트 */}
      <div className="space-y-4">
        {Object.entries(groupedItems).map(([catName, catItems]) => (
          <div key={catName} className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
              <span className="text-xl">{categoryEmoji[catName] || '📦'}</span>
              <span className="px-2 py-0.5 rounded-full bg-primary/20 border border-primary/30 text-primary text-xs">
                {catName}
              </span>
              <span className="text-gray-500 text-xs">
                ({catItems.filter(i => i.isChecked).length}/{catItems.length})
              </span>
            </h3>
            <div className="space-y-2">
              {catItems.map(item => (
                <div
                  key={item.id}
                  className={`group flex items-center justify-between p-3 rounded-lg border transition-all ${
                    item.isChecked
                      ? 'bg-primary/5 border-primary/30'
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3 cursor-pointer" onClick={() => toggleCheck(item.id)}>
                    <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                      item.isChecked
                        ? 'bg-primary border-primary scale-110'
                        : 'border-gray-600 group-hover:border-primary'
                    }`}>
                      {item.isChecked && <Check size={12} className="text-white" />}
                    </div>
                    <span className={`text-sm transition-all ${
                      item.isChecked ? 'text-gray-500 line-through' : 'text-white'
                    }`}>
                      {item.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {item.isChecked && item.checker && (
                      <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full font-bold">
                        {item.checker}
                      </span>
                    )}
                    <button
                      onClick={() => deleteItem(item.id)}
                      className="p-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
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

      {/* Load Preset Button */}
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
