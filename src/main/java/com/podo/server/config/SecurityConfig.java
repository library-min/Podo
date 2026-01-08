package com.podo.server.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(); // 비밀번호 암호화 도구
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // API 서버라 CSRF 보안 끄기
            .cors(cors -> cors.configurationSource(corsConfigurationSource())) // 리액트와 통신 허용
            .authorizeHttpRequests(auth -> auth
                // 인증 없이 접근 가능한 경로들
                .requestMatchers("/api/auth/**", "/ws-stomp/**").permitAll() // 로그인, 회원가입, 소켓
                .requestMatchers(
                    "/v3/api-docs/**",      // OpenAPI 3.0 문서
                    "/swagger-ui/**",       // Swagger UI 리소스
                    "/swagger-ui.html"      // Swagger UI 메인 페이지
                ).permitAll()
                // .anyRequest().authenticated() // 🚨 주의: 이걸 켜면 로그인 안한 사람은 아무것도 못함 (일단 주석 처리 추천)
                .anyRequest().permitAll() // 개발 중엔 편하게 다 열어두기 (나중에 위 줄로 교체)
            );

        return http.build();
    }

    // CORS 설정 (리액트 5173 포트 허용)
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:5173"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
