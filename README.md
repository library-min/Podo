# 🌏 PODO - 함께 떠나는 특별한 여행

> 친구들과 실시간으로 여행 계획(일정, 투표, 짐 체크리스트, 채팅)을 세우고 공유하는 협업 플랫폼

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
- [기술적 심화](#-기술적-심화-technical-deep-dive)
- [트러블 슈팅](#-트러블-슈팅)
- [프로젝트 구조](#-프로젝트-구조)
- [실행 방법](#-실행-방법)

---

## 🎯 프로젝트 소개

**PODO**는 여행을 계획하는 친구들이 실시간으로 협업할 수 있는 웹 플랫폼입니다.
일정 관리, 투표, 짐 체크리스트, 실시간 채팅 등 여행의 전 과정을 함께 계획할 수 있습니다.

### 🌟 주요 특징

- **🗺️ 동선 최적화**: TSP 알고리즘으로 여행 경로를 최단 거리순으로 자동 정렬
- **🗳️ 실시간 투표**: 여행지, 식당, 숙소 등을 팀원들과 투표로 결정
- **📦 짐 체크리스트**: 챙길 물건을 공유하고 담당자 지정
- **💬 실시간 채팅**: WebSocket 기반 채팅 및 이미지 공유
- **👥 접속 상태 표시**: 현재 접속 중인 멤버를 실시간으로 확인
- **🔐 보안**: JWT + Redis 세션 관리 (10분 미활동 시 자동 로그아웃)

---

## 🛠 기술 스택

### Frontend
![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=flat-square&logo=react&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4-06B6D4?style=flat-square&logo=tailwind-css&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-1.6-5A29E4?style=flat-square&logo=axios&logoColor=white)
![Recharts](https://img.shields.io/badge/Recharts-2.10-FF6B6B?style=flat-square)
![Mapbox](https://img.shields.io/badge/Mapbox-GL%20JS-000000?style=flat-square&logo=mapbox&logoColor=white)

### Backend
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.4.1-6DB33F?style=flat-square&logo=spring-boot&logoColor=white)
![Spring Security](https://img.shields.io/badge/Spring%20Security-6.x-6DB33F?style=flat-square&logo=spring-security&logoColor=white)
![JPA](https://img.shields.io/badge/JPA-Hibernate-59666C?style=flat-square&logo=hibernate&logoColor=white)
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

### 1️⃣ 여행 관리
- **여행 방 생성/참가**: 초대 코드로 친구 초대
- **여행 정보 수정**: 제목, 날짜 변경
- **여행 통계**: 전체 여행 수, 오늘 생성된 여행 등
- **권한 관리**: 방장(Creator)과 일반 멤버 구분

### 2️⃣ 일정 관리 (Redis 캐싱)
- **일정 CRUD**: 날짜별 일정 생성, 수정, 삭제
- **동선 최적화**: TSP 알고리즘으로 최적 경로 자동 재배치
- **Redis 캐싱**: 자주 조회되는 일정 데이터를 30분간 캐싱하여 성능 향상

### 3️⃣ 투표 시스템
- **투표 생성**: 여행지, 식당, 숙소 등에 대한 투표 생성
- **실시간 투표**: WebSocket으로 투표 결과 실시간 반영
- **투표 취소/변경**: 언제든지 투표 취소하거나 다른 항목으로 변경 가능
- **내 투표 기록 조회**: 여행별 내가 투표한 항목 확인

### 4️⃣ 짐 체크리스트
- **카테고리별 관리**: 의류, 세면도구, 전자기기 등 카테고리 분류
- **담당자 지정**: 누가 챙겨올지 담당자 지정 가능
- **체크 완료**: 짐을 챙겼을 때 체크 표시 및 완료자 기록
- **실시간 동기화**: WebSocket으로 팀원들과 실시간 공유

### 5️⃣ 실시간 채팅
- **텍스트 채팅**: WebSocket (STOMP) 기반 실시간 메시지 전송
- **이미지 공유**: 파일 업로드 기능으로 사진 공유
- **채팅 히스토리**: 이전 대화 내역 조회

### 6️⃣ 접속 상태 관리 (Presence System)
- **실시간 접속자 표시**: 현재 누가 여행 방에 접속해 있는지 실시간 표시
- **입장/퇴장 알림**: 멤버가 들어오거나 나갈 때 자동 감지
- **WebSocket 연결 관리**: 브라우저 종료 시 자동으로 퇴장 처리

### 7️⃣ 관리자 대시보드
- **전체 통계 조회**: 전체 회원 수, 여행 수, 오늘 생성된 여행 수
- **권한 관리**: ADMIN 역할을 가진 사용자만 접근 가능
- **JWT 기반 인증**: Authorization 헤더로 관리자 권한 확인

---

## 🚀 기술적 심화 (Technical Deep Dive)

### 1. 동선 최적화 알고리즘 (TSP - Nearest Neighbor + Haversine)

여행 일정의 여러 장소를 **최단 거리순으로 자동 정렬**하여 불필요한 이동 시간을 최소화합니다.

```java
// RouteService.java - 핵심 로직
@Transactional
public void optimizeRoute(Long travelId, int day) {
    List<Schedule> originalList = scheduleRepository
        .findByTravel_TravelIdAndDayOrderByTimeAsc(travelId, day);

    // 1. 시작점 설정 (첫 번째 일정 고정)
    List<Schedule> optimizedList = new ArrayList<>();
    Schedule current = originalList.remove(0);
    optimizedList.add(current);

    // 2. Nearest Neighbor: 현재 위치에서 가장 가까운 다음 장소 선택
    while (!originalList.isEmpty()) {
        Schedule nearest = findNearestSchedule(current, originalList);
        optimizedList.add(nearest);
        originalList.remove(nearest);
        current = nearest;
    }

    // 3. 시간 재설정 (1시간 30분 간격)
    updateScheduleTimes(optimizedList);
}

// Haversine 공식: 두 지점 간 실제 거리 계산 (단위: km)
private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
    final int R = 6371; // 지구 반지름
    double dLat = Math.toRadians(lat2 - lat1);
    double dLon = Math.toRadians(lon2 - lon1);
    double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
               Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
               Math.sin(dLon / 2) * Math.sin(dLon / 2);
    double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}
```

**✅ 효과:**
- 수동으로 경로를 정렬할 필요 없이 클릭 한 번으로 최적 경로 생성
- 위도/경도 기반 실제 거리 계산으로 정확한 경로 제공

---

### 2. Redis 캐싱으로 성능 최적화

자주 조회되는 일정 데이터에 **Redis 캐싱**을 적용하여 DB 조회 횟수를 줄입니다.

```java
@Cacheable(value = "schedules", key = "#travelId + '_' + #day")
public List<Schedule> getSchedules(Long travelId, int day) {
    return scheduleRepository.findByTravel_TravelIdAndDayOrderByTimeAsc(travelId, day);
}

@CacheEvict(value = "schedules", allEntries = true)
public Schedule updateSchedule(Long scheduleId, ScheduleRequest request) {
    // 일정 수정 시 캐시 무효화
}
```

**동작 방식:**
- 첫 조회: DB에서 조회 후 Redis에 30분간 캐싱
- 이후 조회: Redis에서 즉시 반환 (DB 접근 없음)
- 수정/삭제: 캐시 자동 삭제 → 다음 조회 시 최신 데이터 반영

---

### 3. Redis 세션 관리 (10분 자동 로그아웃)

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
2. API 호출 시마다 SessionInterceptor가 TTL 갱신
3. 10분간 활동 없으면 Redis에서 자동 삭제 → 401 에러 → 로그아웃

**프론트엔드 자동 로그아웃:**
```javascript
// axiosConfig.js
axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.clear();
            alert('세션이 만료되었습니다. 다시 로그인해주세요.');
            window.location.href = '/'; // 메인페이지로 리다이렉트
        }
        return Promise.reject(error);
    }
);
```

---

### 4. WebSocket 실시간 통신 (STOMP)

**STOMP 프로토콜**을 사용하여 채팅, 투표, 접속 상태를 실시간으로 동기화합니다.

```java
// WebSocketConfig.java
@Override
public void configureMessageBroker(MessageBrokerRegistry config) {
    config.enableSimpleBroker("/topic"); // 클라이언트가 구독할 prefix
    config.setApplicationDestinationPrefixes("/app"); // 서버로 전송 시 prefix
}
```

**주요 토픽:**
- `/topic/chat/{travelId}` - 채팅 메시지
- `/topic/travel/{travelId}` - 투표/짐 체크리스트 업데이트
- `/topic/travel/{travelId}/presence` - 접속 상태

**접속 상태 관리 (Presence System):**
```java
// PresenceController.java
@MessageMapping("/travel/{travelId}/enter")
public void enter(@DestinationVariable Long travelId, @Payload String username) {
    roomUsers.computeIfAbsent(travelId, k -> ConcurrentHashMap.newKeySet()).add(username);
    broadcastList(travelId); // 전체에게 현재 접속자 명단 전송
}

@EventListener
public void handleDisconnect(SessionDisconnectEvent event) {
    // 브라우저 종료 시 자동으로 명단에서 제거
}
```

---

## 🔥 트러블 슈팅

### 1️⃣ Redis 연결 거부 (`RedisConnectionFailureException`)

**🚨 문제:**
```
Unable to connect to Redis; Connection refused: localhost/127.0.0.1:6379
```

**🔍 원인:**
- Spring Boot 실행 전 Redis 서버가 구동되지 않음

**✅ 해결:**
```bash
docker run -d --name podo-redis -p 6379:6379 redis:latest
```

---

### 2️⃣ Swagger 500 에러

**🚨 문제:**
- Swagger UI 접속 시 500 Internal Server Error

**🔍 원인:**
- Spring Security가 `/v3/api-docs/**` 경로를 차단

**✅ 해결:**
```java
// SecurityConfig.java
http.authorizeHttpRequests(auth -> auth
    .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()
    .anyRequest().authenticated()
);
```

---

### 3️⃣ CORS 에러

**🚨 문제:**
```
Access blocked by CORS policy
```

**🔍 원인:**
- 프론트엔드(5173)와 백엔드(8080) 포트가 달라 CORS 정책 위반

**✅ 해결:**
```java
@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.addAllowedOrigin("http://localhost:5173");
    configuration.addAllowedMethod("*");
    configuration.addAllowedHeader("*");
    configuration.setAllowCredentials(true);
    return source;
}
```

---

### 4️⃣ 프론트엔드 Authorization 헤더 누락

**🚨 문제:**
```
⚠️ Authorization 헤더 없음: /api/travels/my
```

**🔍 원인:**
- API 호출 시 JWT 토큰을 헤더에 포함하지 않음

**✅ 해결:**
```javascript
// axiosConfig.js - 글로벌 인터셉터
axios.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
```

---

### 5️⃣ WebSocket 연결 끊김 시 접속자 명단 미갱신

**🚨 문제:**
- 브라우저 종료 후에도 접속자 명단에 남아있음

**🔍 원인:**
- `SessionDisconnectEvent` 리스너가 제대로 동작하지 않음

**✅ 해결:**
```java
// sessionId와 사용자 정보를 매핑하여 저장
private final Map<String, UserSessionInfo> sessionMap = new ConcurrentHashMap<>();

@EventListener
public void handleDisconnect(SessionDisconnectEvent event) {
    String sessionId = event.getSessionId();
    UserSessionInfo info = sessionMap.remove(sessionId);
    if (info != null) {
        roomUsers.get(info.travelId).remove(info.username);
        broadcastList(info.travelId);
    }
}
```

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
│   ├── AuthController.java       # 로그인/회원가입/로그아웃
│   ├── TravelController.java     # 여행 CRUD
│   ├── ScheduleController.java   # 일정 관리
│   ├── VoteController.java       # 투표 시스템
│   ├── ItemController.java       # 짐 체크리스트
│   ├── ChatController.java       # 채팅 메시지
│   ├── PresenceController.java   # 접속 상태 관리
│   ├── AdminController.java      # 관리자 기능
│   ├── NotificationController.java # 알림
│   ├── MemberController.java     # 멤버 관리
│   └── UserController.java       # 사용자 조회
├── dto/                    # 데이터 전송 객체
├── entity/                 # JPA 엔티티 (DB 테이블)
│   ├── Users.java                # 사용자
│   ├── Travels.java              # 여행
│   ├── Schedule.java             # 일정
│   ├── Vote.java                 # 투표
│   ├── Item.java                 # 짐
│   ├── ChatMessage.java          # 채팅
│   └── Member.java               # 여행 멤버
├── interceptor/            # HTTP 요청 인터셉터
│   └── SessionInterceptor.java   # 세션 TTL 갱신
├── repository/             # JPA Repository
├── security/               # JWT 유틸리티
│   └── JwtUtil.java              # 토큰 생성/검증
└── service/                # 비즈니스 로직
    ├── AuthService.java          # 인증/인가
    ├── TravelService.java        # 여행 관리
    ├── ScheduleService.java      # 일정 관리
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
│   ├── VoteManager.jsx           # 투표
│   ├── PlaceSearch.jsx           # 장소 검색
│   ├── DayRouteMap.jsx           # 지도
│   ├── PresenceAvatars.jsx       # 접속 상태
│   ├── AdminDashboard.jsx        # 관리자 대시보드
│   └── MyPage.jsx                # 마이페이지
├── axiosConfig.js          # Axios 인터셉터 설정
├── App.jsx                 # 라우팅 설정
└── main.jsx                # 앱 진입점
```

---

## 🚀 실행 방법

### 0. 환경 설정 (최초 1회)

**⚠️ 중요: 민감한 정보 설정**

```bash
# 1. application.properties 파일 생성
cd src/main/resources
cp application.properties.example application.properties

# 2. application.properties 파일 수정
# - spring.datasource.username: MySQL 사용자명
# - spring.datasource.password: MySQL 비밀번호
```

### 1. Redis 실행 (Docker)
```bash
docker run -d --name podo-redis -p 6379:6379 redis:latest
```

### 2. MySQL 설정
```sql
CREATE DATABASE podo;
```

### 3. Backend 실행
```bash
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

## 📌 Git 설정 안내

### .gitignore에 포함된 파일들 (Git에 올라가지 않음)

**민감한 정보:**
- `application.properties` - DB 비밀번호, API 키
- `.env` 파일들

**빌드 결과물:**
- `build/`, `target/`, `dist/`
- `node_modules/`

**업로드 파일:**
- `uploads/` - 사용자가 업로드한 이미지

**기타:**
- 로그 파일 (`*.log`)
- IDE 설정 (`.idea/`, `.vscode/`)
- OS 파일 (`.DS_Store`)

### 처음 클론하는 경우

```bash
# 1. 저장소 클론
git clone <repository-url>
cd server

# 2. application.properties 생성
cp src/main/resources/application.properties.example src/main/resources/application.properties

# 3. application.properties 수정 (DB 정보 입력)
# vim 또는 메모장으로 수정

# 4. 의존성 설치 및 실행 (위의 실행 방법 참고)
```

---

## 📝 API 문서

Swagger를 통해 모든 API 엔드포인트를 테스트할 수 있습니다.

**접속:** http://localhost:8080/swagger-ui/index.html

**주요 엔드포인트:**
- `POST /api/auth/login` - 로그인
- `POST /api/auth/signup` - 회원가입
- `POST /api/auth/logout` - 로그아웃
- `GET /api/travels/my` - 내 여행 목록
- `POST /api/travels` - 여행 생성
- `POST /api/travels/{travelId}/join` - 여행 참가
- `GET /api/schedules/{travelId}/{day}` - 일정 조회
- `POST /api/schedules/{travelId}/{day}/optimize` - 동선 최적화
- `POST /api/votes/{travelId}` - 투표 생성
- `GET /api/items/{travelId}` - 짐 체크리스트 조회
- `GET /api/admin/stats` - 관리자 통계

---

## 🎓 학습 내용

이 프로젝트를 통해 다음 개념들을 깊이 있게 학습했습니다:

### Backend
- **Spring Security + JWT**: Stateless 인증 구현
- **Redis Session**: 세션 TTL 관리 및 자동 로그아웃
- **Redis Caching**: 성능 최적화
- **WebSocket (STOMP)**: 실시간 통신
- **TSP 알고리즘**: Nearest Neighbor + Haversine 거리 계산
- **Swagger**: API 문서 자동화

### Frontend
- **React Hooks**: useState, useEffect
- **Axios Interceptor**: 인증 토큰 자동 관리
- **WebSocket Client**: STOMP.js를 이용한 실시간 통신
- **Recharts**: 통계 데이터 시각화

### DevOps
- **Docker**: Redis 컨테이너 관리
- **Git**: 버전 관리

---

## 🔮 향후 계획

- [ ] OAuth2 소셜 로그인 (Kakao, Google)
- [ ] 비용 정산 기능
- [ ] 일정 공유 링크 생성
- [ ] 다국어 지원 (i18n)
- [ ] CI/CD 파이프라인 구축
- [ ] AWS 배포 (EC2, RDS, S3)

---

## 📄 라이센스

이 프로젝트는 개인 포트폴리오 용도로 제작되었습니다.

---

<div align="center">

**⭐ 이 프로젝트가 도움이 되었다면 Star를 눌러주세요! ⭐**

</div>
