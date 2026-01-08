package com.podo.server.controller;

// 👇 여기가 중요합니다! 경로가 com.podo.server... 로 바뀌었습니다.
import com.podo.server.entity.Item;
import com.podo.server.entity.Travels;
import com.podo.server.repository.ItemRepository;
import com.podo.server.repository.TravelRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/items")
@CrossOrigin(origins = "http://localhost:5173")
public class ItemController {

    @Autowired
    private ItemRepository itemRepository; // 이제 찾을 수 있습니다!

    @Autowired
    private TravelRepository travelRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate; // 웹소켓 메시지 전송용

    @GetMapping("/{travelId}")
    public List<Item> getItems(@PathVariable Long travelId) {
        System.out.println("===== 아이템 목록 조회 요청 =====");
        System.out.println("travelId: " + travelId);

        List<Item> items = itemRepository.findByTravel_TravelId(travelId);
        System.out.println("조회된 아이템 수: " + items.size());

        return items;
    }

    @PostMapping("/{travelId}")
    public Item addItem(@PathVariable Long travelId, @RequestBody Item itemDto) {
        System.out.println("===== 아이템 추가 요청 =====");
        System.out.println("travelId: " + travelId);
        System.out.println("아이템 이름: " + itemDto.getName());
        System.out.println("카테고리: " + itemDto.getCategory());

        Travels travel = travelRepository.findById(travelId)
                .orElseThrow(() -> new IllegalArgumentException("없는 여행 방입니다!"));

        Item newItem = new Item(itemDto.getName(),
                               itemDto.getCategory() != null ? itemDto.getCategory() : "기타",
                               travel);
        Item savedItem = itemRepository.save(newItem);

        System.out.println("아이템 저장 완료: ID=" + savedItem.getId());

        // 📡 실시간 업데이트 알림 전송
        sendUpdate(travelId);

        return savedItem;
    }

    @PatchMapping("/{itemId}/check")
    public Item toggleCheck(@PathVariable Long itemId, @RequestBody Item checkDto) {
        System.out.println("===== 체크 토글 요청 =====");
        System.out.println("itemId: " + itemId);
        System.out.println("checker: " + checkDto.getChecker());

        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new IllegalArgumentException("없는 물건입니다!"));

        System.out.println("현재 체크 상태: " + item.isChecked());

        if (item.isChecked()) {
            item.setChecked(false);
            item.setChecker(null); // 체크 해제 시 완료자 정보도 삭제
            System.out.println("체크 해제");
        } else {
            item.setChecked(true);
            item.setChecker(checkDto.getChecker()); // 완료자 기록
            System.out.println("체크 완료, 담당자: " + checkDto.getChecker());
        }
        Item updatedItem = itemRepository.save(item);

        System.out.println("체크 상태 저장 완료");

        // 📡 실시간 업데이트 알림 전송
        sendUpdate(item.getTravel().getTravelId());

        return updatedItem;
    }

    // 담당자(챙겨올 사람) 지정/해제
    @PatchMapping("/{itemId}/assignee")
    public Item toggleAssignee(@PathVariable Long itemId, @RequestBody Item assigneeDto) {
        System.out.println("===== 담당자 토글 요청 =====");
        System.out.println("itemId: " + itemId);
        System.out.println("새 담당자: " + assigneeDto.getAssignee());

        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new IllegalArgumentException("없는 물건입니다!"));

        System.out.println("현재 담당자: " + item.getAssignee());

        // 이미 같은 담당자가 지정되어 있으면 해제, 아니면 변경/지정
        if (assigneeDto.getAssignee() != null && assigneeDto.getAssignee().equals(item.getAssignee())) {
            item.setAssignee(null); // 담당자 해제
            System.out.println("담당자 해제");
        } else {
            item.setAssignee(assigneeDto.getAssignee()); // 담당자 지정
            System.out.println("담당자 지정 완료: " + assigneeDto.getAssignee());
        }
        Item updatedItem = itemRepository.save(item);

        System.out.println("담당자 상태 저장 완료");

        // 📡 실시간 업데이트 알림 전송
        sendUpdate(item.getTravel().getTravelId());

        return updatedItem;
    }

    // 아이템 삭제
    @DeleteMapping("/{itemId}")
    public String deleteItem(@PathVariable Long itemId) {
        System.out.println("===== 아이템 삭제 요청 =====");
        System.out.println("itemId: " + itemId);

        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new IllegalArgumentException("없는 물건입니다!"));

        Long travelId = item.getTravel().getTravelId();
        itemRepository.deleteById(itemId);

        System.out.println("아이템 삭제 완료");

        // 📡 실시간 업데이트 알림 전송
        sendUpdate(travelId);

        return "아이템이 삭제되었습니다.";
    }

    // 📡 웹소켓을 통해 "UPDATE" 메시지 전송 (모든 클라이언트가 목록 새로고침하도록)
    private void sendUpdate(Long travelId) {
        messagingTemplate.convertAndSend("/topic/travel/" + travelId, "UPDATE");
        System.out.println("📡 웹소켓 메시지 전송: /topic/travel/" + travelId + " -> UPDATE");
    }
}