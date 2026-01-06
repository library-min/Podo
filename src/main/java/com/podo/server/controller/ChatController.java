package com.podo.server.controller;

import com.podo.server.entity.ChatMessage;
import com.podo.server.repository.ChatRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequiredArgsConstructor
public class ChatController {

    private final ChatRepository chatRepository;
    private final SimpMessagingTemplate messagingTemplate;

    // 채팅 메시지 목록 조회
    @GetMapping("/api/chat/{travelId}")
    public List<ChatMessage> getMessages(@PathVariable Long travelId) {
        return chatRepository.findByTravelIdOrderByTimestampAsc(travelId);
    }

    // 채팅 메시지 전송
    @PostMapping("/api/chat/{travelId}")
    public ChatMessage sendMessage(@PathVariable Long travelId, @RequestBody ChatMessage message) {
        message.setTravelId(travelId);
        message.setTimestamp(java.time.LocalDateTime.now());
        ChatMessage savedMessage = chatRepository.save(message);

        // WebSocket으로 모든 클라이언트에게 브로드캐스트 (한 번만)
        messagingTemplate.convertAndSend("/topic/chat/" + travelId, savedMessage);

        return savedMessage;
    }
}
