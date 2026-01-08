package com.podo.server.service;

import com.podo.server.entity.Users;
import com.podo.server.repository.UserRepository;
import com.podo.server.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    // 회원가입
    public String signup(String email, String password, String nickname) {
        if (userRepository.findByEmail(email).isPresent()) {
            throw new IllegalArgumentException("이미 존재하는 이메일입니다.");
        }
        // 비밀번호 암호화하여 저장
        Users user = new Users(email, passwordEncoder.encode(password), nickname);
        userRepository.save(user);
        return "회원가입 성공!";
    }

    // 로그인 (JWT 토큰과 사용자 정보 반환)
    public Users loginAndGetUser(String email, String password) {
        Optional<Users> userOpt = userRepository.findByEmail(email);

        if (userOpt.isEmpty()) {
            throw new IllegalArgumentException("가입되지 않은 이메일입니다.");
        }

        Users user = userOpt.get();

        // 암호화된 비밀번호 검증
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new IllegalArgumentException("비밀번호가 틀렸습니다.");
        }

        return user;
    }

    // JWT 토큰 생성
    public String generateToken(String email) {
        return jwtUtil.generateToken(email);
    }
}