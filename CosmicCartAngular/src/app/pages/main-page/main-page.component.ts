import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RestaurantService } from '../../services/restaurant.service';
import { Restaurant } from '../../services/cart.service';
import { HeaderComponent } from '../../components/header.component';
import { CosmicNotificationService } from '../../services/cosmic-notification.service';
import { CosmicNotificationComponent } from '../../components/cosmic-notification.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, CosmicNotificationComponent],
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
      
      <!-- Hero Section with Floating Elements -->
      <section class="container py-5 position-relative" style="padding-top: 8rem !important;">
        
        <!-- Hero Content -->
        <div class="text-center mb-5 position-relative" style="z-index: 10;">
          <h1 class="display-3 fw-bold space-text space-font-primary mb-4 cosmic-title">
            Explore the 
            <span class="cosmic-text-gradient">Cosmic Kitchen</span>
          </h1>
          <p class="lead space-text-muted space-font-secondary mb-4" style="max-width: 600px; margin: 0 auto;">
            🚀 Discover intergalactic cuisines from the finest restaurants across the galaxy
          </p>
          
          <!-- Cosmic Stats -->
          <div class="d-flex justify-content-center flex-wrap gap-4 mb-5">
            <div class="cosmic-stat-card">
              <div class="cosmic-stat-icon">🍽️</div>
              <div class="h4 fw-bold space-text mb-1">{{ restaurants.length }}+</div>
              <div class="small space-text-dim fw-bold">Cosmic Restaurants</div>
            </div>
            <div class="cosmic-stat-card">
              <div class="cosmic-stat-icon">⚡</div>
              <div class="h4 fw-bold space-text mb-1">25 min</div>
              <div class="small space-text-dim fw-bold">Warp Speed</div>
            </div>
            <div class="cosmic-stat-card">
              <div class="cosmic-stat-icon">🌟</div>
              <div class="h4 fw-bold space-text mb-1">4.9★</div>
              <div class="small space-text-dim fw-bold">Galaxy Rating</div>
            </div>
          </div>
        </div>

        <!-- Restaurant Grid -->
        <div class="row g-4 position-relative" style="z-index: 10;">
          <div class="col-md-6 col-lg-4" *ngFor="let restaurant of restaurants; let i = index">
                         <div class="cosmic-restaurant-card glass-card p-0 h-100 position-relative overflow-hidden" 
                 [routerLink]="['/restaurant', restaurant.id]"
                 style="cursor: pointer;">
              
              <!-- Cosmic Restaurant Card -->
              <div class="cosmic-image-container position-relative" [style.background]="getCosmicCardGradient(i)">
                <!-- Cosmic Pattern Background -->
                <div class="cosmic-pattern-bg" [attr.data-pattern]="getCosmicCardPattern(i)"></div>
                
                <!-- Floating Elements -->
                <div class="cosmic-floating-elements">
                  <div class="cosmic-star star-1">✦</div>
                  <div class="cosmic-star star-2">✧</div>
                  <div class="cosmic-star star-3">⭑</div>
                </div>
                
                <!-- Central Emoji -->
                <div class="cosmic-center-emoji">
                  {{ getCosmicCardEmoji(i) }}
                </div>
                
                <!-- Cosmic Overlay -->
                <div class="cosmic-image-overlay position-absolute top-0 start-0 w-100 h-100">
                  <div class="cosmic-cuisine-badge position-absolute">
                    {{ getCuisineEmoji(i) }} {{ getCuisineType(i) }}
                  </div>
                </div>
                
                <!-- Cosmic Glow Effect -->
                <div class="cosmic-glow-effect" [style.box-shadow]="'0 0 30px ' + getCosmicCardGlow(i)"></div>
              </div>

              <!-- Restaurant Content -->
              <div class="p-3">
                <!-- Restaurant Header -->
                <div class="d-flex align-items-start justify-content-between mb-2">
                  <div class="flex-grow-1">
                    <h3 class="h5 fw-bold space-text space-font-primary mb-1">
                      {{ restaurant.name }}
                    </h3>
                    <p class="space-text-muted space-font-secondary mb-1 fw-bold small">
                      <svg class="me-1" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                        <circle cx="12" cy="10" r="3"/>
                      </svg>
                      {{ restaurant.location || restaurant.address || 'Location not available' }}
                    </p>
                    <p class="space-text-dim space-font-secondary fw-bold" style="font-size: 0.85rem;">
                      {{ getRestaurantDescription(i) }}
                    </p>
                  </div>
                  <div class="cosmic-rating-badge">
                    <span class="fw-bold space-text small">{{ getRestaurantRating(i) }}</span>
                    <span class="text-warning small">★</span>
                  </div>
                </div>

                <!-- Restaurant Features -->
                <div class="d-flex flex-wrap gap-1 mb-2">
                  <span class="cosmic-feature-tag" *ngFor="let feature of getRestaurantFeatures(i)">
                    {{ feature }}
                  </span>
        </div>
        
                <!-- Restaurant Stats -->
                <div class="d-flex justify-content-between align-items-center">
                  <div class="d-flex gap-3">
                    <div class="cosmic-mini-stat">
                      <div class="cosmic-mini-stat-icon">⚡</div>
                      <div class="cosmic-mini-stat-text">{{ getDeliveryTime(i) }}</div>
                    </div>
                    <div class="cosmic-mini-stat">
                      <div class="cosmic-mini-stat-icon">💰</div>
                      <div class="cosmic-mini-stat-text">{{ getDeliveryFee(i) }}</div>
                    </div>
                  </div>
                  
                  <!-- Explore Button -->
                  <div class="cosmic-explore-btn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="m9 18 6-6-6-6"/>
                    </svg>
                  </div>
                </div>
              </div>

              <!-- Cosmic Border Animation -->
              <div class="cosmic-card-border"></div>
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div *ngIf="restaurants.length === 0" class="text-center py-5">
          <div class="cosmic-loader mx-auto mb-3">
            <div class="cosmic-spinner"></div>
            <div class="cosmic-ring ring-1"></div>
            <div class="cosmic-ring ring-2"></div>
          </div>
          <p class="space-text-muted space-font-secondary fw-bold">🚀 Scanning the galaxy for cosmic restaurants...</p>
      </div>
      </section>
    </div>
  `,
  styles: [`
    /* Hero Section */
    .cosmic-title {
      font-size: clamp(2.5rem, 5vw, 4rem);
      line-height: 1.2;
      text-shadow: 0 4px 20px rgba(0,0,0,0.5);
    }

    /* Cosmic Stat Cards */
    .cosmic-stat-card {
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 16px;
      padding: 1.2rem 1rem;
      min-width: 120px;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }
    
    .cosmic-stat-card:hover {
      background: rgba(255, 255, 255, 0.12);
      transform: translateY(-5px);
      border-color: rgba(255, 255, 255, 0.3);
    }
    
    .cosmic-stat-icon {
      font-size: 1.5rem;
      margin-bottom: 0.5rem;
      filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
    }

    /* Restaurant Cards */
    .cosmic-restaurant-card {
      transition: all 0.4s ease;
      border-radius: 20px;
      overflow: hidden;
      position: relative;
    }
    
    .cosmic-restaurant-card:hover {
      transform: translateY(-8px) scale(1.02);
      box-shadow: 
        0 20px 40px rgba(255, 255, 255, 0.1),
        0 0 30px rgba(255, 255, 255, 0.05);
    }

    /* Cosmic Restaurant Card */
    .cosmic-image-container {
      height: 180px;
      overflow: hidden;
      border-radius: 16px 16px 0 0;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .cosmic-pattern-bg {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      opacity: 0.3;
    }
    
    .cosmic-pattern-bg[data-pattern="cosmic-pizza"]::before {
      content: '';
      position: absolute;
      width: 100%;
      height: 100%;
      background-image: radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 2px, transparent 2px),
                        radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 2px, transparent 2px);
      background-size: 30px 30px;
    }
    
    .cosmic-pattern-bg[data-pattern="cosmic-burger"]::before {
      content: '';
      position: absolute;
      width: 100%;
      height: 100%;
      background-image: linear-gradient(45deg, rgba(255,255,255,0.1) 25%, transparent 25%),
                        linear-gradient(-45deg, rgba(255,255,255,0.1) 25%, transparent 25%);
      background-size: 20px 20px;
    }
    
    .cosmic-pattern-bg[data-pattern="cosmic-salad"]::before {
      content: '';
      position: absolute;
      width: 100%;
      height: 100%;
      background-image: radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 1px, transparent 1px);
      background-size: 15px 15px;
    }
    
    .cosmic-floating-elements {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      pointer-events: none;
    }
    
    .cosmic-star {
      position: absolute;
      color: rgba(255, 255, 255, 0.6);
      font-size: 1rem;
      animation: cosmic-twinkle 3s ease-in-out infinite;
    }
    
    .star-1 {
      top: 20%;
      left: 20%;
      animation-delay: 0s;
    }
    
    .star-2 {
      top: 30%;
      right: 25%;
      animation-delay: 1s;
    }
    
    .star-3 {
      bottom: 25%;
      left: 30%;
      animation-delay: 2s;
    }
    
    @keyframes cosmic-twinkle {
      0%, 100% { opacity: 0.3; transform: scale(1); }
      50% { opacity: 1; transform: scale(1.2); }
    }
    
    .cosmic-center-emoji {
      font-size: 3rem;
      z-index: 5;
      position: relative;
      filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3));
      animation: cosmic-float 4s ease-in-out infinite;
    }
    
    @keyframes cosmic-float {
      0%, 100% { transform: translateY(0) rotate(0deg); }
      50% { transform: translateY(-5px) rotate(5deg); }
    }
    
    .cosmic-glow-effect {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      border-radius: 16px 16px 0 0;
      opacity: 0;
      transition: opacity 0.3s ease;
      pointer-events: none;
    }
    
    .cosmic-restaurant-card:hover .cosmic-glow-effect {
      opacity: 1;
    }

    /* Image Overlay */
    .cosmic-image-overlay {
      background: linear-gradient(
        135deg, 
        rgba(0,0,0,0.1) 0%, 
        rgba(0,0,0,0.4) 100%
      );
      opacity: 0;
      transition: all 0.3s ease;
    }
    
    .cosmic-restaurant-card:hover .cosmic-image-overlay {
      opacity: 1;
    }

    /* Cuisine Badge */
    .cosmic-cuisine-badge {
      background: rgba(255, 255, 255, 0.95);
      color: #0c0c0c;
      padding: 0.5rem 1rem;
      border-radius: 25px;
      font-weight: 700;
      font-family: 'Exo 2', sans-serif;
      font-size: 0.9rem;
      backdrop-filter: blur(10px);
      top: 12px;
      right: 12px;
      transform: translateY(-20px);
      transition: all 0.3s ease;
      opacity: 0;
    }
    
    .cosmic-restaurant-card:hover .cosmic-cuisine-badge {
      transform: translateY(0);
      opacity: 1;
    }

    /* Rating Badge */
    .cosmic-rating-badge {
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 10px;
      padding: 0.3rem 0.6rem;
      backdrop-filter: blur(10px);
      font-size: 0.85rem;
    }

    /* Feature Tags */
    .cosmic-feature-tag {
      background: rgba(255, 255, 255, 0.1);
      color: rgba(255, 255, 255, 0.9);
      padding: 0.2rem 0.5rem;
      border-radius: 15px;
      font-size: 0.75rem;
      font-weight: 600;
      font-family: 'Exo 2', sans-serif;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    /* Mini Stats */
    .cosmic-mini-stat {
      display: flex;
      align-items: center;
      gap: 0.3rem;
    }
    
    .cosmic-mini-stat-icon {
      font-size: 0.9rem;
    }
    
    .cosmic-mini-stat-text {
      font-size: 0.85rem;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.8);
      font-family: 'Exo 2', sans-serif;
    }

    /* Explore Button */
    .cosmic-explore-btn {
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
      color: rgba(255, 255, 255, 0.8);
    }
    
    .cosmic-restaurant-card:hover .cosmic-explore-btn {
      background: rgba(255, 255, 255, 0.2);
      transform: translateX(5px);
      color: rgba(255, 255, 255, 1);
    }

    /* Card Border Animation */
    .cosmic-card-border {
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
      animation: cosmic-border-glow 8s ease infinite;
      pointer-events: none;
    }
    
    .cosmic-restaurant-card:hover .cosmic-card-border {
      opacity: 1;
    }
    
    @keyframes cosmic-border-glow {
      0%, 100% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
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
      .cosmic-title {
        font-size: 2.5rem;
      }
      
      .cosmic-stat-card {
        min-width: 100px;
        padding: 1rem 0.75rem;
      }
      
      .cosmic-image-container {
        height: 160px;
      }
    }
  `]
})
export class MainPageComponent implements OnInit {
  restaurants: Restaurant[] = [];

  // Cosmic restaurant card designs - no internet dependency
  private cosmicCardData = [
    {
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      emoji: '🍕',
      pattern: 'cosmic-pizza',
      glow: 'rgba(102, 126, 234, 0.3)'
    },
    {
      gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      emoji: '🍔',
      pattern: 'cosmic-burger',
      glow: 'rgba(67, 233, 123, 0.3)'
    },
    {
      gradient: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
      emoji: '🥗',
      pattern: 'cosmic-salad',
      glow: 'rgba(34, 197, 94, 0.3)'
    },
    {
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      emoji: '🥢',
      pattern: 'cosmic-asian',
      glow: 'rgba(240, 147, 251, 0.3)'
    },
    {
      gradient: 'linear-gradient(135deg, #ffeaa7 0%, #fdcb6e 100%)',
      emoji: '🍽️',
      pattern: 'cosmic-dining',
      glow: 'rgba(255, 234, 167, 0.3)'
    },
    {
      gradient: 'linear-gradient(135deg, #fd79a8 0%, #e84393 100%)',
      emoji: '🌮',
      pattern: 'cosmic-mexican',
      glow: 'rgba(253, 121, 168, 0.3)'
    }
  ];

  private restaurantDescriptions = [
    "🚀 Authentic cosmic pizzas with interdimensional flavors",
    "🌌 Galactic burgers made from space-age ingredients", 
    "⭐ Fresh cosmic salads from hydroponic space gardens",
    "🥢 Traditional Asian dishes with a stellar twist",
    "✨ Fine dining experience among the stars",
    "🌶️ Spicy Mexican flavors from across the galaxy"
  ];

  private cuisineTypes = [
    "Italian Cosmic", "Space Burgers", "Galactic Greens", "Asian Fusion", "Stellar Dining", "Cosmic Mexican"
  ];

  private cuisineEmojis = ["🍕", "🍔", "🥗", "🥢", "🍽️", "🌮"];

  constructor(
    private restaurantService: RestaurantService,
    public cosmicNotificationService: CosmicNotificationService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loadRestaurants();
    this.debugUserInfo();
  }

  private debugUserInfo(): void {
    console.log('=== MAIN PAGE USER DEBUG ===');
    console.log('Current user ID:', this.authService.getCurrentUserId());
    console.log('Current user:', this.authService.getCurrentUser());
    console.log('Is authenticated:', this.authService.isAuthenticated());
    console.log('User roles:', this.authService.getCurrentUserRoles());
    console.log('================================');
  }

  private loadRestaurants(): void {
    this.restaurantService.fetchRestaurants().subscribe({
      next: (restaurants: Restaurant[]) => {
        this.restaurants = restaurants;
        // Removed annoying notification
      },
      error: (error: any) => {
        console.error('Error loading restaurants:', error);
        // Removed annoying notification
      }
    });
  }

  getCosmicCardGradient(index: number): string {
    return this.cosmicCardData[index % this.cosmicCardData.length].gradient;
  }

  getCosmicCardEmoji(index: number): string {
    return this.cosmicCardData[index % this.cosmicCardData.length].emoji;
  }

  getCosmicCardPattern(index: number): string {
    return this.cosmicCardData[index % this.cosmicCardData.length].pattern;
  }

  getCosmicCardGlow(index: number): string {
    return this.cosmicCardData[index % this.cosmicCardData.length].glow;
  }

  getRestaurantDescription(index: number): string {
    return this.restaurantDescriptions[index % this.restaurantDescriptions.length];
  }

  getCuisineType(index: number): string {
    return this.cuisineTypes[index % this.cuisineTypes.length];
  }

  getCuisineEmoji(index: number): string {
    return this.cuisineEmojis[index % this.cuisineEmojis.length];
  }

  getRestaurantRating(index: number): string {
    const ratings = ["4.9", "4.8", "4.7", "4.9", "4.8", "4.6"];
    return ratings[index % ratings.length];
  }

  getRestaurantFeatures(index: number): string[] {
    const features = [
      ["Fast Delivery", "Hot & Fresh"],
      ["Premium Quality", "Cosmic Taste"],
      ["Healthy Options", "Fresh Daily"],
      ["Authentic Recipes", "Quick Service"],
      ["Fine Dining", "Premium"],
      ["Spicy & Bold", "Traditional"]
    ];
    return features[index % features.length];
  }

  getDeliveryTime(index: number): string {
    const times = ["20-25 min", "25-30 min", "15-20 min", "30-35 min", "35-40 min", "25-30 min"];
    return times[index % times.length];
  }

  getDeliveryFee(index: number): string {
    const fees = ["Free", "₹29", "₹19", "Free", "₹39", "₹25"];
    return fees[index % fees.length];
  }
} 