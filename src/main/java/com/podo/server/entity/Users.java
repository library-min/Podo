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

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role = Role.USER; // 기본값은 일반 사용자

    private LocalDateTime createdAt;

    @ManyToMany
    @JoinTable(
        name = "users_travels",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "travel_id")
    )
    private java.util.List<Travels> travels = new java.util.ArrayList<>();

    // 회원가입용 생성자 - 무조건 일반 유저(USER)로 생성
    public Users(String email, String password, String nickname) {
        this.email = email;
        this.password = password;
        this.nickname = nickname;
        this.role = Role.USER; // 항상 일반 사용자로 설정
        this.createdAt = LocalDateTime.now();
    }

    // 관리자 생성 전용 생성자 - DataLoader에서만 사용 (일반 회원가입에서는 사용 불가)
    public Users(String email, String password, String nickname, Role role) {
        this.email = email;
        this.password = password;
        this.nickname = nickname;
        this.role = role;
        this.createdAt = LocalDateTime.now();
    }

    public void addTravel(Travels travel) {
        this.travels.add(travel);
    }
}