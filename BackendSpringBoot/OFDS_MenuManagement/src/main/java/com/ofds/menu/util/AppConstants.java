package com.ofds.menu.util;

public class AppConstants {
	public static final String ITEM_ADDED = "Menu item added successfully.";
	public static final String ITEM_UPDATED = "Menu item updated successfully.";
	public static final String ITEM_DELETD = "Menu item deleted successfully.";
	public static final String DUPLICATE_ITEM = "Menu item already exixts in the restaurant with item name : ";
	public static final String ITEM_NOTFOUND = "Menu item not found with item ID : ";
	public static final String NOITEMS_IN_RESTAURANT = "No Menu items found in the restaurant ID : ";
	public static final String INVALID_RESTAURANTID = "There is no restaurant with restaurant ID : ";
	public static final String INVALID_ITEMID = "There is no item with item ID : ";
	public static final String INVALID_CATEGORY = "Vegetarian status (isVegetarian) cannot be null";
	public static final String NO_CATEGORY_ITEMS = "There are no items for your dersired category in the restaurant with ID : ";
	public static final String NO_SIMILAR_ITEMS_FOUND = "There are no restaurants containing this item name";
	public static final String INVALID_ITEMNAME = "Item name for search cannot be null or blank.";
	
	private AppConstants() {
		  throw new UnsupportedOperationException("Utility class cannot be instantiated");
	}
	
}
