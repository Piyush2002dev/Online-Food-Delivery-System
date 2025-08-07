import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { CartService } from '../services/cart.service';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="cosmic-navigation-header sticky-top">
      <div class="container d-flex justify-content-between align-items-center">
        <!-- Logo and Brand -->
          <div class="d-flex align-items-center">
          <div class="cosmic-brand-icon me-3">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z"/>
              <line x1="6" x2="18" y1="17" y2="17"/>
            </svg>
          </div>
          <div>
            <a routerLink="/main" class="text-decoration-none">
              <h1 class="h3 fw-bold space-text space-font-primary mb-0">🍽️ CosmicCart</h1>
            </a>
            <p class="space-text-muted mb-0 small fw-bold">{{ subtitle }}</p>
          </div>
        </div>

        <!-- Navigation and Cart -->
        <div class="d-flex align-items-center gap-3">
          <!-- Back Button (conditional) -->
          <a *ngIf="showBackButton" [routerLink]="backRoute" 
             class="btn btn-outline-orange rounded-circle p-2 me-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>
            </svg>
          </a>

          <!-- Cart Icon with Count -->
          <a routerLink="/cart" class="btn btn-outline-orange position-relative cart-button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="9" cy="21" r="1"/>
              <circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            <!-- Cart Count Badge -->
            <div *ngIf="cartItemCount > 0" 
                 class="cart-badge position-absolute">
              <span class="badge bg-orange-500 text-white fw-bold rounded-pill px-2 py-1"
                    [class.cart-pulse]="cartItemCount > 0">
                {{ cartItemCount > 99 ? '99+' : cartItemCount }}
              </span>
            </div>
          </a>

          <!-- Profile/Login Button -->
          <a *ngIf="isLoggedIn; else loginButton" routerLink="/profile" class="btn btn-orange">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </a>
          
          <ng-template #loginButton>
            <a routerLink="/customer/login" class="btn btn-orange">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M15 3h6v6"/>
                <path d="M10 14L21 3"/>
                <path d="M13 21H3a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h8"/>
              </svg>
            </a>
          </ng-template>
        </div>
      </div>

      <!-- Cart Summary Preview (shows on hover/focus) -->
      <div *ngIf="cartItemCount > 0" 
           class="cart-preview position-absolute end-0 mt-2 me-3 bg-white rounded-3xl shadow-xl border p-4"
           style="width: 320px; top: 100%; z-index: 1000; opacity: 0; visibility: hidden; transition: all 0.3s ease;">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h6 class="fw-bold mb-0">Cart Summary</h6>
          <span class="badge bg-orange-100 text-orange-800">{{ cartItemCount }} items</span>
        </div>
        
        <div class="cart-preview-items" style="max-height: 200px; overflow-y: auto;">
          <div *ngFor="let item of cartItems | slice:0:3" 
               class="d-flex justify-content-between align-items-center py-2 border-bottom">
            <div class="flex-grow-1">
              <h6 class="mb-0 small">{{ item.name }}</h6>
              <small class="text-gray-600">{{ item.quantity }}x ₹{{ item.price }}</small>
            </div>
            <div class="fw-semibold text-orange-600">
              ₹{{ item.quantity * item.price }}
            </div>
          </div>
          
          <div *ngIf="cartItems.length > 3" class="text-center py-2">
            <small class="text-gray-500">and {{ cartItems.length - 3 }} more items...</small>
          </div>
        </div>
        
        <div class="border-top pt-3 mt-3">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <span class="fw-bold">Total:</span>
            <span class="fw-bold text-orange-600 h5 mb-0">₹{{ cartTotal }}</span>
          </div>
          <a routerLink="/cart" class="btn btn-orange w-100 fw-semibold">
            View Cart & Checkout
          </a>
        </div>
      </div>
    </header>
  `,
  styles: [`
    /* Cosmic Navigation Header */
    .cosmic-navigation-header {
      background: rgba(255, 255, 255, 0.08);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.2);
      padding: 0.75rem 0;
      z-index: 1000;
      box-shadow: 0 2px 20px rgba(0, 0, 0, 0.3);
      position: fixed !important;
      top: 0;
      left: 0;
      right: 0;
      width: 100%;
    }

    .cosmic-brand-icon {
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, rgba(249, 115, 22, 0.8), rgba(239, 68, 68, 0.8));
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      color: rgba(255, 255, 255, 0.9);
      animation: brand-glow 3s ease-in-out infinite;
    }

    @keyframes brand-glow {
      0%, 100% { 
        box-shadow: 0 0 15px rgba(249, 115, 22, 0.4);
        transform: scale(1);
      }
      50% { 
        box-shadow: 0 0 25px rgba(239, 68, 68, 0.6);
        transform: scale(1.02);
      }
    }

    .cart-button {
      transition: all 0.3s ease;
    }

    .cart-button:hover {
      transform: scale(1.05);
    }

    .cart-badge {
      z-index: 10;
      top: -8px;
      right: -8px;
    }
    
    .cart-badge .badge {
      min-width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.75rem;
      line-height: 1;
    }

    .cart-pulse {
      animation: cartPulse 2s infinite;
    }

    @keyframes cartPulse {
      0% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.1);
      }
      100% {
        transform: scale(1);
      }
    }

    .cart-button:hover + .cart-preview,
    .cart-preview:hover {
      opacity: 1 !important;
      visibility: visible !important;
    }

    .bg-gradient-to-r {
      background: linear-gradient(to right, var(--bs-orange), var(--bs-red));
    }

    /* Mobile responsiveness */
    @media (max-width: 768px) {
      .cart-preview {
        width: 280px !important;
        right: 0.5rem !important;
      }
    }

    .z-50 {
      z-index: 50;
    }
  `]
})
export class HeaderComponent implements OnInit, OnDestroy {
  cartItemCount = 0;
  cartItems: any[] = [];
  cartTotal = 0;
  isLoggedIn = false;
  subtitle = 'Delicious food delivered fast';
  showBackButton = false;
  backRoute = '/main';

  private subscriptions: Subscription[] = [];

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Subscribe to cart changes
    const cartSub = this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
      this.cartItemCount = this.cartService.getCartItemCount();
      this.cartTotal = this.cartService.getCartTotal();
    });
    this.subscriptions.push(cartSub);

    // Check login status
    const authSub = this.authService.userId$.subscribe(userId => {
      this.isLoggedIn = !!userId;
    });
    this.subscriptions.push(authSub);

    // Update subtitle based on current route
    this.updateSubtitleBasedOnRoute();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private updateSubtitleBasedOnRoute(): void {
    const currentUrl = this.router.url;
    
    if (currentUrl.includes('/restaurant/')) {
      this.subtitle = 'Choose your favorite dishes';
      this.showBackButton = true;
      this.backRoute = '/main';
    } else if (currentUrl.includes('/cart')) {
      this.subtitle = 'Review your order';
      this.showBackButton = true;
      this.backRoute = '/main';
    } else if (currentUrl.includes('/payment')) {
      this.subtitle = 'Complete your payment';
      this.showBackButton = true;
      this.backRoute = '/cart';
    } else if (currentUrl.includes('/main')) {
      this.subtitle = 'Discover amazing restaurants';
      this.showBackButton = false;
    } else {
      this.subtitle = 'Delicious food delivered fast';
      this.showBackButton = false;
    }
  }
} 