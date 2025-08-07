package com.fooddelivery.orderservicef.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class RestaurantDTO {
   private Long id;
   private String name;
   private String location;
   private String email;
   private boolean active;
}