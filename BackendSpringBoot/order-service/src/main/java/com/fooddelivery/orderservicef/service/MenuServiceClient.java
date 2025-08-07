package com.fooddelivery.orderservicef.service;

import java.util.UUID;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;

import com.fooddelivery.orderservicef.dto.MenuItemDTO;

@FeignClient(name = "MENU-SERVICE")
public interface MenuServiceClient {
    @GetMapping("/api/menu/{itemId}")
    MenuItemDTO getMenuItemById(
            @PathVariable Long itemId);
}