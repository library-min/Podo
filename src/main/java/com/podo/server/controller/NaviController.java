package com.podo.server.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@Slf4j
@Tag(name = "카카오 네비 API", description = "Kakao Navigation API Proxy")
@CrossOrigin(origins = "http://localhost:5173")
@RestController
public class NaviController {

    // application.yml에 있는 카카오 REST API 키를 가져옵니다.
    @Value("${kakao.rest.api.key}")
    private String kakaoRestApiKey;

    @Operation(summary = "카카오 네비 경로 조회", description = "Gets navigation directions from Kakao Mobility API")
    @GetMapping("/kakao-navi/v1/directions")
    public ResponseEntity<?> getDirections(
            @Parameter(description = "출발지 좌표 (경도,위도)", required = true, example = "127.1086228,37.4012191")
            @RequestParam String origin,
            @Parameter(description = "목적지 좌표 (경도,위도)", required = true, example = "127.110510,37.394125")
            @RequestParam String destination,
            @Parameter(description = "경유지 좌표들 (경도,위도|경도,위도)", required = false)
            @RequestParam(required = false) String waypoints) {

        log.info("Requesting directions from {} to {} with waypoints: {}", origin, destination, waypoints);

        // 1. 진짜 카카오 API 주소 구성
        StringBuilder urlBuilder = new StringBuilder("https://apis-navi.kakaomobility.com/v1/directions");
        urlBuilder.append("?origin=").append(origin);
        urlBuilder.append("&destination=").append(destination);

        if (waypoints != null && !waypoints.trim().isEmpty()) {
            urlBuilder.append("&waypoints=").append(waypoints);
        }

        String url = urlBuilder.toString();

        // 2. 헤더에 API 키 담기
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "KakaoAK " + kakaoRestApiKey);
        headers.set("Content-Type", "application/json");

        HttpEntity<String> entity = new HttpEntity<>(headers);
        RestTemplate restTemplate = new RestTemplate();

        try {
            // 3. 카카오 서버로 요청 쏘고 결과 받기 (Proxy)
            ResponseEntity<String> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    entity,
                    String.class
            );

            log.debug("Kakao API response received successfully");
            // 4. 받은 결과를 프론트엔드에 그대로 토스
            return ResponseEntity.ok(response.getBody());
        } catch (Exception e) {
            log.error("Failed to get directions from Kakao API: {}", e.getMessage());
            return ResponseEntity.status(500).body("{\"error\": \"Failed to get directions from Kakao API\"}");
        }
    }
}
