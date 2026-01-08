package com.podo.server.controller;

import com.podo.server.entity.Schedule;
import com.podo.server.repository.ScheduleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/test")
@RequiredArgsConstructor
public class TestController {

    private final ScheduleRepository scheduleRepository;

    // 낙관적 락 테스트용 API
    // 사용법: 브라우저 탭 2개를 열고 각각 요청을 보냄
    @GetMapping("/race/{id}")
    @Transactional
    public String triggerRaceCondition(@PathVariable Long id, 
                                     @RequestParam String name, 
                                     @RequestParam int delay) throws InterruptedException {
        
        // 1. 데이터 읽기 (버전 확인)
        Schedule schedule = scheduleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("일정 없음"));
        System.out.println("🚩 [" + name + "] 데이터 읽기 완료 (버전: " + schedule.getVersion() + ")");

        // 2. 강제 딜레이 (이 사이에 다른 요청이 들어와서 데이터를 수정하도록 유도)
        if (delay > 0) {
            System.out.println("💤 [" + name + "] " + delay + "ms 동안 잠드는 중... (다른 요청 실행하세요!)");
            Thread.sleep(delay); 
            System.out.println("⚡ [" + name + "] 기상! 수정 시도...");
        }

        // 3. 데이터 수정 시도
        schedule.setTitle("수정 by " + name);
        
        // 4. 트랜잭션 종료 시점에 DB 업데이트 (이때 버전 불일치면 예외 발생)
        return "[" + name + "] 수정 완료!";
    }
}
