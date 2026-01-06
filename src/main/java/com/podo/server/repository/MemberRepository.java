package com.podo.server.repository;

import com.podo.server.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MemberRepository extends JpaRepository<Member, Long> {
    // 특정 여행의 모든 멤버 조회
    List<Member> findByTravel_TravelId(Long travelId);

    // 특정 여행에 특정 이메일의 멤버가 있는지 확인
    boolean existsByTravel_TravelIdAndEmail(Long travelId, String email);
}
