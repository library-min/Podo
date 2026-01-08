import { useEffect, useRef, useState } from 'react';
import { X, Navigation, Clock, MapPin, Undo2, CornerUpLeft, CornerUpRight, ArrowLeft, ArrowRight, ArrowUp } from 'lucide-react';
import axios from 'axios';

export default function DayRouteMap({ schedules, onClose, selectedDay }) {
  const mapRef = useRef(null);
  const [routeSummary, setRouteSummary] = useState(null);
  
  const REST_API_KEY = '4d0efc256245b6aa2b9469b3039d77ea';

  useEffect(() => {
    if (!window.kakao || schedules.length === 0) return;

    const container = mapRef.current;
    const options = {
      center: new window.kakao.maps.LatLng(37.5665, 126.9780),
      level: 3
    };

    const map = new window.kakao.maps.Map(container, options);
    const validSchedules = schedules.filter(s => s.y && s.x);
    const bounds = new window.kakao.maps.LatLngBounds();
    
    // 1. 주요 경유지(장소) 마커 생성 - 핀 모양으로 정확한 위치 표시
    validSchedules.forEach((schedule, index) => {
      const position = new window.kakao.maps.LatLng(schedule.y, schedule.x);
      
      const color = index === 0 ? '#10B981' : index === validSchedules.length - 1 ? '#EF4444' : '#7C3AED';
      
      const content = `
        <div class="location-pin" style="
          position: relative;
          display: flex; 
          flex-direction: column; 
          align-items: center;
          filter: drop-shadow(0 4px 6px rgba(0,0,0,0.4));
        ">
          <div style="
            background: ${color};
            color: white;
            width: 32px;
            height: 32px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            display: flex;
            align-items: center;
            justify-content: center;
            border: 3px solid white;
          ">
            <span style="transform: rotate(45deg); font-weight: bold; font-size: 14px;">${index + 1}</span>
          </div>
          <div style="
            position: absolute;
            top: -30px;
            background: white;
            color: #1F2937;
            padding: 4px 10px;
            border-radius: 8px;
            font-size: 12px;
            font-weight: 700;
            white-space: nowrap;
            border: 1px solid #E5E7EB;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          ">${schedule.title}</div>
        </div>
      `;

      const customOverlay = new window.kakao.maps.CustomOverlay({
        position: position,
        content: content,
        xAnchor: 0.5,
        yAnchor: 1 // 핀의 뾰족한 끝이 정확히 좌표에 오도록 설정
      });

      customOverlay.setMap(map);
      bounds.extend(position);
    });

    const drawRoute = async () => {
      if (validSchedules.length < 2) {
        if (validSchedules.length > 0) map.setBounds(bounds);
        return;
      }

      const origin = `${validSchedules[0].x},${validSchedules[0].y}`;
      const destination = `${validSchedules[validSchedules.length - 1].x},${validSchedules[validSchedules.length - 1].y}`;
      const waypoints = validSchedules.slice(1, -1)
        .map(s => `${s.x},${s.y}`)
        .join('|');

      try {
        const response = await axios.get('/kakao-navi/v1/directions', {
          headers: { Authorization: `KakaoAK ${REST_API_KEY}` },
          params: {
            origin: origin,
            destination: destination,
            waypoints: waypoints,
            priority: 'RECOMMEND'
          }
        });

        const route = response.data.routes[0];
        setRouteSummary({
          distance: (route.summary.distance / 1000).toFixed(1),
          duration: Math.round(route.summary.duration / 60)
        });

        const linePath = [];
        
        // 2. 경로 가이드(턴 포인트) 아이콘 표시
        route.sections.forEach(section => {
          // 도로 선 좌표 추출
          section.roads.forEach(road => {
            for (let i = 0; i < road.vertexes.length; i += 2) {
              linePath.push(new window.kakao.maps.LatLng(road.vertexes[i + 1], road.vertexes[i]));
            }
          });

          // 가이드(네비게이션 안내) 추출
          section.guides.forEach(guide => {
            // 주요 회전 구간만 표시 (직진 등은 제외하여 혼잡도 줄임)
            const isUTurn = guide.guidance.includes('유턴');
            const isLeft = guide.guidance.includes('좌회전');
            const isRight = guide.guidance.includes('우회전');
            
            if (isUTurn || isLeft || isRight) {
              let iconSvg = '';
              let bgColor = '';

              if (isUTurn) {
                iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5v0a5.5 5.5 0 0 1-5.5 5.5H11"/></svg>`; // U-Turn Icon
                bgColor = '#F59E0B'; // Amber for U-Turn
              } else if (isLeft) {
                iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 10 4 15 9 20"/><path d="M20 4v7a4 4 0 0 1-4 4H4"/></svg>`; // Left Turn
                bgColor = '#3B82F6'; // Blue for Left
              } else if (isRight) {
                iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 10 20 15 15 20"/><path d="M4 4v7a4 4 0 0 0 4 4h12"/></svg>`; // Right Turn
                bgColor = '#3B82F6'; // Blue for Right
              }

              const guideContent = `
                <div style="
                  background: ${bgColor};
                  width: 28px;
                  height: 28px;
                  border-radius: 50%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  border: 2px solid white;
                  box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                ">
                  ${iconSvg}
                </div>
              `;

              new window.kakao.maps.CustomOverlay({
                position: new window.kakao.maps.LatLng(guide.y, guide.x),
                content: guideContent,
                yAnchor: 0.5,
                xAnchor: 0.5
              }).setMap(map);
            }
          });
        });

        // 3. 외곽선 Polyline (더 두꺼운 흰색/검정 외곽선)
        new window.kakao.maps.Polyline({
          path: linePath,
          strokeWeight: 9,
          strokeColor: '#FFFFFF',
          strokeOpacity: 0.7,
          strokeStyle: 'solid'
        }).setMap(map);

        // 4. 메인 경로 Polyline
        new window.kakao.maps.Polyline({
          path: linePath,
          strokeWeight: 5,
          strokeColor: '#7C3AED',
          strokeOpacity: 1,
          strokeStyle: 'solid'
        }).setMap(map);
        
        map.setBounds(bounds);

      } catch (error) {
        console.warn('자동차 경로 API 실패:', error);
        const straightPath = validSchedules.map(s => new window.kakao.maps.LatLng(s.y, s.x));
        new window.kakao.maps.Polyline({
          path: straightPath,
          strokeWeight: 4,
          strokeColor: '#7C3AED',
          strokeOpacity: 0.6,
          strokeStyle: 'dashed'
        }).setMap(map);
        map.setBounds(bounds);
      }
    };

    drawRoute();

  }, [schedules]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-[#111] w-full max-w-5xl h-[85vh] rounded-[2rem] border border-white/10 relative overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="absolute top-6 left-6 right-6 z-20 flex justify-between items-start pointer-events-none">
          <div className="bg-black/60 backdrop-blur-xl px-5 py-3 rounded-2xl border border-white/10 pointer-events-auto shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                <Navigation className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">Day {selectedDay} 드라이빙 코스</h3>
                <p className="text-xs text-gray-400">네비게이션 스타일 경로 안내</p>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-3 rounded-2xl bg-white/90 text-black hover:bg-white transition-all shadow-lg pointer-events-auto"
          >
            <X size={20} />
          </button>
        </div>

        {/* Route Summary Floating Card */}
        {routeSummary && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 w-[90%] max-w-sm">
            <div className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl flex items-center justify-around">
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-1.5 text-primary mb-1">
                  <MapPin className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">총 거리</span>
                </div>
                <div className="text-white text-lg font-black">{routeSummary.distance}<span className="text-sm font-normal ml-0.5">km</span></div>
              </div>
              <div className="w-px h-8 bg-white/10"></div>
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-1.5 text-purple-400 mb-1">
                  <Clock className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">예상 시간</span>
                </div>
                <div className="text-white text-lg font-black">
                  {routeSummary.duration >= 60 ? (
                    <>
                      {Math.floor(routeSummary.duration / 60)}<span className="text-sm font-normal ml-0.5">시간</span> {routeSummary.duration % 60}<span className="text-sm font-normal ml-0.5">분</span>
                    </>
                  ) : (
                    <>{routeSummary.duration}<span className="text-sm font-normal ml-0.5">분</span></>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 지도가 그려질 영역 */}
        <div ref={mapRef} className="w-full h-full bg-[#1a1a1a]"></div>
      </div>
    </div>
  );
}
