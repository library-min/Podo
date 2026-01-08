package com.podo.server.repository;

import com.podo.server.entity.Vote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VoteRepository extends JpaRepository<Vote, Long> {
    List<Vote> findByTravel_TravelIdOrderByIdDesc(Long travelId);
}
