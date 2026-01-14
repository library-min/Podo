package com.podo.server.controller;

import com.podo.server.entity.Item;
import com.podo.server.entity.Travels;
import com.podo.server.repository.ItemRepository;
import com.podo.server.repository.TravelRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/items")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class ItemController {

    private final ItemRepository itemRepository;
    private final TravelRepository travelRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @GetMapping("/{travelId}")
    public List<Item> getItems(@PathVariable Long travelId) {
        log.info("Request to get items for travelId: {}", travelId);

        List<Item> items = itemRepository.findByTravel_TravelId(travelId);
        log.debug("Items found: {}", items.size());

        return items;
    }

    @PostMapping("/{travelId}")
    public Item addItem(@PathVariable Long travelId, @RequestBody Item itemDto) {
        log.info("Request to add item for travelId: {}", travelId);
        log.debug("Item Name: {}, Category: {}", itemDto.getName(), itemDto.getCategory());

        Travels travel = travelRepository.findById(travelId)
                .orElseThrow(() -> new IllegalArgumentException("Travel not found"));

        Item newItem = new Item(itemDto.getName(),
                               itemDto.getCategory() != null ? itemDto.getCategory() : "기타",
                               travel);
        Item savedItem = itemRepository.save(newItem);

        log.info("Item saved: ID={}", savedItem.getId());

        // Send real-time update notification
        sendUpdate(travelId);

        return savedItem;
    }

    @PatchMapping("/{itemId}/check")
    public Item toggleCheck(@PathVariable Long itemId, @RequestBody Item checkDto) {
        log.info("Request to toggle check for itemId: {}", itemId);

        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new IllegalArgumentException("Item not found"));

        log.debug("Current check status: {}", item.isChecked());

        if (item.isChecked()) {
            item.setChecked(false);
            item.setChecker(null);
            log.info("Item unchecked");
        } else {
            item.setChecked(true);
            item.setChecker(checkDto.getChecker());
            log.info("Item checked by: {}", checkDto.getChecker());
        }
        Item updatedItem = itemRepository.save(item);

        log.debug("Check status updated");

        // Send real-time update notification
        sendUpdate(item.getTravel().getTravelId());

        return updatedItem;
    }

    // Assign/Unassign Person
    @PatchMapping("/{itemId}/assignee")
    public Item toggleAssignee(@PathVariable Long itemId, @RequestBody Item assigneeDto) {
        log.info("Request to toggle assignee for itemId: {}", itemId);

        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new IllegalArgumentException("Item not found"));

        log.debug("Current assignee: {}", item.getAssignee());

        // Unassign if same person, otherwise assign/change
        if (assigneeDto.getAssignee() != null && assigneeDto.getAssignee().equals(item.getAssignee())) {
            item.setAssignee(null);
            log.info("Assignee removed");
        } else {
            item.setAssignee(assigneeDto.getAssignee());
            log.info("Assignee set to: {}", assigneeDto.getAssignee());
        }
        Item updatedItem = itemRepository.save(item);

        log.debug("Assignee status updated");

        // Send real-time update notification
        sendUpdate(item.getTravel().getTravelId());

        return updatedItem;
    }

    @DeleteMapping("/{itemId}")
    public String deleteItem(@PathVariable Long itemId) {
        log.info("Request to delete item: {}", itemId);

        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new IllegalArgumentException("Item not found"));

        Long travelId = item.getTravel().getTravelId();
        itemRepository.deleteById(itemId);

        log.info("Item deleted");

        // Send real-time update notification
        sendUpdate(travelId);

        return "Item deleted successfully.";
    }

    // Send "UPDATE" message via WebSocket
    private void sendUpdate(Long travelId) {
        messagingTemplate.convertAndSend("/topic/travel/" + travelId, "UPDATE");
        log.info("WebSocket message sent: /topic/travel/{} -> UPDATE", travelId);
    }
}