package com.podo.server.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter @Setter
@NoArgsConstructor
public class Item {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;        // 물건 이름
    private String category;    // 👈 추가됨! (음식, 장비 등)
    private boolean isChecked;  // 체크 여부
    private String checker;     // 담당자 닉네임

    @ManyToOne
    @JoinColumn(name = "travel_id")
    private Travels travel;

    // 👈 컨트롤러에서 호출하는 새 생성자
    public Item(String name, String category, Travels travel) {
        this.name = name;
        this.category = category;
        this.travel = travel;
        this.isChecked = false;
    }
}