import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { CartService, CartItem } from '../../services/cart.service';
import { HeaderComponent } from '../../components/header.component';
import { CosmicNotificationService } from '../../services/cosmic-notification.service';
import { CosmicNotificationComponent } from '../../components/cosmic-notification.component';

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, CosmicNotificationComponent],
  template: `
    <div class="space-background">
      <!-- Header Component -->
      <app-header></app-header>
      
      <!-- Cosmic Notifications (Left Position for Cart Page) -->
      <app-cosmic-notification 
        *ngFor="let notification of cosmicNotificationService.notifications$ | async" 
        [notification]="notification"
        position="left">
      </app-cosmic-notification>
      
      <!-- Cart Content -->
      <section class="container py-5" style="padding-top: 6rem !important;">
        
        <!-- Cart Header -->
        <div class="text-center mb-4">
          <h1 class="display-5 fw-bold space-text space-font-primary mb-2">
            Your <span class="cosmic-text-gradient">Cosmic Cart</span>
          </h1>
          <p class="lead space-text-muted space-font-secondary fw-bold">
            🛸 Review your intergalactic feast before launch
          </p>
        </div>

        <!-- Empty Cart State - Full Width -->
        <div *ngIf="cartItems.length === 0" class="cosmic-empty-cart text-center py-5 mb-5">
          <div class="row justify-content-center">
            <div class="col-lg-8 col-xl-6">
              <div class="cosmic-empty-icon mb-4">
                <div class="empty-cart-animation">
                  <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" class="empty-cart-svg">
                    <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17"/>
                    <circle cx="17" cy="20" r="1"/>
                    <circle cx="9" cy="20" r="1"/>
                  </svg>
                  <div class="cosmic-sparkles">
                    <span class="sparkle sparkle-1">✨</span>
                    <span class="sparkle sparkle-2">⭐</span>
                    <span class="sparkle sparkle-3">💫</span>
                  </div>
                </div>
              </div>
              <h3 class="h2 fw-bold space-text space-font-primary mb-3">
                Your Cosmic Cart is Empty
              </h3>
              <p class="space-text-muted space-font-secondary fw-bold mb-4">
                🚀 Start your culinary space journey by adding some delicious items!
              </p>
              <button class="btn-cosmic-primary fw-bold" (click)="continueShopping()">
                <svg class="me-2" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z"/>
                  <line x1="6" x2="18" y1="17" y2="17"/>
                </svg>
                🌌 Explore Cosmic Restaurants
              </button>
            </div>
          </div>
        </div>

        <!-- Cart Items Section -->
        <div *ngIf="cartItems.length > 0" class="row g-5">
          <!-- Cart Items Column -->
          <div class="col-lg-8">
            <div class="cosmic-cart-items">
              <div class="d-flex align-items-center justify-content-between mb-4">
                <h3 class="h4 fw-bold space-text space-font-primary mb-0">
                  Cart Items ({{ cartItems.length }})
                </h3>
                <button class="btn-cosmic-outline fw-bold" (click)="clearCart()">
                  <svg class="me-2" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M3 6h18"/>
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                  </svg>
                  Clear All
                </button>
              </div>

              <div class="cart-items-list">
                <div class="cosmic-cart-item glass-card mb-3" *ngFor="let item of cartItems; let i = index">
                  <div class="d-flex align-items-center p-4">
                    
                    <!-- Cosmic Item Design -->
                    <div class="cosmic-item-image me-4" [style.background]="getCartItemGradient(i)">
                      <!-- Cosmic Food Emoji -->
                      <div class="cosmic-cart-emoji">
                        {{ getCartItemEmoji(i) }}
                      </div>
                      <!-- Item Number Badge -->
                      <div class="cosmic-item-number">
                        {{ i + 1 }}
                      </div>
                    </div>

                    <!-- Item Details -->
                    <div class="flex-grow-1">
                      <h5 class="fw-bold space-text space-font-primary mb-2">
                        {{ item.name }}
                      </h5>
                      <p class="space-text-dim space-font-secondary small fw-bold mb-2">
                        {{ getItemDescription(i) }}
                      </p>
                      <div class="cosmic-price-display">
                        ₹{{ item.price }} × {{ item.quantity }}
                      </div>
                    </div>

                    <!-- Quantity Controls -->
                    <div class="cosmic-quantity-controls me-4">
                      <button class="cosmic-qty-btn" (click)="decreaseQuantity(item)">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M5 12h14"/>
                        </svg>
                      </button>
                      <span class="cosmic-qty-display">{{ item.quantity }}</span>
                      <button class="cosmic-qty-btn" (click)="increaseQuantity(item)">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M12 5v14"/>
                          <path d="M5 12h14"/>
                        </svg>
                      </button>
                    </div>

                    <!-- Item Total & Remove -->
                    <div class="text-end">
                      <div class="cosmic-item-total fw-bold space-text mb-2">
                        ₹{{ item.price * item.quantity }}
                      </div>
                      <button class="cosmic-remove-btn" (click)="removeItem(item)">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M3 6h18"/>
                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Order Summary Column -->
          <div class="col-lg-4" *ngIf="cartItems.length > 0">
            <div class="cosmic-order-summary glass-card p-4 position-sticky" style="top: 6rem;">
              
              <!-- Summary Header -->
              <div class="text-center mb-4">
                <h4 class="fw-bold space-text space-font-primary mb-2 d-flex align-items-center justify-content-center">
                  <svg class="me-2" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 11H5a2 2 0 0 0-2 2v3c0 3.6 2.4 6 6 6h4c3.6 0 6-2.4 6-6v-3a2 2 0 0 0-2-2h-4"/>
                    <path d="M9 7h6l-3-4z"/>
                  </svg>
                  Order Summary
                </h4>
                <div class="cosmic-delivery-info">
                  <span class="cosmic-delivery-badge">
                    <span class="pulse-dot"></span>
                    Preparing for Launch
                  </span>
                </div>
              </div>

              <!-- Price Breakdown -->
              <div class="cosmic-price-breakdown mb-4">
                <div class="price-row d-flex justify-content-between mb-3">
                  <span class="space-text-muted fw-bold">Subtotal ({{ getTotalItems() }} items)</span>
                  <span class="space-text fw-bold">₹{{ getSubtotal() }}</span>
                </div>
                <div class="price-row d-flex justify-content-between mb-3">
                  <span class="space-text-muted fw-bold">Delivery Fee</span>
                  <span class="space-text fw-bold">₹{{ getDeliveryFee() }}</span>
                </div>
                <div class="price-row d-flex justify-content-between mb-3">
                  <span class="space-text-muted fw-bold">Taxes & Fees</span>
                  <span class="space-text fw-bold">₹{{ getTaxes() }}</span>
                </div>
                <hr class="my-3" style="border-color: rgba(255,255,255,0.2);">
                <div class="price-row d-flex justify-content-between mb-4">
                  <span class="h5 fw-bold space-text space-font-primary">Total Amount</span>
                  <span class="h4 fw-bold space-text">₹{{ getTotal() }}</span>
                </div>
              </div>
              
              <!-- Estimated Delivery Time -->
              <div class="cosmic-delivery-estimate mb-4">
                <div class="d-flex align-items-center justify-content-center">
                  <div class="cosmic-delivery-icon me-3">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/>
                      <path d="M15 18H9"/>
                      <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624L20 10.5a2.5 2.5 0 0 0-2.17-1.5H15"/>
                      <circle cx="17" cy="18" r="2"/>
                      <circle cx="7" cy="18" r="2"/>
                    </svg>
                  </div>
                  <div class="text-center">
                    <div class="fw-bold space-text">25-30 min</div>
                    <div class="small space-text-dim">Estimated Delivery</div>
                  </div>
                </div>
              </div>

              <!-- Checkout Button -->
              <button class="btn-cosmic-primary w-100 fw-bold cosmic-checkout-btn" (click)="proceedToCheckout()">
                <svg class="me-2" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M9 12l2 2 4-4"/>
                  <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3"/>
                  <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3"/>
                  <path d="M3 7h6l4-4h8"/>
                </svg>
                🚀 Launch to Checkout
              </button>

              <!-- Continue Shopping -->
              <button class="btn-cosmic-outline w-100 fw-bold mt-3" (click)="continueShopping()">
                <svg class="me-2" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17"/>
                  <circle cx="17" cy="20" r="1"/>
                  <circle cx="9" cy="20" r="1"/>
                </svg>
                🌌 Add More Items
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    /* Empty Cart Animation */
    .cosmic-empty-cart {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 100%;
    }

    .empty-cart-animation {
      position: relative;
      display: inline-block;
    }

    .empty-cart-svg {
      color: rgba(255, 255, 255, 0.6);
      animation: cart-float 3s ease-in-out infinite;
    }

    @keyframes cart-float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }

    .cosmic-sparkles {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
    }

    .sparkle {
      position: absolute;
      font-size: 1.5rem;
      animation: sparkle-twinkle 2s ease-in-out infinite;
    }

    .sparkle-1 {
      top: 20%;
      left: 20%;
      animation-delay: 0s;
    }

    .sparkle-2 {
      top: 30%;
      right: 15%;
      animation-delay: 0.7s;
    }

    .sparkle-3 {
      bottom: 25%;
      left: 50%;
      animation-delay: 1.4s;
    }

    @keyframes sparkle-twinkle {
      0%, 100% { opacity: 0.3; transform: scale(1); }
      50% { opacity: 1; transform: scale(1.3); }
    }

    /* Cart Items */
    .cosmic-cart-item {
      transition: all 0.3s ease;
      border-radius: 16px;
      position: relative;
      overflow: hidden;
    }

    .cosmic-cart-item:hover {
      transform: translateX(5px);
      box-shadow: 0 10px 30px rgba(255, 255, 255, 0.1);
    }

    .cosmic-item-image {
      width: 80px;
      height: 80px;
      border-radius: 12px;
      overflow: hidden;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .cosmic-cart-emoji {
      font-size: 2rem;
      filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
      z-index: 3;
    }

    .cosmic-item-number {
      position: absolute;
      top: 4px;
      right: 4px;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: rgba(102, 126, 234, 0.9);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.75rem;
      font-weight: 700;
      color: white;
      font-family: 'Orbitron', monospace;
      z-index: 5;
      border: 2px solid rgba(255, 255, 255, 0.3);
    }

    .cosmic-price-display {
      color: rgba(255, 255, 255, 0.8);
      font-weight: 600;
      font-family: 'Exo 2', sans-serif;
      font-size: 0.9rem;
    }

    /* Quantity Controls */
    .cosmic-quantity-controls {
      display: flex;
      align-items: center;
      gap: 1rem;
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 25px;
      padding: 0.5rem 1rem;
      backdrop-filter: blur(10px);
    }

    .cosmic-qty-btn {
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: rgba(255, 255, 255, 0.8);
      transition: all 0.3s ease;
      cursor: pointer;
    }

    .cosmic-qty-btn:hover {
      background: rgba(255, 255, 255, 0.2);
      color: rgba(255, 255, 255, 1);
      transform: scale(1.1);
    }

    .cosmic-qty-display {
      font-weight: 700;
      font-family: 'Orbitron', monospace;
      color: rgba(255, 255, 255, 0.9);
      min-width: 2rem;
      text-align: center;
    }

    .cosmic-item-total {
      font-family: 'Orbitron', monospace;
      font-size: 1.1rem;
    }

    .cosmic-remove-btn {
      background: rgba(239, 68, 68, 0.2);
      border: 1px solid rgba(239, 68, 68, 0.4);
      border-radius: 8px;
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: rgba(255, 255, 255, 0.8);
      transition: all 0.3s ease;
      cursor: pointer;
    }

    .cosmic-remove-btn:hover {
      background: rgba(239, 68, 68, 0.3);
      color: rgba(255, 255, 255, 1);
      transform: scale(1.05);
    }

    /* Order Summary */
    .cosmic-order-summary {
      border-radius: 20px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .cosmic-delivery-info {
      margin-top: 0.5rem;
    }

    .cosmic-delivery-badge {
      background: rgba(34, 197, 94, 0.2);
      border: 1px solid rgba(34, 197, 94, 0.4);
      border-radius: 20px;
      padding: 0.4rem 1rem;
      font-size: 0.9rem;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.9);
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
    }

    .pulse-dot {
      width: 8px;
      height: 8px;
      background: #22c55e;
      border-radius: 50%;
      animation: pulse-glow 1.5s ease-in-out infinite;
    }

    @keyframes pulse-glow {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.5; transform: scale(1.2); }
    }

    .cosmic-price-breakdown {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      padding: 1.5rem;
    }

    .price-row {
      font-size: 0.95rem;
    }

    .cosmic-delivery-estimate {
      background: rgba(102, 126, 234, 0.1);
      border: 1px solid rgba(102, 126, 234, 0.3);
      border-radius: 12px;
      padding: 1rem;
    }

    .cosmic-delivery-icon {
      background: rgba(102, 126, 234, 0.2);
      border: 1px solid rgba(102, 126, 234, 0.4);
      border-radius: 50%;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: rgba(255, 255, 255, 0.9);
    }

    .cosmic-checkout-btn {
      animation: checkout-glow 3s ease-in-out infinite;
    }

    @keyframes checkout-glow {
      0%, 100% { box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3); }
      50% { box-shadow: 0 8px 25px rgba(102, 126, 234, 0.5); }
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .cosmic-item-image {
        width: 60px;
        height: 60px;
      }
      
      .cosmic-quantity-controls {
        gap: 0.5rem;
        padding: 0.3rem 0.7rem;
      }
      
      .cosmic-qty-btn {
        width: 28px;
        height: 28px;
      }
      
      .cosmic-qty-display {
        min-width: 1.5rem;
        font-size: 0.9rem;
      }
    }
  `]
})
export class CartPageComponent implements OnInit {
  cartItems: CartItem[] = [];

  private cartItemDesigns = [
    { gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', emoji: '🍕' },
    { gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', emoji: '🍔' },
    { gradient: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)', emoji: '🥗' },
    { gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', emoji: '🍜' },
    { gradient: 'linear-gradient(135deg, #ffeaa7 0%, #fdcb6e 100%)', emoji: '🍝' },
    { gradient: 'linear-gradient(135deg, #fd79a8 0%, #e84393 100%)', emoji: '🧁' }
  ];

  private itemDescriptions = [
    "Fresh from our cosmic kitchen",
    "Made with stellar ingredients",
    "A galactic favorite",
    "Prepared with cosmic love",
    "Inter-dimensional flavors",
    "Straight from the space garden"
  ];

  constructor(
    private cartService: CartService,
    private router: Router,
    public cosmicNotificationService: CosmicNotificationService
  ) { }

  ngOnInit(): void {
    this.loadCartItems();
  }

  private loadCartItems(): void {
    this.cartItems = this.cartService.getCartItems();
  }

  getCartItemGradient(index: number): string {
    return this.cartItemDesigns[index % this.cartItemDesigns.length].gradient;
  }

  getCartItemEmoji(index: number): string {
    return this.cartItemDesigns[index % this.cartItemDesigns.length].emoji;
  }

  getItemDescription(index: number): string {
    return this.itemDescriptions[index % this.itemDescriptions.length];
  }

  increaseQuantity(item: CartItem): void {
    this.cartService.updateQuantity(item.id, item.quantity + 1);
    this.loadCartItems();
  }

  decreaseQuantity(item: CartItem): void {
    if (item.quantity > 1) {
      this.cartService.updateQuantity(item.id, item.quantity - 1);
      this.loadCartItems();
    }
  }

  removeItem(item: CartItem): void {
    this.cartService.removeFromCart(item.id);
    this.loadCartItems();
  }

  clearCart(): void {
    this.cartService.clearCart();
    this.loadCartItems();
  }

  getTotalItems(): number {
    return this.cartItems.reduce((total, item) => total + item.quantity, 0);
  }

  getSubtotal(): number {
    return this.cartService.getCartTotal();
  }

  getDeliveryFee(): number {
    return this.getSubtotal() > 500 ? 0 : 40;
  }

  getTaxes(): number {
    return Math.round(this.getSubtotal() * 0.05); // 5% tax
  }

  getTotal(): number {
    return this.getSubtotal() + this.getDeliveryFee() + this.getTaxes();
  }

  proceedToCheckout(): void {
    this.router.navigate(['/payment']);
  }

  continueShopping(): void {
    this.router.navigate(['/main']);
  }
} 