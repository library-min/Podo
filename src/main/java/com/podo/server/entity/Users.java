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

    /**
     * 사용자가 참여한 여행 목록 (다대다 관계)
     * users_travels 조인 테이블을 통해 관리됨
     */
    @ManyToMany
    @JoinTable(
        name = "users_travels",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "travel_id")
    )
    private java.util.List<Travels> travels = new java.util.ArrayList<>();

    /**
     * 회원가입용 생성자 (일반 사용자)
     */
    public Users(String email, String password, String nickname) {
        this.email = email;
        this.password = password;
        this.nickname = nickname;
        this.role = Role.USER;
        this.createdAt = LocalDateTime.now();
    }

    /**
     * 관리자 생성 전용 생성자 (DataLoader 전용)
     */
    public Users(String email, String password, String nickname, Role role) {
        this.email = email;
        this.password = password;
        this.nickname = nickname;
        this.role = role;
        this.createdAt = LocalDateTime.now();
    }

    /**
     * 여행 참가 시 호출 (양방향 관계 유지)
     */
    public void addTravel(Travels travel) {
        this.travels.add(travel);
    }
}