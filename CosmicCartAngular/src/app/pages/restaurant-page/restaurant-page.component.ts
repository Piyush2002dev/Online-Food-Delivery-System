import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { RestaurantService, MenuItem } from '../../services/restaurant.service';
import { CartService, Restaurant } from '../../services/cart.service';
import { HeaderComponent } from '../../components/header.component';
import { ToastrService } from 'ngx-toastr';
import { CosmicNotificationService } from '../../services/cosmic-notification.service';
import { CosmicNotificationComponent } from '../../components/cosmic-notification.component';

@Component({
  selector: 'app-restaurant-page',
  standalone: true,
  imports: [CommonModule, HeaderComponent, CosmicNotificationComponent],
  template: `
    <div class="space-background">
      <!-- Header Component -->
      <app-header></app-header>
      
      <!-- Cosmic Notifications (Left Position to Avoid Cart Icon) -->
      <app-cosmic-notification 
        *ngFor="let notification of cosmicNotificationService.notifications$ | async" 
        [notification]="notification"
        position="left">
      </app-cosmic-notification>

      <!-- Restaurant Hero Section -->
      <section class="cosmic-restaurant-hero" style="padding-top: 6rem;">
        <div class="container py-5">
          <div class="row align-items-center">
            <div class="col-lg-8 col-md-12">
              <div class="cosmic-restaurant-info">
                <div class="d-flex align-items-center mb-3">
                  <div class="cosmic-restaurant-badge me-3">
                    🍽️
                  </div>
                  <div>
                    <h1 class="display-4 fw-bold space-text space-font-primary mb-2">
                      {{ restaurant?.name || 'Cosmic Restaurant' }}
                    </h1>
                                         <p class="lead space-text-muted space-font-secondary fw-bold">
                       <svg class="me-2" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                         <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                         <circle cx="12" cy="10" r="3"/>
            </svg>
                       {{ restaurant?.location || restaurant?.address || 'Location not available' }}
                     </p>
                  </div>
                </div>
                
                <!-- Restaurant Stats -->
                <div class="d-flex flex-wrap gap-3 mb-4">
                  <div class="cosmic-stat-chip">
                    <span class="stat-icon">⭐</span>
                    <span class="stat-text">4.8 Rating</span>
                  </div>
                  <div class="cosmic-stat-chip">
                    <span class="stat-icon">⚡</span>
                    <span class="stat-text">25-30 min</span>
                  </div>
                  <div class="cosmic-stat-chip">
                    <span class="stat-icon">🛸</span>
                    <span class="stat-text">Free Delivery</span>
                  </div>
                  <div class="cosmic-stat-chip">
                    <span class="stat-icon">🌟</span>
                    <span class="stat-text">Verified</span>
                  </div>
                </div>
                
                <p class="space-text-muted space-font-secondary fw-bold" style="max-width: 600px;">
                  🚀 Welcome to our cosmic kitchen! Discover intergalactic flavors crafted with love and served with stellar quality. Every dish is a journey through the universe of taste.
                </p>
              </div>
            </div>
            <div class="col-lg-4 col-md-12">
              <div class="cosmic-restaurant-image">
                <img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop" 
                     alt="Restaurant Interior" 
                     class="w-100 rounded-3"
                     (error)="onHeroImageError($event)">
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Menu Section -->
      <section class="container py-5">
        <div class="text-center mb-5">
          <h2 class="display-5 fw-bold space-text space-font-primary mb-3">
            Our <span class="cosmic-text-gradient">Cosmic Menu</span>
          </h2>
          <p class="lead space-text-muted space-font-secondary fw-bold">
            🌌 Explore our galaxy of flavors
          </p>
        </div>
      
        <!-- Loading State -->
        <div *ngIf="loading" class="text-center py-5">
          <div class="cosmic-loader mx-auto mb-3">
            <div class="cosmic-spinner"></div>
            <div class="cosmic-ring ring-1"></div>
            <div class="cosmic-ring ring-2"></div>
          </div>
          <p class="space-text-muted space-font-secondary fw-bold">🚀 Loading cosmic menu...</p>
        </div>
        
        <!-- Menu Items Grid -->
        <div *ngIf="!loading" class="row g-4">
          <div class="col-lg-6 col-xl-4" *ngFor="let item of menuItems; let i = index">
            <div class="cosmic-menu-card glass-card h-100 position-relative">
              
                            <!-- Cosmic Menu Item Design -->
              <div class="cosmic-menu-image position-relative" [style.background]="getMenuItemGradient(i)">
                <!-- Cosmic Pattern -->
                <div class="cosmic-menu-pattern">
                  <div class="cosmic-food-stars">
                    <span class="food-star star-1">✦</span>
                    <span class="food-star star-2">✧</span>
                    <span class="food-star star-3">⭑</span>
                  </div>
                </div>

                <!-- Central Food Emoji -->
                <div class="cosmic-food-emoji">
                  {{ getMenuItemEmoji(i) }}
                </div>

                <!-- Veg/Non-Veg Indicator -->
                <div class="cosmic-diet-indicator position-absolute" [class]="getDietClass(item.isVeg)">
                  <div class="diet-dot"></div>
                </div>

                <!-- Popular Badge -->
                <div class="cosmic-popular-badge position-absolute" *ngIf="isPopular(i)">
                  ⭐ Popular
                </div>

                <!-- Cosmic Glow -->
                <div class="cosmic-menu-glow" [style.box-shadow]="'0 0 20px ' + getMenuItemColor(i)"></div>
          </div>
          
              <!-- Menu Item Content -->
              <div class="p-4">
                <div class="d-flex justify-content-between align-items-start mb-3">
                  <div class="flex-grow-1">
                    <h4 class="h5 fw-bold space-text space-font-primary mb-2">
                      {{ item.name }}
                    </h4>
                    <p class="space-text-dim space-font-secondary small fw-bold mb-0" *ngIf="item.description">
                      {{ item.description }}
                    </p>
                    <p class="space-text-dim space-font-secondary small fw-bold mb-0" *ngIf="!item.description">
                      {{ getMenuItemDescription(i) }}
                    </p>
                  </div>
                  <div class="cosmic-price-badge">
                    ₹{{ item.price }}
                  </div>
                </div>

                <!-- Menu Item Features -->
                <div class="d-flex flex-wrap gap-2 mb-3">
                  <span class="cosmic-feature-mini" *ngFor="let feature of getMenuItemFeatures(i)">
                    {{ feature }}
                  </span>
                </div>

                <!-- Add to Cart Button / Quantity Controls -->
                <div *ngIf="getItemQuantityInCart(item.id) === 0 && item.available">
                  <button 
                    class="btn-cosmic-primary w-100 fw-bold cosmic-add-to-cart"
                    (click)="addToCart(item)">
                    <svg class="me-2" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17"/>
                      <circle cx="17" cy="20" r="1"/>
                      <circle cx="9" cy="20" r="1"/>
                    </svg>
                    🚀 Add to Cosmic Cart
                  </button>
                </div>

                <!-- Quantity Controls -->
                <div *ngIf="getItemQuantityInCart(item.id) > 0" class="cosmic-quantity-controls-menu">
                  <button class="cosmic-qty-btn-menu" (click)="decreaseQuantity(item)">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M5 12h14"/>
                    </svg>
                  </button>
                  <div class="cosmic-qty-display-menu">
                    <span class="qty-number">{{ getItemQuantityInCart(item.id) }}</span>
                    <span class="qty-label">in cart</span>
                  </div>
                  <button class="cosmic-qty-btn-menu" (click)="increaseQuantity(item)">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M12 5v14"/>
                      <path d="M5 12h14"/>
                    </svg>
                  </button>
                </div>

                <!-- Unavailable State -->
                <div *ngIf="!item.available">
                  <button class="btn-cosmic-disabled w-100 fw-bold" disabled>
                    <svg class="me-2" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="10"/>
                      <path d="m4.9 4.9 14.2 14.2"/>
                    </svg>
                    😞 Currently Unavailable
                  </button>
                </div>
              </div>

              <!-- Cosmic Border Animation -->
              <div class="cosmic-menu-border"></div>
            </div>
          </div>
        </div>

        <!-- Empty Menu State -->
        <div *ngIf="!loading && menuItems.length === 0" class="text-center py-5">
          <div class="cosmic-empty-state mb-4">
            <div class="cosmic-empty-icon mb-3">🍽️</div>
            <h3 class="h3 fw-bold space-text space-font-primary mb-3">
              No Cosmic Dishes Available
            </h3>
            <p class="space-text-muted space-font-secondary fw-bold">
              Our cosmic chefs are preparing something amazing! Check back soon.
            </p>
        </div>
      </div>
      </section>
    </div>
  `,
  styles: [`
    /* Restaurant Hero */
    .cosmic-restaurant-hero {
      background: linear-gradient(
        135deg,
        rgba(102, 126, 234, 0.1) 0%,
        rgba(67, 233, 123, 0.1) 100%
      );
      position: relative;
    }

    .cosmic-restaurant-badge {
      background: rgba(255, 255, 255, 0.1);
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      width: 80px;
      height: 80px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
      backdrop-filter: blur(10px);
      animation: cosmic-glow 3s ease-in-out infinite alternate;
    }

    @keyframes cosmic-glow {
      0% { 
        border-color: rgba(102, 126, 234, 0.3);
        box-shadow: 0 0 20px rgba(102, 126, 234, 0.2);
      }
      100% { 
        border-color: rgba(67, 233, 123, 0.3);
        box-shadow: 0 0 30px rgba(67, 233, 123, 0.2);
      }
    }

    .cosmic-stat-chip {
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 25px;
      padding: 0.5rem 1rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      backdrop-filter: blur(10px);
      transition: all 0.3s ease;
    }

    .cosmic-stat-chip:hover {
      background: rgba(255, 255, 255, 0.12);
      transform: translateY(-2px);
    }

    .stat-icon {
      font-size: 1rem;
    }

    .stat-text {
      font-weight: 600;
      color: rgba(255, 255, 255, 0.9);
      font-family: 'Exo 2', sans-serif;
      font-size: 0.9rem;
    }

    .cosmic-restaurant-image {
      position: relative;
      overflow: hidden;
      border-radius: 20px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.3);
    }

    .cosmic-restaurant-image img {
      transition: transform 0.4s ease;
      object-fit: cover;
      height: 300px;
    }

    .cosmic-restaurant-image:hover img {
      transform: scale(1.05);
    }

    /* Menu Cards */
    .cosmic-menu-card {
      transition: all 0.4s ease;
      border-radius: 20px;
      overflow: hidden;
      position: relative;
    }

    .cosmic-menu-card:hover {
      transform: translateY(-8px);
      box-shadow: 
        0 20px 40px rgba(255, 255, 255, 0.1),
        0 0 30px rgba(255, 255, 255, 0.05);
    }

    /* Cosmic Menu Item Design */
    .cosmic-menu-image {
      height: 200px;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
    }

    .cosmic-menu-pattern {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0.3;
    }

    .cosmic-food-stars {
      position: relative;
      width: 100%;
      height: 100%;
    }

    .food-star {
      position: absolute;
      color: rgba(255, 255, 255, 0.7);
      font-size: 1.2rem;
      animation: food-star-twinkle 3s ease-in-out infinite;
    }

    .star-1 {
      top: 25%;
      left: 20%;
      animation-delay: 0s;
    }

    .star-2 {
      top: 70%;
      right: 25%;
      animation-delay: 1s;
    }

    .star-3 {
      bottom: 30%;
      left: 60%;
      animation-delay: 2s;
    }

    @keyframes food-star-twinkle {
      0%, 100% { opacity: 0.4; transform: scale(1); }
      50% { opacity: 1; transform: scale(1.3); }
    }

    .cosmic-food-emoji {
      font-size: 3.5rem;
      z-index: 5;
      position: relative;
      filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3));
      animation: food-float 3s ease-in-out infinite;
    }

    @keyframes food-float {
      0%, 100% { transform: translateY(0) rotate(-2deg); }
      50% { transform: translateY(-8px) rotate(2deg); }
    }

    .cosmic-menu-glow {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      opacity: 0;
      transition: opacity 0.3s ease;
      pointer-events: none;
    }

    .cosmic-menu-card:hover .cosmic-menu-glow {
      opacity: 1;
    }

    /* Diet Indicator */
    .cosmic-diet-indicator {
      top: 12px;
      left: 12px;
      width: 20px;
      height: 20px;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      backdrop-filter: blur(10px);
    }

    .diet-veg {
      background: rgba(34, 197, 94, 0.2);
      border: 2px solid #22c55e;
    }

    .diet-non-veg {
      background: rgba(239, 68, 68, 0.2);
      border: 2px solid #ef4444;
    }

    .diet-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
    }

    .diet-veg .diet-dot {
      background: #22c55e;
    }

    .diet-non-veg .diet-dot {
      background: #ef4444;
    }

    /* Popular Badge */
    .cosmic-popular-badge {
      top: 12px;
      right: 12px;
      background: rgba(255, 193, 7, 0.9);
      color: #0c0c0c;
      padding: 0.3rem 0.7rem;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 700;
      font-family: 'Exo 2', sans-serif;
      backdrop-filter: blur(10px);
      animation: popular-pulse 2s ease-in-out infinite;
    }

    @keyframes popular-pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }

    /* Price Badge */
    .cosmic-price-badge {
      background: rgba(102, 126, 234, 0.2);
      border: 1px solid rgba(102, 126, 234, 0.4);
      border-radius: 12px;
      padding: 0.4rem 0.8rem;
      font-weight: 700;
      font-family: 'Orbitron', monospace;
      color: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(10px);
    }

    /* Feature Mini Tags */
    .cosmic-feature-mini {
      background: rgba(255, 255, 255, 0.08);
      color: rgba(255, 255, 255, 0.8);
      padding: 0.2rem 0.5rem;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;
      font-family: 'Exo 2', sans-serif;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    /* Add to Cart Button */
    .cosmic-add-to-cart {
      position: relative;
      overflow: hidden;
      transition: all 0.3s ease;
    }

    .cosmic-add-to-cart:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
    }

    .cosmic-add-to-cart:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    /* Disabled Button */
    .btn-cosmic-disabled {
      background: rgba(255, 255, 255, 0.1);
      border: 2px solid rgba(255, 255, 255, 0.2);
      border-radius: 12px;
      color: rgba(255, 255, 255, 0.5);
      padding: 12px 24px;
      font-weight: 700;
      font-family: 'Orbitron', monospace;
      cursor: not-allowed;
    }

    /* Quantity Controls for Menu */
    .cosmic-quantity-controls-menu {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 12px;
      padding: 0.5rem;
      backdrop-filter: blur(10px);
    }

    .cosmic-qty-btn-menu {
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
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

    .cosmic-qty-btn-menu:hover {
      background: rgba(255, 255, 255, 0.2);
      color: rgba(255, 255, 255, 1);
      transform: scale(1.05);
    }

    .cosmic-qty-display-menu {
      text-align: center;
      flex: 1;
      padding: 0 1rem;
    }

    .qty-number {
      display: block;
      font-weight: 700;
      font-family: 'Orbitron', monospace;
      color: rgba(255, 255, 255, 0.9);
      font-size: 1.1rem;
    }

    .qty-label {
      display: block;
      font-size: 0.75rem;
      color: rgba(255, 255, 255, 0.6);
      font-family: 'Exo 2', sans-serif;
      font-weight: 600;
      margin-top: 0.1rem;
    }

    /* Menu Border Animation */
    .cosmic-menu-border {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      border-radius: 20px;
      background: linear-gradient(45deg, 
        rgba(255, 255, 255, 0.1) 0%,
        rgba(102, 126, 234, 0.2) 25%,
        rgba(67, 233, 123, 0.2) 50%,
        rgba(255, 255, 255, 0.1) 75%,
        rgba(255, 255, 255, 0.1) 100%
      );
      background-size: 400% 400%;
      opacity: 0;
      transition: opacity 0.3s ease;
      animation: cosmic-border-glow 6s ease infinite;
      pointer-events: none;
    }

    .cosmic-menu-card:hover .cosmic-menu-border {
      opacity: 1;
    }

    @keyframes cosmic-border-glow {
      0%, 100% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
    }

    /* Empty State */
    .cosmic-empty-state {
      max-width: 400px;
      margin: 0 auto;
    }

    .cosmic-empty-icon {
      font-size: 4rem;
      animation: empty-float 3s ease-in-out infinite;
    }

    @keyframes empty-float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }

    /* Cosmic Loader */
    .cosmic-loader {
      position: relative;
      width: 60px;
      height: 60px;
    }

    .cosmic-spinner {
      position: absolute;
      width: 100%;
      height: 100%;
      border: 3px solid rgba(255,255,255,0.2);
      border-top: 3px solid rgba(102, 126, 234, 0.8);
      border-radius: 50%;
      animation: cosmic-spin 1s linear infinite;
    }

    .cosmic-ring {
      position: absolute;
      border-radius: 50%;
      border: 2px solid rgba(102, 126, 234, 0.2);
      animation: cosmic-pulse 2s ease-in-out infinite;
    }

    .ring-1 {
      width: 100%;
      height: 100%;
      animation-delay: 0s;
    }

    .ring-2 {
      width: 120%;
      height: 120%;
      top: -10%;
      left: -10%;
      animation-delay: 0.5s;
    }

    @keyframes cosmic-spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    @keyframes cosmic-pulse {
      0% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.5; transform: scale(1.1); }
      100% { opacity: 1; transform: scale(1); }
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .cosmic-restaurant-badge {
        width: 60px;
        height: 60px;
        font-size: 1.5rem;
      }

      .cosmic-stat-chip {
        padding: 0.3rem 0.7rem;
      }

      .stat-text {
        font-size: 0.8rem;
      }

      .cosmic-menu-image {
        height: 160px;
      }

      .cosmic-restaurant-image img {
        height: 200px;
      }
    }
  `]
})
export class RestaurantPageComponent implements OnInit {
  restaurant: Restaurant | null = null;
  menuItems: MenuItem[] = [];
  loading = true;

  private menuItemDesigns = [
    { gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', emoji: '🍕', color: 'rgba(102, 126, 234, 0.3)' },
    { gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', emoji: '🍔', color: 'rgba(67, 233, 123, 0.3)' },
    { gradient: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)', emoji: '🥗', color: 'rgba(34, 197, 94, 0.3)' },
    { gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', emoji: '🍜', color: 'rgba(240, 147, 251, 0.3)' },
    { gradient: 'linear-gradient(135deg, #ffeaa7 0%, #fdcb6e 100%)', emoji: '🍝', color: 'rgba(255, 234, 167, 0.3)' },
    { gradient: 'linear-gradient(135deg, #fd79a8 0%, #e84393 100%)', emoji: '🧁', color: 'rgba(253, 121, 168, 0.3)' }
  ];

  private menuDescriptions = [
    "Crafted with cosmic love and stellar ingredients",
    "A galactic favorite from our space kitchen",
    "Fresh from our interplanetary garden",
    "Made with traditional alien spices",
    "A fusion of Earth and cosmic flavors",
    "Straight from our quantum oven"
  ];

  private menuFeatures = [
    ["Spicy", "Popular"],
    ["Healthy", "Protein Rich"],
    ["Vegan", "Fresh"],
    ["Traditional", "Spicy"],
    ["Creamy", "Rich"],
    ["Sweet", "Dessert"]
  ];

  constructor(
    private route: ActivatedRoute,
    private restaurantService: RestaurantService,
    private cartService: CartService,
    private toastr: ToastrService,
    public cosmicNotificationService: CosmicNotificationService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const restaurantId = +params['id'];
      this.loadRestaurant(restaurantId);
      this.loadMenu(restaurantId);
    });
  }

  private loadRestaurant(restaurantId: number): void {
    this.restaurantService.fetchRestaurantById(restaurantId).subscribe({
      next: (restaurant: Restaurant) => {
        this.restaurant = restaurant;
        this.cosmicNotificationService.info(
          '🏪 Welcome to the Cosmic Kitchen!',
          `${restaurant.name} is ready to serve your stellar cravings!`
        );
      },
      error: (error: any) => {
        console.error('Error loading restaurant:', error);
        this.cosmicNotificationService.error(
          '❌ Restaurant Portal Offline',
          'Unable to connect to this cosmic kitchen. Please try another restaurant.'
        );
      }
    });
  }

  private loadMenu(restaurantId: number): void {
    this.loading = true;
    this.restaurantService.fetchMenuItems(restaurantId).subscribe({
      next: (menuItems: MenuItem[]) => {
        this.menuItems = menuItems;
        this.loading = false;
        // Removed menu loaded notification to prevent cart icon overlap
        },
      error: (error: any) => {
        console.error('Error loading menu:', error);
        this.loading = false;
        this.cosmicNotificationService.error(
          '❌ Menu Transmission Failed',
          'Unable to load the cosmic menu. The kitchen might be in another dimension.'
        );
      }
    });
  }

  getMenuItemGradient(index: number): string {
    return this.menuItemDesigns[index % this.menuItemDesigns.length].gradient;
  }

  getMenuItemEmoji(index: number): string {
    return this.menuItemDesigns[index % this.menuItemDesigns.length].emoji;
  }

  getMenuItemColor(index: number): string {
    return this.menuItemDesigns[index % this.menuItemDesigns.length].color;
  }

  onHeroImageError(event: any): void {
    event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSJsaW5lYXItZ3JhZGllbnQoMTM1ZGVnLCAjNjY3ZWVhIDAlLCAjNzY0YmEyIDEwMCUpIi8+Cjx0ZXh0IHg9IjIwMCIgeT0iMTUwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7wn40lUmVzdGF1cmFudDwvdGV4dD4KPC9zdmc+';
  }

  getDietClass(isVeg: string): string {
    return isVeg === 'yes' ? 'diet-veg' : 'diet-non-veg';
  }

  isPopular(index: number): boolean {
    return index % 3 === 0; // Every 3rd item is popular
  }

  getMenuItemDescription(index: number): string {
    return this.menuDescriptions[index % this.menuDescriptions.length];
  }

  getMenuItemFeatures(index: number): string[] {
    return this.menuFeatures[index % this.menuFeatures.length];
  }

  getItemQuantityInCart(itemId: number): number {
    const cartItems = this.cartService.getCartItems();
    const item = cartItems.find(cartItem => cartItem.id === itemId);
    return item ? item.quantity : 0;
  }

  addToCart(item: MenuItem): void {
    if (this.restaurant) {
      this.cartService.addToCart({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: 1,
        description: item.description,
        restaurantId: this.restaurant.id
      }, this.restaurant);

      this.cosmicNotificationService.success(
        '🛸 Added to Cosmic Cart!',
        `${item.name} has been successfully added to your galactic cart! ₹${item.price}`
      );
    }
  }

  increaseQuantity(item: MenuItem): void {
    const currentQuantity = this.getItemQuantityInCart(item.id);
    this.cartService.updateQuantity(item.id, currentQuantity + 1);
  }

  decreaseQuantity(item: MenuItem): void {
    const currentQuantity = this.getItemQuantityInCart(item.id);
    if (currentQuantity > 1) {
      this.cartService.updateQuantity(item.id, currentQuantity - 1);
    } else {
      this.cartService.removeFromCart(item.id);
    }
  }
} 