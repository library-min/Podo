package com.podo.server.repository;

import com.podo.server.entity.Travels;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TravelRepository extends JpaRepository<Travels, Long> {

    // 멤버 이메일로 여행 목록 조회 (Member 엔티티와 조인)
    @Query("SELECT t FROM Travels t JOIN Member m ON t.travelId = m.travel.travelId WHERE m.email = :email")
    List<Travels> findByMemberEmail(@Param("email") String email);

    // 초대코드로 여행 조회
    java.util.Optional<Travels> findByInviteCode(String inviteCode);
}