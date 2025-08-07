import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  description?: string;
  image?: string;
  category?: string;
  restaurantId?: number;
}

export interface Restaurant {
  id: number;
  name: string;
  description?: string;
  address?: string;
  location?: string;
  phone?: string;
  email?: string;
  image?: string;
  category?: string;
  rating?: number;
  deliveryTime?: string;
  deliveryFee?: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  private cartRestaurantSubject = new BehaviorSubject<Restaurant | null>(null);

  public cartItems$ = this.cartItemsSubject.asObservable();
  public cartRestaurant$ = this.cartRestaurantSubject.asObservable();

  constructor(private toastr: ToastrService) {
    // Load cart from localStorage if available
    this.loadCartFromStorage();
  }

  // Load cart from localStorage
  private loadCartFromStorage(): void {
    try {
      const savedCart = localStorage.getItem('cart');
      const savedRestaurant = localStorage.getItem('cartRestaurant');
      
      if (savedCart) {
        const cartItems = JSON.parse(savedCart);
        this.cartItemsSubject.next(cartItems);
      }
      
      if (savedRestaurant) {
        const restaurant = JSON.parse(savedRestaurant);
        this.cartRestaurantSubject.next(restaurant);
      }
    } catch (error) {
      console.error('Error loading cart from storage:', error);
    }
  }

  // Save cart to localStorage
  private saveCartToStorage(): void {
    try {
      localStorage.setItem('cart', JSON.stringify(this.cartItemsSubject.value));
      localStorage.setItem('cartRestaurant', JSON.stringify(this.cartRestaurantSubject.value));
    } catch (error) {
      console.error('Error saving cart to storage:', error);
    }
  }

  // Add item to cart
  addToCart(item: CartItem, restaurant: Restaurant): void {

    console.log('🧩 Adding to cart:', item);
    const currentItems = this.cartItemsSubject.value;
    const currentRestaurant = this.cartRestaurantSubject.value;

    // Check if adding from different restaurant
    if (currentRestaurant && currentRestaurant.id !== restaurant.id && currentItems.length > 0) {
      // Clear cart and set new restaurant
      this.clearCart();
      this.cartRestaurantSubject.next(restaurant);
      this.cartItemsSubject.next([{ ...item, quantity: 1 }]);
      // Removed annoying toastr notification
    } else {
      // Same restaurant or empty cart
      if (!currentRestaurant) {
        this.cartRestaurantSubject.next(restaurant);
      }

      const existingItemIndex = currentItems.findIndex(cartItem => cartItem.id === item.id);
      
      if (existingItemIndex > -1) {
        // Item already exists, increase quantity
        const updatedItems = [...currentItems];
        updatedItems[existingItemIndex].quantity += 1;
        this.cartItemsSubject.next(updatedItems);
        // Removed annoying toastr notification
      } else {
        // Add new item
        const newItems = [...currentItems, { ...item, quantity: 1 }];
        this.cartItemsSubject.next(newItems);
        // Removed annoying toastr notification
      }
    }

    this.saveCartToStorage();
  }

  // Remove item from cart
  removeFromCart(itemId: number): void {
    const currentItems = this.cartItemsSubject.value;
    const updatedItems = currentItems.filter(item => item.id !== itemId);
    this.cartItemsSubject.next(updatedItems);

    // Clear restaurant if cart is empty
    if (updatedItems.length === 0) {
      this.cartRestaurantSubject.next(null);
    }

    this.saveCartToStorage();
    // Removed annoying toastr notification
  }

  // Update item quantity
  updateQuantity(itemId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(itemId);
      return;
    }

    const currentItems = this.cartItemsSubject.value;
    const updatedItems = currentItems.map(item =>
      item.id === itemId ? { ...item, quantity } : item
    );
    this.cartItemsSubject.next(updatedItems);
    this.saveCartToStorage();
  }

  // Increase item quantity
  increaseQuantity(itemId: number): void {
    const currentItems = this.cartItemsSubject.value;
    const item = currentItems.find(item => item.id === itemId);
    if (item) {
      this.updateQuantity(itemId, item.quantity + 1);
    }
  }

  // Decrease item quantity
  decreaseQuantity(itemId: number): void {
    const currentItems = this.cartItemsSubject.value;
    const item = currentItems.find(item => item.id === itemId);
    if (item) {
      this.updateQuantity(itemId, item.quantity - 1);
    }
  }

  // Clear entire cart
  clearCart(): void {
    this.cartItemsSubject.next([]);
    this.cartRestaurantSubject.next(null);
    localStorage.removeItem('cart');
    localStorage.removeItem('cartRestaurant');
    // Removed annoying toastr notification
  }

  // Get cart total
  getCartTotal(): number {
    return this.cartItemsSubject.value.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  // Get cart item count
  getCartItemCount(): number {
    return this.cartItemsSubject.value.reduce((count, item) => count + item.quantity, 0);
  }

  // Get current cart items
  getCartItems(): CartItem[] {
    return this.cartItemsSubject.value;
  }

  // Get current cart restaurant
  getCartRestaurant(): Restaurant | null {
    return this.cartRestaurantSubject.value;
  }

  // Check if cart is empty
  isCartEmpty(): boolean {
    return this.cartItemsSubject.value.length === 0;
  }

  // Get restaurant ID for the current cart
getRestaurantId(): number | null {
  return this.cartRestaurantSubject.value?.id || null;
}

// Get simplified order items for backend
// getOrderItems(): { itemId: number; quantity: number; price: number }[] {
//   return this.cartItemsSubject.value.map(item => ({
//     itemId: item.id,
//     quantity: item.quantity,
//     price: item.price
//   }));
// }



getOrderItems(): {
  menuItemId: number;
  itemName: string;
  quantity: number;
  price: number;
}[] {
  return this.cartItemsSubject.value.map((cartItem: CartItem) => ({
    menuItemId: cartItem.id,
    itemName: cartItem.name,
    quantity: cartItem.quantity,
    price: cartItem.price
  }));



  
}





  // Get cart summary for checkout
  getCartSummary(): {
    items: CartItem[];
    restaurant: Restaurant | null;
    subtotal: number;
    deliveryFee: number;
    total: number;
    itemCount: number;
  } {
    const items = this.getCartItems();
    const restaurant = this.getCartRestaurant();
    const subtotal = this.getCartTotal();
    const deliveryFee = restaurant?.deliveryFee || 30; // Default delivery fee
    const total = subtotal + deliveryFee;
    const itemCount = this.getCartItemCount();

    return {
      items,
      restaurant,
      subtotal,
      deliveryFee,
      total,
      itemCount
    };
  }
} 