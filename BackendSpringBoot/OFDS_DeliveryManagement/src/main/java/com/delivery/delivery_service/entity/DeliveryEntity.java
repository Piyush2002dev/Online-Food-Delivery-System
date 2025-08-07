package com.delivery.delivery_service.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

/**
 * Represents a delivery record in the system.
 * This entity tracks the assignment of an order to an agent and its status.
 * It also includes auditing fields for tracking creation and last modification.
 */

@Entity
@Table (name = "delivery")
@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
public class DeliveryEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "delivery_id")
    private Long deliveryId;

    @Column(name = "order_id", unique = true, nullable = false)
    private Long orderId;

    @ManyToOne
    @JoinColumn(name = "agent_id")
    private AgentEntity agent;

    /**
     * The current status of the delivery (e.g., IN_PROGRESS, DELIVERED).
     * Stored as a string in the database.
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private DeliveryStatus deliveryStatus;

    @Column(name = "estimated_time_of_arrival", nullable = false)
    private LocalDateTime estimatedTimeOfArrival;

    @CreatedBy
    @Column(name = "created_by", nullable = false, updatable = false)
    private String createdBy;

    @CreatedDate
    @Column(name = "created_on", nullable = false, updatable = false)
    private LocalDateTime createdOn;

    @LastModifiedBy
    @Column(name = "updated_by")
    private String updatedBy;

    @LastModifiedDate
    @Column(name = "updated_on")
    private LocalDateTime updatedOn;

}
