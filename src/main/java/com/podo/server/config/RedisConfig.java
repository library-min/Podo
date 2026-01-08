package com.podo.server.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializationContext;
import org.springframework.data.redis.serializer.StringRedisSerializer;

import java.time.Duration;

/**
 * Redis 캐시 설정 클래스
 *
 * 🎯 목적: 자주 조회되지만 잘 변하지 않는 데이터를 Redis에 캐싱하여 DB 부하 감소 및 응답 속도 개선
 *
 * 📦 캐시 적용 대상:
 * - currencyRates: 환율 정보 (1시간 캐싱)
 * - schedules: 여행 일정 (30분 캐싱)
 *
 * ⚠️ 주의: Redis가 설치되지 않은 경우 application.properties에서 spring.cache.type=simple로 설정
 */
// @Configuration
// @EnableCaching
public class RedisConfig {

    /**
     * Redis 캐시 매니저 설정
     * Key: String, Value: JSON (Jackson 직렬화)
     */
    // @Bean
    // public CacheManager cacheManager(RedisConnectionFactory connectionFactory) {
    //     // ObjectMapper 설정 (LocalDateTime 등 Java 8 시간 API 지원)
    //     ObjectMapper objectMapper = new ObjectMapper();
    //     objectMapper.registerModule(new JavaTimeModule());
    //     objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

    //     // JSON 직렬화기
    //     GenericJackson2JsonRedisSerializer jsonSerializer =
    //         new GenericJackson2JsonRedisSerializer(objectMapper);

    //     // 기본 캐시 설정 (TTL: 30분)
    //     RedisCacheConfiguration defaultConfig = RedisCacheConfiguration.defaultCacheConfig()
    //         .serializeKeysWith(
    //             RedisSerializationContext.SerializationPair.fromSerializer(new StringRedisSerializer())
    //         )
    //         .serializeValuesWith(
    //             RedisSerializationContext.SerializationPair.fromSerializer(jsonSerializer)
    //         )
    //         .entryTtl(Duration.ofMinutes(30)); // 기본 TTL 30분

    //     // 캐시별 개별 설정
    //     RedisCacheManager.RedisCacheManagerBuilder builder = RedisCacheManager
    //         .builder(connectionFactory)
    //         .cacheDefaults(defaultConfig)
    //         // 환율 정보: 1시간 캐싱
    //         .withCacheConfiguration("currencyRates",
    //             defaultConfig.entryTtl(Duration.ofHours(1)))
    //         // 여행 일정: 30분 캐싱 (기본값)
    //         .withCacheConfiguration("schedules",
    //             defaultConfig.entryTtl(Duration.ofMinutes(30)));

    //     return builder.build();
    // }
}
