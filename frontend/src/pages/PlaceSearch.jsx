import { useState, useEffect } from 'react';
import { Search, MapPin, X } from 'lucide-react';

export default function PlaceSearch({ onSelect, onClose }) {
  const [keyword, setKeyword] = useState('');
  const [places, setPlaces] = useState([]);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 지도 초기화
  useEffect(() => {
    const loadKakaoMapScript = () => {
      return new Promise((resolve, reject) => {
        if (window.kakao && window.kakao.maps) {
          console.log('✅ Kakao SDK already loaded');
          resolve();
          return;
        }

        const existingScript = document.querySelector('script[src*="dapi.kakao.com"]');
        if (existingScript) {
          console.log('Script tag exists, waiting for load...');
          existingScript.onload = () => resolve();
          existingScript.onerror = () => reject(new Error('Script load failed'));
          return;
        }

        console.log('Loading Kakao Maps SDK...');
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'https://dapi.kakao.com/v2/maps/sdk.js?appkey=c1c7b561db27d2cac582842263059ce1&libraries=services&autoload=false';
        script.async = true;

        script.onload = () => {
          console.log('✅ Kakao SDK script loaded');
          resolve();
        };

        script.onerror = () => {
          console.error('❌ Failed to load Kakao SDK script');
          reject(new Error('Failed to load Kakao Maps SDK'));
        };

        document.head.appendChild(script);
      });
    };

    const initMap = () => {
      loadKakaoMapScript()
        .then(() => {
          if (!window.kakao || !window.kakao.maps) {
            throw new Error('Kakao Maps SDK not available');
          }

          window.kakao.maps.load(() => {
            const container = document.getElementById('kakao-map');
            if (!container) {
              throw new Error('Map container not found');
            }

            const options = {
              center: new window.kakao.maps.LatLng(37.566826, 126.9786567),
              level: 3
            };

            const newMap = new window.kakao.maps.Map(container, options);
            setMap(newMap);
            setIsLoading(false);
            console.log('✅ 카카오맵 초기화 성공!');
          });
        })
        .catch((error) => {
          console.error('❌ Map initialization failed:', error);
          setIsLoading(false);
        });
    };

    initMap();
  }, []);

  // 검색 결과가 변경될 때마다 마커 업데이트
  useEffect(() => {
    if (!map || !window.kakao) return;

    // 기존 마커 제거
    markers.forEach(marker => marker.setMap(null));

    if (places.length === 0) {
      setMarkers([]);
      return;
    }

    // 새 마커 생성
    const bounds = new window.kakao.maps.LatLngBounds();
    const newMarkers = [];

    places.forEach((place) => {
      const position = new window.kakao.maps.LatLng(place.y, place.x);
      const marker = new window.kakao.maps.Marker({
        map: map,
        position: position
      });

      // 마커 클릭 이벤트
      const infowindow = new window.kakao.maps.InfoWindow({
        content: `<div style="padding:5px;font-size:12px;color:black;">${place.place_name}</div>`
      });

      window.kakao.maps.event.addListener(marker, 'click', () => {
        infowindow.open(map, marker);
      });

      newMarkers.push(marker);
      bounds.extend(position);
    });

    setMarkers(newMarkers);
    map.setBounds(bounds);
  }, [places, map]);

  const searchPlaces = () => {
    if (!keyword.trim()) return;

    if (!window.kakao || !window.kakao.maps || !window.kakao.maps.services) {
      alert("카카오맵 API가 로드되지 않았습니다.");
      return;
    }

    const ps = new window.kakao.maps.services.Places();

    ps.keywordSearch(keyword, (data, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
        setPlaces(data);
      } else if (status === window.kakao.maps.services.Status.ZERO_RESULT) {
        alert('검색 결과가 없습니다.');
        setPlaces([]);
      } else {
        alert('검색 중 오류가 발생했습니다.');
        setPlaces([]);
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-darker w-full max-w-4xl rounded-2xl border border-gray-700 shadow-2xl h-[600px] flex overflow-hidden relative">

        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-dark/50 text-gray-400 hover:text-white hover:bg-dark/80 transition-all"
        >
          <X size={20} />
        </button>

        {/* 왼쪽: 검색 패널 */}
        <div className="w-1/3 border-r border-gray-700 flex flex-col bg-darker/50 backdrop-blur-md">
          <div className="p-4 border-b border-gray-700">
            <h3 className="text-lg font-bold text-white mb-3">장소 검색</h3>
            <div className="relative">
              <input
                type="text"
                className="w-full bg-dark border border-gray-600 rounded-xl pl-4 pr-10 py-3 text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                placeholder="장소 입력 (예: 강남역)"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && searchPlaces()}
              />
              <button
                onClick={searchPlaces}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-primary/10 rounded-lg text-primary hover:bg-primary/20 transition-all"
              >
                <Search size={18} />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
            {places.length > 0 ? (
              <div className="space-y-2">
                {places.map((place) => (
                  <div
                    key={place.id}
                    className="p-3 bg-white/5 rounded-xl hover:bg-white/10 cursor-pointer transition-all border border-transparent hover:border-primary/30 group"
                    onClick={() => {
                      onSelect({
                        placeName: place.place_name,
                        address: place.address_name,
                        x: parseFloat(place.x),
                        y: parseFloat(place.y)
                      });
                      onClose();
                    }}
                  >
                    <h4 className="font-bold text-white group-hover:text-primary transition-colors flex items-center gap-2">
                      <MapPin size={14} className="text-primary shrink-0" />
                      <span className="truncate">{place.place_name}</span>
                    </h4>
                    <p className="text-sm text-gray-400 mt-1 truncate pl-5">{place.address_name}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-500 gap-3">
                <Search size={32} className="text-gray-600" />
                <p>검색 결과가 없습니다</p>
              </div>
            )}
          </div>
        </div>

        {/* 오른쪽: 지도 영역 */}
        <div className="flex-1 relative bg-dark">
          <div id="kakao-map" className="w-full h-full"></div>
          {isLoading && (
            <div className="absolute inset-0 w-full h-full flex items-center justify-center text-gray-400 bg-dark">
              <div className="flex flex-col items-center gap-3 animate-pulse">
                <MapPin size={32} className="text-gray-600" />
                <p>지도 로딩 중...</p>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
