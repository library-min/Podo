package com.podo.server.repository;

import com.podo.server.entity.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, Long> {
    // 특정 여행의 특정 날짜 일정을 시간순으로 조회
    List<Schedule> findByTravel_TravelIdAndDayOrderByTimeAsc(Long travelId, Integer day);
}
