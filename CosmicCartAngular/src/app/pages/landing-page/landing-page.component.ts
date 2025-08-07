import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TypewriterComponent } from '../../components/typewriter.component';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, RouterModule, TypewriterComponent],
  template: `
    <!-- Cosmic Space Background -->
    <div class="space-background">
      <!-- Header with Glassmorphism -->
      <header class="glass-card fixed-top mx-auto mt-3" style="max-width: 95%; left: 50%; transform: translateX(-50%); z-index: 100;">
        <div class="container py-3">
          <div class="d-flex align-items-center justify-content-center">
            <!-- Cosmic Logo -->
            <div class="cosmic-logo me-3">
              <svg class="text-white" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/>
              <path d="M7 2v20"/>
              <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>
            </svg>
            </div>
            <h1 class="h2 fw-bold space-text mb-0">
              <span class="cosmic-text-gradient">CosmicCart</span>
            </h1>
          </div>
        </div>
      </header>

      <!-- Main Content Container -->
      <div class="container py-5" style="padding-top: 8rem !important;">
        
        <!-- Hero Section with Cosmic Elements -->
        <div class="text-center mb-5 position-relative">
          <!-- Cosmic Hero Title -->
          <div class="hero-cosmic mb-4">
            <h2 class="display-2 fw-bold space-text mb-4 cosmic-title">
              <app-typewriter 
                [texts]="heroTexts"
                [speed]="120"
                [deleteSpeed]="60"
                [pauseDuration]="2500"
                [loop]="true"
                containerClass="cosmic-typewriter"
                textColor="rgba(255, 255, 255, 0.9)"
                cursorColor="#667eea">
              </app-typewriter>
              <br>
              <span class="cosmic-text-gradient">Cosmic Kitchen</span>
          </h2>
            <p class="lead space-text-muted mb-4 cosmic-subtitle">
              🚀 Embark on an intergalactic culinary journey where flavors transcend earthly boundaries
            </p>
          </div>
          
          <!-- Cosmic Stats -->
          <div class="d-flex justify-content-center flex-wrap gap-4 mb-5">
            <div class="cosmic-stat-card">
              <div class="cosmic-stat-icon">⭐</div>
              <div class="h4 fw-bold space-text mb-1">4.9</div>
              <div class="small space-text-dim">Galaxy Rating</div>
            </div>
            <div class="cosmic-stat-card">
              <div class="cosmic-stat-icon">👥</div>
              <div class="h4 fw-bold space-text mb-1">10K+</div>
              <div class="small space-text-dim">Space Travelers</div>
            </div>
            <div class="cosmic-stat-card">
              <div class="cosmic-stat-icon">🍽️</div>
              <div class="h4 fw-bold space-text mb-1">500+</div>
              <div class="small space-text-dim">Cosmic Restaurants</div>
            </div>
            <div class="cosmic-stat-card">
              <div class="cosmic-stat-icon">⚡</div>
              <div class="h4 fw-bold space-text mb-1">25 min</div>
              <div class="small space-text-dim">Warp Speed Delivery</div>
            </div>
          </div>
        </div>

        <!-- Customer and Restaurant Portals -->
        <div class="row g-4 align-items-stretch mb-5">
          
          <!-- Customer Portal -->
          <div class="col-lg-6">
            <div class="glass-card h-100 p-4 cosmic-portal" data-portal="customer">
              <div class="text-center h-100 d-flex flex-column">
                
                <!-- Portal Icon -->
                <div class="cosmic-icon mb-4">
                  <div class="portal-ring"></div>
                  <svg class="space-text" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="m22 21-3-3 3-3"/>
                    <path d="M16 8h-1.5a2.5 2.5 0 1 0 0 5H16"/>
                  </svg>
                </div>
                
                <h3 class="h2 fw-bold space-text mb-3">
                  🚀 Customer Portal
                </h3>
                <p class="space-text-muted mb-4 flex-grow-1 fs-6">
                  Join thousands of space travelers exploring cosmic cuisines from across the galaxy. 
                  Discover exotic flavors and have them delivered to your space station in warp speed.
                </p>

                <!-- Portal Features -->
                <div class="cosmic-features mb-4">
                  <div class="cosmic-feature">
                    <span class="feature-emoji">🌟</span>
                    <span class="space-text-muted small">Infinite variety of cosmic cuisines</span>
                  </div>
                  <div class="cosmic-feature">
                    <span class="feature-emoji">⚡</span>
                    <span class="space-text-muted small">Lightning-fast quantum delivery</span>
                  </div>
                  <div class="cosmic-feature">
                    <span class="feature-emoji">🛡️</span>
                    <span class="space-text-muted small">Galactic quality assurance</span>
                  </div>
                </div>

                <!-- Portal Actions -->
                <div class="d-grid gap-3 mb-4">
                  <a routerLink="/customer/login" class="btn-cosmic-primary text-decoration-none text-center">
                    🚀 Launch Customer Portal
                  </a>
                  <a routerLink="/customer/register" class="btn-cosmic-outline text-decoration-none text-center">
                    ✨ Join the Galaxy
                  </a>
                </div>

                <!-- Portal Stats -->
                <div class="row text-center mt-auto pt-3 border-top" style="border-color: rgba(255,255,255,0.2) !important;">
                  <div class="col-4">
                    <div class="h5 fw-bold cosmic-text-gradient">500+</div>
                    <div class="small space-text-dim">Restaurants</div>
                  </div>
                  <div class="col-4">
                    <div class="h5 fw-bold cosmic-text-gradient">25min</div>
                    <div class="small space-text-dim">Avg Delivery</div>
                  </div>
                  <div class="col-4">
                    <div class="h5 fw-bold cosmic-text-gradient">24/7</div>
                    <div class="small space-text-dim">Support</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Restaurant Portal -->
          <div class="col-lg-6">
            <div class="glass-card h-100 p-4 cosmic-portal" data-portal="restaurant">
              <div class="text-center h-100 d-flex flex-column">
                
                <!-- Portal Icon -->
                <div class="cosmic-icon mb-4">
                  <div class="portal-ring"></div>
                  <svg class="space-text" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z"/>
                    <line x1="6" x2="18" y1="17" y2="17"/>
                  </svg>
                </div>
                
                <h3 class="h2 fw-bold space-text mb-3">
                  👨‍🍳 Restaurant Portal
                </h3>
                <p class="space-text-muted mb-4 flex-grow-1 fs-6">
                  Transform your restaurant into a cosmic culinary destination. 
                  Reach hungry space travelers across the galaxy and grow your intergalactic business.
                </p>

                <!-- Portal Features -->
                <div class="cosmic-features mb-4">
                  <div class="cosmic-feature">
                    <span class="feature-emoji">🌌</span>
                    <span class="space-text-muted small">Expand across the galaxy</span>
                  </div>
                  <div class="cosmic-feature">
                    <span class="feature-emoji">📊</span>
                    <span class="space-text-muted small">Advanced cosmic analytics</span>
                  </div>
                  <div class="cosmic-feature">
                    <span class="feature-emoji">💫</span>
                    <span class="space-text-muted small">Zero setup fees</span>
                  </div>
                </div>

                <!-- Portal Actions -->
                <div class="d-grid gap-3 mb-4">
                  <a routerLink="/restaurant/login" class="btn-cosmic-secondary text-decoration-none text-center">
                    🏪 Launch Restaurant Portal
                  </a>
                  <a routerLink="/restaurant/register" class="btn-cosmic-outline text-decoration-none text-center">
                    ⭐ Join the Fleet
                  </a>
                </div>

                <!-- Portal Stats -->
                <div class="row text-center mt-auto pt-3 border-top" style="border-color: rgba(255,255,255,0.2) !important;">
                  <div class="col-4">
                    <div class="h5 fw-bold cosmic-text-gradient">0%</div>
                    <div class="small space-text-dim">Setup Fee</div>
                  </div>
                  <div class="col-4">
                    <div class="h5 fw-bold cosmic-text-gradient">10K+</div>
                    <div class="small space-text-dim">Customers</div>
                  </div>
                  <div class="col-4">
                    <div class="h5 fw-bold cosmic-text-gradient">Easy</div>
                    <div class="small space-text-dim">Management</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Cosmic Features Section -->
        <div class="text-center mb-5">
          <h3 class="display-5 fw-bold space-text mb-5">
            Why Choose Our <span class="cosmic-text-gradient">Cosmic Platform</span>?
          </h3>
          
          <div class="row g-4">
            <div class="col-md-4">
              <div class="glass-card p-4 h-100 cosmic-feature-card">
                <div class="cosmic-icon mb-3">
                  <svg class="space-text" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/>
                    <path d="M7 2v20"/>
                    <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>
                  </svg>
                </div>
                <h4 class="h5 fw-semibold space-text mb-3">🌌 Galactic Variety</h4>
                <p class="space-text-muted">From local Earth favorites to exotic alien cuisines, explore flavors from across the known universe.</p>
              </div>
            </div>
            
            <div class="col-md-4">
              <div class="glass-card p-4 h-100 cosmic-feature-card">
                <div class="cosmic-icon mb-3">
                  <svg class="space-text" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="m22 21-3-3 3-3"/>
                    <path d="M16 8h-1.5a2.5 2.5 0 1 0 0 5H16"/>
                  </svg>
                </div>
                <h4 class="h5 fw-semibold space-text mb-3">⚡ Warp Speed Delivery</h4>
                <p class="space-text-muted">Advanced quantum delivery technology ensures your food arrives hot and fresh in under 30 parsecs.</p>
              </div>
            </div>
            
            <div class="col-md-4">
              <div class="glass-card p-4 h-100 cosmic-feature-card">
                <div class="cosmic-icon mb-3">
                  <svg class="space-text" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
                  </svg>
                </div>
                <h4 class="h5 fw-semibold space-text mb-3">🛡️ Cosmic Quality</h4>
                <p class="space-text-muted">All partner restaurants are verified by the Galactic Food Safety Council and maintain stellar standards.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Call to Action -->
        <div class="text-center">
          <div class="glass-card p-5 cosmic-cta">
            <h3 class="h2 fw-bold space-text mb-3">
              Ready to Begin Your <span class="cosmic-text-gradient">Cosmic Journey</span>?
            </h3>
            <p class="space-text-muted mb-4 fs-5">
              Join thousands of space travelers and restaurants in the largest intergalactic food network
            </p>
            <div class="d-flex justify-content-center gap-3 flex-wrap">
              <a routerLink="/customer/login" class="btn-cosmic-primary text-decoration-none">
                🚀 Start as Customer
              </a>
              <a routerLink="/restaurant/login" class="btn-cosmic-secondary text-decoration-none">
                👨‍🍳 Start as Restaurant
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* Cosmic Logo Animation */
    .cosmic-logo {
      animation: cosmic-glow 3s ease-in-out infinite alternate;
    }
    
    @keyframes cosmic-glow {
      0% { filter: drop-shadow(0 0 5px rgba(255,255,255,0.3)); }
      100% { filter: drop-shadow(0 0 20px rgba(255,255,255,0.8)); }
    }
    
    /* Cosmic Text Gradient */
    .cosmic-text-gradient {
      background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #ffeaa7, #fd79a8);
      background-size: 400% 400%;
      background-clip: text;
      -webkit-background-clip: text;
      color: transparent;
      animation: cosmic-gradient 6s ease infinite;
    }
    
    @keyframes cosmic-gradient {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    
    /* Hero Cosmic */
    .hero-cosmic {
      position: relative;
      z-index: 10;
    }
    
    .cosmic-title {
      font-size: clamp(2.5rem, 5vw, 4rem);
      line-height: 1.2;
      margin-bottom: 2rem;
    }
    
    .cosmic-subtitle {
      font-size: clamp(1.1rem, 2.5vw, 1.4rem);
      line-height: 1.6;
      max-width: 800px;
      margin: 0 auto;
    }
    
    /* Cosmic Stat Cards */
    .cosmic-stat-card {
      background: rgba(255, 255, 255, 0.08);
      backdrop-filter: blur(15px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 16px;
      padding: 1.5rem 1rem;
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
    
    .cosmic-stat-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
      transition: left 0.5s ease;
    }
    
    .cosmic-stat-card:hover::before {
      left: 100%;
    }
    
    .cosmic-stat-icon {
      font-size: 1.5rem;
      margin-bottom: 0.5rem;
      filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
    }
    
    /* Cosmic Portals */
    .cosmic-portal {
      transition: all 0.4s ease;
      position: relative;
      overflow: hidden;
    }
    
    .cosmic-portal:hover {
      transform: translateY(-10px);
    }
    
    .cosmic-portal[data-portal="customer"]:hover {
      box-shadow: 
        0 20px 40px rgba(102, 126, 234, 0.3),
        0 0 30px rgba(102, 126, 234, 0.2);
    }
    
    .cosmic-portal[data-portal="restaurant"]:hover {
      box-shadow: 
        0 20px 40px rgba(67, 233, 123, 0.3),
        0 0 30px rgba(67, 233, 123, 0.2);
    }
    
    /* Portal Ring Animation - Smaller Size */
    .portal-ring {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 80px;
      height: 80px;
      border: 2px solid rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      animation: portal-spin 8s linear infinite;
    }
    
    .portal-ring::before {
      content: '';
      position: absolute;
      top: -2px;
      left: -2px;
      right: -2px;
      bottom: -2px;
      border: 2px solid transparent;
      border-top: 2px solid rgba(255, 255, 255, 0.6);
      border-radius: 50%;
      animation: portal-spin-reverse 4s linear infinite;
    }
    
    @keyframes portal-spin {
      0% { transform: translate(-50%, -50%) rotate(0deg); }
      100% { transform: translate(-50%, -50%) rotate(360deg); }
    }
    
    @keyframes portal-spin-reverse {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(-360deg); }
    }
    
    /* Cosmic Features */
    .cosmic-features {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    
    .cosmic-feature {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.5rem;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 8px;
      transition: all 0.3s ease;
    }
    
    .cosmic-feature:hover {
      background: rgba(255, 255, 255, 0.1);
      transform: translateX(5px);
    }
    
    .feature-emoji {
      font-size: 1.2rem;
      filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
    }
    
    /* Feature Cards */
    .cosmic-feature-card {
      transition: all 0.4s ease;
      position: relative;
      overflow: hidden;
    }
    
    .cosmic-feature-card:hover {
      transform: translateY(-8px);
      border-color: rgba(255, 255, 255, 0.4);
    }
    
    .cosmic-feature-card::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, #ff6b6b, #4ecdc4, #45b7d1);
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    
    .cosmic-feature-card:hover::after {
      opacity: 1;
    }
    
    /* Cosmic CTA */
    .cosmic-cta {
      position: relative;
      overflow: hidden;
    }
    
    .cosmic-cta::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: radial-gradient(ellipse at center, rgba(255,255,255,0.1) 0%, transparent 70%);
      opacity: 0;
      transition: opacity 0.6s ease;
      pointer-events: none;
    }
    
    .cosmic-cta:hover::before {
      opacity: 1;
    }
    
    /* Responsive Design */
    @media (max-width: 768px) {
      .cosmic-title {
        font-size: 2.5rem;
      }
      
      .cosmic-subtitle {
        font-size: 1.1rem;
      }
      
      .cosmic-stat-card {
        min-width: 100px;
        padding: 1rem 0.75rem;
      }
      
      .cosmic-features {
        gap: 0.5rem;
      }
      
      .cosmic-feature {
        padding: 0.4rem;
      }
    }
  `]
})
export class LandingPageComponent {
  heroTexts = [
    'Delicious Food from the',
    'Cosmic Cuisine from the',
    'Intergalactic Flavors from the',
    'Stellar Dishes from the'
  ];
} 