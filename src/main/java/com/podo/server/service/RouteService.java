package com.podo.server.service;

import com.podo.server.entity.Schedule;
import com.podo.server.repository.ScheduleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RouteService {

    private final ScheduleRepository scheduleRepository;

    // ⚡ 동선 최적화 로직 (Nearest Neighbor 알고리즘)
    @Transactional
    public void optimizeRoute(Long travelId, int day) {
        // 1. 해당 날짜의 모든 일정을 가져옴
        List<Schedule> originalList = scheduleRepository.findByTravel_TravelIdAndDayOrderByTimeAsc(travelId, day);
        if (originalList.size() <= 1) return; // 일정이 1개 이하면 최적화 불필요

        // 2. 시작점 설정 (가장 첫 번째 일정을 고정)
        // 첫 번째 일정은 사용자가 "숙소 출발" 등으로 설정했을 가능성이 높으므로 유지
        List<Schedule> optimizedList = new ArrayList<>();
        Schedule current = originalList.remove(0); 
        optimizedList.add(current);

        // 3. 가까운 곳 찾기 반복 (Greedy)
        while (!originalList.isEmpty()) {
            Schedule nearest = null;
            double minDistance = Double.MAX_VALUE;

            for (Schedule target : originalList) {
                // 좌표가 없는 일정은 거리 계산에서 제외하고 맨 뒤로 보낼 수도 있지만, 
                // 여기서는 좌표 있는 것들끼리 먼저 비교
                if (current.getX() == null || current.getY() == null || target.getX() == null || target.getY() == null) {
                    continue; 
                }

                double dist = calculateDistance(current.getY(), current.getX(), target.getY(), target.getX());
                if (dist < minDistance) {
                    minDistance = dist;
                    nearest = target;
                }
            }

            // 좌표가 없어서 nearest를 못 찾았거나 남은게 좌표 없는 것들뿐일 때
            if (nearest == null) {
                nearest = originalList.get(0); // 그냥 다음꺼 가져옴
            }

            // 선택된 일정을 결과 리스트에 추가
            optimizedList.add(nearest);
            originalList.remove(nearest);
            current = nearest; // 기준점 이동
        }

        // 4. 순서대로 시간 재설정
        // 첫 일정의 시간을 기준으로 1시간 30분 간격으로 재배치 (단순화된 로직)
        LocalTime startTime = parseTime(optimizedList.get(0).getTime()); 
        if (startTime == null) startTime = LocalTime.of(10, 0); // 시간이 없으면 오전 10시 시작

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm");

        for (int i = 0; i < optimizedList.size(); i++) {
            Schedule s = optimizedList.get(i);
            
            // 첫 번째 일정 시간은 유지, 그 이후부터 시간 조정
            if (i > 0) {
                // 이전 일정 시간 + 1시간 30분 (이동 및 관람 시간 고려)
                startTime = startTime.plusMinutes(90);
                s.setTime(startTime.format(formatter));
            } else {
                // 첫 일정은 포맷만 통일
                s.setTime(startTime.format(formatter));
            }
            
            scheduleRepository.save(s);
        }
    }

    // 📏 하버사인(Haversine) 공식: 두 지점(위도, 경도) 사이의 거리 계산 (단위: km)
    // lat: y, lon: x
    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371; // 지구 반지름
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                   Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                   Math.sin(dLon / 2) * Math.sin(dLon / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    private LocalTime parseTime(String timeStr) {
        try {
            if (timeStr == null || timeStr.isEmpty()) return null;
            // "9:00" 같은 경우 "09:00"으로 패딩 처리
            String[] parts = timeStr.split(":");
            if (parts.length == 2) {
                return LocalTime.of(Integer.parseInt(parts[0]), Integer.parseInt(parts[1]));
            }
            return null;
        } catch (Exception e) {
            return null;
        }
    }
}
