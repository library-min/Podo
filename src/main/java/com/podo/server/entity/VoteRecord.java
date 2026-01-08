package com.podo.server.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter @Setter
@NoArgsConstructor
@Table(name = "vote_record", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"vote_id", "user_id"})
})
public class VoteRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vote_id")
    private Vote vote;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private Users user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "option_id")
    private VoteOption selectedOption;

    public VoteRecord(Vote vote, Users user, VoteOption selectedOption) {
        this.vote = vote;
        this.user = user;
        this.selectedOption = selectedOption;
    }
}