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
    public ResponseEntity<String> createTravel(@RequestBody com.podo.server.dto.TravelRequest request) {
        Long travelId = travelService.createTravel(request, request.getCreatorEmail(), request.getCreatorName());
        return ResponseEntity.ok("여행 방 생성 완료! ID: " + travelId);
    }

    // 내 여행 목록 조회
    @GetMapping("/api/travels/my")
    public ResponseEntity<List<Travels>> getMyTravels(@RequestParam String email) {
        List<Travels> travels = travelService.getMyTravels(email);
        return ResponseEntity.ok(travels);
    }

    // 전체 여행 조회 (관리자용 또는 디버깅용으로 남겨둠)
    @GetMapping("/api/travels")
    public ResponseEntity<List<Travels>> getAllTravels() {
        List<Travels> travels = travelService.getAllTravels();
        return ResponseEntity.ok(travels);
    }

    // 특정 여행 조회
    @GetMapping("/api/travels/{travelId}")
    public ResponseEntity<Travels> getTravelById(@PathVariable Long travelId) {
        Travels travel = travelService.getTravelById(travelId);
        return ResponseEntity.ok(travel);
    }

    // 초대코드로 여행 조회
    @GetMapping("/api/travels/code/{inviteCode}")
    public ResponseEntity<Travels> getTravelByInviteCode(@PathVariable String inviteCode) {
        Travels travel = travelService.getTravelByInviteCode(inviteCode);
        return ResponseEntity.ok(travel);
    }

    // 여행 참가
    @PostMapping("/api/travels/{travelId}/join")
    public ResponseEntity<String> joinTravel(@PathVariable Long travelId, @RequestParam String email, @RequestParam String nickname) {
        travelService.joinTravel(travelId, email, nickname);
        return ResponseEntity.ok("여행 참가 완료!");
    }
} // 클래스 끝