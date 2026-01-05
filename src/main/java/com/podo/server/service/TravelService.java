package com.podo.server.service;

import com.podo.server.dto.TravelRequest;
import com.podo.server.entity.Travels;
import com.podo.server.repository.TravelRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List; // 👈 추가됨
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TravelService {

    private final TravelRepository travelRepository;

    @Transactional
    public Long createTravel(TravelRequest request) {
        String randomCode = UUID.randomUUID().toString().substring(0, 8);
        Travels travel = new Travels(
                request.getTitle(),
                request.getStartDate(),
                request.getEndDate(),
                randomCode
        );
        Travels savedTravel = travelRepository.save(travel);
        return savedTravel.getTravelId();
    }

    // ⭐ 여기에 붙여넣으세요!
    public List<Travels> getAllTravels() {
        return travelRepository.findAll();
    }
}