package com.podo.server.service;

import com.podo.server.dto.TravelRequest;
import com.podo.server.entity.Member;
import com.podo.server.entity.Travels;
import com.podo.server.repository.MemberRepository;
import com.podo.server.repository.TravelRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TravelService {

    private final TravelRepository travelRepository;
    private final MemberRepository memberRepository;
    private final com.podo.server.repository.UserRepository userRepository;
    private final com.podo.server.repository.ScheduleRepository scheduleRepository; // 👈 주입 추가

    @Transactional
    public Long createTravel(TravelRequest request, String creatorEmail, String creatorName) {
        String randomCode = UUID.randomUUID().toString().substring(0, 8);
        Travels travel = new Travels(
                request.getTitle(),
                request.getStartDate(),
                request.getEndDate(),
                randomCode,
                creatorEmail // 방장 이메일 저장
        );
        Travels savedTravel = travelRepository.save(travel);

        // 생성자를 멤버로 자동 추가 (중복 체크)
        if (!memberRepository.existsByTravel_TravelIdAndEmail(savedTravel.getTravelId(), creatorEmail)) {
            Member creator = new Member(creatorName, creatorEmail, savedTravel);
            memberRepository.save(creator);
        }

        // users_travels 매핑 테이블에 추가
        userRepository.findByEmail(creatorEmail).ifPresent(user -> {
            user.addTravel(savedTravel);
            userRepository.save(user);
        });

        return savedTravel.getTravelId();
    }

    public List<Travels> getAllTravels() {
        return travelRepository.findAll();
    }

    // 내 여행 목록 조회
    public List<Travels> getMyTravels(String email) {
        return travelRepository.findByMemberEmail(email);
    }

    // 특정 여행 조회
    public Travels getTravelById(Long travelId) {
        return travelRepository.findById(travelId)
                .orElseThrow(() -> new RuntimeException("여행을 찾을 수 없습니다."));
    }

    // 초대코드로 여행 조회
    public Travels getTravelByInviteCode(String inviteCode) {
        return travelRepository.findByInviteCode(inviteCode)
                .orElseThrow(() -> new RuntimeException("유효하지 않은 초대코드입니다."));
    }

    // 여행 참가
    @Transactional
    public void joinTravel(Long travelId, String email, String nickname) {
        Travels travel = getTravelById(travelId);

        // 중복 체크
        if (memberRepository.existsByTravel_TravelIdAndEmail(travelId, email)) {
            throw new RuntimeException("이미 참가한 여행입니다.");
        }

        // 멤버 추가
        Member newMember = new Member(nickname, email, travel);
        memberRepository.save(newMember);

        // users_travels 매핑 테이블에 추가
        userRepository.findByEmail(email).ifPresent(user -> {
            user.addTravel(travel);
            userRepository.save(user);
        });
    }

    // 통계 조회
    public com.podo.server.dto.StatsResponse getStats(String email) {
        // 1. 월별 여행 빈도 (Java에서 집계)
        List<Travels> myTravels = getMyTravels(email);
        java.util.Map<Integer, Long> monthlyCounts = myTravels.stream()
                .collect(java.util.stream.Collectors.groupingBy(
                        t -> t.getStartDate().getMonthValue(),
                        java.util.stream.Collectors.counting()
                ));

        List<com.podo.server.dto.StatsResponse.ChartData> monthlyData = new java.util.ArrayList<>();
        for (int i = 1; i <= 12; i++) {
            monthlyData.add(new com.podo.server.dto.StatsResponse.ChartData(
                    i + "월",
                    monthlyCounts.getOrDefault(i, 0L)
            ));
        }

        // 2. 일정 유형 분포 (DB 쿼리)
        List<Object[]> typeCounts = scheduleRepository.countTypesByMemberEmail(email);
        List<com.podo.server.dto.StatsResponse.ChartData> typeData = typeCounts.stream()
                .map(row -> new com.podo.server.dto.StatsResponse.ChartData(
                        (String) row[0],
                        (Long) row[1]
                ))
                .collect(java.util.stream.Collectors.toList());

        return new com.podo.server.dto.StatsResponse(monthlyData, typeData);
    }
}