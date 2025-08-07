import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService, LoginRequest } from '../../services/auth.service';

@Component({
  selector: 'app-restaurant-login',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <!-- Cosmic Space Background -->
    <div class="space-background">
      <div class="single-card-optimized">
        <div class="card-container">
          
          <!-- Back Button -->
          <a routerLink="/" class="cosmic-link d-inline-flex align-items-center mb-4 text-decoration-none">
            <!-- Arrow Left Icon -->
            <svg class="me-2" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="m12 19-7-7 7-7"/>
              <path d="M19 12H5"/>
            </svg>
            <span class="space-text-muted">Back to Cosmic Home</span>
          </a>

          <!-- Login Card -->
          <div class="glass-card p-4 cosmic-login-card restaurant-theme">
            
            <!-- Header -->
            <div class="text-center mb-4">
              <div class="cosmic-icon mx-auto mb-3">
                <!-- Restaurant Portal Icon -->
                <svg class="space-text" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z"/>
                  <line x1="6" x2="18" y1="17" y2="17"/>
                </svg>
              </div>
              <h2 class="h2 fw-bold space-text space-font-primary">Welcome Back, Chef!</h2>
              <p class="space-text-muted mt-2 space-font-secondary">
                👨‍🍳 Access your cosmic restaurant portal
              </p>
            </div>

            <!-- Form -->
            <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-4">
              
              <!-- Email Field -->
              <div class="mb-3">
                <label class="form-label fw-bold space-text-muted space-font-secondary">
                  📧 Restaurant Email Address
                </label>
                <div class="position-relative cosmic-input-group">
                  <!-- Mail Icon -->
                  <svg class="cosmic-input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                  <input
                    type="email"
                    formControlName="email"
                    class="form-control-cosmic"
                    placeholder="Enter your restaurant email"
                    [disabled]="loading"
                  />
                </div>
                <div *ngIf="loginForm.get('email')?.touched && loginForm.get('email')?.errors?.['required']" class="text-danger small mt-1 fw-bold">
                  📧 Email is required for restaurant access
                </div>
                <div *ngIf="loginForm.get('email')?.touched && loginForm.get('email')?.errors?.['email']" class="text-danger small mt-1 fw-bold">
                  📧 Please enter a valid restaurant email
                </div>
              </div>

              <!-- Password Field -->
              <div class="mb-3">
                <label class="form-label fw-bold space-text-muted space-font-secondary">
                  🔐 Restaurant Security Code
                </label>
                <div class="position-relative cosmic-input-group">
                  <!-- Lock Icon -->
                  <svg class="cosmic-input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  <input
                    type="password"
                    formControlName="password"
                    class="form-control-cosmic"
                    placeholder="Enter your security code"
                    [disabled]="loading"
                  />
                </div>
                <div *ngIf="loginForm.get('password')?.touched && loginForm.get('password')?.errors?.['required']" class="text-danger small mt-1 fw-bold">
                  🔐 Security code is required
                </div>
              </div>

              <!-- Error Alert -->
              <div *ngIf="error" class="cosmic-alert cosmic-alert-danger text-center" role="alert">
                ⚠️ {{ error }}
              </div>

              <!-- Loading State -->
              <div *ngIf="loading" class="text-center py-3">
                <div class="cosmic-loader">
                  <div class="cosmic-spinner restaurant-spinner"></div>
                  <div class="cosmic-ring ring-1 restaurant-ring"></div>
                  <div class="cosmic-ring ring-2 restaurant-ring"></div>
                </div>
                <div class="mt-3">
                  <p class="space-text-muted space-font-secondary fw-bold">🏪 Connecting to restaurant portal...</p>
                </div>
              </div>

              <!-- Login Button -->
              <button
                type="submit"
                class="btn-cosmic-secondary w-100 fw-bold"
                [disabled]="loading || loginForm.invalid"
              >
                <span *ngIf="!loading">🏪 Launch Restaurant Portal</span>
                <span *ngIf="loading">⚡ Connecting...</span>
              </button>
            </form>

            <!-- Footer -->
            <div class="mt-4 text-center">
              <p class="space-text-muted space-font-secondary fw-bold">
                New restaurant partner? 
                <a routerLink="/restaurant/register" class="cosmic-link fw-bold">
                  ⭐ Join our cosmic fleet
                </a>
              </p>
              
              <!-- Cosmic Features -->
              <div class="cosmic-features-mini mt-4 pt-3" style="border-top: 1px solid rgba(255,255,255,0.1);">
                <div class="d-flex justify-content-center gap-4 text-center">
                  <div class="cosmic-mini-feature">
                    <div class="feature-emoji">🌌</div>
                    <div class="small space-text-dim fw-bold">Galaxy Reach</div>
                  </div>
                  <div class="cosmic-mini-feature">
                    <div class="feature-emoji">💫</div>
                    <div class="small space-text-dim fw-bold">Zero Fees</div>
                  </div>
                  <div class="cosmic-mini-feature">
                    <div class="feature-emoji">📊</div>
                    <div class="small space-text-dim fw-bold">Analytics</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* Restaurant Theme Variations */
    .restaurant-theme .cosmic-icon {
      border-color: rgba(67, 233, 123, 0.3);
      background: rgba(67, 233, 123, 0.1);
    }
    
    .restaurant-spinner {
      border-top-color: rgba(67, 233, 123, 0.8) !important;
    }
    
    .restaurant-ring {
      border-color: rgba(67, 233, 123, 0.2) !important;
    }
    
    /* Login Card Animation */
    .cosmic-login-card {
      animation: cosmic-entrance 0.8s ease-out forwards;
      opacity: 0;
      transform: translateY(30px) scale(0.95);
    }
    
    @keyframes cosmic-entrance {
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }
    
    /* Cosmic Input Groups - Fixed centering */
    .cosmic-input-group {
      position: relative;
      width: 100%;
    }
    
    .cosmic-input-icon {
      position: absolute;
      left: 16px;
      top: 50%;
      transform: translateY(-50%);
      z-index: 5;
      color: rgba(255, 255, 255, 0.6);
      transition: all 0.3s ease;
    }
    
    .form-control-cosmic:focus ~ .cosmic-input-icon {
      color: rgba(255, 255, 255, 0.9);
      transform: translateY(-50%) scale(1.1);
    }
    
    /* Cosmic Alerts */
    .cosmic-alert {
      background: rgba(255, 255, 255, 0.08);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 12px;
      padding: 0.75rem 1rem;
      margin: 1rem 0;
    }
    
    .cosmic-alert-danger {
      background: rgba(239, 68, 68, 0.15);
      border-color: rgba(239, 68, 68, 0.3);
      color: rgba(255, 255, 255, 0.9);
    }
    
    /* Cosmic Loader */
    .cosmic-loader {
      position: relative;
      width: 60px;
      height: 60px;
      margin: 0 auto;
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
    
    /* Mini Features */
    .cosmic-mini-feature {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.25rem;
      transition: all 0.3s ease;
    }
    
    .cosmic-mini-feature:hover {
      transform: translateY(-2px);
    }
    
    .cosmic-mini-feature .feature-emoji {
      font-size: 1.2rem;
      filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
    }
    
    /* Responsive Design */
    @media (max-width: 768px) {
      .cosmic-login-card {
        margin: 1rem;
      }
      
      .cosmic-mini-feature {
        gap: 0.15rem;
      }
      
      .cosmic-mini-feature .feature-emoji {
        font-size: 1rem;
      }
    }
  `]
})
export class RestaurantLoginComponent {
  loginForm: FormGroup;
  loading = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.loading = true;
    this.error = '';

    const loginRequest: LoginRequest = this.loginForm.value;

    this.authService.restaurantLogin(loginRequest).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/restaurant/dashboard']);
      },
      error: (error) => {
        this.loading = false;
        this.error = error.error?.message || 'Login failed. Please try again.';
      }
    });
  }
} 