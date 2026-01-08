package com.podo.server.controller;

import com.podo.server.entity.*;
import com.podo.server.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/votes")
@CrossOrigin(origins = "http://localhost:5173")
public class VoteController {

    @Autowired private VoteRepository voteRepository;
    @Autowired private VoteOptionRepository voteOptionRepository;
    @Autowired private TravelRepository travelRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private VoteRecordRepository voteRecordRepository;
    @Autowired private SimpMessagingTemplate messagingTemplate;

    // 1. 투표 목록 조회
    @GetMapping("/{travelId}")
    public List<Vote> getVotes(@PathVariable Long travelId) {
        return voteRepository.findByTravel_TravelIdOrderByIdDesc(travelId);
    }

    // 2. 투표 생성
    @PostMapping("/{travelId}")
    public Vote createVote(@PathVariable Long travelId, @RequestBody Vote voteDto) {
        Travels travel = travelRepository.findById(travelId).orElseThrow();
        voteDto.setTravel(travel);

        // 프론트에서 options에 text만 담아서 보내면 여기서 연결
        for (VoteOption option : voteDto.getOptions()) {
            option.setVote(voteDto);
        }

        Vote saved = voteRepository.save(voteDto);
        messagingTemplate.convertAndSend("/topic/travel/" + travelId, "VOTE_UPDATE");
        return saved;
    }

    // 3. 투표하기 (토글 방식: 취소/변경 가능)
    @PostMapping("/cast/{optionId}")
    public String castVote(@PathVariable Long optionId, @RequestBody Map<String, String> data) {
        String userEmail = data.get("userEmail");

        VoteOption newOption = voteOptionRepository.findById(optionId).orElseThrow();
        Vote vote = newOption.getVote();
        Users user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        // 기존 투표 기록 조회
        VoteRecord existingRecord = voteRecordRepository.findByVoteAndUser(vote, user).orElse(null);

        if (existingRecord != null) {
            VoteOption oldOption = existingRecord.getSelectedOption();

            if (oldOption.getId().equals(newOption.getId())) {
                // 같은 항목 클릭 -> 투표 취소
                oldOption.setCount(oldOption.getCount() - 1);
                voteOptionRepository.save(oldOption);
                voteRecordRepository.delete(existingRecord);
                messagingTemplate.convertAndSend("/topic/travel/" + vote.getTravel().getTravelId(), "VOTE_UPDATE");
                return "투표 취소";
            } else {
                // 다른 항목 클릭 -> 변경
                oldOption.setCount(oldOption.getCount() - 1);
                voteOptionRepository.save(oldOption);

                newOption.setCount(newOption.getCount() + 1);
                voteOptionRepository.save(newOption);

                existingRecord.setSelectedOption(newOption);
                voteRecordRepository.save(existingRecord);
                messagingTemplate.convertAndSend("/topic/travel/" + vote.getTravel().getTravelId(), "VOTE_UPDATE");
                return "투표 변경";
            }
        } else {
            // 새 투표
            newOption.setCount(newOption.getCount() + 1);
            voteOptionRepository.save(newOption);

            VoteRecord newRecord = new VoteRecord(vote, user, newOption);
            voteRecordRepository.save(newRecord);
            messagingTemplate.convertAndSend("/topic/travel/" + vote.getTravel().getTravelId(), "VOTE_UPDATE");
            return "투표 완료";
        }
    }

    // 5. 내 투표 기록 조회
    @GetMapping("/my-votes/{travelId}")
    public Map<Long, Long> getMyVotes(@PathVariable Long travelId, @RequestParam String userEmail) {
        Users user = userRepository.findByEmail(userEmail).orElse(null);
        if (user == null) return Map.of();

        // 이 여행에 대한 내 모든 투표 기록 조회 (효율성을 위해 쿼리 최적화 권장)
        return voteRecordRepository.findAll().stream()
                .filter(r -> r.getVote().getTravel().getTravelId().equals(travelId) && r.getUser().getEmail().equals(userEmail))
                .collect(Collectors.toMap(
                        r -> r.getVote().getId(),
                        r -> r.getSelectedOption().getId()
                ));
    }

    // 4. 투표 삭제
    @DeleteMapping("/{voteId}")
    public void deleteVote(@PathVariable Long voteId) {
        Vote vote = voteRepository.findById(voteId).orElseThrow();
        Long travelId = vote.getTravel().getTravelId();
        voteRepository.delete(vote);
        messagingTemplate.convertAndSend("/topic/travel/" + travelId, "VOTE_UPDATE");
    }
}
