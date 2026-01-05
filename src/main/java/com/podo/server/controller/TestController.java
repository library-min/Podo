package com.podo.server.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    @GetMapping("/hello")
    public String sayHello() {
        return "🍇 포도 서버가 정상 작동 중입니다! (DB 연결 성공) 🍇";
    }
}