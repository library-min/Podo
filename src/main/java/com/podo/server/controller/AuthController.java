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

    // 2. 로그인 (JWT 토큰과 사용자 정보 반환)
    @PostMapping("/login")
    public Map<String, String> login(@RequestBody Map<String, String> data) {
        Users user = authService.loginAndGetUser(data.get("email"), data.get("password"));
        String token = authService.generateToken(user.getEmail());

        Map<String, String> response = new HashMap<>();
        response.put("token", token);
        response.put("email", user.getEmail());
        response.put("nickname", user.getNickname());

        return response;
    }
}