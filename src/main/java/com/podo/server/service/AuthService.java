package com.podo.server.service;

import com.podo.server.entity.Users;
import com.podo.server.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;

    // 회원가입
    public String signup(String email, String password, String nickname) {
        if (userRepository.findByEmail(email).isPresent()) {
            return "이미 존재하는 이메일입니다.";
        }
        Users user = new Users(email, password, nickname);
        userRepository.save(user);
        return "회원가입 성공!";
    }

    // 로그인
    public Users login(String email, String password) {
        Optional<Users> user = userRepository.findByEmail(email);

        // 이메일이 있고 비밀번호가 일치하면 사용자 정보 반환
        if (user.isPresent() && user.get().getPassword().equals(password)) {
            return user.get();
        }
        return null; // 로그인 실패
    }
}