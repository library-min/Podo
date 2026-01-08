import { useState, useEffect } from 'react';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

// 랜덤 배경색 생성기 (사용자마다 색깔 다르게)
const stringToColor = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const c = (hash & 0x00ffffff).toString(16).toUpperCase();
  return '#' + '00000'.substring(0, 6 - c.length) + c;
};

export default function PresenceAvatars({ travelId, currentUser }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (!currentUser) return; // 로그인 안했으면 패스

    const socket = new SockJS('http://localhost:8080/ws-stomp');
    const client = Stomp.over(socket);
    
    // 로그 끄기 (콘솔창 깨끗하게)
    client.debug = () => {};

    client.connect({}, () => {
      // 1. 명단 구독 (누가 들어오거나 나가면 여기로 명단이 옴)
      client.subscribe(`/topic/travel/${travelId}/presence`, (msg) => {
        setUsers(JSON.parse(msg.body));
      });

      // 2. 입장 알리기 ("나 들어왔어!")
      client.send(`/app/travel/${travelId}/enter`, {}, currentUser);
    });

    return () => {
        if(client && client.connected) client.disconnect();
    };
  }, [travelId, currentUser]);

  return (
    <div className="flex items-center -space-x-2">
      {/* 1. 접속자 동그라미들 (최대 5명만 보여주기) */}
      {users.slice(0, 5).map((user) => (
        <div 
            key={user} 
            className="relative group cursor-default transition-all hover:-translate-y-1 hover:z-20 z-10"
        >
          {/* 아바타 원 */}
          <div 
            className="w-8 h-8 rounded-full border-2 border-dark flex items-center justify-center text-white font-bold text-xs shadow-lg overflow-hidden"
            style={{ backgroundColor: stringToColor(user) }}
            title={user}
          >
            {user.charAt(0).toUpperCase()}
          </div>
          
          {/* 온라인 표시 (초록 점) */}
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-dark rounded-full"></span>

          {/* 툴팁 (이름 보여주기) */}
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-1 bg-black/80 backdrop-blur-sm text-white text-[10px] rounded opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity pointer-events-none">
            {user === currentUser ? `${user} (나)` : user}
          </div>
        </div>
      ))}
      
      {/* 2. 접속자 수 표시 (5명 넘으면 +N 명 표시) */}
      {users.length > 5 && (
          <div className="w-8 h-8 rounded-full border-2 border-dark bg-gray-700 flex items-center justify-center text-white text-xs font-bold z-0 pl-1">
              +{users.length - 5}
          </div>
      )}
      
      {users.length > 0 && (
        <div className="ml-3 text-gray-400 text-xs font-medium">
            <span className="text-green-500 font-bold">{users.length}</span>명 접속 중
        </div>
      )}
    </div>
  );
}
