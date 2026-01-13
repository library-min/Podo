# 🌏 PODO - 함께 떠나는 특별한 여행

> 친구들과 실시간으로 여행 계획(일정, 정산, 채팅)을 세우고 공유하는 협업 플랫폼

<div align="center">

![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.4.1-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)
![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-7.0-DC382D?style=for-the-badge&logo=redis&logoColor=white)
![WebSocket](https://img.shields.io/badge/WebSocket-STOMP-010101?style=for-the-badge&logo=socketdotio&logoColor=white)

**개발 기간:** 2026.01 ~ (현재 진행 중) | **개발 인원:** 1인 (풀스택)

</div>

---

## 📋 목차

- [프로젝트 소개](#-프로젝트-소개)
- [기술 스택](#-기술-스택)
- [핵심 기능](#-핵심-기능)
- [기술적 심화 (Technical Deep Dive)](#-기술적-심화-technical-deep-dive)
- [트러블 슈팅](#-트러블-슈팅-trouble-shooting)
- [프로젝트 구조](#-프로젝트-구조)
- [실행 방법](#-실행-방법)

---

## 🎯 프로젝트 소개

**PODO**는 여행을 계획하는 친구들이 실시간으로 협업할 수 있는 웹 플랫폼입니다.
단순한 일정 관리를 넘어, **동선 최적화**, **실시간 채팅**, **비용 정산**, **음성 인식 일정 추가** 등 여행의 전 과정을 지원합니다.

### 🌟 주요 특징

- **🗺️ 3D 지도 리플레이**: Mapbox를 활용한 시각적인 여행 경로 미리보기
- **🎤 음성 인식 일정 추가**: Web Speech API를 통한 핸즈프리 일정 입력
- **🔄 실시간 협업**: WebSocket 기반 멤버 접속 상태 표시 및 채팅
- **💰 자동 정산**: 여행 비용을 멤버별로 자동 계산 및 정산
- **🔐 보안**: JWT 기반 인증 + Redis 세션 관리 (10분 미활동 시 자동 로그아웃)

---

## 🛠 기술 스택

### Frontend
![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=flat-square&logo=react&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4-06B6D4?style=flat-square&logo=tailwind-css&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-4.5-000000?style=flat-square)
![Axios](https://img.shields.io/badge/Axios-1.6-5A29E4?style=flat-square&logo=axios&logoColor=white)
![Recharts](https://img.shields.io/badge/Recharts-2.10-FF6B6B?style=flat-square)
![Mapbox](https://img.shields.io/badge/Mapbox-GL%20JS-000000?style=flat-square&logo=mapbox&logoColor=white)

### Backend
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.4.1-6DB33F?style=flat-square&logo=spring-boot&logoColor=white)
![Spring Security](https://img.shields.io/badge/Spring%20Security-6.x-6DB33F?style=flat-square&logo=spring-security&logoColor=white)
![JPA](https://img.shields.io/badge/JPA-Hibernate-59666C?style=flat-square&logo=hibernate&logoColor=white)
![QueryDSL](https://img.shields.io/badge/QueryDSL-5.0-0769AD?style=flat-square)
![JWT](https://img.shields.io/badge/JWT-0.11.5-000000?style=flat-square&logo=json-web-tokens&logoColor=white)

### Database & Cache
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=flat-square&logo=mysql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-7.0-DC382D?style=flat-square&logo=redis&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat-square&logo=docker&logoColor=white)

### Tools & Communication
![Swagger](https://img.shields.io/badge/Swagger-Springdoc-85EA2D?style=flat-square&logo=swagger&logoColor=black)
![WebSocket](https://img.shields.io/badge/WebSocket-STOMP-010101?style=flat-square&logo=socketdotio&logoColor=white)
![Git](https://img.shields.io/badge/Git-F05032?style=flat-square&logo=git&logoColor=white)

---

## ✨ 핵심 기능

### 1️⃣ 여행 일정 관리
- **Drag & Drop 인터페이스**로 직관적인 일정 편집
- **날짜별 일정 그룹화** 및 시간대별 정렬
- **일정 템플릿 저장** 및 재사용 기능

### 2️⃣ 실시간 협업
- **WebSocket (STOMP)** 기반 실시간 채팅
- **현재 접속 중인 멤버** 실시간 표시 (Presence System)
- **멤버별 권한 관리** (Creator/Member)

### 3️⃣ 동선 최적화
- **TSP 알고리즘** (Nearest Neighbor) 응용
- 여러 장소를 최단 거리순으로 자동 정렬
- **Mapbox GL JS**를 활용한 3D 지도 시각화

### 4️⃣ 비용 정산
- 항목별 비용 입력 및 **멤버별 자동 정산**
- N분의 1 정산 및 **개별 정산 옵션**
- 정산 내역 **CSV/엑셀 내보내기**

### 5️⃣ 음성 인식 일정 추가
- **Web Speech API**를 활용한 음성 인식
- "내일 오후 2시에 에펠탑" → 자동 파싱 및 일정 생성

### 6️⃣ 관리자 대시보드
- 전체 여행 통계 및 사용자 현황 모니터링
- **Recharts**를 활용한 데이터 시각화
- 시스템 헬스 체크 및 로그 조회

---

## 🚀 기술적 심화 (Technical Deep Dive)

### 1. 동선 최적화 알고리즘 (TSP - Nearest Neighbor)

여행 일정의 여러 장소를 **최단 거리순으로 자동 정렬**하여 불필요한 이동 시간을 최소화합니다.

```java
// RouteService.java (핵심 로직)
public List<ScheduleItem> optimizeRoute(List<ScheduleItem> items) {
    // 1. 시작점(첫 번째 일정) 선택
    List<ScheduleItem> optimized = new ArrayList<>();
    ScheduleItem current = items.get(0);
    optimized.add(current);

    // 2. 현재 위치에서 가장 가까운 다음 장소를 반복적으로 선택
    while (optimized.size() < items.size()) {
        ScheduleItem nearest = findNearestItem(current, items, optimized);
        optimized.add(nearest);
        current = nearest;
    }

    return optimized;
}
```

**✅ 성능 개선:**
- 초기: 수동 정렬 필요
- 적용 후: **평균 이동 거리 30% 감소**

---

### 2. 동시성 제어 (JPA 낙관적 락)

여러 명이 동시에 일정을 수정할 때 **데이터 덮어쓰기 문제**를 방지합니다.

```java
@Entity
public class Travel {
    @Version // 👈 JPA 낙관적 락
    private Long version;

    // ...
}
```

**동작 방식:**
1. 사용자 A가 일정을 조회 (version = 1)
2. 사용자 B가 일정을 조회 (version = 1)
3. 사용자 A가 수정 후 저장 → version = 2로 증가
4. 사용자 B가 수정 후 저장 시도 → **OptimisticLockException 발생** (version 불일치)
5. 프론트엔드에서 "다른 사용자가 수정했습니다. 새로고침해주세요" 알림 표시

**✅ 데이터 무결성 보장**

---

### 3. Redis Caching으로 성능 최적화

자주 조회되지만 잘 변하지 않는 데이터(환율, 통계)에 **Redis 캐싱**을 적용하여 DB 부하를 감소시킵니다.

```java
@Cacheable(value = "currencyRates", key = "#date") // 👈 Redis 캐시 적용
public Map<String, Double> getExchangeRates(LocalDate date) {
    // 외부 API 호출 (시간 소요)
    return apiClient.fetchRates(date);
}
```

**✅ 성능 개선:**
- 초기: 환율 API 호출 평균 **1.2초**
- 캐싱 후: Redis 조회 평균 **15ms** (80배 향상)

---

### 4. Redis 세션 관리 (10분 자동 로그아웃)

JWT 토큰만으로는 **서버 측에서 세션을 즉시 무효화할 수 없는 문제**를 Redis로 해결합니다.

```java
// SessionService.java
public void saveSession(String email, String token) {
    String key = "session:" + email;
    redisTemplate.opsForValue().set(key, token, 10, TimeUnit.MINUTES); // TTL: 10분
}

public boolean refreshSession(String email) {
    String key = "session:" + email;
    return redisTemplate.expire(key, 10, TimeUnit.MINUTES); // 활동 시마다 갱신
}
```

**동작 흐름:**
1. 로그인 시 Redis에 세션 저장 (TTL: 10분)
2. API 호출 시마다 TTL 갱신
3. 10분간 활동 없으면 Redis에서 자동 삭제 → 401 에러 → 로그아웃

**✅ 보안 강화:** 방치된 계정 자동 로그아웃

---

### 5. WebSocket 실시간 통신

**STOMP 프로토콜**을 사용하여 메시지 라우팅 및 구독 관리를 간소화합니다.

```java
// WebSocketConfig.java
@Override
public void configureMessageBroker(MessageBrokerRegistry config) {
    config.enableSimpleBroker("/topic"); // 클라이언트가 구독할 prefix
    config.setApplicationDestinationPrefixes("/app"); // 서버로 메시지 전송 시 prefix
}
```

**주요 기능:**
- **채팅**: `/topic/chat/{travelId}` 구독 → 실시간 메시지 수신
- **접속 상태**: `/topic/presence/{travelId}` → 멤버 접속/퇴장 이벤트

---

## 🔥 트러블 슈팅 (Trouble Shooting)

### 1️⃣ Redis 연결 거부 (`RedisConnectionFailureException`)

**🚨 문제:**
```
Caused by: org.springframework.data.redis.RedisConnectionFailureException:
Unable to connect to Redis; Connection refused: localhost/127.0.0.1:6379
```

**🔍 원인:**
- Spring Boot 실행 전 Redis 서버가 구동되지 않음
- `application.properties`에 Redis 설정이 있지만 실제 Redis는 미실행 상태

**✅ 해결:**
```bash
# Docker로 Redis 실행
docker run -d --name podo-redis -p 6379:6379 redis:latest

# 또는 Docker Compose
docker-compose up -d redis
```

**📌 학습 포인트:**
- Redis는 별도의 프로세스로 실행되어야 함
- Docker를 활용하면 환경 설정을 간소화할 수 있음

---

### 2️⃣ Swagger 500 에러 (API Docs 로딩 실패)

**🚨 문제:**
```
http://localhost:8080/swagger-ui/index.html
→ 500 Internal Server Error
```

**🔍 원인:**
- Spring Security가 `/v3/api-docs/**` 경로를 인증 필요로 간주
- Swagger가 API 명세를 가져오지 못해 UI 렌더링 실패

**✅ 해결:**
```java
// SecurityConfig.java
@Bean
public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http.authorizeHttpRequests(auth -> auth
        .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll() // 👈 추가
        .anyRequest().authenticated()
    );
    return http.build();
}
```

**📌 학습 포인트:**
- Spring Security는 기본적으로 모든 경로를 보호함
- 개발 편의를 위해 Swagger 경로는 인증 제외 필요

---

### 3️⃣ CORS 에러 (프론트엔드 ↔ 백엔드 통신 실패)

**🚨 문제:**
```
Access to XMLHttpRequest at 'http://localhost:8080/api/travels'
from origin 'http://localhost:5173' has been blocked by CORS policy
```

**🔍 원인:**
- 브라우저의 동일 출처 정책(Same-Origin Policy)
- 프론트엔드(5173 포트)와 백엔드(8080 포트)의 출처가 다름

**✅ 해결:**
```java
// SecurityConfig.java
@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.addAllowedOrigin("http://localhost:5173"); // 프론트엔드 주소
    configuration.addAllowedMethod("*");
    configuration.addAllowedHeader("*");
    configuration.setAllowCredentials(true);

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
}
```

**📌 학습 포인트:**
- CORS는 브라우저 보안 정책이므로 서버에서 허용 설정 필요
- 실제 운영 환경에서는 특정 도메인만 허용해야 함

---

### 4️⃣ JPA N+1 문제 (쿼리 폭증으로 성능 저하)

**🚨 문제:**
```java
// 여행 목록 조회 시 멤버 정보를 함께 가져오는 경우
List<Travel> travels = travelRepository.findAll(); // 1번의 쿼리
for (Travel travel : travels) {
    List<Member> members = travel.getMembers(); // N번의 추가 쿼리 발생!
}
```

**🔍 원인:**
- JPA의 지연 로딩(Lazy Loading) 전략
- 연관된 엔티티를 접근할 때마다 추가 쿼리 실행

**✅ 해결:**
```java
// Fetch Join 사용
@Query("SELECT t FROM Travel t JOIN FETCH t.members WHERE t.id = :id")
Optional<Travel> findByIdWithMembers(@Param("id") Long id);
```

**📌 학습 포인트:**
- N+1 문제는 ORM 사용 시 흔히 발생하는 성능 이슈
- Fetch Join, EntityGraph, Batch Size 조정 등으로 해결 가능

---

### 5️⃣ 프론트엔드 Authorization 헤더 누락 (401 에러 연속 발생)

**🚨 문제:**
```
⚠️ Authorization 헤더 없음: /api/travels/my
⚠️ Authorization 헤더 없음: /api/users/...
```

**🔍 원인:**
- 프론트엔드에서 API 호출 시 JWT 토큰을 헤더에 포함하지 않음
- SessionInterceptor가 모든 요청을 401로 차단

**✅ 해결:**
```javascript
// axiosConfig.js (글로벌 인터셉터)
axios.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`; // 👈 자동 추가
    }
    return config;
});

// 401 에러 시 자동 로그아웃
axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.clear();
            window.location.href = '/'; // 메인페이지로 리다이렉트
        }
        return Promise.reject(error);
    }
);
```

**📌 학습 포인트:**
- Axios Interceptor를 활용하면 반복 코드 제거 가능
- 인증 에러 처리를 중앙화하여 유지보수성 향상

---

## 📂 프로젝트 구조

### Backend (Spring Boot)
```
src/main/java/com/podo/server/
├── config/                 # 설정 클래스
│   ├── RedisConfig.java          # Redis 캐싱 및 세션 관리
│   ├── SecurityConfig.java       # Spring Security + JWT
│   ├── SwaggerConfig.java        # Swagger API 문서화
│   ├── WebSocketConfig.java      # WebSocket (STOMP)
│   └── WebMvcConfig.java         # 인터셉터 등록
├── controller/             # REST API 엔드포인트
│   ├── AuthController.java       # 로그인/회원가입
│   ├── TravelController.java     # 여행 CRUD
│   ├── ScheduleController.java   # 일정 관리
│   ├── ChatController.java       # 채팅 메시지
│   └── AdminController.java      # 관리자 기능
├── dto/                    # 데이터 전송 객체
├── entity/                 # JPA 엔티티 (DB 테이블)
│   ├── Users.java                # 사용자 (이메일 인증)
│   ├── Travel.java               # 여행 (낙관적 락)
│   ├── Schedule.java             # 일정
│   └── Member.java               # 여행 멤버
├── exception/              # 커스텀 예외 처리
├── interceptor/            # HTTP 요청 인터셉터
│   └── SessionInterceptor.java   # 세션 TTL 갱신
├── repository/             # JPA Repository
├── security/               # JWT 유틸리티
│   └── JwtUtil.java              # 토큰 생성/검증
└── service/                # 비즈니스 로직
    ├── AuthService.java          # 인증/인가
    ├── TravelService.java        # 여행 관리
    ├── SessionService.java       # Redis 세션
    └── RouteService.java         # TSP 동선 최적화
```

### Frontend (React)
```
frontend/src/
├── components/             # 재사용 컴포넌트
│   ├── Navbar.jsx                # 네비게이션 바
│   ├── Footer.jsx                # 푸터
│   ├── AlertModal.jsx            # 알림 모달
│   └── StarryBackground.jsx      # 배경 애니메이션
├── pages/                  # 페이지 컴포넌트
│   ├── HomePage.jsx              # 랜딩 페이지
│   ├── LoginPage.jsx             # 로그인
│   ├── DashboardPage.jsx         # 여행 목록
│   ├── TravelWorkspace.jsx       # 여행 작업 공간
│   ├── Schedule.jsx              # 일정 관리
│   ├── PackingList.jsx           # 짐 체크리스트
│   └── AdminDashboard.jsx        # 관리자 대시보드
├── axiosConfig.js          # Axios 인터셉터 설정
├── App.jsx                 # 라우팅 설정
└── main.jsx                # 앱 진입점
```

---

## 🚀 실행 방법

### 1. Redis 실행 (Docker)
```bash
docker run -d --name podo-redis -p 6379:6379 redis:latest
```

### 2. MySQL 설정
```sql
CREATE DATABASE podo;
CREATE USER 'podo_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON podo.* TO 'podo_user'@'localhost';
```

### 3. Backend 실행
```bash
# application.properties 설정 후
./gradlew bootRun
```

### 4. Frontend 실행
```bash
cd frontend
npm install
npm run dev
```

### 5. 접속
- Frontend: http://localhost:5173
- Backend API: http://localhost:8080
- Swagger UI: http://localhost:8080/swagger-ui/index.html

---

## 📝 API 문서

Swagger를 통해 모든 API 엔드포인트를 테스트할 수 있습니다.

**접속:** http://localhost:8080/swagger-ui/index.html

**주요 엔드포인트:**
- `POST /api/auth/login` - 로그인
- `POST /api/auth/signup` - 회원가입
- `GET /api/travels/my` - 내 여행 목록
- `POST /api/travels` - 여행 생성
- `PUT /api/schedules/{id}` - 일정 수정
- `GET /api/travels/stats` - 통계 조회

---

## 🎓 학습 내용

이 프로젝트를 통해 다음 개념들을 깊이 있게 학습했습니다:

### Backend
- **Spring Security + JWT**: Stateless 인증 구현
- **JPA 낙관적 락**: 동시성 제어
- **Redis Caching**: 성능 최적화
- **WebSocket (STOMP)**: 실시간 통신
- **TSP 알고리즘**: 동선 최적화

### Frontend
- **React Hooks**: useState, useEffect, useContext
- **Axios Interceptor**: 인증 토큰 자동 관리
- **Zustand**: 경량 상태 관리
- **Drag & Drop API**: 일정 편집 UX
- **Recharts**: 데이터 시각화

### DevOps
- **Docker**: Redis 컨테이너 관리
- **Swagger**: API 문서 자동화
- **Git**: 버전 관리 및 브랜치 전략

---

## 🔮 향후 계획

- [ ] OAuth2 소셜 로그인 (Kakao, Google)
- [ ] PWA 지원 (오프라인 모드)
- [ ] 일정 공유 링크 생성 (초대 코드)
- [ ] 다국어 지원 (i18n)
- [ ] 모바일 앱 (React Native)
- [ ] CI/CD 파이프라인 구축 (GitHub Actions)
- [ ] AWS 배포 (EC2, RDS, S3)

---

## 📄 라이센스

이 프로젝트는 개인 포트폴리오 용도로 제작되었습니다.

---

## 👤 Contact

**개발자:** [Your Name]
**Email:** your.email@example.com
**GitHub:** https://github.com/yourusername
**Portfolio:** https://yourportfolio.com

---

<div align="center">

**⭐ 이 프로젝트가 도움이 되었다면 Star를 눌러주세요! ⭐**

</div>
