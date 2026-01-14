package com.podo.server.controller;

import com.podo.server.entity.Member;
import com.podo.server.entity.Travels;
import com.podo.server.entity.Users;
import com.podo.server.repository.MemberRepository;
import com.podo.server.repository.TravelRepository;
import com.podo.server.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/members")
@RequiredArgsConstructor // 생성자 주입
@CrossOrigin(origins = "http://localhost:5173")
public class MemberController {

    private final MemberRepository memberRepository;
    private final TravelRepository travelRepository;
    private final UserRepository userRepository; // 👈 추가
    private final NotificationController notificationController;

    // 특정 여행의 멤버 목록 조회 (Sync Logic 추가)
    @GetMapping("/{travelId}")
    public List<Member> getMembers(@PathVariable Long travelId) {
        log.debug("Fetching members for travel: {}", travelId);
        
        // 1. users_travels 테이블(Source of Truth)에서 해당 여행의 유저 목록 가져오기
        List<Users> participatingUsers = userRepository.findByTravels_TravelId(travelId);
        Travels travel = travelRepository.findById(travelId).orElse(null);

        if (travel != null) {
            // 2. Member 테이블과 동기화 (누락된 유저가 있으면 Member 테이블에 추가)
            for (Users user : participatingUsers) {
                if (!memberRepository.existsByTravel_TravelIdAndEmail(travelId, user.getEmail())) {
                    log.info("Syncing user to member: {} ({})", user.getNickname(), user.getEmail());
                    Member newMember = new Member(
                            user.getNickname(),
                            user.getEmail(),
                            travel
                    );
                    memberRepository.save(newMember);
                }
            }
        }

        // 3. 동기화된 Member 목록 반환
        return memberRepository.findByTravel_TravelId(travelId);
    }

    // 멤버 추가 (여행에 참여)
    @PostMapping("/{travelId}")
    public Member addMember(@PathVariable Long travelId, @RequestBody Member memberDto) {
        Travels travel = travelRepository.findById(travelId)
                .orElseThrow(() -> new IllegalArgumentException("Travel not found"));

        if (memberRepository.existsByTravel_TravelIdAndEmail(travelId, memberDto.getEmail())) {
            throw new IllegalArgumentException("Member already exists");
        }

        Member newMember = new Member(
                memberDto.getName(),
                memberDto.getEmail(),
                travel
        );

        return memberRepository.save(newMember);
    }

    @PatchMapping("/{memberId}/online")
    public Member toggleOnline(@PathVariable Long memberId) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException("Member not found"));

        member.setOnline(!member.isOnline());
        return memberRepository.save(member);
    }

    @DeleteMapping("/{memberId}")
    public String deleteMember(@PathVariable Long memberId) {
        memberRepository.deleteById(memberId);
        return "Member deleted";
    }

    @PostMapping("/{travelId}/invite")
    public String inviteMember(@PathVariable Long travelId, @RequestBody Map<String, String> body) {
        Travels travel = travelRepository.findById(travelId)
                .orElseThrow(() -> new IllegalArgumentException("Travel not found"));

        String recipientEmail = body.get("email");
        String senderName = body.get("senderName");

        notificationController.createInvitation(recipientEmail, senderName, travelId, travel.getTitle());

        return "Invitation sent";
    }
}
