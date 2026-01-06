package com.podo.server.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter @Setter
@NoArgsConstructor
public class Notification {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String type;            // "INVITATION", "MEMBER_JOINED", etc.
    private String message;         // 알림 메시지
    private String recipientEmail;  // 받는 사람 이메일
    private String senderName;      // 보낸 사람 이름
    private Long travelId;          // 관련 여행 ID
    private boolean isRead;         // 읽음 여부
    private LocalDateTime createdAt; // 생성 시간

    public Notification(String type, String message, String recipientEmail, String senderName, Long travelId) {
        this.type = type;
        this.message = message;
        this.recipientEmail = recipientEmail;
        this.senderName = senderName;
        this.travelId = travelId;
        this.isRead = false;
        this.createdAt = LocalDateTime.now();
    }
}
