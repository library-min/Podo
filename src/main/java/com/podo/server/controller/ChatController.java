package com.podo.server.controller;

import com.podo.server.entity.ChatMessage;
import com.podo.server.repository.ChatRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile; // 👈 추가

import java.io.File; // 👈 추가
import java.io.IOException; // 👈 추가
import java.util.List;
import java.util.UUID; // 👈 추가

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
        // Type이 없으면 TEXT로 설정
        if (message.getType() == null) {
            message.setType("TEXT");
        }
        ChatMessage savedMessage = chatRepository.save(message);

        // WebSocket으로 모든 클라이언트에게 브로드캐스트 (한 번만)
        messagingTemplate.convertAndSend("/topic/chat/" + travelId, savedMessage);

        return savedMessage;
    }

    // 이미지 업로드
    @PostMapping("/api/chat/upload")
    public String uploadFile(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            throw new RuntimeException("파일이 비어있습니다.");
        }

        try {
            // 프로젝트 루트 경로 + /uploads/
            String uploadDir = System.getProperty("user.dir") + "/uploads/";
            File directory = new File(uploadDir);
            if (!directory.exists()) {
                directory.mkdirs();
            }

            String originalName = file.getOriginalFilename();
            String uuid = UUID.randomUUID().toString();
            String savedName = uuid + "_" + originalName;
            File dest = new File(uploadDir + savedName);
            file.transferTo(dest);

            // 접근 가능한 URL 반환 (나중에 WebConfig에서 매핑 필요)
            return "http://localhost:8080/uploads/" + savedName;
        } catch (IOException e) {
            throw new RuntimeException("파일 업로드 실패", e);
        }
    }
}
