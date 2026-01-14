package com.podo.server.config;

import com.podo.server.entity.Role;
import com.podo.server.entity.Users;
import com.podo.server.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Class to load initial data at application startup.
 *
 * ⚠️ Important: Admin account is created only here!
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class DataLoader implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Create admin account if not exists
        String adminEmail = "admin@podo.com";

        if (userRepository.findByEmail(adminEmail).isEmpty()) {
            Users admin = new Users(
                adminEmail,
                passwordEncoder.encode("admin1234"), // Password: admin1234
                "Admin",
                Role.ADMIN
            );

            userRepository.save(admin);
            log.info("========================================");
            log.info("✅ Admin account created!");
            log.info("📧 Email: admin@podo.com");
            log.info("🔑 Password: admin1234");
            log.info("⚠️  Normal signups are created as USER role.");
            log.info("========================================");
        } else {
            log.info("ℹ️  Admin account already exists.");
        }
    }
}
