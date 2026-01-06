package com.podo.server.repository;

import com.podo.server.entity.Item;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ItemRepository extends JpaRepository<Item, Long> {
    // "이 여행 방 번호(ID)에 해당하는 물건 다 가져와!"
    List<Item> findByTravel_TravelId(Long travelId);
}