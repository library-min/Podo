package com.podo.server.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter
@NoArgsConstructor
public class ScheduleRequest {
    private Integer day;
    private String time;
    private String type;
    private String title;
    private String location; // 구버전 호환
    private String color;
    private String placeName;
    private Double x;
    private Double y;
    private String address;
}
