package com.podo.server.controller;

import com.podo.server.entity.Member;
import com.podo.server.entity.Travels;
import com.podo.server.repository.MemberRepository;
import com.podo.server.repository.TravelRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/members")
@CrossOrigin(origins = "http://localhost:5173")
public class MemberController {

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private TravelRepository travelRepository;

    @Autowired
    private NotificationController notificationController;

    // 특정 여행의 멤버 목록 조회
    @GetMapping("/{travelId}")
    public List<Member> getMembers(@PathVariable Long travelId) {
        return memberRepository.findByTravel_TravelId(travelId);
    }

    // 멤버 추가 (여행에 참여)
    @PostMapping("/{travelId}")
    public Member addMember(@PathVariable Long travelId, @RequestBody Member memberDto) {
        Travels travel = travelRepository.findById(travelId)
                .orElseThrow(() -> new IllegalArgumentException("여행을 찾을 수 없습니다!"));

        // 중복 체크
        if (memberRepository.existsByTravel_TravelIdAndEmail(travelId, memberDto.getEmail())) {
            throw new IllegalArgumentException("이미 해당 여행에 참여 중인 멤버입니다!");
        }

        Member newMember = new Member(
                memberDto.getName(),
                memberDto.getEmail(),
                travel
        );

        return memberRepository.save(newMember);
    }

    // 멤버 온라인 상태 토글
    @PatchMapping("/{memberId}/online")
    public Member toggleOnline(@PathVariable Long memberId) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException("멤버를 찾을 수 없습니다!"));

        member.setOnline(!member.isOnline());
        return memberRepository.save(member);
    }

    // 멤버 삭제
    @DeleteMapping("/{memberId}")
    public String deleteMember(@PathVariable Long memberId) {
        memberRepository.deleteById(memberId);
        return "멤버가 삭제되었습니다.";
    }

    // 멤버 초대 (알림 전송)
    @PostMapping("/{travelId}/invite")
    public String inviteMember(@PathVariable Long travelId, @RequestBody Map<String, String> body) {
        Travels travel = travelRepository.findById(travelId)
                .orElseThrow(() -> new IllegalArgumentException("여행을 찾을 수 없습니다!"));

        String recipientEmail = body.get("email");
        String senderName = body.get("senderName");

        // 초대 알림 생성
        notificationController.createInvitation(recipientEmail, senderName, travelId, travel.getTitle());

        return "초대 알림을 전송했습니다!";
    }
}
