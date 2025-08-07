package com.fooddelivery.orderservicef.model;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

public enum OrderStatus {
	   PENDING("Pending"),
	   ACCEPTED("Accepted"),
	   DECLINED("Declined"),
	   IN_COOKING("In Cooking"),
	   OUT_FOR_DELIVERY("Out for Delivery"),
	   COMPLETED("Completed"),
	   CANCELLED("Cancelled");
	   private final String displayName;
	   OrderStatus(String displayName) {
	       this.displayName = displayName;
	   }
	   public String getDisplayName() {
	       return displayName;
	   }
	   /**
	    * Validates if a status transition is allowed
	    * newStatus The target status
	    * true if transition is valid
	    */
	   public boolean canTransitionTo(OrderStatus newStatus) {
	       return switch (this) {
	           case PENDING -> newStatus == ACCEPTED || newStatus == DECLINED;
	           case ACCEPTED -> newStatus == IN_COOKING || newStatus == CANCELLED;
	           case IN_COOKING -> newStatus == OUT_FOR_DELIVERY || newStatus == CANCELLED;
	           case OUT_FOR_DELIVERY -> newStatus == COMPLETED;
	           case DECLINED -> newStatus == CANCELLED; // Allow declined orders to be cancelled for deletion
	           case COMPLETED, CANCELLED -> false;
	       };
	   }
	   /**
	    * Checks if the order is in a final state
	    */
	   public boolean isFinalState() {
	       return this == DECLINED || this == COMPLETED || this == CANCELLED;
	   }
	   /**
	    * Checks if the order can be cancelled
	    */
	   public boolean isCancellable() {
	       return !isFinalState() && this != OUT_FOR_DELIVERY;
	   }
	   /**
	    * Gets all valid next statuses
	    */
	   public List<OrderStatus> getValidTransitions() {
	       return Arrays.stream(OrderStatus.values())
	               .filter(status -> this.canTransitionTo(status))
	               .collect(Collectors.toList());
	   }
	}
