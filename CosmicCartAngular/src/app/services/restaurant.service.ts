import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { Restaurant, CartItem } from './cart.service';
import { catchError, finalize, tap } from 'rxjs/operators';
import { map } from 'rxjs/operators';

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  isVeg: string; // 'yes' or 'no'
  category?: string;
  image?: string;
  available?: boolean;
  restaurantId?: number;
}

export interface OrderItem {
  menuItemId: number;
  itemName: string;
  quantity: number;
  price: number;
}

export interface Order {
  orderId: number;
  userId: number;
  restaurantId: number;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  orderTime: string;
  deliveryAddress: string;
  customerName?: string;
  customerPhone?: string;
}


@Injectable({
  providedIn: 'root'
})
export class RestaurantService {
  private apiUrl = 'http://localhost:9095/api';
  private restaurantsSubject = new BehaviorSubject<Restaurant[]>([]);
  private currentRestaurantSubject = new BehaviorSubject<Restaurant | null>(null);
  private menuItemsSubject = new BehaviorSubject<MenuItem[]>([]);
  private ordersSubject = new BehaviorSubject<Order[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  public restaurants$ = this.restaurantsSubject.asObservable();
  public currentRestaurant$ = this.currentRestaurantSubject.asObservable();
  public menuItems$ = this.menuItemsSubject.asObservable();
  public orders$ = this.ordersSubject.asObservable();
  public loading$ = this.loadingSubject.asObservable();

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    const authHeaders = this.authService.getAuthHeaders();
    return new HttpHeaders(authHeaders);
  }

  fetchRestaurants(): Observable<Restaurant[]> {
    this.loadingSubject.next(true);
    return this.http.get<Restaurant[]>(`${this.apiUrl}/restaurants`).pipe(
      tap(restaurants => this.restaurantsSubject.next(restaurants)),
      catchError(error => {
        console.error('Error fetching restaurants:', error);
        return throwError(() => error);
      }),
      finalize(() => this.loadingSubject.next(false))
    );
  }

  fetchRestaurantById(id: number): Observable<Restaurant> {
    this.loadingSubject.next(true);
    return this.http.get<Restaurant>(`${this.apiUrl}/restaurants/${id}`).pipe(
      tap(restaurant => this.currentRestaurantSubject.next(restaurant)),
      catchError(error => {
        console.error('Error fetching restaurant:', error);
        return throwError(() => error);
      }),
      finalize(() => this.loadingSubject.next(false))
    );
  }

  fetchMenuItems(restaurantId: number): Observable<MenuItem[]> {
    this.loadingSubject.next(true);
    return this.http.get<any[]>(`${this.apiUrl}/menu/restaurant/${restaurantId}`).pipe(
      map(data => {
        const transformed = data.map((item: any) => ({
          id: item.itemId,
          name: item.itemName,
          description: item.description,
          price: item.price,
          isVeg: item.isVegetarian ? 'yes' : 'no',
          category: item.category || 'General',
          available: true,
          restaurantId: restaurantId
        }));
        console.log('🍽️ Transformed menu items:', transformed); // ✅ Add this
        return transformed;
      }),
      tap(menuItems => this.menuItemsSubject.next(menuItems)),
      catchError(error => {
        console.error('Error fetching menu items:', error);
        return throwError(() => error);
      }),
      finalize(() => this.loadingSubject.next(false))
    );
  }
  

  addMenuItem(restaurantId: number, menuItem: any): Observable<any> {
    const payload = {
      itemName: menuItem.name,
      description: menuItem.description,
      price: parseFloat(menuItem.price),
      isVegetarian: menuItem.isVeg === 'yes'
    };
    
    // Get the required headers for the backend
    const authHeaders = this.authService.getAuthHeaders();
    const roles = this.authService.getCurrentUserRoles();
    
    // Create headers object with all required values
    const headersObj: { [key: string]: string } = {
      ...authHeaders,
      'X-Internal-User-Id': restaurantId.toString(),
      'X-Internal-User-Roles': roles.length > 0 ? roles.join(',') : 'RESTAURANT'
    };
    
    return this.http.post<any>(`${this.apiUrl}/menu/restaurant`, payload, {
      headers: new HttpHeaders(headersObj)
    }).pipe(
      // Backend returns ResponseMessageDto, not MenuItem, so we just return the response
      catchError(error => throwError(() => error))
    );
  }

  updateMenuItem(restaurantId: number, itemId: number, updates: any): Observable<MenuItem> {
    const payload = {
      itemName: updates.name,
      description: updates.description,
      price: parseFloat(updates.price),
      isVegetarian: updates.isVeg === 'yes'
    };
    
    // Get the required headers for the backend
    const authHeaders = this.authService.getAuthHeaders();
    const roles = this.authService.getCurrentUserRoles();
    
    // Create headers object with all required values
    const headersObj: { [key: string]: string } = {
      ...authHeaders,
      'X-Internal-User-Roles': roles.length > 0 ? roles.join(',') : 'RESTAURANT'
    };
    
    return this.http.put<any>(`${this.apiUrl}/menu/${itemId}`, payload, {
      headers: new HttpHeaders(headersObj)
    }).pipe(
      tap(response => {
        const updatedItem: MenuItem = {
          id: response.itemId,
          name: response.itemName,
          description: response.description,
          price: response.price,
          isVeg: response.isVegetarian ? 'yes' : 'no',
          category: response.category || 'General',
          available: true,
          restaurantId: restaurantId
        };
        const currentItems = this.menuItemsSubject.value;
        const updatedItems = currentItems.map(item =>
          item.id === itemId ? updatedItem : item
        );
        this.menuItemsSubject.next(updatedItems);
      }),
      catchError(error => throwError(() => error))
    );
  }

  deleteMenuItem(restaurantId: number, itemId: number): Observable<void> {
    // Get the required headers for the backend
    const authHeaders = this.authService.getAuthHeaders();
    const roles = this.authService.getCurrentUserRoles();
    
    // Create headers object with all required values
    const headersObj: { [key: string]: string } = {
      ...authHeaders,
      'X-Internal-User-Roles': roles.length > 0 ? roles.join(',') : 'RESTAURANT'
    };
    
    return this.http.delete(`${this.apiUrl}/menu/${itemId}`, {
      headers: new HttpHeaders(headersObj),
      responseType: 'text' // Backend returns plain text "Item Deleted..."
    }).pipe(
      map(() => void 0), // Convert text response to void
      tap(() => {
        const currentItems = this.menuItemsSubject.value;
        const filteredItems = currentItems.filter(item => item.id !== itemId);
        this.menuItemsSubject.next(filteredItems);
      }),
      catchError(error => throwError(() => error))
    );
  }

  fetchRestaurantOrders(restaurantId: number): Observable<Order[]> {
    this.loadingSubject.next(true);
    return this.http.get<Order[]>(`${this.apiUrl}/orders/restaurant`, {
      headers: this.getHeaders()
    }).pipe(
      tap(orders => this.ordersSubject.next(orders)),
      catchError(error => {
        console.error('Error fetching restaurant orders:', error);
        return throwError(() => error);
      }),
      finalize(() => this.loadingSubject.next(false))
    );
  }

  updateOrderStatus(payload: {
    orderId: number;
    status: string;
    restaurantId: number;
  }): Observable<Order> {
    return this.http.put<Order>(`${this.apiUrl}/orders/status`, payload, {
      headers: this.getHeaders()
    }).pipe(
      tap(updatedOrder => {
        const currentOrders = this.ordersSubject.value;
        const updatedOrders = currentOrders.map(order =>
          order.orderId === updatedOrder.orderId ? updatedOrder : order
        );
        this.ordersSubject.next(updatedOrders);
      }),
      catchError(error => throwError(() => error))
    );
  }

  deleteOrder(orderId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/orders/${orderId}`, {
      headers: this.getHeaders()
    }).pipe(
      tap(() => {
        const currentOrders = this.ordersSubject.value;
        const filteredOrders = currentOrders.filter(order => order.orderId !== orderId);
        this.ordersSubject.next(filteredOrders);
      }),
      catchError(error => {
        console.error('Delete order error:', error);
        let errorMessage = 'Failed to delete order';
        
        if (error.status === 400) {
          errorMessage = 'Cannot delete this order. It may be in an invalid state or already processed.';
        } else if (error.status === 403) {
          errorMessage = 'You do not have permission to delete this order.';
        } else if (error.status === 404) {
          errorMessage = 'Order not found or already deleted.';
        } else if (error.status === 409) {
          errorMessage = 'Order cannot be deleted due to its current status.';
        }
        
        return throwError(() => ({ ...error, customMessage: errorMessage }));
      })
    );
  }

  private getCurrentRestaurantId(): number | null {
    // Get restaurant ID from auth service or local storage
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        return user.id || null;
      } catch (e) {
        return null;
      }
    }
    return null;
  }
  
  

  searchRestaurants(query: string): Observable<Restaurant[]> {
    return this.http.get<Restaurant[]>(`${this.apiUrl}/restaurants/search?q=${encodeURIComponent(query)}`).pipe(
      catchError(error => throwError(() => error))
    );
  }

  filterRestaurantsByCategory(category: string): Observable<Restaurant[]> {
    return this.http.get<Restaurant[]>(`${this.apiUrl}/restaurants?category=${encodeURIComponent(category)}`).pipe(
      catchError(error => throwError(() => error))
    );
  }

  getRestaurants(): Restaurant[] {
    return this.restaurantsSubject.value;
  }

  getCurrentRestaurant(): Restaurant | null {
    return this.currentRestaurantSubject.value;
  }

  getMenuItems(): MenuItem[] {
    return this.menuItemsSubject.value;
  }

  getOrders(): Order[] {
    return this.ordersSubject.value;
  }

  clearCurrentRestaurant(): void {
    this.currentRestaurantSubject.next(null);
    this.menuItemsSubject.next([]);
  }

  getMenuItemsByCategory(category: string): MenuItem[] {
    return this.menuItemsSubject.value.filter(item => item.category === category);
  }

  getMenuCategories(): string[] {
    const items = this.menuItemsSubject.value;
    const categories = items.map(item => item.category || 'General').filter(cat => cat);
    return [...new Set(categories)];
  }
}