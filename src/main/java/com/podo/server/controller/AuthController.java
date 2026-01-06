package com.podo.server.controller;

import com.podo.server.entity.Users;
import com.podo.server.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@CrossOrigin("*")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/api/signup")
    public String signup(@RequestBody Map<String, String> data) {
        return authService.signup(data.get("email"), data.get("password"), data.get("nickname"));
    }

    @PostMapping("/api/login")
    public Map<String, String> login(@RequestBody Map<String, String> data) {
        Users user = authService.login(data.get("email"), data.get("password"));
        if (user != null) {
            return Map.of(
                "email", user.getEmail(),
                "nickname", user.getNickname(),
                "message", user.getNickname() + "님 환영합니다!"
            );
        }
        throw new IllegalArgumentException("이메일 또는 비밀번호가 틀렸습니다.");
    }
}