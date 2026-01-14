package com.podo.server.service;

import com.podo.server.entity.Schedule;
import com.podo.server.repository.ScheduleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

/**
 * Service for route optimization and schedule management.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class RouteService {

    private final ScheduleRepository scheduleRepository;

    /**
     * Nearest Neighbor 알고리즘을 응용한 경로 최적화 로직.
     * Haversine 공식을 사용하여 좌표 간 거리를 계산하고, Greedy 방식으로 최단 거리 경로를 재정렬함.
     * (Time Complexity: O(N^2))
     *
     * @param travelId The ID of the travel plan
     * @param day The specific day to optimize
     */
    @Transactional
    @CacheEvict(value = "schedules", key = "#travelId + '-' + #day")
    public void optimizeRoute(Long travelId, int day) {
        log.info("Optimizing route for travelId: {}, day: {}", travelId, day);

        // 1. Retrieve all schedules for the specified day
        List<Schedule> allSchedules = scheduleRepository.findByTravel_TravelIdAndDayOrderByTimeAsc(travelId, day);
        if (allSchedules.size() <= 1) {
            log.debug("Not enough schedules to optimize (size: {})", allSchedules.size());
            return;
        }

        // 2. Filter schedules with valid coordinates
        List<Schedule> schedulesWithCoords = new ArrayList<>();
        List<Schedule> schedulesWithoutCoords = new ArrayList<>();

        for (Schedule s : allSchedules) {
            if (s.getX() != null && s.getY() != null && s.getX() != 0.0 && s.getY() != 0.0) {
                schedulesWithCoords.add(s);
            } else {
                schedulesWithoutCoords.add(s);
            }
        }

        // If no schedules with coordinates, cannot optimize
        if (schedulesWithCoords.isEmpty()) {
            log.warn("No schedules with valid coordinates to optimize");
            return;
        }

        // 3. Optimize only schedules with coordinates using Nearest Neighbor algorithm
        List<Schedule> optimizedList = new ArrayList<>();
        List<Schedule> remaining = new ArrayList<>(schedulesWithCoords);

        // Start with the first schedule (keep it as the starting point)
        Schedule current = remaining.remove(0);
        optimizedList.add(current);

        // 4. Find nearest neighbors iteratively (Greedy approach)
        while (!remaining.isEmpty()) {
            Schedule nearest = null;
            double minDistance = Double.MAX_VALUE;

            for (Schedule target : remaining) {
                double dist = calculateDistance(current.getY(), current.getX(), target.getY(), target.getX());
                if (dist < minDistance) {
                    minDistance = dist;
                    nearest = target;
                }
            }

            if (nearest != null) {
                optimizedList.add(nearest);
                remaining.remove(nearest);
                current = nearest;
            } else {
                // Should not happen, but just in case
                break;
            }
        }

        // 5. Merge optimized list with schedules without coordinates
        // Place schedules without coordinates at the end
        optimizedList.addAll(schedulesWithoutCoords);

        // 6. Reschedule times sequentially
        LocalTime startTime = parseTime(allSchedules.get(0).getTime());
        if (startTime == null) {
            startTime = LocalTime.of(9, 0); // Default to 09:00 AM
        }

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm");

        for (int i = 0; i < optimizedList.size(); i++) {
            Schedule s = optimizedList.get(i);

            // Assign time with 90-minute intervals
            LocalTime scheduleTime = startTime.plusMinutes(i * 90L);
            s.setTime(scheduleTime.format(formatter));

            scheduleRepository.save(s);
            log.debug("Schedule {} updated: {} at {}", s.getId(), s.getTitle(), s.getTime());
        }

        log.info("Route optimization completed. {} schedules optimized.", optimizedList.size());
    }

    /**
     * Calculates the distance between two points using the Haversine formula.
     *
     * @param lat1 Latitude of point 1
     * @param lon1 Longitude of point 1
     * @param lat2 Latitude of point 2
     * @param lon2 Longitude of point 2
     * @return Distance in kilometers
     */
    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371; // Earth radius in km
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
            // Pad "9:00" to "09:00"
            String[] parts = timeStr.split(":");
            if (parts.length == 2) {
                return LocalTime.of(Integer.parseInt(parts[0]), Integer.parseInt(parts[1]));
            }
            return null;
        } catch (Exception e) {
            log.warn("Failed to parse time string: {}", timeStr);
            return null;
        }
    }
}
