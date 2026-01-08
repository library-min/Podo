package com.podo.server.controller;

import com.podo.server.dto.TravelRequest;
import com.podo.server.entity.Travels;
import com.podo.server.service.TravelService;
import com.podo.server.repository.TravelRepository; // 👈 추가
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequiredArgsConstructor
public class TravelController {

    private final TravelService travelService;
    private final TravelRepository travelRepository; // 👈 추가

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

    // 여행 정보 수정
    @PutMapping("/api/travels/{travelId}")
    public ResponseEntity<Travels> updateTravel(@PathVariable Long travelId, @RequestBody Travels request) {
        Travels travel = travelRepository.findById(travelId)
                .orElseThrow(() -> new IllegalArgumentException("여행을 찾을 수 없습니다."));
        
        travel.setTitle(request.getTitle());
        travel.setStartDate(request.getStartDate());
        travel.setEndDate(request.getEndDate());
        
        return ResponseEntity.ok(travelRepository.save(travel));
    }

    // 여행 삭제
    @DeleteMapping("/api/travels/{travelId}")
    public ResponseEntity<String> deleteTravel(@PathVariable Long travelId, @RequestParam String email) {
        Travels travel = travelRepository.findById(travelId)
                .orElseThrow(() -> new IllegalArgumentException("여행을 찾을 수 없습니다."));

        // 방장인지 확인
        if (travel.getOwnerEmail() != null && !travel.getOwnerEmail().equals(email)) {
            return ResponseEntity.status(403).body("방장만 여행을 삭제할 수 있습니다.");
        }

        // 실제로는 연관된 Member, Schedule 등도 삭제해야 함 (Cascade 설정 권장)
        // 일단 DB Cascade 설정이 되어있다고 가정하거나, 에러가 나면 수동 삭제 로직 추가 필요
        travelRepository.deleteById(travelId);
        return ResponseEntity.ok("여행이 삭제되었습니다.");
    }
} // 클래스 끝