package com.podo.server.controller;

import com.podo.server.entity.Member;
import com.podo.server.entity.Notification;
import com.podo.server.entity.Travels;
import com.podo.server.repository.MemberRepository;
import com.podo.server.repository.NotificationRepository;
import com.podo.server.repository.TravelRepository;

import com.podo.server.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "http://localhost:5173")
public class NotificationController {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private TravelRepository travelRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    // 특정 사용자의 알림 목록 조회
    @GetMapping("/{email}")
    public List<Notification> getNotifications(@PathVariable String email) {
        return notificationRepository.findByRecipientEmailOrderByCreatedAtDesc(email);
    }

    // 읽지 않은 알림 개수
    @GetMapping("/{email}/unread-count")
    public long getUnreadCount(@PathVariable String email) {
        return notificationRepository.countByRecipientEmailAndIsReadFalse(email);
    }

    // 알림 읽음 처리
    @PatchMapping("/{notificationId}/read")
    public Notification markAsRead(@PathVariable Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new IllegalArgumentException("알림을 찾을 수 없습니다!"));

        notification.setRead(true);
        return notificationRepository.save(notification);
    }

    // 초대 수락
    @PostMapping("/{notificationId}/accept")
    public String acceptInvitation(@PathVariable Long notificationId, @RequestBody Map<String, String> body) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new IllegalArgumentException("알림을 찾을 수 없습니다!"));

        if (!"INVITATION".equals(notification.getType())) {
            throw new IllegalArgumentException("초대 알림이 아닙니다!");
        }

        Travels travel = travelRepository.findById(notification.getTravelId())
                .orElseThrow(() -> new IllegalArgumentException("여행을 찾을 수 없습니다!"));

        // 멤버 추가 (이름을 Users 테이블에서 닉네임으로 가져옴)
        String nickname = userRepository.findByEmail(notification.getRecipientEmail())
                .map(com.podo.server.entity.Users::getNickname)
                .orElse(body.get("name") != null ? body.get("name") : notification.getRecipientEmail().split("@")[0]);

        Member newMember = new Member(
                nickname,
                notification.getRecipientEmail(),
                travel
        );
        memberRepository.save(newMember);

        // users_travels 매핑 테이블에도 추가
        userRepository.findByEmail(notification.getRecipientEmail()).ifPresent(user -> {
            user.getTravels().add(travel);
            userRepository.save(user);
        });

        // 알림 삭제
        notificationRepository.delete(notification);

        // 여행 방에 멤버 추가 알림 전송 (WebSocket)
        messagingTemplate.convertAndSend("/topic/travel/" + travel.getTravelId(), "MEMBER_JOINED");

        return "초대를 수락했습니다!";
    }

    // 초대 거절
    @PostMapping("/{notificationId}/reject")
    public String rejectInvitation(@PathVariable Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new IllegalArgumentException("알림을 찾을 수 없습니다!"));

        // 알림 삭제
        notificationRepository.delete(notification);

        return "초대를 거절했습니다.";
    }

    // 초대 알림 생성 (내부 사용)
    public void createInvitation(String recipientEmail, String senderName, Long travelId, String travelTitle) {
        String message = senderName + "님이 '" + travelTitle + "' 여행에 초대했습니다!";

        Notification notification = new Notification(
                "INVITATION",
                message,
                recipientEmail,
                senderName,
                travelId
        );

        notificationRepository.save(notification);

        // WebSocket으로 실시간 알림 전송
        messagingTemplate.convertAndSend("/topic/notifications/" + recipientEmail, notification);
    }
}
