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
        return itemRepository.findByTravel_TravelId(travelId);
    }

    @PostMapping("/{travelId}")
    public Item addItem(@PathVariable Long travelId, @RequestBody Item itemDto) {
        Travels travel = travelRepository.findById(travelId)
                .orElseThrow(() -> new IllegalArgumentException("없는 여행 방입니다!"));

        Item newItem = new Item(itemDto.getName(),
                               itemDto.getCategory() != null ? itemDto.getCategory() : "기타",
                               travel);
        Item savedItem = itemRepository.save(newItem);

        // 📡 실시간 업데이트 알림 전송
        sendUpdate(travelId);

        return savedItem;
    }

    @PatchMapping("/{itemId}/check")
    public Item toggleCheck(@PathVariable Long itemId, @RequestBody Item checkDto) {
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new IllegalArgumentException("없는 물건입니다!"));

        if (item.isChecked()) {
            item.setChecked(false);
            item.setChecker(null);
        } else {
            item.setChecked(true);
            item.setChecker(checkDto.getChecker());
        }
        Item updatedItem = itemRepository.save(item);

        // 📡 실시간 업데이트 알림 전송
        sendUpdate(item.getTravel().getTravelId());

        return updatedItem;
    }

    // 담당자 지정/해제
    @PatchMapping("/{itemId}/assignee")
    public Item toggleAssignee(@PathVariable Long itemId, @RequestBody Item assigneeDto) {
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new IllegalArgumentException("없는 물건입니다!"));

        if (assigneeDto.getChecker() != null && assigneeDto.getChecker().equals(item.getChecker())) {
            item.setChecker(null); // 담당자 해제
        } else {
            item.setChecker(assigneeDto.getChecker()); // 담당자 지정
        }
        Item updatedItem = itemRepository.save(item);

        // 📡 실시간 업데이트 알림 전송
        sendUpdate(item.getTravel().getTravelId());

        return updatedItem;
    }

    // 아이템 삭제
    @DeleteMapping("/{itemId}")
    public String deleteItem(@PathVariable Long itemId) {
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new IllegalArgumentException("없는 물건입니다!"));

        Long travelId = item.getTravel().getTravelId();
        itemRepository.deleteById(itemId);

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