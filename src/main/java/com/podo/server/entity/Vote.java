package com.podo.server.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter @Setter
@NoArgsConstructor
public class Vote {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title; // 투표 제목 (예: 저녁 메뉴는?)
    private boolean multiple; // 복수 선택 가능 여부 (일단 false로 고정해도 됨)
    private boolean closed;   // 투표 종료 여부

    @ManyToOne
    @JoinColumn(name = "travel_id")
    @JsonIgnoreProperties({"members", "schedules"})
    private Travels travel;

    // 선택지들 (짜장, 짬뽕...)
    @OneToMany(mappedBy = "vote", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<VoteOption> options = new ArrayList<>();

    public void addOption(VoteOption option) {
        options.add(option);
        option.setVote(this);
    }
}
