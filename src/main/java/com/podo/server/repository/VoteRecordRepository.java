package com.podo.server.repository;

import com.podo.server.entity.Vote;
import com.podo.server.entity.VoteRecord;
import com.podo.server.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VoteRecordRepository extends JpaRepository<VoteRecord, Long> {
    Optional<VoteRecord> findByVoteAndUser(Vote vote, Users user);
    List<VoteRecord> findByVote(Vote vote);
}