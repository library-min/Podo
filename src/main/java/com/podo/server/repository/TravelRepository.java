package com.podo.server.repository;

import com.podo.server.entity.Travels;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TravelRepository extends JpaRepository<Travels, Long> {
    // 기본적인 CRUD 기능(저장, 조회 등)이 자동으로 생성됩니다.
}