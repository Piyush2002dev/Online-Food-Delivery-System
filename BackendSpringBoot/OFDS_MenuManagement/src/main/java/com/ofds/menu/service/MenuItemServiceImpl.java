package com.ofds.menu.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.ofds.menu.dto.MenuItemRequestDto;
import com.ofds.menu.dto.MenuItemResponseDto;
import com.ofds.menu.dto.ResponseMessageDto;
import com.ofds.menu.entity.MenuItem;
import com.ofds.menu.exception.DuplicateMenuItemException;
import com.ofds.menu.exception.InvalidCategoryException;
import com.ofds.menu.exception.InvalidItemIdException;
import com.ofds.menu.exception.InvalidItemNameException;
import com.ofds.menu.exception.InvalidRestaurantIdException;
import com.ofds.menu.exception.MenuItemNotFoundException;
import com.ofds.menu.exception.NoItemsInRestaurantException;
import com.ofds.menu.mapper.MenuItemMapper;
import com.ofds.menu.repository.MenuItemRepository;
import com.ofds.menu.util.AppConstants;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class MenuItemServiceImpl implements MenuItemService{

	private MenuItemRepository menuItemRepository;
	private MenuItemMapper menuItemMapper;
	
	public MenuItemServiceImpl(MenuItemRepository menuItemRepository, MenuItemMapper menuItemMapper) {
		super();
		this.menuItemRepository = menuItemRepository;
		this.menuItemMapper = menuItemMapper;
	}
	
	@Override
	public ResponseMessageDto createMenuItem(Long resturantId,MenuItemRequestDto menuItemRequestDto){
		if(resturantId==null || resturantId<=0) {
			throw new InvalidRestaurantIdException(AppConstants.INVALID_RESTAURANTID+resturantId);
		}
		Optional<MenuItem> exsistingMenuItem = menuItemRepository.findByRestaurantIdAndItemName(resturantId,menuItemRequestDto.getItemName());
		if(exsistingMenuItem.isPresent()) {
			throw new DuplicateMenuItemException(AppConstants.DUPLICATE_ITEM+menuItemRequestDto.getItemName());
		}
		
		MenuItem menuItem = menuItemMapper.convertToEntity(menuItemRequestDto);
		menuItem.setRestaurantId(resturantId);
		MenuItem savedMenuItem = menuItemRepository.save(menuItem);
		log.info("Added Menu Items:{}",savedMenuItem);
		return new ResponseMessageDto(AppConstants.ITEM_ADDED);
	}
	
	@Override
	public ResponseMessageDto updateMenuItem(Long itemId, MenuItemRequestDto menuItemRequestDto){
		if(itemId==null || itemId<=0) {
			throw new InvalidItemIdException(AppConstants.INVALID_ITEMID+itemId);
		}
		MenuItem exsistingMenuItem = menuItemRepository.findById(itemId)
				.orElseThrow(() -> new MenuItemNotFoundException(AppConstants.ITEM_NOTFOUND+itemId));
		
		menuItemMapper.updateEntityFromDto(menuItemRequestDto, exsistingMenuItem);
		MenuItem updatedMenuItem = menuItemRepository.save(exsistingMenuItem);
		log.info("Updated Menu Item:{}",updatedMenuItem);
		return new ResponseMessageDto(AppConstants.ITEM_UPDATED);
	}

	@Override
	public ResponseMessageDto deleteMenuItem(Long itemId){
		if(itemId==null || itemId<=0) {
			throw new InvalidItemIdException(AppConstants.INVALID_ITEMID+itemId);
		}
		MenuItem menuItem = menuItemRepository.findById(itemId)
				.orElseThrow(() -> new MenuItemNotFoundException(AppConstants.ITEM_NOTFOUND+itemId));
		menuItemRepository.delete(menuItem);
		log.info("Deleted Menu Item:{}",menuItem);
		return new ResponseMessageDto(AppConstants.ITEM_DELETD);
	}
	
	@Override
	public MenuItemResponseDto getMenuItemById(Long itemId){
		if(itemId==null || itemId<=0) {
			throw new InvalidItemIdException(AppConstants.INVALID_ITEMID+itemId);
		}
		MenuItem menuItem = menuItemRepository.findById(itemId)
				.orElseThrow(() -> new MenuItemNotFoundException(AppConstants.ITEM_NOTFOUND+itemId)) ;
		log.info("Menu Item by ItemId "+itemId+":{}",menuItem);
		return menuItemMapper.convertToDo(menuItem);
	}
	
	@Override
	public List<MenuItemResponseDto> getAllMenuItemsByResturant(Long restaurantId) {
	
		if(restaurantId==null || restaurantId<=0) {
			throw new InvalidRestaurantIdException(AppConstants.INVALID_RESTAURANTID+restaurantId);
		}
		
		List<MenuItem> menuItems = menuItemRepository.findByRestaurantId(restaurantId);
		log.info("{}",menuItems);
		if(menuItems.isEmpty()) {
			throw new NoItemsInRestaurantException(AppConstants.NOITEMS_IN_RESTAURANT+restaurantId);
		}
		
		log.info("Menu Items from resturant with ID "+restaurantId+"{}",menuItems);
		
		return menuItems.stream()
						.map(menuItemMapper::convertToDo)
						.toList();
	}
	
	@Override
	public List<MenuItemResponseDto> getMenuItemByCategory(Long restaurantId, Boolean isVegetarian){
		if(restaurantId==null || restaurantId<=0) {
			throw new InvalidRestaurantIdException(AppConstants.INVALID_RESTAURANTID+restaurantId);
		}
		if(isVegetarian == null) {
			throw new InvalidCategoryException(AppConstants.INVALID_CATEGORY);
		}
		List<MenuItem> menuItems = menuItemRepository.findByRestaurantIdAndIsVegetarian(restaurantId,isVegetarian);
		log.info("{}",menuItems);
		if(menuItems.isEmpty()) {
			throw new NoItemsInRestaurantException(AppConstants.NO_CATEGORY_ITEMS+restaurantId);
		}
		
		log.info("Menu Items from resturant with ID {} and category {} are : {}",restaurantId,isVegetarian,menuItems);
		
		return menuItems.stream()
				.map(menuItemMapper::convertToDo)
				.toList();
	}
	
	@Override
    public List<Long> getMenuItemsBySimilarName(String itemName) {
        log.info("Attempting to retrieve menu items with similar name: {}", itemName);

        if (itemName == null || itemName.trim().isEmpty()) {
            log.error("Invalid item name provided: {}", itemName);
            throw new InvalidItemNameException(AppConstants.INVALID_ITEMNAME);
        }

        List<MenuItem> menuItems = menuItemRepository.findByItemNameContainingIgnoreCase(itemName);

        if (menuItems.isEmpty()) {
            log.warn("No menu items found with name similar to: {}", itemName);
            throw new NoItemsInRestaurantException(AppConstants.NO_SIMILAR_ITEMS_FOUND + itemName);
        }

        List<Long> uniqueRestaurantIds = menuItems.stream()
                .map(MenuItem::getRestaurantId)
                .distinct()
                .toList();

        log.info("Successfully retrieved {} unique restaurant IDs for similar item name: {}", uniqueRestaurantIds.size(), itemName);
        return uniqueRestaurantIds;
    }
	
}
