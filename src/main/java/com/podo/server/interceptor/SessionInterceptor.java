package com.podo.server.interceptor;

import com.podo.server.security.JwtUtil;
import com.podo.server.service.SessionService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

/**
 * 세션 자동 갱신 인터셉터
 *
 * 🎯 목적: API 호출 시마다 사용자의 Redis 세션을 체크하고, TTL을 10분으로 갱신하여
 *         "10분 미활동 시 자동 로그아웃" 기능 구현
 *
 * 📌 동작 흐름:
 * 1. HTTP 요청에서 Authorization 헤더의 JWT 토큰 추출
 * 2. JWT 토큰에서 사용자 이메일 추출
 * 3. Redis에서 세션 유효성 확인
 *    - 유효하면: TTL 10분으로 갱신 → 요청 통과
 *    - 만료되었으면: 401 Unauthorized 응답 → 로그인 페이지로 이동
 *
 * 💡 예시:
 * - 09:00 로그인 → Redis 세션 생성 (TTL: 09:10)
 * - 09:05 API 호출 → 세션 갱신 (TTL: 09:15)
 * - 09:14 API 호출 → 세션 갱신 (TTL: 09:24)
 * - 09:24~09:34 활동 없음 → 09:34 API 호출 시 401 에러 (자동 로그아웃)
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class SessionInterceptor implements HandlerInterceptor {

    private final JwtUtil jwtUtil;
    private final SessionService sessionService;

    /**
     * 컨트롤러 실행 전에 호출됨
     *
     * @return true: 요청 통과, false: 요청 차단
     */
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        // OPTIONS 요청은 세션 체크 안 함 (CORS preflight)
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            return true;
        }

        // Authorization 헤더에서 JWT 토큰 추출
        String authHeader = request.getHeader("Authorization");

        // 토큰이 없는 경우 (로그인 안 한 사용자)
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            log.warn("⚠️ Authorization 헤더 없음: {}", request.getRequestURI());
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED); // 401
            response.getWriter().write("{\"error\": \"로그인이 필요합니다.\"}");
            return false; // 요청 차단
        }

        try {
            // "Bearer {token}" 형식에서 토큰 추출
            String token = authHeader.replace("Bearer ", "");

            // JWT 토큰 유효성 검증
            if (!jwtUtil.validateToken(token)) {
                log.warn("⚠️ 유효하지 않은 JWT 토큰: {}", request.getRequestURI());
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED); // 401
                response.getWriter().write("{\"error\": \"유효하지 않은 토큰입니다.\"}");
                return false; // 요청 차단
            }

            // JWT에서 이메일 추출
            String email = jwtUtil.getEmail(token);

            // Redis 세션 유효성 확인
            if (!sessionService.isSessionValid(email)) {
                log.warn("⚠️ Redis 세션 만료 (10분 미활동): {}", email);
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED); // 401
                response.getWriter().write("{\"error\": \"세션이 만료되었습니다. 다시 로그인해주세요.\"}");
                return false; // 요청 차단 (자동 로그아웃)
            }

            // ✨ 세션 TTL 갱신 (10분 연장)
            sessionService.refreshSession(email);
            log.info("✅ 세션 갱신 완료: {} → 요청 통과: {}", email, request.getRequestURI());

            return true; // 요청 통과

        } catch (Exception e) {
            log.error("❌ 세션 인터셉터 오류: {}", e.getMessage());
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR); // 500
            response.getWriter().write("{\"error\": \"서버 오류가 발생했습니다.\"}");
            return false; // 요청 차단
        }
    }
}
