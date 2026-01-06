package com.podo.server.repository;

import com.podo.server.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    // 특정 사용자의 알림 조회 (최신순)
    List<Notification> findByRecipientEmailOrderByCreatedAtDesc(String recipientEmail);

    // 특정 사용자의 읽지 않은 알림 개수
    long countByRecipientEmailAndIsReadFalse(String recipientEmail);
}
