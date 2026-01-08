package com.podo.server.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class StatsResponse {
    private List<ChartData> monthlyTravels;
    private List<ChartData> scheduleTypes;

    @Getter @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ChartData {
        private String name;
        private long value;
    }
}
