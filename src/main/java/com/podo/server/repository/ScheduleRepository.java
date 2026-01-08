package com.podo.server.repository;

import com.podo.server.entity.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, Long> {
    // 특정 여행의 특정 날짜 일정을 시간순으로 조회
    List<Schedule> findByTravel_TravelIdAndDayOrderByTimeAsc(Long travelId, Integer day);

    // 사용자별 일정 유형 통계
    @org.springframework.data.jpa.repository.Query("SELECT s.type, COUNT(s) FROM Schedule s JOIN s.travel t JOIN Member m ON t.travelId = m.travel.travelId WHERE m.email = :email GROUP BY s.type")
    List<Object[]> countTypesByMemberEmail(@org.springframework.data.repository.query.Param("email") String email);
}
