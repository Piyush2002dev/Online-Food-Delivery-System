import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-restaurant-register',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <!-- Cosmic Space Background -->
    <div class="space-background">
      <div class="single-card-optimized">
        <div class="card-container">
          
          <!-- Back Button -->
          <a routerLink="/" class="cosmic-link d-inline-flex align-items-center mb-4 text-decoration-none">
            <svg class="me-2" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="m12 19-7-7 7-7"/>
              <path d="M19 12H5"/>
            </svg>
            <span class="space-text-muted">Back to Cosmic Home</span>
          </a>

          <!-- Register Card -->
          <div class="glass-card p-4 cosmic-login-card restaurant-theme">
            
            <!-- Header -->
            <div class="text-center mb-4">
              <div class="cosmic-icon mx-auto mb-3">
                <div class="portal-ring restaurant-portal"></div>
                <svg class="space-text" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z"/>
                  <line x1="6" x2="18" y1="17" y2="17"/>
                </svg>
              </div>
              <h2 class="h2 fw-bold space-text">Join the Cosmic Fleet!</h2>
              <p class="space-text-muted mt-2">
                👨‍🍳 Register your cosmic restaurant
              </p>
            </div>

            <!-- Form -->
            <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
              
              <!-- Restaurant Name Field -->
              <div class="mb-3">
                <label class="form-label fw-medium space-text-muted">
                  🏪 Restaurant Name
                </label>
                <div class="position-relative cosmic-input-group">
                  <svg class="cosmic-input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z"/>
                    <line x1="6" x2="18" y1="17" y2="17"/>
                  </svg>
                  <input formControlName="name" class="form-control-cosmic" placeholder="Enter restaurant name" [disabled]="loading">
                  <div class="cosmic-input-glow restaurant-glow"></div>
                </div>
              </div>

              <!-- Location Field -->
              <div class="mb-3">
                <label class="form-label fw-medium space-text-muted">
                  🌍 Galactic Location
                </label>
                <div class="position-relative cosmic-input-group">
                  <svg class="cosmic-input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                  <input formControlName="location" class="form-control-cosmic" placeholder="Enter restaurant location" [disabled]="loading">
                  <div class="cosmic-input-glow restaurant-glow"></div>
                </div>
              </div>

              <!-- Email Field -->
              <div class="mb-3">
                <label class="form-label fw-medium space-text-muted">
                  📧 Restaurant Email
                </label>
                <div class="position-relative cosmic-input-group">
                  <svg class="cosmic-input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                  <input formControlName="email" class="form-control-cosmic" placeholder="Enter business email" [disabled]="loading">
                  <div class="cosmic-input-glow restaurant-glow"></div>
                </div>
              </div>

              <!-- Password Field -->
              <div class="mb-3">
                <label class="form-label fw-medium space-text-muted">
                  🔐 Cosmic Security Code
                </label>
                <div class="position-relative cosmic-input-group">
                  <svg class="cosmic-input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  <input type="password" formControlName="password" class="form-control-cosmic" placeholder="Create a secure password" [disabled]="loading">
                  <div class="cosmic-input-glow restaurant-glow"></div>
                </div>
              </div>

              <!-- Error Alert -->
              <div *ngIf="error" class="cosmic-alert cosmic-alert-danger text-center">
                ⚠️ {{ error }}
              </div>

              <!-- Success Alert -->
              <div *ngIf="success" class="cosmic-alert cosmic-alert-success text-center">
                ✅ {{ success }}
              </div>

              <!-- Loading State -->
              <div *ngIf="loading" class="text-center py-3">
                <div class="cosmic-loader">
                  <div class="cosmic-spinner restaurant-spinner"></div>
                  <div class="cosmic-ring ring-1 restaurant-ring"></div>
                  <div class="cosmic-ring ring-2 restaurant-ring"></div>
                </div>
                <div class="mt-3">
                  <p class="space-text-muted">🏪 Registering your cosmic restaurant...</p>
                </div>
              </div>

              <!-- Register Button -->
              <button type="submit" class="btn-cosmic-secondary w-100 fw-semibold" [disabled]="loading || registerForm.invalid">
                <span *ngIf="!loading">⭐ Join the Fleet</span>
                <span *ngIf="loading">⚡ Processing...</span>
              </button>
            </form>

            <!-- Footer -->
            <div class="mt-4 text-center">
              <p class="space-text-muted">
                Already part of the fleet? 
                <a routerLink="/restaurant/login" class="cosmic-link fw-semibold">
                  🏪 Launch restaurant portal
                </a>
              </p>
              
              <!-- Cosmic Benefits -->
              <div class="cosmic-features-mini mt-4 pt-3" style="border-top: 1px solid rgba(255,255,255,0.1);">
                <div class="d-flex justify-content-center gap-4 text-center">
                  <div class="cosmic-mini-feature">
                    <div class="feature-emoji">🌌</div>
                    <div class="small space-text-dim">Galaxy Reach</div>
                  </div>
                  <div class="cosmic-mini-feature">
                    <div class="feature-emoji">💫</div>
                    <div class="small space-text-dim">Zero Setup</div>
                  </div>
                  <div class="cosmic-mini-feature">
                    <div class="feature-emoji">🚀</div>
                    <div class="small space-text-dim">Easy Start</div>
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
    .restaurant-theme .portal-ring.restaurant-portal {
      border-color: rgba(67, 233, 123, 0.3);
    }
    
    .restaurant-theme .portal-ring.restaurant-portal::before {
      border-top-color: rgba(67, 233, 123, 0.8);
    }
    
    .restaurant-glow {
      background: linear-gradient(45deg, rgba(67, 233, 123, 0.2), rgba(56, 249, 215, 0.2));
    }
    
    .restaurant-spinner {
      border-top-color: rgba(67, 233, 123, 0.8) !important;
    }
    
    .restaurant-ring {
      border-color: rgba(67, 233, 123, 0.2) !important;
    }

    /* Cosmic alert success */
    .cosmic-alert-success {
      background: rgba(34, 197, 94, 0.15);
      border-color: rgba(34, 197, 94, 0.3);
      color: rgba(255, 255, 255, 0.9);
    }

    /* All other styles inherited from global cosmic theme */
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
    
    .portal-ring {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 100px;
      height: 100px;
      border: 2px solid rgba(102, 126, 234, 0.3);
      border-radius: 50%;
      animation: portal-spin 6s linear infinite;
    }
    
    @keyframes portal-spin {
      0% { transform: translate(-50%, -50%) rotate(0deg); }
      100% { transform: translate(-50%, -50%) rotate(360deg); }
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
  `]
})
export class RestaurantRegisterComponent {
  registerForm: FormGroup;
  loading = false;
  error = '';
  success = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      location: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.registerForm.invalid) return;

    this.loading = true;
    this.error = '';
    this.success = '';

    this.authService.restaurantRegister(this.registerForm.value).subscribe({
      next: () => {
        this.loading = false;
        this.success = 'Registration successful! Redirecting to login...';
        setTimeout(() => {
          this.router.navigate(['/restaurant/login']);
        }, 2000);
      },
      error: (error) => {
        this.loading = false;
        this.error = error.error?.message || 'Registration failed. Please try again.';
      }
    });
  }
} 