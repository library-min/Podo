import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Settings, Users, Calendar, Trash2, LogOut, Save } from 'lucide-react';
import AlertModal from '../components/AlertModal';

function TravelSettings({ travel, onUpdate }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    startDate: '',
    endDate: ''
  });
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const userEmail = localStorage.getItem('userEmail');
  
  // 방장 여부 확인 (백엔드에서 ownerEmail을 보내준다고 가정)
  // 만약 기존 데이터에 ownerEmail이 없다면 null일 수 있음
  const isOwner = travel?.ownerEmail === userEmail;

  // Alert State
  const [alertState, setAlertState] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'success',
    onClose: () => {}
  });

  const showAlert = (title, message, type = 'success', onClose = () => {}) => {
    setAlertState({
      isOpen: true,
      title,
      message,
      type,
      onClose: () => {
        setAlertState(prev => ({ ...prev, isOpen: false }));
        onClose();
      }
    });
  };

  useEffect(() => {
    if (travel) {
      setFormData({
        title: travel.title,
        startDate: travel.startDate,
        endDate: travel.endDate
      });
      fetchMembers();
    }
  }, [travel]);

  const fetchMembers = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/members/${travel.travelId}`);
      setMembers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      await axios.put(`http://localhost:8080/api/travels/${travel.travelId}`, formData);
      showAlert('성공', '여행 정보가 수정되었습니다.');
      onUpdate(); // 부모 컴포넌트(TravelWorkspace)의 데이터 갱신
    } catch (err) {
      showAlert('오류', '수정에 실패했습니다.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTravel = async () => {
    if (!window.confirm(`정말 이 여행을 삭제하시겠습니까?
모든 일정, 투표, 패킹리스트가 삭제됩니다.`)) return;

    try {
      await axios.delete(`http://localhost:8080/api/travels/${travel.travelId}`, {
        params: { email: userEmail }
      });
      showAlert('삭제 완료', '여행이 삭제되었습니다.', 'success', () => navigate('/dashboard'));
    } catch (err) {
      showAlert('오류', '삭제에 실패했습니다. (다른 멤버가 있거나 데이터 의존성 문제일 수 있습니다)', 'error');
    }
  };

  const handleLeaveTravel = async () => {
    if (!window.confirm('정말 이 여행에서 나가시겠습니까?')) return;

    const myMemberInfo = members.find(m => m.email === userEmail);
    if (!myMemberInfo) return;

    try {
      await axios.delete(`http://localhost:8080/api/members/${myMemberInfo.id}`);
      showAlert('완료', '여행에서 나갔습니다.', 'success', () => navigate('/dashboard'));
    } catch (err) {
      showAlert('오류', '나가기에 실패했습니다.', 'error');
    }
  };

  const handleKickMember = async (memberId) => {
    if (!window.confirm('해당 멤버를 내보내시겠습니까?')) return;
    try {
      await axios.delete(`http://localhost:8080/api/members/${memberId}`);
      fetchMembers();
      showAlert('성공', '멤버를 내보냈습니다.');
    } catch (err) {
      showAlert('오류', '실패했습니다.', 'error');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <AlertModal
        isOpen={alertState.isOpen}
        onClose={alertState.onClose}
        title={alertState.title}
        message={alertState.message}
        type={alertState.type}
      />

      {/* Removed Header Text & Description as requested */}

      <div className="space-y-6">
        {/* 1. 여행 기본 정보 수정 */}
        <section className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-sm animate-in fade-in slide-in-from-top-4 duration-500">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            기본 정보
          </h2>
          
          <div className="grid gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">여행 제목</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-dark/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-all"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">시작일</label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full bg-dark/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">종료일</label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full bg-dark/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-all"
                />
              </div>
            </div>

            <div className="flex justify-end mt-2">
              <button
                onClick={handleUpdate}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/80 text-white rounded-xl font-bold transition-all disabled:opacity-50"
              >
                <Save className="w-5 h-5" />
                {loading ? '저장 중...' : '변경사항 저장'}
              </button>
            </div>
          </div>
        </section>

        {/* 2. 멤버 관리 */}
        <section className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-sm animate-in fade-in slide-in-from-top-4 duration-700">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            멤버 관리
          </h2>
          
          <div className="space-y-3">
            {members.map(member => (
              <div key={member.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-bold">
                    {member.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-white font-medium">
                      {member.name} 
                      {member.email === userEmail && <span className="ml-2 text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full">나</span>}
                      {travel.ownerEmail === member.email && <span className="ml-2 text-xs text-yellow-400 border border-yellow-400/30 bg-yellow-400/10 px-2 py-0.5 rounded-full">방장</span>}
                    </p>
                    <p className="text-xs text-gray-500">{member.email}</p>
                  </div>
                </div>
                {/* 방장만 다른 멤버를 내보낼 수 있음 (자기 자신 제외) */}
                {isOwner && member.email !== userEmail && (
                  <button
                    onClick={() => handleKickMember(member.id)}
                    className="p-2 text-gray-500 hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-all"
                    title="내보내기"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* 3. Actions (Danger Zone style removed) */}
        <div className="flex flex-col md:flex-row gap-4 pt-4 animate-in fade-in slide-in-from-top-4 duration-1000">
            <button
              onClick={handleLeaveTravel}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-gray-300 hover:text-white rounded-xl font-bold transition-all"
            >
              <LogOut className="w-5 h-5" />
              여행 나가기
            </button>
            
            {/* Only Owner can delete the travel */}
            {isOwner && (
                <button
                onClick={handleDeleteTravel}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-500 hover:text-red-400 rounded-xl font-bold transition-all"
                >
                <Trash2 className="w-5 h-5" />
                여행 삭제하기
                </button>
            )}
        </div>
      </div>
    </div>
  );
}

export default TravelSettings;