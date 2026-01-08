package com.podo.server.config;

import com.podo.server.entity.Role;
import com.podo.server.entity.Users;
import com.podo.server.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * 애플리케이션 시작 시 초기 데이터를 로드하는 클래스
 *
 * ⚠️ 중요: 관리자 계정은 오직 여기서만 생성됩니다!
 * - 일반 회원가입(/api/auth/signup)으로는 절대 관리자 계정을 만들 수 없습니다.
 * - 모든 회원가입은 무조건 일반 유저(USER)로만 등록됩니다.
 */
@Component
@RequiredArgsConstructor
public class DataLoader implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // 관리자 계정이 없으면 자동 생성 (애플리케이션 시작 시 1회만 실행)
        String adminEmail = "admin@podo.com";

        if (userRepository.findByEmail(adminEmail).isEmpty()) {
            // 4개 파라미터 생성자 사용 → Role.ADMIN 설정 가능 (오직 여기서만!)
            Users admin = new Users(
                adminEmail,
                passwordEncoder.encode("admin1234"), // 비밀번호: admin1234
                "관리자",
                Role.ADMIN  // 관리자 권한 부여
            );

            userRepository.save(admin);
            System.out.println("========================================");
            System.out.println("✅ 관리자 계정이 생성되었습니다!");
            System.out.println("📧 이메일: admin@podo.com");
            System.out.println("🔑 비밀번호: admin1234");
            System.out.println("⚠️  일반 회원가입은 모두 USER 권한으로 생성됩니다.");
            System.out.println("========================================");
        } else {
            System.out.println("ℹ️  관리자 계정이 이미 존재합니다.");
        }
    }
}
