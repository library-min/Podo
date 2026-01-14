package com.podo.server.repository;

import com.podo.server.entity.Travels;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TravelRepository extends JpaRepository<Travels, Long> {

    /**
     * 사용자가 참여한 모든 여행 조회
     * users_travels 조인 테이블을 통해 조회 (내가 만든 여행 + 참가한 여행 모두 포함)
     */
    @Query("SELECT DISTINCT t FROM Travels t JOIN t.users u WHERE u.email = :email ORDER BY t.createdAt DESC")
    List<Travels> findByMemberEmail(@Param("email") String email);

    /**
     * 초대코드로 여행 조회
     */
    java.util.Optional<Travels> findByInviteCode(String inviteCode);

    /**
     * 오늘 생성된 여행 개수 조회 (관리자 대시보드용)
     */
    @Query("SELECT COUNT(t) FROM Travels t WHERE t.createdAt >= :startOfDay AND t.createdAt < :endOfDay")
    long countTodayTravels(@Param("startOfDay") LocalDateTime startOfDay, @Param("endOfDay") LocalDateTime endOfDay);

    /**
     * 특정 기간 내 생성된 여행 개수 조회 (통계용)
     */
    long countByCreatedAtBetween(LocalDateTime start, LocalDateTime end);
}