package com.podo.server.controller;

import com.podo.server.dto.TravelRequest;
import com.podo.server.entity.Travels; // 👈 추가됨
import com.podo.server.service.TravelService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List; // 👈 추가됨

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequiredArgsConstructor
public class TravelController {

    private final TravelService travelService;

    @PostMapping("/api/travels")
    public ResponseEntity<String> createTravel(@RequestBody TravelRequest request) {
        Long travelId = travelService.createTravel(request);
        return ResponseEntity.ok("여행 방 생성 완료! ID: " + travelId);
    }

    // ⭐ 여기에 붙여넣으세요!
    @GetMapping("/api/travels")
    public ResponseEntity<List<Travels>> getAllTravels() {
        List<Travels> travels = travelService.getAllTravels();
        return ResponseEntity.ok(travels);
    }
} // 클래스 끝