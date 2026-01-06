package com.podo.server.controller;

import com.podo.server.entity.Users;
import com.podo.server.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    // 내 정보 조회
    @GetMapping("/{email}")
    public Users getUserInfo(@PathVariable String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
    }

    // 닉네임 변경
    @PatchMapping("/{email}")
    public Users updateNickname(@PathVariable String email, @RequestBody Map<String, String> body) {
        Users user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        String newNickname = body.get("nickname");
        if (newNickname != null && !newNickname.trim().isEmpty()) {
            user.setNickname(newNickname);
        }

        return userRepository.save(user);
    }

    // 회원탈퇴
    @DeleteMapping("/{email}")
    public String deleteUser(@PathVariable String email) {
        Users user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        userRepository.delete(user);
        return "회원탈퇴가 완료되었습니다.";
    }
}
