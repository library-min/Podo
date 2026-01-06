package com.podo.server.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class ChatMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long travelId;
    private String sender;
    private String message;
    private LocalDateTime timestamp;

    public ChatMessage(Long travelId, String sender, String message) {
        this.travelId = travelId;
        this.sender = sender;
        this.message = message;
        this.timestamp = LocalDateTime.now();
    }
}
