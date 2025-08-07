import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
import { Order } from '../../services/restaurant.service';
import { Subscription, interval } from 'rxjs';
import { switchMap, takeWhile } from 'rxjs/operators';

@Component({
  selector: 'app-order-tracking',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="space-background">
      <div class="single-card-optimized">
        <div class="card-container">
          
          <!-- Back Button -->
          <div class="d-flex gap-3 mb-3">
            <a routerLink="/main" class="cosmic-link d-inline-flex align-items-center text-decoration-none">
            <svg class="me-2" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="m12 19-7-7 7-7"/>
              <path d="M19 12H5"/>
            </svg>
            <span class="space-text-muted">Back to Cosmic Kitchen</span>
          </a>
            <button class="cosmic-close-btn d-inline-flex align-items-center" (click)="goBackToProfile()">
              <svg class="me-2" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
              <span class="space-text-muted">Close Tracker</span>
            </button>
          </div>

          <!-- Tracking Card -->
          <div class="glass-card p-5 cosmic-tracking-card">
            
            <!-- Header -->
            <div class="text-center mb-3">
              <div class="cosmic-tracking-icon mx-auto mb-3">
                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="space-text">
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M12 1v6M12 17v6M4.22 4.22l4.24 4.24M15.54 15.54l4.24 4.24M1 12h6M17 12h6M4.22 19.78l4.24-4.24M15.54 8.46l4.24-4.24"/>
                </svg>
              </div>
              <h1 class="h2 fw-bold space-text space-font-primary mb-2">🛸 Order Tracking</h1>
              <p class="space-text-muted space-font-secondary fw-bold" *ngIf="!loading && !error">
                Order #{{ orderId }} - Track your cosmic feast journey
              </p>
              <p class="space-text-muted space-font-secondary fw-bold" *ngIf="loading">
                🔍 Scanning cosmic order database...
              </p>
              <p class="text-danger fw-bold" *ngIf="error">
                ❌ {{ error }}
              </p>
            </div>

            <!-- Order Status Timeline -->
            <div class="cosmic-timeline mb-4">
              
              <!-- Status: Order Confirmed -->
              <div class="timeline-item" [class.active]="currentStatus >= 1" [class.completed]="currentStatus > 1">
                <div class="timeline-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 6L9 17l-5-5"/>
                  </svg>
                </div>
                <div class="timeline-content">
                  <h4 class="timeline-title">✅ Order Confirmed</h4>
                  <p class="timeline-desc">Your cosmic order has been received and confirmed</p>
                  <span class="timeline-time">{{ getStatusTime(1) }}</span>
                </div>
              </div>

              <!-- Status: Preparing -->
              <div class="timeline-item" [class.active]="currentStatus >= 2" [class.completed]="currentStatus > 2">
                <div class="timeline-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M8 2v4"/>
                    <path d="M16 2v4"/>
                    <rect width="18" height="18" x="3" y="4" rx="2"/>
                    <path d="M3 10h18"/>
                  </svg>
                </div>
                <div class="timeline-content">
                  <h4 class="timeline-title">👨‍🍳 Preparing Your Feast</h4>
                  <p class="timeline-desc">Our cosmic chefs are preparing your delicious meal</p>
                  <span class="timeline-time">{{ getStatusTime(2) }}</span>
                </div>
              </div>

              <!-- Status: Out for Delivery -->
              <div class="timeline-item" [class.active]="currentStatus >= 3" [class.completed]="currentStatus > 3">
                <div class="timeline-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/>
                    <path d="M15 18H9"/>
                    <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624L20 10.5a2.5 2.5 0 0 0-2.17-1.5H15"/>
                    <circle cx="17" cy="18" r="2"/>
                    <circle cx="7" cy="18" r="2"/>
                  </svg>
                </div>
                <div class="timeline-content">
                  <h4 class="timeline-title">🚀 Out for Delivery</h4>
                  <p class="timeline-desc">Your order is on its way to your cosmic coordinates</p>
                  <span class="timeline-time">{{ getStatusTime(3) }}</span>
                </div>
              </div>

              <!-- Status: Delivered -->
              <div class="timeline-item" [class.active]="currentStatus >= 4" [class.completed]="currentStatus >= 4">
                <div class="timeline-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M8 21l4-7 4 7"/>
                    <path d="M12 2v7"/>
                    <path d="M3 12h6m6 0h6"/>
                  </svg>
                </div>
                <div class="timeline-content">
                  <h4 class="timeline-title">🎉 Delivered</h4>
                  <p class="timeline-desc">Your cosmic feast has been successfully delivered!</p>
                  <span class="timeline-time">{{ getStatusTime(4) }}</span>
                </div>
              </div>
            </div>

            <!-- Current Status Card -->
            <div class="cosmic-status-card mb-4">
              <div class="status-header">
                <h3 class="h5 fw-bold space-text space-font-primary mb-2">
                  🌟 Current Status: {{ getCurrentStatusText() }}
                </h3>
                <p class="space-text-muted fw-bold">{{ getCurrentStatusDescription() }}</p>
              </div>
              
              <div class="estimated-time" *ngIf="currentStatus < 4">
                <div class="d-flex align-items-center justify-content-center">
                  <div class="time-icon me-3">⏰</div>
                  <div class="text-center">
                    <div class="h4 fw-bold space-text cosmic-text-gradient">{{ getEstimatedTime() }}</div>
                    <div class="small space-text-muted fw-bold">Estimated {{ getNextActionText() }}</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="text-center">
              <button class="btn-cosmic-primary w-100 mb-3 fw-bold" 
                      (click)="refreshStatus()" 
                      [disabled]="refreshing">
                <div *ngIf="!refreshing; else loadingIcon">
                  <svg class="me-2" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
                    <path d="M21 3v5h-5"/>
                    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
                    <path d="M3 21v-5h5"/>
                  </svg>
                  🔄 Refresh Status
                </div>
                <ng-template #loadingIcon>
                  <div class="cosmic-loading-spinner me-2"></div>
                  ⚡ Refreshing...
                </ng-template>
              </button>

              <button class="btn-cosmic-outline w-100 fw-bold" (click)="orderMore()">
                <svg class="me-2" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17"/>
                  <circle cx="17" cy="20" r="1"/>
                  <circle cx="9" cy="20" r="1"/>
                </svg>
                🌌 Order More Cosmic Delights
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .cosmic-tracking-card {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 20px;
    }

    .cosmic-tracking-icon {
      width: 80px;
      height: 80px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.1);
      border: 2px solid rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      animation: tracking-pulse 2s ease-in-out infinite;
    }

    @keyframes tracking-pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }

    /* Timeline Styles */
    .cosmic-timeline {
      position: relative;
      padding-left: 1rem;
    }

    .cosmic-timeline::before {
      content: '';
      position: absolute;
      left: 1.5rem;
      top: 0;
      bottom: 0;
      width: 2px;
      background: linear-gradient(180deg, rgba(102, 126, 234, 0.3) 0%, rgba(67, 233, 123, 0.3) 100%);
    }

    .timeline-item {
      position: relative;
      padding-left: 3rem;
      padding-bottom: 2rem;
    }

    .timeline-item:last-child {
      padding-bottom: 0;
    }

    .timeline-icon {
      position: absolute;
      left: -1.5rem;
      top: 0;
      width: 3rem;
      height: 3rem;
      background: rgba(255, 255, 255, 0.1);
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: rgba(255, 255, 255, 0.6);
      transition: all 0.3s ease;
    }

    .timeline-item.active .timeline-icon {
      background: rgba(102, 126, 234, 0.2);
      border-color: rgba(102, 126, 234, 0.6);
      color: rgba(255, 255, 255, 0.9);
      animation: timeline-glow 2s ease-in-out infinite;
    }

    .timeline-item.completed .timeline-icon {
      background: rgba(34, 197, 94, 0.2);
      border-color: rgba(34, 197, 94, 0.6);
      color: rgba(255, 255, 255, 1);
    }

    @keyframes timeline-glow {
      0%, 100% { box-shadow: 0 0 10px rgba(102, 126, 234, 0.3); }
      50% { box-shadow: 0 0 20px rgba(102, 126, 234, 0.6); }
    }

    .timeline-title {
      font-size: 1rem;
      font-weight: 700;
      color: rgba(255, 255, 255, 0.9);
      font-family: 'Exo 2', sans-serif;
      margin-bottom: 0.5rem;
    }

    .timeline-desc {
      font-size: 0.85rem;
      color: rgba(255, 255, 255, 0.7);
      font-family: 'Exo 2', sans-serif;
      margin-bottom: 0.5rem;
    }

    .timeline-time {
      font-size: 0.75rem;
      color: rgba(255, 255, 255, 0.5);
      font-family: 'Orbitron', monospace;
      font-weight: 600;
    }

    /* Status Card */
    .cosmic-status-card {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 16px;
      padding: 1.5rem;
      text-align: center;
    }

    .time-icon {
      font-size: 2rem;
      filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
    }

    .cosmic-link {
      color: rgba(255, 255, 255, 0.7);
      transition: all 0.3s ease;
    }

    .cosmic-link:hover {
      color: rgba(255, 255, 255, 1);
      transform: translateX(-3px);
    }

    .cosmic-close-btn {
      background: rgba(239, 68, 68, 0.1);
      border: 2px solid rgba(239, 68, 68, 0.3);
      border-radius: 12px;
      color: rgba(255, 255, 255, 0.7);
      padding: 0.5rem 1rem;
      font-weight: 600;
      font-family: 'Exo 2', sans-serif;
      transition: all 0.3s ease;
      cursor: pointer;
    }

    .cosmic-close-btn:hover {
      background: rgba(239, 68, 68, 0.2);
      border-color: rgba(239, 68, 68, 0.5);
      color: rgba(255, 255, 255, 1);
      transform: translateX(-3px);
    }

    /* Loading Spinner */
    .cosmic-loading-spinner {
      display: inline-block;
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top: 2px solid rgba(255, 255, 255, 0.9);
      border-radius: 50%;
      animation: cosmic-loading-spin 1s linear infinite;
    }

    @keyframes cosmic-loading-spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    /* Responsive */
    @media (max-width: 768px) {
      .cosmic-tracking-icon {
        width: 60px;
        height: 60px;
      }
      
      .timeline-item {
        padding-left: 2.5rem;
      }
      
      .timeline-icon {
        width: 2.5rem;
        height: 2.5rem;
        left: -1.25rem;
      }
    }
  `]
})
export class OrderTrackingComponent implements OnInit, OnDestroy {
  orderId: string = '';
  order: Order | null = null;
  currentStatus: number = 0; // 0=Not found, 1=Pending/Accepted, 2=In Cooking, 3=Out for Delivery, 4=Completed
  refreshing: boolean = false;
  loading: boolean = true;
  error: string = '';
  
  private refreshSubscription?: Subscription;
  private routeSubscription?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Get order ID from route parameters or query params
    this.routeSubscription = this.route.params.subscribe(params => {
      this.orderId = params['id'];
      if (!this.orderId) {
        // Fallback to query params
        this.route.queryParams.subscribe(queryParams => {
          this.orderId = queryParams['orderId'] || queryParams['id'];
          if (this.orderId) {
            this.loadOrderDetails();
            this.startAutoRefresh();
          } else {
            this.error = 'No order ID provided';
            this.loading = false;
          }
        });
      } else {
        this.loadOrderDetails();
        this.startAutoRefresh();
      }
    });
  }

  ngOnDestroy() {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  private loadOrderDetails() {
    if (!this.orderId) return;
    
    this.loading = true;
    this.error = '';
    
    console.log('🔍 Loading order details for ID:', this.orderId);
    
    this.orderService.fetchOrderById(Number(this.orderId)).subscribe({
      next: (order: Order) => {
        this.order = order;
        this.currentStatus = this.mapStatusToNumber(order.status);
        this.loading = false;
        this.error = '';
        console.log('✅ Order loaded:', order);
      },
      error: (error: any) => {
        console.error('❌ Failed to load order:', error);
        this.error = 'Order not found or access denied';
        this.loading = false;
        this.currentStatus = 0;
      }
    });
  }

  private startAutoRefresh() {
    // Auto-refresh every 30 seconds for non-completed orders
    this.refreshSubscription = interval(30000)
      .pipe(
        takeWhile(() => this.currentStatus < 4 && this.currentStatus > 0),
        switchMap(() => this.orderService.fetchOrderById(Number(this.orderId)))
      )
      .subscribe({
        next: (order) => {
          const newStatus = this.mapStatusToNumber(order.status);
          if (newStatus !== this.currentStatus) {
            console.log('🔄 Order status updated:', order.status);
            this.order = order;
            this.currentStatus = newStatus;
          }
        },
        error: (error) => {
          console.warn('⚠️ Auto-refresh failed:', error);
      }
      });
  }

  private mapStatusToNumber(status: string): number {
    switch (status.toUpperCase()) {
      case 'PENDING':
      case 'ACCEPTED':
        return 1; // Order Confirmed
      case 'IN_COOKING':
        return 2; // Preparing
      case 'OUT_FOR_DELIVERY':
        return 3; // Out for Delivery
      case 'COMPLETED':
      case 'DELIVERED':
        return 4; // Delivered
      case 'CANCELLED':
      case 'DECLINED':
        return 0; // Cancelled/Failed
      default:
        return 0;
    }
  }

  getStatusTime(status: number): string {
    if (!this.order || status > this.currentStatus) return '';
    
    // Use real order time if available, otherwise use placeholder
    if (status === 1 && this.order.orderTime) {
      const orderTime = new Date(this.order.orderTime);
      const timeDiff = Math.floor((Date.now() - orderTime.getTime()) / (1000 * 60)); // minutes ago
      
      if (timeDiff < 1) return 'Just now';
      if (timeDiff < 60) return `${timeDiff} min ago`;
      
      const hours = Math.floor(timeDiff / 60);
      if (hours === 1) return '1 hour ago';
      return `${hours} hours ago`;
    }
    
    // Estimate times for other statuses
    const estimatedTimes = [
      '', // 0 - not used
      'Just now', // 1 - Confirmed
      '5 mins ago', // 2 - Preparing
      '15 mins ago', // 3 - Out for delivery
      '25 mins ago' // 4 - Delivered
    ];
    
    return estimatedTimes[status] || '';
  }

  getCurrentStatusText(): string {
    if (this.order?.status) {
      // Use actual backend status for display
      switch (this.order.status.toUpperCase()) {
        case 'PENDING': return 'Order Pending';
        case 'ACCEPTED': return 'Order Confirmed';
        case 'IN_COOKING': return 'Preparing Your Feast';
        case 'OUT_FOR_DELIVERY': return 'Out for Delivery';
        case 'COMPLETED': return 'Delivered';
        case 'CANCELLED': return 'Order Cancelled';
        case 'DECLINED': return 'Order Declined';
        default: return this.order.status;
      }
    }
    
    const statuses = ['Order Not Found', 'Order Confirmed', 'Preparing', 'Out for Delivery', 'Delivered'];
    return statuses[this.currentStatus];
  }

  getCurrentStatusDescription(): string {
    const descriptions = [
      '',
      'Your order has been confirmed and is being processed',
      'Our cosmic chefs are preparing your delicious meal',
      'Your order is on its way to your location',
      'Your cosmic feast has been successfully delivered!'
    ];
    return descriptions[this.currentStatus];
  }

  getEstimatedTime(): string {
    const times = ['', '25-30 min', '15-20 min', '5-10 min', 'Delivered'];
    return times[this.currentStatus];
  }

  getNextActionText(): string {
    const actions = ['', 'preparation time', 'delivery time', 'arrival', ''];
    return actions[this.currentStatus];
  }

  refreshStatus(): void {
    this.refreshing = true;
    this.loadOrderDetails();
    
    // Reset refreshing state
    setTimeout(() => {
      this.refreshing = false;
    }, 1000);
  }

  orderMore(): void {
    this.router.navigate(['/main']);
  }

  goBackToProfile(): void {
    // Navigate back to user profile and ensure order history is shown
    // Set flag to restore the order history state
    sessionStorage.setItem('returnToProfile', 'true');
    sessionStorage.setItem('orderHistoryVisible', 'true');
    
    this.router.navigate(['/profile']);
  }
} 