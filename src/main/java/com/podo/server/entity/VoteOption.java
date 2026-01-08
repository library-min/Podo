package com.podo.server.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter @Setter
@NoArgsConstructor
public class VoteOption {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String text;  // 선택지 내용 (예: 짜장면)
    private Integer count = 0; // 득표수

    @ManyToOne
    @JoinColumn(name = "vote_id")
    @JsonIgnore // 무한 루프 방지
    private Vote vote;

    public VoteOption(String text) {
        this.text = text;
    }
}
