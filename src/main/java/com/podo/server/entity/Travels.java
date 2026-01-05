package com.podo.server.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor
@Table(name = "travels")
public class Travels {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "travel_id")
    private Long travelId;

    @Column(nullable = false)
    private String title;       // 여행 제목

    @Column(name = "start_date")
    private LocalDate startDate; // 여행 시작일

    @Column(name = "end_date")
    private LocalDate endDate;   // 여행 종료일

    @Column(name = "invite_code", unique = true, nullable = false)
    private String inviteCode;   // 초대 코드

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    // 👇 [추가된 부분] 생성자: 이걸 만들어야 Service에서 데이터를 넣을 수 있습니다!
    public Travels(String title, LocalDate startDate, LocalDate endDate, String inviteCode) {
        this.title = title;
        this.startDate = startDate;
        this.endDate = endDate;
        this.inviteCode = inviteCode;
        this.createdAt = LocalDateTime.now(); // 생성 시간은 현재 시간으로 자동 설정
    }
}