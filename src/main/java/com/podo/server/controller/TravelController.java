package com.podo.server.controller;

import com.podo.server.dto.TravelRequest;
import com.podo.server.entity.Travels;
import com.podo.server.service.TravelService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@Tag(name = "여행 관리", description = "Travel Management API")
@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequiredArgsConstructor
public class TravelController {

    private final TravelService travelService;

    @Operation(summary = "여행 생성", description = "Creates a new travel plan. Creator is automatically added as a member.")
    @PostMapping("/api/travels")
    public ResponseEntity<String> createTravel(@RequestBody TravelRequest request) {
        log.info("Request to create travel: {}", request.getTitle());
        Long travelId = travelService.createTravel(request, request.getCreatorEmail(), request.getCreatorName());
        return ResponseEntity.ok("Travel created! ID: " + travelId);
    }

    @Operation(summary = "내 여행 목록 조회", description = "Retrieves all travels for a specific user.")
    @GetMapping("/api/travels/my")
    public ResponseEntity<List<Travels>> getMyTravels(
        @Parameter(description = "User Email", required = true)
        @RequestParam String email) {
        log.debug("Fetching travels for user: {}", email);
        List<Travels> travels = travelService.getMyTravels(email);
        return ResponseEntity.ok(travels);
    }

    @Operation(summary = "전체 여행 조회", description = "Retrieves all travels (Admin only).")
    @GetMapping("/api/travels")
    public ResponseEntity<List<Travels>> getAllTravels() {
        log.info("Fetching all travels");
        List<Travels> travels = travelService.getAllTravels();
        return ResponseEntity.ok(travels);
    }

    @Operation(summary = "여행 상세 조회", description = "Retrieves detailed information of a specific travel.")
    @GetMapping("/api/travels/{travelId}")
    public ResponseEntity<Travels> getTravelById(
        @Parameter(description = "Travel ID", required = true)
        @PathVariable Long travelId) {
        log.debug("Fetching travel detail: {}", travelId);
        Travels travel = travelService.getTravelById(travelId);
        return ResponseEntity.ok(travel);
    }

    @Operation(summary = "초대코드로 여행 조회", description = "Retrieves travel info using an invite code.")
    @GetMapping("/api/travels/code/{inviteCode}")
    public ResponseEntity<Travels> getTravelByInviteCode(
        @Parameter(description = "Invite Code", required = true)
        @PathVariable String inviteCode) {
        log.debug("Fetching travel by code: {}", inviteCode);
        Travels travel = travelService.getTravelByInviteCode(inviteCode);
        return ResponseEntity.ok(travel);
    }

    @PostMapping("/api/travels/{travelId}/join")
    public ResponseEntity<String> joinTravel(@PathVariable Long travelId, @RequestParam String email, @RequestParam String nickname) {
        log.info("Request to join travel: ID={}, Email={}", travelId, email);
        travelService.joinTravel(travelId, email, nickname);
        return ResponseEntity.ok("Joined successfully!");
    }

    @GetMapping("/api/travels/stats")
    public ResponseEntity<com.podo.server.dto.StatsResponse> getStats(@RequestParam String email) {
        return ResponseEntity.ok(travelService.getStats(email));
    }

    @PutMapping("/api/travels/{travelId}")
    public ResponseEntity<Travels> updateTravel(@PathVariable Long travelId, @RequestBody Travels request) {
        log.info("Request to update travel: {}", travelId);
        Travels updatedTravel = travelService.updateTravel(travelId, request);
        return ResponseEntity.ok(updatedTravel);
    }

    @DeleteMapping("/api/travels/{travelId}")
    public ResponseEntity<String> deleteTravel(@PathVariable Long travelId, @RequestParam String email) {
        log.info("Request to delete travel: {}", travelId);
        try {
            travelService.deleteTravel(travelId, email);
            return ResponseEntity.ok("Travel deleted successfully.");
        } catch (RuntimeException e) {
            log.error("Delete failed: {}", e.getMessage());
            return ResponseEntity.status(403).body(e.getMessage());
        }
    }
}