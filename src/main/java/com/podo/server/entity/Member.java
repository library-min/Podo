package com.podo.server.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter @Setter
@NoArgsConstructor
public class Member {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String email;
    private boolean online;

    @ManyToOne
    @JoinColumn(name = "travel_id")
    private Travels travel;

    public Member(String name, String email, Travels travel) {
        this.name = name;
        this.email = email;
        this.online = true; // 기본값: 온라인
        this.travel = travel;
    }
}
