package com.podo.server.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter @Setter
@NoArgsConstructor
@Table(name = "travels")
public class Travels implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "travel_id")
    private Long travelId;

    @Column(nullable = false)
    private String title;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(name = "invite_code", unique = true, nullable = false)
    private String inviteCode;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "owner_email")
    private String ownerEmail;

    /**
     * 이 여행에 참여한 사용자 목록 (다대다 양방향 관계)
     * Users 엔티티의 travels 필드와 연결됨
     * JSON 직렬화 시 순환 참조 방지를 위해 @JsonIgnore 적용
     */
    @JsonIgnore
    @ManyToMany(mappedBy = "travels")
    private List<Users> users = new ArrayList<>();

    /**
     * 여행 생성 시 사용하는 생성자
     */
    public Travels(String title, LocalDate startDate, LocalDate endDate, String inviteCode, String ownerEmail) {
        this.title = title;
        this.startDate = startDate;
        this.endDate = endDate;
        this.inviteCode = inviteCode;
        this.ownerEmail = ownerEmail;
        this.createdAt = LocalDateTime.now();
    }
}