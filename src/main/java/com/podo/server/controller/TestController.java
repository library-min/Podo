package com.podo.server.controller;

import com.podo.server.entity.Schedule;
import com.podo.server.repository.ScheduleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/test")
@RequiredArgsConstructor
public class TestController {

    private final ScheduleRepository scheduleRepository;

    // Optimistic Locking Test API
    @GetMapping("/race/{id}")
    @Transactional
    public String triggerRaceCondition(@PathVariable Long id, 
                                     @RequestParam String name, 
                                     @RequestParam int delay) throws InterruptedException {
        
        // 1. Read Data
        Schedule schedule = scheduleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Schedule not found"));
        log.info("🚩 [{}] Data read (Version: {})", name, schedule.getVersion());

        // 2. Force Delay (to induce race condition)
        if (delay > 0) {
            log.info("💤 [{}] Sleeping for {}ms...", name, delay);
            Thread.sleep(delay); 
            log.info("⚡ [{}] Waking up! Attempting update...", name);
        }

        // 3. Attempt Update
        schedule.setTitle("Modified by " + name);
        
        // 4. Update on commit (Version mismatch will cause exception)
        return "[" + name + "] Modification completed!";
    }
}
