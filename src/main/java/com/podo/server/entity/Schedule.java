package com.podo.server.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Getter @Setter
@NoArgsConstructor
public class Schedule {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer day;       // 여행 몇 일차인지 (1, 2, 3...)
    private String time;       // 시간 (e.g., "09:00")
    private String type;       // travel, meal, activity
    private String title;      // 제목
    private String location;   // 위치 (구버전 호환용)
    private String color;      // 색상 (blue, orange, purple)

    // 카카오맵 장소 정보
    private String placeName; 
    private Double x;         
    private Double y;         
    private String address;   

    @ManyToOne
    @JoinColumn(name = "travel_id")
    @JsonIgnore
    private Travels travel;

    /**
     * JPA @Version을 활용한 Optimistic Locking(낙관적 락) 구현.
     * 다중 사용자 환경에서의 Race Condition을 방지하고 데이터 정합성을 보장함.
     */
    @Version
    private Long version = 0L; // 초기화 추가 (Null 방지)

    public Schedule(Integer day, String time, String type, String title, String location, String color,
                    String placeName, Double x, Double y, String address, Travels travel) {
        this.day = day;
        this.time = time;
        this.type = type;
        this.title = title;
        this.location = location;
        this.color = color;
        this.placeName = placeName;
        this.x = x;
        this.y = y;
        this.address = address;
        this.travel = travel;
    }
}
