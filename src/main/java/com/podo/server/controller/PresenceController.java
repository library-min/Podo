package com.podo.server.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Controller;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Controller
public class PresenceController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    // 1. 메모리 저장소 (DB 대신 램에 저장, 서버 끄면 초기화됨)
    // travelId -> 접속자 명단(Set)
    private final Map<Long, Set<String>> roomUsers = new ConcurrentHashMap<>();
    
    // sessionId -> {travelId, username} (연결 끊길 때 누군지 찾기 위해)
    private final Map<String, UserSessionInfo> sessionMap = new ConcurrentHashMap<>();

    // 2. 입장 처리 ("나 들어왔어!")
    @MessageMapping("/travel/{travelId}/enter")
    public void enter(@DestinationVariable Long travelId, @Payload String username, StompHeaderAccessor headerAccessor) {
        // 방 명단에 추가
        roomUsers.computeIfAbsent(travelId, k -> ConcurrentHashMap.newKeySet()).add(username);
        
        // 세션 정보 저장 (나갈 때 쓰려고)
        String sessionId = headerAccessor.getSessionId();
        sessionMap.put(sessionId, new UserSessionInfo(travelId, username));

        // 방 전체에 "지금 누구누구 있는지" 명단 방송 📢
        broadcastList(travelId);
    }

    // 3. 퇴장 처리 (브라우저 종료 or 인터넷 끊김 감지)
    @EventListener
    public void handleDisconnect(SessionDisconnectEvent event) {
        String sessionId = event.getSessionId();
        UserSessionInfo info = sessionMap.remove(sessionId); // 누구였지?

        if (info != null) {
            // 방 명단에서 삭제
            Set<String> users = roomUsers.get(info.travelId);
            if (users != null) {
                users.remove(info.username);
                // 남은 사람들한테 "쟤 나갔어" 하고 명단 다시 방송 📢
                broadcastList(info.travelId);
            }
        }
    }

    // 명단 방송 헬퍼 메서드
    private void broadcastList(Long travelId) {
        Set<String> users = roomUsers.get(travelId);
        if (users != null) {
            messagingTemplate.convertAndSend("/topic/travel/" + travelId + "/presence", users);
        }
    }

    // 내부 클래스 (DTO)
    private static class UserSessionInfo {
        Long travelId;
        String username;
        public UserSessionInfo(Long travelId, String username) {
            this.travelId = travelId;
            this.username = username;
        }
    }
}