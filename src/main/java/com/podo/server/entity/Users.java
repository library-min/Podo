package com.podo.server.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Getter @Setter
@NoArgsConstructor
@Table(name = "users")
public class Users {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;

    @Column(unique = true, nullable = false)
    private String email;    // 로그인 아이디로 사용

    @Column(nullable = false)
    private String password; // 암호화해서 저장할 예정

    private String nickname;

    private LocalDateTime createdAt;

    @ManyToMany
    @JoinTable(
        name = "users_travels",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "travel_id")
    )
    private java.util.List<Travels> travels = new java.util.ArrayList<>();

    public Users(String email, String password, String nickname) {
        this.email = email;
        this.password = password;
        this.nickname = nickname;
        this.createdAt = LocalDateTime.now();
    }

    public void addTravel(Travels travel) {
        this.travels.add(travel);
    }
}