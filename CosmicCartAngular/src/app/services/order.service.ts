import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { CartService } from './cart.service';
import { Order } from './restaurant.service';
import { ToastrService } from 'ngx-toastr';

export interface PaymentDetails {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
  billingAddress: string;
}

export interface OrderRequest {
  userId: number;
  restaurantId: number;
  deliveryAddress: string;
  totalAmount: number;
  items: {
    menuItemId: number;
    itemName: string;
    quantity: number;
    price: number;
  }[];
  paymentDetails: PaymentDetails;
  paymentMethod: 'Card' | 'Cash' | 'Online'; // ✅ Added payment method
}


@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://localhost:9095/api';
  private customerOrdersSubject = new BehaviorSubject<Order[]>([]);
  private currentOrderSubject = new BehaviorSubject<Order | null>(null);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  public customerOrders$ = this.customerOrdersSubject.asObservable();
  public currentOrder$ = this.currentOrderSubject.asObservable();
  public loading$ = this.loadingSubject.asObservable();

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private cartService: CartService,
    private toastr: ToastrService
  ) {}

  private getHeaders(): HttpHeaders {
    const authHeaders = this.authService.getAuthHeaders();
    const idempotencyKey = this.generateIdempotencyKey();
    const userId = this.authService.getCurrentUserId();
    const userRoles = this.authService.getCurrentUserRoles();

    return new HttpHeaders({
      ...authHeaders,
      'Idempotency-Key': idempotencyKey,
      'X-Internal-User-Id': userId ? userId.toString() : '',
      'X-Internal-User-Roles': userRoles.join(',')
    });
  }

  private generateIdempotencyKey(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  // ✅ Updated: Place a new order with only deliveryAddress
  placeOrder(deliveryAddress: string): Observable<Order> {
    this.loadingSubject.next(true);
    return new Observable(observer => {
      const headers = this.getHeaders();

      this.http.post<Order>(
        `${this.apiUrl}/orders`,
        { deliveryAddress },
        { headers }
      ).subscribe({
        next: (order) => {
          this.currentOrderSubject.next(order);
          const currentOrders = this.customerOrdersSubject.value;
          this.customerOrdersSubject.next([order, ...currentOrders]);
          this.cartService.clearCart();
          this.toastr.success('Order placed successfully!');
          this.loadingSubject.next(false);
          observer.next(order);
        },
        error: (error) => {
          this.toastr.error(error.error?.message || 'Failed to place order');
          this.loadingSubject.next(false);
          observer.error(error);
        }
      });
    });
  }

  placeFullOrder(orderRequest: OrderRequest): Observable<Order>
 {
    this.loadingSubject.next(true);
    return new Observable(observer => {
      const headers = this.getHeaders();
      
      console.log('🚀 Placing full order:', orderRequest);
      console.log('📤 Payment method being sent:', orderRequest.paymentMethod);
      console.log('📤 Full request payload:', JSON.stringify(orderRequest, null, 2));
  
      this.http.post<Order>(
        `${this.apiUrl}/orders`,
        orderRequest,
        { headers }
      ).subscribe({
        next: (order) => {
          this.currentOrderSubject.next(order);
          const currentOrders = this.customerOrdersSubject.value;
          this.customerOrdersSubject.next([order, ...currentOrders]);
          this.cartService.clearCart();
          this.toastr.success('Order placed successfully!');
          this.loadingSubject.next(false);
          observer.next(order);
        },
        error: (error: any) => {
          this.toastr.error(error.error?.message || 'Failed to place order');
          this.loadingSubject.next(false);
          observer.error(error);
        }
      });
    });
  }
  

  // 🔽 All other methods remain unchanged 🔽

  fetchCustomerOrders(): Observable<Order[]> {
    this.loadingSubject.next(true);
    const customerId = this.authService.getCurrentUserId();
    
    if (!customerId) {
      this.loadingSubject.next(false);
      return new Observable(observer => observer.error('No customer ID available'));
    }

    return new Observable(observer => {
      // Get the token for authentication 
      const token = localStorage.getItem('jwt');
      if (!token) {
        console.error('❌ No JWT token found in localStorage');
        observer.error(new Error('No authentication token'));
        return;
      }

      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'X-Internal-User-Id': customerId.toString(),
        'X-Internal-User-Roles': 'CUSTOMER',
        'Content-Type': 'application/json'
      });
      
      console.log('🔑 Sending request with headers:', {
        'Authorization': `Bearer ${token.substring(0, 20)}...`,
        'X-Internal-User-Id': customerId.toString(),
        'X-Internal-User-Roles': 'CUSTOMER',
        'URL': `${this.apiUrl}/orders/user`
      });
      
      this.http.get<Order[]>(`${this.apiUrl}/orders/user`, {
        headers: headers
      }).subscribe({
        next: (orders) => {
          this.customerOrdersSubject.next(orders);
          this.loadingSubject.next(false);
          observer.next(orders);
        },
        error: (error) => {
          // Only log if it's not a 404 (expected when backend is not running)
          if (error.status !== 404) {
            console.error('Error fetching customer orders:', error);
          }
          this.loadingSubject.next(false);
          observer.error(error);
        }
      });
    });
  }

  fetchOrderById(orderId: number): Observable<Order> {
    return new Observable(observer => {
      this.http.get<Order>(`${this.apiUrl}/orders/${orderId}`, {
        headers: this.getHeaders()
      }).subscribe({
        next: (order) => {
          this.currentOrderSubject.next(order);
          observer.next(order);
        },
        error: (error) => {
          console.error('Error fetching order:', error);
          observer.error(error);
        }
      });
    });
  }

  cancelOrder(orderId: number): Observable<Order> {
    return new Observable(observer => {
      this.http.patch<Order>(`${this.apiUrl}/orders/${orderId}/cancel`, {}, {
        headers: this.getHeaders()
      }).subscribe({
        next: (cancelledOrder) => {
          const currentOrders = this.customerOrdersSubject.value;
          const updatedOrders = currentOrders.map(order => 
            order.orderId === orderId ? { ...order, ...cancelledOrder } : order
          );
          this.customerOrdersSubject.next(updatedOrders);
          
          if (this.currentOrderSubject.value?.orderId === orderId) {
            this.currentOrderSubject.next(cancelledOrder);
          }
          
          this.toastr.success('Order cancelled successfully');
          observer.next(cancelledOrder);
        },
        error: (error) => {
          this.toastr.error(error.error?.message || 'Failed to cancel order');
          observer.error(error);
        }
      });
    });
  }

  rateOrder(orderId: number, rating: number, review?: string): Observable<any> {
    return new Observable(observer => {
      this.http.post(`${this.apiUrl}/orders/${orderId}/rating`, { rating, review }, {
        headers: this.getHeaders()
      }).subscribe({
        next: (response) => {
          this.toastr.success('Thank you for your feedback!');
          observer.next(response);
        },
        error: (error) => {
          this.toastr.error(error.error?.message || 'Failed to submit rating');
          observer.error(error);
        }
      });
    });
  }

  trackOrder(orderId: number): Observable<any> {
    return new Observable(observer => {
      this.http.get(`${this.apiUrl}/orders/${orderId}/tracking`, {
        headers: this.getHeaders()
      }).subscribe({
        next: (trackingInfo) => {
          observer.next(trackingInfo);
        },
        error: (error) => {
          observer.error(error);
        }
      });
    });
  }

  processPayment(paymentDetails: PaymentDetails, amount: number): Observable<any> {
    return new Observable(observer => {
      const paymentData = {
        ...paymentDetails,
        amount
      };

      this.http.post(`${this.apiUrl}/payments/process`, paymentData, {
        headers: this.getHeaders()
      }).subscribe({
        next: (paymentResult) => {
          observer.next(paymentResult);
        },
        error: (error) => {
          observer.error(error);
        }
      });
    });
  }

  getOrderStatistics(): Observable<any> {
    const customerId = this.authService.getCurrentUserId();
    
    if (!customerId) {
      return new Observable(observer => observer.error('No customer ID available'));
    }

    return new Observable(observer => {
      this.http.get(`${this.apiUrl}/customers/${customerId}/order-stats`, {
        headers: this.getHeaders()
      }).subscribe({
        next: (stats) => {
          observer.next(stats);
        },
        error: (error) => {
          observer.error(error);
        }
      });
    });
  }

  getCustomerOrders(): Order[] {
    return this.customerOrdersSubject.value;
  }

  getCurrentOrder(): Order | null {
    return this.currentOrderSubject.value;
  }

  clearCurrentOrder(): void {
    this.currentOrderSubject.next(null);
  }

  getOrdersByStatus(status: string): Order[] {
    return this.customerOrdersSubject.value.filter(order => order.status === status);
  }

  getRecentOrders(): Order[] {
    return this.customerOrdersSubject.value.slice(0, 5);
  }

  getTotalSpent(): number {
    return this.customerOrdersSubject.value
      .filter(order => order.status !== 'cancelled')
      .reduce((total, order) => total + order.totalAmount, 0);
  }

  getFavoriteRestaurants(): { restaurantId: number; orderCount: number }[] {
    const restaurantCounts: { [key: number]: number } = {};
    
    this.customerOrdersSubject.value.forEach(order => {
      if (order.status !== 'cancelled') {
        restaurantCounts[order.restaurantId] = (restaurantCounts[order.restaurantId] || 0) + 1;
      }
    });

    return Object.entries(restaurantCounts)
      .map(([restaurantId, count]) => ({ restaurantId: Number(restaurantId), orderCount: count }))
      .sort((a, b) => b.orderCount - a.orderCount);
  }
}
