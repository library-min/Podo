package com.podo.server.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {
    // ⚠️ 실무에서는 이 키를 application.properties에 숨겨야 합니다! (지금은 연습용)
    private static final String SECRET_KEY = "podo_travel_app_secret_key_must_be_very_long_random_string";
    private static final long EXPIRATION_TIME = 86400000; // 24시간 (1일)

    private final Key key = Keys.hmacShaKeyFor(SECRET_KEY.getBytes());

    // 1. 토큰 생성 (로그인 성공 시)
    public String generateToken(String email) {
        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    // 2. 토큰에서 이메일 추출
    public String getEmail(String token) {
        return Jwts.parserBuilder().setSigningKey(key).build()
                .parseClaimsJws(token).getBody().getSubject();
    }

    // 3. 토큰 유효성 검사
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }
}
