import { useState, useEffect } from 'react';
import axios from 'axios';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { CheckCircle2, Plus, Trash2, BarChart2, Check } from 'lucide-react';
import AlertModal from '../components/AlertModal';

export default function VoteManager({ travelId }) {
  const [votes, setVotes] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [myVotes, setMyVotes] = useState({}); // 내가 투표한 항목들 { voteId: optionId }
  const [loading, setLoading] = useState(true);

  // 새 투표 입력 상태
  const [title, setTitle] = useState('');
  const [options, setOptions] = useState(['', '']); // 기본 입력창 2개
  
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

  useEffect(() => {
    fetchVotes();
    fetchMyVotes();
    const socket = new SockJS('http://localhost:8080/ws-stomp');
    const client = Stomp.over(socket);
    client.connect({}, () => {
      client.subscribe(`/topic/travel/${travelId}`, (msg) => {
        if (msg.body === 'VOTE_UPDATE') {
          fetchVotes();
          fetchMyVotes();
        }
      });
    });
    return () => client && client.disconnect();
  }, [travelId]);

  const fetchVotes = () => {
    axios.get(`http://localhost:8080/api/votes/${travelId}`)
      .then(res => {
          setVotes(res.data);
          setLoading(false);
      });
  };

  const fetchMyVotes = () => {
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) return;

    axios.get(`http://localhost:8080/api/votes/my-votes/${travelId}?userEmail=${userEmail}`)
      .then(res => setMyVotes(res.data))
      .catch(err => console.error('투표 기록 조회 실패:', err));
  };

  const createVote = () => {
    const validOptions = options.filter(opt => opt.trim() !== '').map(text => ({ text }));
    if (!title || validOptions.length < 2) {
        showAlert("알림", "제목과 최소 2개의 선택지를 입력하세요.", "error");
        return;
    }

    axios.post(`http://localhost:8080/api/votes/${travelId}`, {
      title,
      options: validOptions
    }).then(() => {
      setIsFormOpen(false);
      setTitle('');
      setOptions(['', '']);
    });
  };

  const castVote = (optionId, voteId) => {
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) {
      showAlert('로그인 필요', '투표하려면 로그인이 필요합니다.', 'error');
      return;
    }

    // 서버로 요청 (토글/변경 로직은 서버에서 처리)
    axios.post(`http://localhost:8080/api/votes/cast/${optionId}`, { userEmail })
      .then((res) => {
        // 성공 메시지는 필요하다면 보여주거나, 조용히 업데이트
        // fetchMyVotes()는 웹소켓이 해주지만, 반응성을 위해 즉시 호출도 가능
        fetchMyVotes();
      })
      .catch(err => {
        showAlert('오류', err.response?.data || '투표에 실패했습니다.', 'error');
      });
  };

  const deleteVote = (voteId) => {
      if(window.confirm("투표를 종료하고 삭제할까요?")) {
          axios.delete(`http://localhost:8080/api/votes/${voteId}`);
      }
  }

  // 총 득표수 계산 함수
  const getTotal = (vote) => vote.options.reduce((acc, cur) => acc + cur.count, 0);

  if (loading) {
      return (
          <div className="flex items-center justify-center h-64">
              <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          </div>
      );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <AlertModal
        isOpen={alertState.isOpen}
        onClose={alertState.onClose}
        title={alertState.title}
        message={alertState.message}
        type={alertState.type}
      />
      
      {/* 상단 헤더 & 만들기 버튼 */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold flex items-center gap-2 text-white">
            <BarChart2 className="text-primary" /> 투표 목록
        </h2>
        <button 
            onClick={() => setIsFormOpen(!isFormOpen)} 
            className={`px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg ${
                isFormOpen 
                ? 'bg-white/10 text-gray-300 hover:bg-white/20' 
                : 'bg-gradient-to-r from-primary to-purple-600 text-white hover:shadow-primary/50'
            }`}
        >
            {isFormOpen ? '취소' : '+ 새 투표 만들기'}
        </button>
      </div>

      {/* 투표 생성 폼 */}
      {isFormOpen && (
        <div className="bg-white/5 p-6 rounded-2xl border border-white/10 mb-8 animate-in fade-in slide-in-from-top-4 duration-300 backdrop-blur-sm">
            <input
                className="w-full bg-dark p-4 rounded-xl border border-white/10 text-white mb-4 outline-none focus:border-primary/50 placeholder:text-gray-600"
                placeholder="투표 제목 (예: 오늘 저녁 뭐 먹지?)"
                value={title} onChange={e => setTitle(e.target.value)}
            />
            <div className="space-y-3 mb-6">
                {options.map((opt, idx) => (
                    <div key={idx} className="flex gap-2">
                        <span className="flex-shrink-0 w-8 h-10 flex items-center justify-center text-gray-500 font-bold">{idx + 1}</span>
                        <input
                            className="w-full bg-dark/50 p-3 rounded-lg border border-white/10 text-white text-sm outline-none focus:border-primary/50"
                            placeholder={`선택지 ${idx + 1}`}
                            value={opt}
                            onChange={e => {
                                const newOpts = [...options];
                                newOpts[idx] = e.target.value;
                                setOptions(newOpts);
                            }}
                        />
                    </div>
                ))}
                <button onClick={() => setOptions([...options, ''])} className="text-sm text-primary hover:text-primary/80 font-semibold flex items-center gap-1 ml-10">
                    <Plus size={14} /> 선택지 추가하기
                </button>
            </div>
            <button onClick={createVote} className="w-full bg-gradient-to-r from-primary to-purple-600 text-white hover:shadow-lg py-3.5 rounded-xl font-bold transition-all transform active:scale-[0.99]">
                투표 생성하기
            </button>
        </div>
      )}

      {/* 투표 리스트 */}
      <div className="space-y-6">
        {votes.length === 0 && !isFormOpen && (
             <div className="text-center py-16 bg-white/5 rounded-3xl border border-white/10 border-dashed">
                 <p className="text-gray-500 mb-2">진행 중인 투표가 없습니다.</p>
                 <p className="text-sm text-gray-600">팀원들과 의견을 나누어보세요!</p>
             </div>
        )}

        {votes.map(vote => {
            const total = getTotal(vote);
            return (
                <div key={vote.id} className="bg-white/5 p-6 rounded-3xl border border-white/10 shadow-xl backdrop-blur-sm hover:border-white/20 transition-all">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h3 className="text-xl font-bold text-white mb-1">{vote.title}</h3>
                            <p className="text-xs text-gray-400">총 {total}명 참여</p>
                        </div>
                        <button onClick={() => deleteVote(vote.id)} className="p-2 hover:bg-red-500/10 rounded-lg text-gray-500 hover:text-red-400 transition-all">
                            <Trash2 size={18} />
                        </button>
                    </div>

                    <div className="space-y-3">
                        {vote.options.map(opt => {
                            const percent = total === 0 ? 0 : Math.round((opt.count / total) * 100);
                            const isMyVote = myVotes[vote.id] === opt.id;
                            const hasVoted = myVotes[vote.id] !== undefined;

                            return (
                                <div
                                    key={opt.id}
                                    onClick={() => castVote(opt.id, vote.id)}
                                    className="group relative cursor-pointer"
                                >
                                    {/* 배경 그래프 바 */}
                                    <div className={`absolute inset-0 rounded-xl overflow-hidden ${
                                        isMyVote ? 'bg-primary/20 ring-2 ring-primary ring-offset-2 ring-offset-dark' : 'bg-white/5'
                                    } transition-all`}>
                                        <div
                                            className={`h-full transition-all duration-700 ease-out ${
                                                isMyVote 
                                                ? 'bg-gradient-to-r from-primary/40 to-purple-500/40' 
                                                : 'bg-white/10 group-hover:bg-white/15'
                                            }`}
                                            style={{ width: `${percent}%` }}
                                        ></div>
                                    </div>

                                    {/* 텍스트 내용 */}
                                    <div className="relative p-4 flex justify-between items-center z-10 min-h-[56px]">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                                                isMyVote 
                                                ? 'border-primary bg-primary text-white scale-110' 
                                                : 'border-gray-500 group-hover:border-white/50'
                                            }`}>
                                                {isMyVote && <Check size={12} strokeWidth={4} />}
                                            </div>
                                            <span className={`font-medium transition-colors ${
                                                isMyVote ? 'text-white' : 'text-gray-300 group-hover:text-white'
                                            }`}>
                                                {opt.text}
                                            </span>
                                        </div>
                                        
                                        <div className="flex items-center gap-3">
                                            {/* 아바타 그룹 (추후 구현 가능) */}
                                            <div className="text-right">
                                                <div className="text-sm font-bold text-white">{percent}%</div>
                                                <div className="text-[10px] text-gray-500">{opt.count}표</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            );
        })}
      </div>
    </div>
  );
}