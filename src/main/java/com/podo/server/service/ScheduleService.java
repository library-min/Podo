package com.podo.server.service;

import com.podo.server.dto.ScheduleRequest;
import com.podo.server.entity.Schedule;
import com.podo.server.entity.Travels;
import com.podo.server.repository.ScheduleRepository;
import com.podo.server.repository.TravelRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ScheduleService {

    private final ScheduleRepository scheduleRepository;
    private final TravelRepository travelRepository;

    /**
     * 여행 일정 조회 (캐싱 적용)
     * 같은 travelId와 day로 조회 시 30분간 캐시에서 반환
     */
    @Cacheable(value = "schedules", key = "#travelId + '-' + #day")
    public List<Schedule> getSchedules(Long travelId, int day) {
        log.debug("Fetching schedules from DB: travelId={}, day={}", travelId, day);
        return scheduleRepository.findByTravel_TravelIdAndDayOrderByTimeAsc(travelId, day);
    }

    /**
     * 일정 생성 (캐시 무효화)
     * 일정이 추가되면 해당 여행의 모든 캐시를 삭제하여 데이터 정합성 유지
     */
    @Transactional
    @CacheEvict(value = "schedules", key = "#travelId + '-' + #request.day")
    public Schedule createSchedule(Long travelId, ScheduleRequest request) {
        Travels travel = travelRepository.findById(travelId)
                .orElseThrow(() -> new RuntimeException("여행을 찾을 수 없습니다."));

        Schedule schedule = new Schedule(
                request.getDay(),
                request.getTime(),
                request.getType(),
                request.getTitle(),
                request.getLocation(),
                request.getColor(),
                request.getPlaceName(),
                request.getX(),
                request.getY(),
                request.getAddress(),
                travel
        );
        log.info("Creating schedule - Cache evicted: travelId={}, day={}", travelId, request.getDay());
        return scheduleRepository.save(schedule);
    }

    /**
     * 일정 수정 (캐시 무효화)
     * 일정이 수정되면 해당 일정의 캐시를 삭제
     */
    @Transactional
    @CacheEvict(value = "schedules", allEntries = true)
    public Schedule updateSchedule(Long scheduleId, ScheduleRequest request) {
        Schedule schedule = scheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new RuntimeException("일정을 찾을 수 없습니다."));

        schedule.setTime(request.getTime());
        schedule.setTitle(request.getTitle());
        schedule.setType(request.getType());
        schedule.setPlaceName(request.getPlaceName());
        schedule.setAddress(request.getAddress());
        schedule.setX(request.getX());
        schedule.setY(request.getY());

        log.info("Updating schedule - All caches evicted");
        return scheduleRepository.save(schedule);
    }

    /**
     * 일정 삭제 (캐시 무효화)
     * 일정이 삭제되면 모든 일정 캐시를 삭제
     */
    @Transactional
    @CacheEvict(value = "schedules", allEntries = true)
    public void deleteSchedule(Long scheduleId) {
        log.info("Deleting schedule - All caches evicted");
        scheduleRepository.deleteById(scheduleId);
    }
}
