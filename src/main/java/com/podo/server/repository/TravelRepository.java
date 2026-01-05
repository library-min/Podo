package com.podo.server.repository;

import com.podo.server.entity.Travels;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TravelRepository extends JpaRepository<Travels, Long> {
    // 텅 비어있어도 기본적인 저장/조회 기능은 다 됩니다!
}