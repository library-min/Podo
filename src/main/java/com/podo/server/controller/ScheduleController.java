package com.podo.server.controller;

import com.podo.server.entity.Schedule;
import com.podo.server.entity.Travels;
import com.podo.server.repository.ScheduleRepository;
import com.podo.server.repository.TravelRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/schedules")
@CrossOrigin(origins = "http://localhost:5173")
public class ScheduleController {

    @Autowired
    private ScheduleRepository scheduleRepository;

    @Autowired
    private TravelRepository travelRepository;

    // 1. 특정 Day의 일정 조회
    @GetMapping("/{travelId}/day/{day}")
    public List<Schedule> getSchedules(@PathVariable Long travelId, @PathVariable Integer day) {
        return scheduleRepository.findByTravel_TravelIdAndDayOrderByTimeAsc(travelId, day);
    }

    // 2. 일정 추가
    @PostMapping("/{travelId}")
    public Schedule addSchedule(@PathVariable Long travelId, @RequestBody Schedule scheduleDto) {
        Travels travel = travelRepository.findById(travelId)
                .orElseThrow(() -> new IllegalArgumentException("없는 여행입니다."));

        scheduleDto.setTravel(travel);
        return scheduleRepository.save(scheduleDto);
    }

    // 3. 일정 삭제
    @DeleteMapping("/{scheduleId}")
    public void deleteSchedule(@PathVariable Long scheduleId) {
        scheduleRepository.deleteById(scheduleId);
    }
}
