package com.ofds.menu.mapper;



import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import com.ofds.menu.dto.MenuItemRequestDto;
import com.ofds.menu.dto.MenuItemResponseDto;
import com.ofds.menu.entity.MenuItem;

@Component
public class MenuItemMapper {

	private ModelMapper modelMapper;

	public MenuItemMapper(ModelMapper modelMapper) {
		super();
		this.modelMapper = modelMapper;
	}
	
	public MenuItemResponseDto convertToDo(MenuItem menuItem) {
		return modelMapper.map(menuItem, MenuItemResponseDto.class);
	}
	
	public MenuItem convertToEntity(MenuItemRequestDto menuItemRequestDto) {
		return modelMapper.map(menuItemRequestDto,MenuItem.class);
	}
	
	public void updateEntityFromDto(MenuItemRequestDto menuItemRequestDto, MenuItem menuItem) {
		modelMapper.map(menuItemRequestDto, menuItem);
	}
}
