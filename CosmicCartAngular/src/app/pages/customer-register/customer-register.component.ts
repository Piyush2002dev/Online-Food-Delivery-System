import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-customer-register',
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
          <div class="glass-card p-3 cosmic-login-card">
            
          <!-- Header -->
            <div class="text-center mb-3">
              <div class="cosmic-icon mx-auto mb-3">
                <div class="portal-ring"></div>
                <svg class="space-text" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="m22 21-3-3 3-3"/>
                  <path d="M16 8h-1.5a2.5 2.5 0 1 0 0 5H16"/>
                </svg>
              </div>
              <h2 class="h2 fw-bold space-text">Join the Cosmic Community!</h2>
              <p class="space-text-muted mt-2">
                ✨ Create your space traveler account
              </p>
            </div>

            <!-- Form -->
            <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
              
              <!-- Name Field -->
              <div class="mb-2">
                <label class="form-label fw-medium space-text-muted small">
                  🚀 Space Traveler Name
              </label>
                <div class="position-relative cosmic-input-group">
                  <input formControlName="name" class="form-control-cosmic" placeholder="Enter your name" [disabled]="loading">
                  <div class="cosmic-input-glow"></div>
                </div>
              </div>

              <!-- Email Field -->
              <div class="mb-2">
                <label class="form-label fw-medium space-text-muted small">
                  📧 Galactic Email Address
                </label>
                <div class="position-relative cosmic-input-group">
                  <input formControlName="email" class="form-control-cosmic" placeholder="Enter your email" [disabled]="loading">
                  <div class="cosmic-input-glow"></div>
              </div>
            </div>

              <!-- Phone Field -->
              <div class="mb-2">
                <label class="form-label fw-medium space-text-muted small">
                  📱 Communication Device
              </label>
                <div class="position-relative cosmic-input-group">
                  <input formControlName="phone" class="form-control-cosmic" placeholder="Enter your phone number" [disabled]="loading">
                  <div class="cosmic-input-glow"></div>
              </div>
              </div>

              <!-- Address Field -->
              <div class="mb-2">
                <label class="form-label fw-medium space-text-muted small">
                  🏠 Space Station Address
                </label>
                <div class="position-relative cosmic-input-group">
                  <input formControlName="address" class="form-control-cosmic" placeholder="Enter your address" [disabled]="loading">
                  <div class="cosmic-input-glow"></div>
              </div>
            </div>

              <!-- Password Field -->
            <div class="mb-3">
                <label class="form-label fw-medium space-text-muted small">
                  🔐 Cosmic Security Code
              </label>
                <div class="position-relative cosmic-input-group">
                  <input type="password" formControlName="password" class="form-control-cosmic" placeholder="Create a secure password" [disabled]="loading">
                  <div class="cosmic-input-glow"></div>
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
                  <div class="cosmic-spinner"></div>
                  <div class="cosmic-ring ring-1"></div>
                  <div class="cosmic-ring ring-2"></div>
            </div>
                <div class="mt-3">
                  <p class="space-text-muted">🚀 Creating your cosmic account...</p>
              </div>
            </div>

              <!-- Register Button -->
              <button type="submit" class="btn-cosmic-primary w-100 fw-semibold" [disabled]="loading || registerForm.invalid">
                <span *ngIf="!loading">✨ Join the Galaxy</span>
                <span *ngIf="loading">⚡ Processing...</span>
            </button>
          </form>

          <!-- Footer -->
          <div class="mt-4 text-center">
              <p class="space-text-muted">
                Already a space traveler? 
                <a routerLink="/customer/login" class="cosmic-link fw-semibold">
                  🚀 Launch into portal
              </a>
            </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
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
  `]
})
export class CustomerRegisterComponent {
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
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.registerForm.invalid) return;

      this.loading = true;
    this.error = '';
    this.success = '';

    this.authService.customerRegister(this.registerForm.value).subscribe({
      next: () => {
          this.loading = false;
        this.success = 'Registration successful! Redirecting to login...';
        setTimeout(() => {
          this.router.navigate(['/customer/login']);
        }, 2000);
        },
        error: (error) => {
        this.loading = false;
          this.error = error.error?.message || 'Registration failed. Please try again.';
        }
      });
  }
} 