package com.podo.server.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

/**
 * Redis 기반 세션 관리 서비스
 *
 * 🎯 목적: 사용자의 로그인 세션을 Redis에 저장하고, TTL(만료 시간)을 관리하여
 *         10분간 활동이 없으면 자동으로 로그아웃되도록 구현
 *
 * 📌 주요 기능:
 * 1. saveSession(): 로그인 시 세션 저장 (TTL 10분)
 * 2. isSessionValid(): 세션이 유효한지 확인
 * 3. refreshSession(): 활동 시마다 TTL을 10분으로 갱신
 * 4. deleteSession(): 로그아웃 시 세션 삭제
 *
 * 🔑 Redis Key 형식: "session:{email}"
 * 💾 Redis Value: JWT 토큰 또는 "ACTIVE" 같은 상태 값
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class SessionService {

    private final RedisTemplate<String, String> redisTemplate;

    // 세션 만료 시간 (10분 미활동 시 자동 로그아웃)
    private static final long SESSION_TIMEOUT_MINUTES = 10;

    // Redis Key 생성 (예: "session:user@example.com")
    private String getSessionKey(String email) {
        return "session:" + email;
    }

    /**
     * 1️⃣ 세션 저장 (로그인 시 호출)
     *
     * @param email 사용자 이메일
     * @param token JWT 토큰
     *
     * 💡 동작 원리:
     * - Redis에 "session:email" 키로 토큰 저장
     * - TTL(Time To Live)을 10분으로 설정
     * - 10분 후 자동으로 Redis에서 삭제됨 (자동 로그아웃)
     */
    public void saveSession(String email, String token) {
        String key = getSessionKey(email);
        redisTemplate.opsForValue().set(key, token, SESSION_TIMEOUT_MINUTES, TimeUnit.MINUTES);
        log.info("✅ 세션 저장 완료: {} (TTL: {}분)", email, SESSION_TIMEOUT_MINUTES);
    }

    /**
     * 2️⃣ 세션 유효성 확인
     *
     * @param email 사용자 이메일
     * @return true: 세션 존재 (로그인 상태), false: 세션 없음 (로그아웃 상태)
     *
     * 💡 동작 원리:
     * - Redis에서 "session:email" 키 조회
     * - 키가 존재하면 true, 없으면 false (TTL 만료 또는 로그아웃)
     */
    public boolean isSessionValid(String email) {
        String key = getSessionKey(email);
        String session = redisTemplate.opsForValue().get(key);
        boolean isValid = session != null;

        if (isValid) {
            log.info("✅ 세션 유효: {}", email);
        } else {
            log.warn("⚠️ 세션 만료 또는 없음: {}", email);
        }

        return isValid;
    }

    /**
     * 3️⃣ 세션 갱신 (활동 시마다 호출)
     *
     * @param email 사용자 이메일
     * @return true: 갱신 성공, false: 세션이 이미 만료되어 갱신 불가
     *
     * 💡 동작 원리:
     * - API 호출(사용자 활동) 시마다 이 메서드를 호출
     * - Redis의 TTL을 10분으로 다시 설정 (시간 연장)
     * - 세션이 없으면(이미 만료) false 반환
     *
     * 📌 예시:
     * - 09:00 로그인 → TTL 09:10까지
     * - 09:05 API 호출 → TTL 09:15까지 (5분 연장)
     * - 09:14 API 호출 → TTL 09:24까지 (또 연장)
     * - 활동 없이 10분 경과 → 자동 로그아웃
     */
    public boolean refreshSession(String email) {
        String key = getSessionKey(email);

        // 세션이 존재하는지 확인
        String session = redisTemplate.opsForValue().get(key);
        if (session == null) {
            log.warn("⚠️ 세션이 만료되어 갱신 불가: {}", email);
            return false;
        }

        // TTL을 10분으로 다시 설정 (시간 연장)
        redisTemplate.expire(key, SESSION_TIMEOUT_MINUTES, TimeUnit.MINUTES);
        log.info("🔄 세션 갱신 완료: {} (새 TTL: {}분)", email, SESSION_TIMEOUT_MINUTES);
        return true;
    }

    /**
     * 4️⃣ 세션 삭제 (로그아웃 시 호출)
     *
     * @param email 사용자 이메일
     *
     * 💡 동작 원리:
     * - Redis에서 "session:email" 키 삭제
     * - 즉시 로그아웃 처리
     */
    public void deleteSession(String email) {
        String key = getSessionKey(email);
        redisTemplate.delete(key);
        log.info("🗑️ 세션 삭제 완료 (로그아웃): {}", email);
    }

    /**
     * 5️⃣ 세션에서 토큰 조회 (선택 사항)
     *
     * @param email 사용자 이메일
     * @return JWT 토큰 (세션이 없으면 null)
     */
    public String getSessionToken(String email) {
        String key = getSessionKey(email);
        return redisTemplate.opsForValue().get(key);
    }
}
