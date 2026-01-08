package com.podo.server.controller;

import com.podo.server.entity.Role;
import com.podo.server.entity.Users;
import com.podo.server.repository.TravelRepository;
import com.podo.server.repository.UserRepository;
import com.podo.server.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final TravelRepository travelRepository;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    /**
     * 관리자 대시보드 통계 데이터 조회
     * GET /api/admin/stats
     */
    @GetMapping("/stats")
    public ResponseEntity<?> getAdminStats(@RequestHeader("Authorization") String authHeader) {
        try {
            // JWT 토큰에서 "Bearer " 제거
            String token = authHeader.replace("Bearer ", "");

            // 토큰 유효성 검사
            if (!jwtUtil.validateToken(token)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "유효하지 않은 토큰입니다."));
            }

            // 토큰에서 이메일 추출
            String email = jwtUtil.getEmail(token);

            // 사용자 조회
            Users user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

            // 관리자 권한 확인
            if (user.getRole() != Role.ADMIN) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "관리자 권한이 필요합니다."));
            }

            // 전체 회원 수 (Users 테이블)
            long totalUsers = userRepository.count();

            // 전체 여행 방 개수
            long totalTravels = travelRepository.count();

            // 오늘 생성된 여행 방 개수
            LocalDateTime startOfDay = LocalDateTime.of(LocalDate.now(), LocalTime.MIN); // 오늘 00:00:00
            LocalDateTime endOfDay = LocalDateTime.of(LocalDate.now(), LocalTime.MAX);   // 오늘 23:59:59
            long todayTravels = travelRepository.countTodayTravels(startOfDay, endOfDay);

            // 관리자 수
            long totalAdmins = userRepository.countByRole(Role.ADMIN);

            // JSON 응답 생성
            Map<String, Object> stats = new HashMap<>();
            stats.put("totalUsers", totalUsers);
            stats.put("totalTravels", totalTravels);
            stats.put("todayTravels", todayTravels);
            stats.put("totalAdmins", totalAdmins);

            return ResponseEntity.ok(stats);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "서버 오류가 발생했습니다: " + e.getMessage()));
        }
    }
}
