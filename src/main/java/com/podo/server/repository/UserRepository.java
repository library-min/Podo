package com.podo.server.repository;

import com.podo.server.entity.Role;
import com.podo.server.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<Users, Long> {
    // 이메일로 사용자를 찾는 기능이 로그인 때 꼭 필요합니다.
    Optional<Users> findByEmail(String email);

    // 특정 권한을 가진 사용자 수 조회 (관리자 대시보드용)
    long countByRole(Role role);
}