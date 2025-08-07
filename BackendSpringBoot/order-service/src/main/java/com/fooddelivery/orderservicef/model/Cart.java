package com.fooddelivery.orderservicef.model;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "carts")
public class Cart {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private Long restaurantId;

    @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CartItem> items = new ArrayList<>();

    // --- ADD THESE HELPER METHODS ---

    /**
     * Helper method to add a CartItem to this cart.
     * Manages the bidirectional relationship by also setting the CartItem's cart reference.
     * @param item The CartItem to add.
     */
    public void addCartItem(CartItem item) {
        if (item != null) {
            items.add(item);
            item.setCart(this);
        }
    }

    /**
     * Helper method to remove a CartItem from this cart.
     * Manages the bidirectional relationship by also nullifying the CartItem's cart reference.
     * @param item The CartItem to remove.
     */
    public void removeCartItem(CartItem item) {
        if (item != null && items.remove(item)) {
            item.setCart(null); // Detach from cart
        }
    }
}