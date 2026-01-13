package com.podo.server.controller;

import com.podo.server.entity.Users;
import com.podo.server.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final AuthService authService;

    // 1. 회원가입
    @PostMapping("/signup")
    public String signup(@RequestBody Map<String, String> data) {
        return authService.signup(data.get("email"), data.get("password"), data.get("nickname"));
    }

    // 2. 로그인 (JWT 토큰과 사용자 정보 반환 + Redis 세션 저장)
    @PostMapping("/login")
    public Map<String, String> login(@RequestBody Map<String, String> data) {
        Users user = authService.loginAndGetUser(data.get("email"), data.get("password"));
        String token = authService.generateToken(user.getEmail()); // ✨ Redis 세션 자동 저장됨

        Map<String, String> response = new HashMap<>();
        response.put("token", token);
        response.put("email", user.getEmail());
        response.put("nickname", user.getNickname());
        response.put("role", user.getRole().name()); // 권한 정보 추가

        return response;
    }

    // 3. 로그아웃 (Redis 세션 삭제)
    @PostMapping("/logout")
    public String logout(@RequestHeader("Authorization") String authHeader) {
        // "Bearer {token}" 형식에서 토큰 추출
        String token = authHeader.replace("Bearer ", "");
        String email = authService.getEmailFromToken(token);

        authService.logout(email); // Redis 세션 삭제
        return "로그아웃 성공!";
    }
}