package com.podo.server.service;

import com.podo.server.dto.TravelRequest;
import com.podo.server.entity.Member;
import com.podo.server.entity.Travels;
import com.podo.server.repository.MemberRepository;
import com.podo.server.repository.TravelRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class TravelService {

    private final TravelRepository travelRepository;
    private final MemberRepository memberRepository;
    private final com.podo.server.repository.UserRepository userRepository;
    private final com.podo.server.repository.ScheduleRepository scheduleRepository;

    @Transactional
    public Long createTravel(TravelRequest request, String creatorEmail, String creatorName) {
        String randomCode = UUID.randomUUID().toString().substring(0, 8);
        Travels travel = new Travels(
                request.getTitle(),
                request.getStartDate(),
                request.getEndDate(),
                randomCode,
                creatorEmail
        );
        Travels savedTravel = travelRepository.save(travel);

        // Add creator as a member
        if (!memberRepository.existsByTravel_TravelIdAndEmail(savedTravel.getTravelId(), creatorEmail)) {
            Member creator = new Member(creatorName, creatorEmail, savedTravel);
            memberRepository.save(creator);
        }

        // Link to User
        userRepository.findByEmail(creatorEmail).ifPresent(user -> {
            user.addTravel(savedTravel);
            userRepository.save(user);
        });

        log.info("Travel created: ID={}, Title={}, Creator={}", savedTravel.getTravelId(), savedTravel.getTitle(), creatorEmail);
        return savedTravel.getTravelId();
    }

    public List<Travels> getAllTravels() {
        return travelRepository.findAll();
    }

    public List<Travels> getMyTravels(String email) {
        return travelRepository.findByMemberEmail(email);
    }

    public Travels getTravelById(Long travelId) {
        return travelRepository.findById(travelId)
                .orElseThrow(() -> new RuntimeException("Travel not found"));
    }

    public Travels getTravelByInviteCode(String inviteCode) {
        return travelRepository.findByInviteCode(inviteCode)
                .orElseThrow(() -> new RuntimeException("Invalid invite code"));
    }

    @Transactional
    public void joinTravel(Long travelId, String email, String nickname) {
        Travels travel = getTravelById(travelId);

        if (memberRepository.existsByTravel_TravelIdAndEmail(travelId, email)) {
            throw new RuntimeException("Already joined this travel");
        }

        Member newMember = new Member(nickname, email, travel);
        memberRepository.save(newMember);

        userRepository.findByEmail(email).ifPresent(user -> {
            user.addTravel(travel);
            userRepository.save(user);
        });
        
        log.info("Member joined: TravelId={}, Email={}", travelId, email);
    }

    @Transactional
    public Travels updateTravel(Long travelId, Travels request) {
        Travels travel = getTravelById(travelId);
        
        if (request.getTitle() != null) travel.setTitle(request.getTitle());
        if (request.getStartDate() != null) travel.setStartDate(request.getStartDate());
        if (request.getEndDate() != null) travel.setEndDate(request.getEndDate());
        
        log.info("Travel updated: ID={}", travelId);
        return travel;
    }

    @Transactional
    public void deleteTravel(Long travelId, String email) {
        Travels travel = getTravelById(travelId);

        if (travel.getOwnerEmail() != null && !travel.getOwnerEmail().equals(email)) {
            throw new RuntimeException("Only the owner can delete the travel");
        }

        travelRepository.delete(travel);
        log.info("Travel deleted: ID={}, By={}", travelId, email);
    }

    public com.podo.server.dto.StatsResponse getStats(String email) {
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