import { useEffect, useRef, useState } from 'react';
import { X, Navigation, Clock, MapPin, Play, Pause, RotateCcw } from 'lucide-react';
import axios from 'axios';

export default function DayRouteMap({ schedules, onClose, selectedDay }) {
  const mapRef = useRef(null);
  const [mapInstance, setMapInstance] = useState(null);
  const [routeSummary, setRouteSummary] = useState(null);
  const [fullPath, setFullPath] = useState([]); // Interpolated path for smooth animation
  
  // Animation State
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const requestRef = useRef(null);
  const markerRef = useRef(null);

  // 1. Initial Map Setup & Static Rendering
  useEffect(() => {
    if (!window.kakao || schedules.length === 0) return;

    const container = mapRef.current;
    const options = {
      center: new window.kakao.maps.LatLng(37.5665, 126.9780),
      level: 3
    };

    const map = new window.kakao.maps.Map(container, options);
    setMapInstance(map);

    const validSchedules = schedules.filter(s => s.y && s.x);
    const bounds = new window.kakao.maps.LatLngBounds();
    
    // Static Markers (Numbered Pins)
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
        yAnchor: 1
      });

      customOverlay.setMap(map);
      bounds.extend(position);
    });

    // Draw Route Logic
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
        // 백엔드 프록시를 통해 카카오 네비 API 호출 (API 키는 백엔드에서 처리)
        const response = await axios.get('http://localhost:8080/kakao-navi/v1/directions', {
          params: {
            origin: origin,
            destination: destination,
            ...(waypoints && { waypoints: waypoints })
          }
        });

        const route = response.data.routes[0];
        setRouteSummary({
          distance: (route.summary.distance / 1000).toFixed(1),
          duration: Math.round(route.summary.duration / 60)
        });

        const linePath = [];
        
        // Extract Coordinates for Polyline & Animation Path
        route.sections.forEach(section => {
          section.roads.forEach(road => {
            for (let i = 0; i < road.vertexes.length; i += 2) {
              linePath.push(new window.kakao.maps.LatLng(road.vertexes[i + 1], road.vertexes[i]));
            }
          });
        });

        setFullPath(linePath); // Save for animation

        // Draw Polylines
        new window.kakao.maps.Polyline({
          path: linePath,
          strokeWeight: 9,
          strokeColor: '#FFFFFF',
          strokeOpacity: 0.7,
          strokeStyle: 'solid'
        }).setMap(map);

        new window.kakao.maps.Polyline({
          path: linePath,
          strokeWeight: 5,
          strokeColor: '#7C3AED',
          strokeOpacity: 1,
          strokeStyle: 'solid'
        }).setMap(map);
        
        map.setBounds(bounds);

        // Initialize Moving Marker (Hidden initially or at start)
        const markerImage = new window.kakao.maps.MarkerImage(
            "https://cdn-icons-png.flaticon.com/512/3097/3097180.png",
            new window.kakao.maps.Size(40, 40),
            { offset: new window.kakao.maps.Point(20, 20) }
        );

        const movingMarker = new window.kakao.maps.Marker({
            position: linePath[0],
            image: markerImage,
            map: map,
            zIndex: 9999
        });
        markerRef.current = movingMarker;

      } catch (error) {
        console.warn('자동차 경로 API 실패:', error);
        // Fallback: Straight lines
        const straightPath = validSchedules.map(s => new window.kakao.maps.LatLng(s.y, s.x));
        setFullPath(straightPath);
        
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

    // Clean up
    return () => {
        cancelAnimationFrame(requestRef.current);
    };

  }, [schedules]);

  // 2. Animation Logic
  const animate = () => {
    setProgress(prev => {
        // Speed control: Smaller = Slower
        const speed = 1.5; 
        const nextProgress = prev + speed;

        if (nextProgress >= fullPath.length - 1) {
            setIsPlaying(false);
            return fullPath.length - 1;
        }

        const currentIndex = Math.floor(nextProgress);
        // Ensure we don't go out of bounds
        if (currentIndex >= fullPath.length) return prev;

        const currentPos = fullPath[currentIndex];

        if (markerRef.current) {
            markerRef.current.setPosition(currentPos);
        }
        
        if (mapInstance) {
            mapInstance.panTo(currentPos);
        }

        return nextProgress;
    });
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (isPlaying && fullPath.length > 0) {
        requestRef.current = requestAnimationFrame(animate);
    } else {
        cancelAnimationFrame(requestRef.current);
    }
    return () => cancelAnimationFrame(requestRef.current);
  }, [isPlaying, fullPath]);

  const handleReset = () => {
    setIsPlaying(false);
    setProgress(0);
    if (fullPath.length > 0 && markerRef.current) {
        markerRef.current.setPosition(fullPath[0]);
        mapInstance.panTo(fullPath[0]);
    }
  };

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
                <p className="text-xs text-gray-400">Travel Replay</p>
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

        {/* Play Control Bar (Bottom Center) - Replaces Summary or sits above it */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-4 w-[90%] max-w-md pointer-events-auto">
            
            {/* Control Buttons */}
            <div className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-full px-6 py-3 shadow-2xl flex items-center gap-6">
                <button 
                    onClick={handleReset}
                    className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-all"
                    title="리셋"
                >
                    <RotateCcw size={20} />
                </button>

                <button
                    onClick={() => {
                        if (progress >= fullPath.length - 1) {
                            setProgress(0);
                        }
                        setIsPlaying(!isPlaying);
                    }}
                    className={`flex items-center justify-center w-14 h-14 rounded-full text-white transition-all shadow-lg ${
                        isPlaying ? 'bg-orange-500 hover:bg-orange-600' : 'bg-primary hover:bg-purple-600'
                    }`}
                >
                    {isPlaying ? <Pause fill="white" size={24} /> : <Play fill="white" className="ml-1" size={24} />}
                </button>

                {/* Progress Text */}
                <div className="flex flex-col">
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">진행률</span>
                    <span className="text-sm font-bold text-white w-12">
                        {fullPath.length > 0 ? Math.round((progress / (fullPath.length - 1)) * 100) : 0}%
                    </span>
                </div>
            </div>

            {/* Route Summary (Optional - kept if user wants stats) */}
            {routeSummary && (
                <div className="flex gap-4 text-xs text-gray-400 bg-black/60 px-4 py-2 rounded-full border border-white/5">
                    <span className="flex items-center gap-1"><MapPin size={12} /> {routeSummary.distance} km</span>
                    <span className="w-px h-3 bg-white/20"></span>
                    <span className="flex items-center gap-1"><Clock size={12} /> {routeSummary.duration} 분</span>
                </div>
            )}
        </div>

        {/* 지도가 그려질 영역 */}
        <div ref={mapRef} className="w-full h-full bg-[#1a1a1a]"></div>
      </div>
    </div>
  );
}
