import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

export default function DayRouteMap({ schedules, onClose, selectedDay }) {
  const mapRef = useRef(null);

  useEffect(() => {
    if (!window.kakao || schedules.length === 0) return;

    const container = mapRef.current;
    const options = {
      center: new window.kakao.maps.LatLng(37.5665, 126.9780), // 기본 서울
      level: 3
    };

    const map = new window.kakao.maps.Map(container, options);

    // 1. 마커와 좌표 배열 만들기
    const linePath = [];
    const bounds = new window.kakao.maps.LatLngBounds();

    schedules.forEach((schedule, index) => {
      // 좌표가 있는 일정만 처리
      if (schedule.y && schedule.x) {
        const position = new window.kakao.maps.LatLng(schedule.y, schedule.x);

        // 마커 생성
        const marker = new window.kakao.maps.Marker({
          position: position,
          map: map
        });

        // 인포윈도우 (마커 위에 일정 제목 띄우기)
        const content = `<div style="padding:5px; font-size:12px; color:black;">${schedule.time} ${schedule.title}</div>`;
        const infowindow = new window.kakao.maps.InfoWindow({
            content: content
        });
        infowindow.open(map, marker);

        // 선을 긋기 위해 좌표 담기
        linePath.push(position);

        // 지도가 모든 마커를 포함하도록 범위 확장
        bounds.extend(position);
      }
    });

    // 2. 경로 선 그리기 (Polyline)
    if (linePath.length > 0) {
      const polyline = new window.kakao.maps.Polyline({
        path: linePath, // 선을 구성하는 좌표배열
        strokeWeight: 5, // 선의 두께
        strokeColor: '#7C3AED', // 선 색깔 (보라색)
        strokeOpacity: 0.8, // 선의 불투명도
        strokeStyle: 'solid' // 선의 스타일
      });

      polyline.setMap(map);

      // 3. 지도의 중심과 줌 레벨을 마커들에 맞춰 자동 조절
      map.setBounds(bounds);
    }

  }, [schedules]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-darker w-full max-w-5xl h-[80vh] rounded-2xl border border-gray-700 relative overflow-hidden shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/90 text-black hover:bg-white transition-all shadow-lg"
        >
          <X size={24} />
        </button>

        <div className="absolute top-4 left-4 z-20 bg-dark/80 backdrop-blur px-4 py-2 rounded-xl border border-gray-600">
            <h3 className="text-white font-bold">🗺️ Day {selectedDay} 일정 동선</h3>
        </div>

        {/* 지도가 그려질 영역 */}
        <div ref={mapRef} className="w-full h-full bg-gray-200"></div>
      </div>
    </div>
  );
}
