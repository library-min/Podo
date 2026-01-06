package com.podo.server.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Getter
@NoArgsConstructor
public class TravelRequest {
    private String title;       // 여행 제목
    private LocalDate startDate; // 시작일
    private LocalDate endDate;   // 종료일
    private String creatorEmail; // 생성자 이메일
    private String creatorName;  // 생성자 이름 (닉네임)
}