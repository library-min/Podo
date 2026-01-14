package com.podo.server.controller;

import com.podo.server.entity.Users;
import com.podo.server.entity.Member;
import com.podo.server.repository.UserRepository;
import com.podo.server.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    private final UserRepository userRepository;
    private final MemberRepository memberRepository;

    // Check Email Availability
    @GetMapping("/check-email")
    public Map<String, Boolean> checkEmailAvailability(@RequestParam String email) {
        log.info("Checking email availability: {}", email);
        boolean exists = userRepository.existsByEmail(email);
        log.debug("Email {} exists: {}", email, exists);
        return Map.of("available", !exists);
    }

    // Get User Info
    @GetMapping("/{email}")
    public Users getUserInfo(@PathVariable String email) {
        log.info("Request for user info: {}", email);

        Users user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + email));

        log.debug("User found: {} / {}", user.getEmail(), user.getNickname());
        return user;
    }

    // Update Nickname
    @PatchMapping("/{email}")
    public Users updateNickname(@PathVariable String email, @RequestBody Map<String, String> body) {
        log.info("Request to update nickname for: {}", email);
        log.debug("Request body: {}", body);

        Users user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + email));

        String newNickname = body.get("nickname");
        log.info("New nickname: {}", newNickname);

        if (newNickname != null && !newNickname.trim().isEmpty()) {
            // 1. Update Nickname in Users table
            user.setNickname(newNickname);
            Users savedUser = userRepository.save(user);

            // 2. Batch update names in Member table
            List<Member> members = memberRepository.findByEmail(email);
            for (Member member : members) {
                member.setName(newNickname);
            }
            memberRepository.saveAll(members);

            log.info("Nickname update complete (including Member table): {}", savedUser.getNickname());
            return savedUser;
        }

        throw new IllegalArgumentException("Invalid nickname");
    }

    // Delete User
    @DeleteMapping("/{email}")
    public String deleteUser(@PathVariable String email) {
        log.info("Request to delete user: {}", email);

        Users user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + email));

        userRepository.delete(user);
        log.info("User deleted: {}", email);
        return "User deletion completed.";
    }
}
