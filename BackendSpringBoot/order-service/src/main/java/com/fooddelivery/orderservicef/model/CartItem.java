package com.fooddelivery.orderservicef.model;

import java.math.BigDecimal;
import java.util.UUID;

import jakarta.persistence.*;
import lombok.*;
@Entity
@Table(name = "cart_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cart_id", nullable = false)
    private Cart cart;
    @Column(nullable = false)
    private Long menuItemId;
    @Column(nullable = false)
    private String itemName;
    @Column(nullable = false)
    private Integer quantity;
    @Column(nullable = false)
    private double price;
}