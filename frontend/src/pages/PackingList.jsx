import { useState, useEffect } from 'react';
import axios from 'axios';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Trash2, Check, Package, Plus, UserCircle2 } from 'lucide-react';
import AlertModal from '../components/AlertModal';

function PackingList({ travelId }) {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [category, setCategory] = useState('음식');
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

  const currentUser = localStorage.getItem('userNickname') || localStorage.getItem('userEmail') || '알 수 없음';

  useEffect(() => {
    fetchItems();
    const socket = new SockJS('http://localhost:8080/ws-stomp');
    const stompClient = Stomp.over(socket);

    stompClient.connect({}, () => {
      stompClient.subscribe(`/topic/travel/${travelId}`, (message) => {
        if (message.body === 'UPDATE') {
          fetchItems();
        }
      });
    }, (error) => console.error(error));

    return () => stompClient && stompClient.connected && stompClient.disconnect();
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

  const addItem = () => {
    if (!newItem.trim()) return;
    axios.post(`http://localhost:8080/api/items/${travelId}`, {
      name: newItem,
      category: category
    });
    setNewItem('');
  };

  // 체크 토글 (완료 여부)
  const toggleCheck = (item, e) => {
    e.stopPropagation();
    
    // 담당자가 지정되지 않은 경우 체크 불가
    if (!item.assignee) {
      showAlert('알림', '먼저 담당자를 지정해주세요!', 'error');
      return;
    }

    axios.patch(`http://localhost:8080/api/items/${item.id}/check`, {
      checker: currentUser
    });
  };

  // 담당자(챙겨올 사람) 지정 토글
  const toggleAssignee = (itemId, e) => {
    e.stopPropagation();
    axios.patch(`http://localhost:8080/api/items/${itemId}/assignee`, {
      assignee: currentUser
    });
  };

  const deleteItem = (itemId) => {
    if (window.confirm("정말 삭제할까요?")) {
      axios.delete(`http://localhost:8080/api/items/${itemId}`);
    }
  };

  // Stats
  const checkedCount = items.filter(i => i.isChecked).length;
  const totalCount = items.length;
  const progress = totalCount > 0 ? Math.round((checkedCount / totalCount) * 100) : 0;

  // Grouping
  const groupedItems = items.reduce((acc, item) => {
    const cat = item.category || '기타';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  const categoryEmoji = { '음식': '🍔', '숙소': '🏠', '장비': '📷', '의류': '👕', '기타': '🎸' };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
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

      {/* Modern Minimal Progress Bar Header */}
      <div className="mb-10 animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="flex justify-between items-end mb-4">
            <div className="flex flex-col gap-1">
                <span className="text-4xl font-black text-white tracking-tighter">
                    {progress}<span className="text-xl text-primary ml-1">%</span>
                </span>
                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">완료율</span>
            </div>
            <div className="text-right">
                <span className="text-sm font-bold text-gray-400">
                    {checkedCount} <span className="text-gray-600">/ {totalCount} 항목</span>
                </span>
            </div>
        </div>
        
        {/* Sleek Progress Bar with Glow */}
        <div className="relative h-4 w-full bg-white/5 rounded-full overflow-hidden backdrop-blur-sm border border-white/5">
            <div 
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary via-purple-500 to-pink-500 shadow-[0_0_20px_rgba(139,92,246,0.5)] transition-all duration-1000 ease-out rounded-full"
                style={{ width: `${progress}%` }}
            >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg] animate-[shine_2s_infinite]"></div>
            </div>
        </div>
      </div>

      {/* Input Section */}
      <div className="mb-10">
        <div className="p-2 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl flex flex-col sm:flex-row gap-2 shadow-2xl">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-3 bg-dark/50 border border-white/5 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all cursor-pointer min-w-[120px]"
          >
            <option value="음식" className="bg-dark">음식</option>
            <option value="숙소" className="bg-dark">숙소</option>
            <option value="장비" className="bg-dark">장비</option>
            <option value="의류" className="bg-dark">의류</option>
            <option value="기타" className="bg-dark">기타</option>
          </select>
          <div className="flex-1">
            <input
              type="text"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addItem()}
              placeholder="추가할 짐을 입력하세요..."
              className="w-full h-full px-5 py-3 bg-dark/50 border border-white/5 rounded-xl text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
            />
          </div>
          <button
            onClick={addItem}
            className="px-8 py-3 bg-gradient-to-r from-primary to-purple-600 rounded-xl text-white font-black hover:shadow-lg hover:shadow-primary/50 transition-all flex items-center justify-center gap-2 whitespace-nowrap active:scale-95"
          >
            <Plus className="w-5 h-5 stroke-[3]" /> ADD
          </button>
        </div>
      </div>

      {/* Masonry Grid */}
      <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
        {Object.entries(groupedItems).map(([catName, catItems]) => (
          <div key={catName} className="break-inside-avoid p-5 rounded-[2rem] bg-white/5 border border-white/10 hover:border-white/20 transition-all backdrop-blur-sm">
            <h3 className="text-base font-black text-white/90 mb-4 flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                  <span className="text-xl">{categoryEmoji[catName] || '📦'}</span>
                  <span className="tracking-tight">{catName}</span>
              </div>
              <span className="text-[10px] font-black px-2 py-1 rounded-full bg-white/10 text-gray-400 uppercase tracking-tighter">
                {catItems.filter(i => i.isChecked).length} / {catItems.length}
              </span>
            </h3>
            <div className="space-y-2">
              {catItems.map(item => (
                <div
                  key={item.id}
                  className={`group flex items-center justify-between p-3.5 rounded-2xl border transition-all duration-300 ${
                    item.isChecked
                      ? 'bg-primary/5 border-primary/20'
                      : 'bg-white/[0.02] border-transparent hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {/* Checkbox for Completion */}
                    <div 
                        onClick={(e) => toggleCheck(item, e)}
                        className={`flex-shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-300 ${
                        item.isChecked
                            ? 'bg-primary border-primary scale-100'
                            : item.assignee 
                                ? 'border-gray-700 hover:border-gray-500 scale-95 cursor-pointer' 
                                : 'border-gray-800 opacity-50 cursor-not-allowed'
                        }`}
                    >
                      {item.isChecked && <Check size={14} className="text-white" strokeWidth={4} />}
                    </div>

                    {/* Item Name */}
                    <span 
                        onClick={(e) => toggleCheck(item, e)}
                        className={`text-sm font-semibold truncate transition-all ${
                        item.isChecked ? 'text-gray-600 line-through decoration-2' : 'text-gray-300'
                    } ${item.assignee ? 'cursor-pointer' : 'cursor-not-allowed'}`}>
                      {item.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Assignee Button / Display */}
                    <button
                        onClick={(e) => toggleAssignee(item.id, e)}
                        className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border transition-all ${
                            item.assignee 
                            ? 'bg-primary/20 border-primary/30 text-primary hover:bg-red-500/20 hover:border-red-500/30 hover:text-red-400' 
                            : 'bg-white/5 border-white/5 text-gray-500 hover:bg-white/10 hover:text-gray-300'
                        }`}
                        title={item.assignee ? "클릭하여 담당자 해제" : "클릭하여 나를 담당자로 지정"}
                    >
                        <UserCircle2 size={14} />
                        <span className="text-[10px] font-bold max-w-[60px] truncate">
                            {item.assignee || '담당'}
                        </span>
                    </button>

                    <button
                      onClick={() => deleteItem(item.id)}
                      className="p-1.5 rounded-lg text-gray-700 hover:text-red-400 transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <style>{`
        @keyframes shine {
          0% { transform: translateX(-100%) skewX(-20deg); }
          100% { transform: translateX(200%) skewX(-20deg); }
        }
      `}</style>
    </div>
  );
}

export default PackingList;