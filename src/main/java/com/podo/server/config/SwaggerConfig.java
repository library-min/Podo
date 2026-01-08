package com.podo.server.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Swagger API 문서화 설정 클래스
 *
 * 🎯 목적: 프론트엔드 개발자가 API를 쉽게 확인하고 테스트할 수 있는 문서 자동 생성
 *
 * 📍 접속 URL: http://localhost:8080/swagger-ui/index.html
 *
 * 🔑 JWT 인증:
 * - 우측 상단 'Authorize' 버튼 클릭
 * - Bearer {token} 형태로 JWT 토큰 입력
 * - 인증이 필요한 API 테스트 가능
 */
@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI openAPI() {
        // JWT 보안 스키마 정의
        String jwtSchemeName = "JWT";
        SecurityRequirement securityRequirement = new SecurityRequirement().addList(jwtSchemeName);

        Components components = new Components()
            .addSecuritySchemes(jwtSchemeName, new SecurityScheme()
                .name(jwtSchemeName)
                .type(SecurityScheme.Type.HTTP) // HTTP 인증 방식
                .scheme("bearer") // Bearer 토큰
                .bearerFormat("JWT") // JWT 형식
                .description("JWT 토큰을 입력하세요. (예: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...)")
            );

        return new OpenAPI()
            .info(apiInfo())
            .addSecurityItem(securityRequirement) // 모든 API에 보안 적용
            .components(components);
    }

    private Info apiInfo() {
        return new Info()
            .title("PODO Travel API") // API 제목
            .description("여행 플래너 앱 REST API 문서 - Redis 캐싱 및 JWT 인증 적용") // API 설명
            .version("1.0.0") // 버전
            .contact(new Contact()
                .name("PODO Team")
                .email("support@podo.com")
                .url("https://podo.com"))
            .license(new License()
                .name("Apache 2.0")
                .url("http://www.apache.org/licenses/LICENSE-2.0.html"));
    }
}
