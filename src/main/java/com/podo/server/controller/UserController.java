package com.podo.server.controller;

import com.podo.server.entity.Users;
import com.podo.server.entity.Member;
import com.podo.server.repository.UserRepository;
import com.podo.server.repository.MemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MemberRepository memberRepository;

    // 내 정보 조회
    @GetMapping("/{email}")
    public Users getUserInfo(@PathVariable String email) {
        System.out.println("===== 사용자 정보 조회 요청 =====");
        System.out.println("받은 이메일: " + email);

        Users user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다: " + email));

        System.out.println("조회된 사용자: " + user.getEmail() + " / " + user.getNickname());
        return user;
    }

    // 닉네임 변경
    @PatchMapping("/{email}")
    public Users updateNickname(@PathVariable String email, @RequestBody Map<String, String> body) {
        System.out.println("===== 닉네임 변경 요청 =====");
        System.out.println("받은 이메일: " + email);
        System.out.println("요청 바디: " + body);

        Users user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다: " + email));

        String newNickname = body.get("nickname");
        System.out.println("변경할 닉네임: " + newNickname);

        if (newNickname != null && !newNickname.trim().isEmpty()) {
            // 1. User 테이블 닉네임 변경
            user.setNickname(newNickname);
            Users savedUser = userRepository.save(user);

            // 2. Member 테이블(각 여행의 참여자 정보)의 이름도 일괄 변경
            List<Member> members = memberRepository.findByEmail(email);
            for (Member member : members) {
                member.setName(newNickname);
            }
            memberRepository.saveAll(members);

            System.out.println("닉네임 변경 완료 (Member 테이블 포함): " + savedUser.getNickname());
            return savedUser;
        }

        throw new IllegalArgumentException("유효하지 않은 닉네임입니다.");
    }

    // 회원탈퇴
    @DeleteMapping("/{email}")
    public String deleteUser(@PathVariable String email) {
        System.out.println("===== 회원탈퇴 요청 =====");
        System.out.println("받은 이메일: " + email);

        Users user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다: " + email));

        userRepository.delete(user);
        System.out.println("회원탈퇴 완료: " + email);
        return "회원탈퇴가 완료되었습니다.";
    }
}
