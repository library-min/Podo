package com.podo.server.controller;

import com.podo.server.dto.ScheduleRequest;
import com.podo.server.entity.Schedule;
import com.podo.server.service.RouteService;
import com.podo.server.service.ScheduleService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "일정 관리", description = "여행 일정 CRUD 및 최적화 API (Redis 캐싱 적용)")
@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/schedules")
@RequiredArgsConstructor
public class ScheduleController {

    private final ScheduleService scheduleService;
    private final RouteService routeService;

    @Operation(
        summary = "일정 조회 (캐싱 적용)",
        description = "특정 여행의 특정 날짜 일정을 조회합니다. 캐시에서 30분간 유지되어 빠른 응답을 제공합니다."
    )
    @GetMapping("/{travelId}/{day}")
    public List<Schedule> getSchedules(
        @Parameter(description = "여행 ID", required = true) @PathVariable Long travelId,
        @Parameter(description = "여행 일차 (1일차, 2일차 등)", required = true) @PathVariable int day) {
        return scheduleService.getSchedules(travelId, day);
    }

    @Operation(
        summary = "일정 생성 (캐시 무효화)",
        description = "새로운 일정을 생성합니다. 생성 시 해당 날짜의 캐시가 자동으로 삭제됩니다."
    )
    @PostMapping("/{travelId}")
    public Schedule createSchedule(
        @Parameter(description = "여행 ID", required = true) @PathVariable Long travelId,
        @RequestBody ScheduleRequest request) {
        return scheduleService.createSchedule(travelId, request);
    }

    @Operation(
        summary = "일정 수정 (캐시 무효화)",
        description = "기존 일정을 수정합니다. 수정 시 모든 일정 캐시가 삭제됩니다."
    )
    @PutMapping("/{scheduleId}")
    public Schedule updateSchedule(
        @Parameter(description = "일정 ID", required = true) @PathVariable Long scheduleId,
        @RequestBody ScheduleRequest request) {
        return scheduleService.updateSchedule(scheduleId, request);
    }

    @Operation(
        summary = "일정 삭제 (캐시 무효화)",
        description = "일정을 삭제합니다. 삭제 시 모든 일정 캐시가 삭제됩니다."
    )
    @DeleteMapping("/{scheduleId}")
    public void deleteSchedule(
        @Parameter(description = "일정 ID", required = true) @PathVariable Long scheduleId) {
        scheduleService.deleteSchedule(scheduleId);
    }

    @Operation(
        summary = "동선 최적화",
        description = "특정 날짜의 일정을 최적 경로로 재배치합니다 (TSP 알고리즘 적용)"
    )
    @PostMapping("/{travelId}/{day}/optimize")
    public void optimizeSchedule(
        @Parameter(description = "여행 ID", required = true) @PathVariable Long travelId,
        @Parameter(description = "여행 일차", required = true) @PathVariable int day) {
        routeService.optimizeRoute(travelId, day);
    }
}
