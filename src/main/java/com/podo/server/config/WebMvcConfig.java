package com.podo.server.config;

import com.podo.server.interceptor.SessionInterceptor;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Spring MVC 설정 클래스
 *
 * 🎯 목적: SessionInterceptor를 등록하여 API 호출 시마다 세션을 자동으로 갱신
 *
 * ✅ 현재 상태: 인터셉터 활성화
 * - 프론트엔드에서 Authorization 헤더를 자동으로 추가하도록 설정 완료
 * - 10분 미활동 시 자동 로그아웃
 *
 * 📌 인터셉터 적용 대상:
 * - 모든 /api/** 경로에 적용
 * - 단, /api/auth/** 경로는 제외 (로그인, 회원가입은 세션 불필요)
 *
 * 💡 동작 흐름:
 * 1. 사용자가 API 호출 (예: GET /api/travels)
 * 2. SessionInterceptor가 먼저 실행
 *    - JWT 토큰 검증
 *    - Redis 세션 확인
 *    - TTL 10분으로 갱신
 * 3. 컨트롤러 실행
 * 4. 응답 반환
 */
@Configuration
@RequiredArgsConstructor
public class WebMvcConfig implements WebMvcConfigurer {

    private final SessionInterceptor sessionInterceptor;

    /**
     * 인터셉터 등록 (✅ 활성화)
     *
     * 📋 적용 규칙:
     * - addPathPatterns("/api/**"): /api로 시작하는 모든 경로에 적용
     * - excludePathPatterns("/api/auth/**"): /api/auth는 제외 (로그인, 회원가입)
     *
     * 🎯 결과:
     * - /api/auth/login → 인터셉터 미적용 (로그인 가능)
     * - /api/auth/signup → 인터셉터 미적용 (회원가입 가능)
     * - /api/travels → 인터셉터 적용 (세션 체크 + TTL 갱신)
     * - /api/schedules → 인터셉터 적용 (세션 체크 + TTL 갱신)
     */
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(sessionInterceptor)
                .addPathPatterns("/api/**") // 모든 API에 적용
                .excludePathPatterns(
                        "/api/auth/login",    // 로그인은 세션 체크 안 함
                        "/api/auth/signup",   // 회원가입은 세션 체크 안 함
                        "/swagger-ui/**",     // Swagger UI 제외
                        "/v3/api-docs/**"     // API 문서 제외
                );
    }
}
