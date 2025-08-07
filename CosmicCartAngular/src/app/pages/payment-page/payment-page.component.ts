import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { OrderService } from '../../services/order.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { CosmicNotificationService } from '../../services/cosmic-notification.service';
import { CosmicNotificationComponent } from '../../components/cosmic-notification.component';
@Component({
  selector: 'app-payment-page',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, CosmicNotificationComponent],
  template: `
    <div class="cosmic-payment-background">
      <!-- Cosmic Notification -->
      <app-cosmic-notification></app-cosmic-notification>

      <header class="cosmic-payment-header py-4">
        <div class="container d-flex align-items-center">
          <a routerLink="/cart" class="cosmic-back-btn me-3">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>
            </svg>
          </a>
          <h1 class="h2 fw-bold space-text space-font-primary mb-0">🚀 Complete Your Cosmic Order</h1>
        </div>
      </header>
      
      <div class="container py-5" style="padding-top: 8rem !important;">
        <div class="row g-5">
          <div class="col-lg-8">
            <div class="glass-card p-5 cosmic-payment-form">
              <div class="text-center mb-4">
                <div class="cosmic-payment-icon mb-3">
                  💳
                </div>
                <h2 class="h3 fw-bold space-text space-font-primary mb-2">🚀 Cosmic Payment Gateway</h2>
                <p class="space-text-muted space-font-secondary fw-bold">Secure intergalactic transaction processing</p>
              </div>

              <form [formGroup]="paymentForm" (ngSubmit)="onSubmit()" class="cosmic-form">
                <!-- Payment Method Selection -->
                <div class="cosmic-input-group mb-4">
                  <label class="cosmic-label">💰 Payment Method</label>
                  <div class="cosmic-payment-options">
                    <div class="cosmic-payment-option" 
                         [class.active]="selectedPaymentMethod === 'card'"
                         (click)="selectPaymentMethod('card')">
                      <div class="payment-option-icon">💳</div>
                      <div class="payment-option-content">
                        <div class="payment-option-title">Credit/Debit Card</div>
                        <div class="payment-option-desc">Secure online payment</div>
                      </div>
                    </div>
                    <div class="cosmic-payment-option" 
                         [class.active]="selectedPaymentMethod === 'cod'"
                         (click)="selectPaymentMethod('cod')">
                      <div class="payment-option-icon">💵</div>
                      <div class="payment-option-content">
                        <div class="payment-option-title">Cash on Delivery</div>
                        <div class="payment-option-desc">Pay when order arrives</div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Card Payment Fields (only show if card is selected) -->
                <div *ngIf="selectedPaymentMethod === 'card'">
                <div class="cosmic-input-group mb-4">
                  <label class="cosmic-label">💳 Card Number</label>
                  <input 
                    formControlName="cardNumber" 
                    class="form-control-cosmic" 
                    placeholder="1234 5678 9012 3456" 
                    [disabled]="loading"
                    maxlength="19">
                </div>

                <div class="row g-3">
                  <div class="col-6">
                    <div class="cosmic-input-group">
                      <label class="cosmic-label">📅 Expiry Date</label>
                      <input 
                        formControlName="expiryDate" 
                        class="form-control-cosmic" 
                        placeholder="MM/YY" 
                        [disabled]="loading"
                        maxlength="5">
                    </div>
                  </div>
                  <div class="col-6">
                    <div class="cosmic-input-group">
                      <label class="cosmic-label">🔒 CVV</label>
                      <input 
                        formControlName="cvv" 
                        class="form-control-cosmic" 
                        placeholder="123" 
                        [disabled]="loading"
                        maxlength="4">
                    </div>
                  </div>
                </div>

                <div class="cosmic-input-group mb-4">
                  <label class="cosmic-label">👤 Cardholder Name 
                    <span *ngIf="paymentForm.get('cardholderName')?.value" class="prefill-indicator">🌟 Pre-filled</span>
                  </label>
                  <input 
                    formControlName="cardholderName" 
                    class="form-control-cosmic" 
                    [class.prefilled]="paymentForm.get('cardholderName')?.value"
                    placeholder="Space Traveler" 
                    [disabled]="loading">
                </div>

                <div class="cosmic-input-group mb-4">
                  <label class="cosmic-label">🏠 Billing Address 
                    <span *ngIf="paymentForm.get('billingAddress')?.value" class="prefill-indicator">🌟 Pre-filled</span>
                  </label>
                  <textarea 
                    formControlName="billingAddress" 
                    class="form-control-cosmic cosmic-textarea" 
                    [class.prefilled]="paymentForm.get('billingAddress')?.value"
                    placeholder="Galaxy Sector 7, Planet Earth" 
                    [disabled]="loading"
                    rows="3"></textarea>
                </div>
                </div>

                <!-- COD-specific Fields (only show if COD is selected) -->
                <div *ngIf="selectedPaymentMethod === 'cod'">
                  <div class="cosmic-cod-info mb-4">
                    <div class="cod-info-header">
                      <div class="cod-info-icon">💵</div>
                      <div>
                        <h4 class="fw-bold space-text space-font-primary mb-1">Cash on Delivery</h4>
                        <p class="space-text-muted small fw-bold mb-0">Pay securely when your order arrives</p>
                      </div>
                    </div>
                    <div class="cod-features">
                      <div class="cod-feature">
                        <span class="feature-icon">✅</span>
                        <span>No online payment required</span>
                      </div>
                      <div class="cod-feature">
                        <span class="feature-icon">🚚</span>
                        <span>Pay directly to delivery agent</span>
                      </div>
                      <div class="cod-feature">
                        <span class="feature-icon">💰</span>
                        <span>Exact amount preferred</span>
                      </div>
                    </div>
                  </div>

                  <div class="cosmic-input-group mb-4">
                    <label class="cosmic-label">👤 Full Name 
                      <span *ngIf="paymentForm.get('codFullName')?.value" class="prefill-indicator">🌟 Pre-filled</span>
                    </label>
                    <input 
                      formControlName="codFullName" 
                      class="form-control-cosmic" 
                      [class.prefilled]="paymentForm.get('codFullName')?.value"
                      placeholder="Your full name for delivery verification" 
                      [disabled]="loading">
                  </div>

                  <div class="cosmic-input-group mb-4">
                    <label class="cosmic-label">📱 Contact Number 
                      <span *ngIf="paymentForm.get('codContactNumber')?.value" class="prefill-indicator">🌟 Pre-filled</span>
                    </label>
                    <input 
                      formControlName="codContactNumber" 
                      class="form-control-cosmic" 
                      [class.prefilled]="paymentForm.get('codContactNumber')?.value"
                      placeholder="Your contact number for delivery coordination" 
                      [disabled]="loading">
                  </div>
                </div>

                <div class="cosmic-input-group mb-4">
                  <label class="cosmic-label">🚀 Delivery Address 
                    <span *ngIf="paymentForm.get('deliveryAddress')?.value" class="prefill-indicator">🌟 Pre-filled</span>
                  </label>
                  <textarea 
                    formControlName="deliveryAddress" 
                    class="form-control-cosmic cosmic-textarea" 
                    [class.prefilled]="paymentForm.get('deliveryAddress')?.value"
                    placeholder="Your cosmic coordinates for delivery" 
                    [disabled]="loading"
                    rows="3"></textarea>
                </div>

                <div *ngIf="error" class="cosmic-error-alert mb-4">
                  <div class="error-icon">⚠️</div>
                  <div class="error-message">{{ error }}</div>
                </div>

                <button 
                  *ngIf="selectedPaymentMethod"
                  type="submit" 
                  class="btn-cosmic-primary w-100 fw-bold cosmic-place-order" 
                  [disabled]="loading || paymentForm.invalid">
                  <svg *ngIf="loading" class="me-2 cosmic-spinner" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                  </svg>
                  <span *ngIf="!loading">
                    {{ selectedPaymentMethod === 'cod' ? '🚚 Place COD Order' : '💳 Pay & Place Order' }} - ₹{{ getTotal() }}
                  </span>
                  <span *ngIf="loading">
                    {{ selectedPaymentMethod === 'cod' ? '🚚 Placing COD Order...' : '💳 Processing Payment...' }}
                  </span>
                </button>
                
                <!-- Payment Method Selection Prompt -->
                <div *ngIf="!selectedPaymentMethod" class="cosmic-selection-prompt text-center py-4">
                  <div class="selection-icon mb-3">✨</div>
                  <h4 class="space-text space-font-primary mb-2">Choose Your Payment Method</h4>
                  <p class="space-text-muted">Select Card Payment or Cash on Delivery to continue</p>
                </div>
              </form>
            </div>
          </div>

          <div class="col-lg-4">
            <div class="glass-card p-4 cosmic-order-summary position-sticky" style="top: 8rem;">
              <div class="text-center mb-4">
                <div class="cosmic-summary-icon mb-2">📋</div>
                <h3 class="h5 fw-bold space-text space-font-primary">Order Summary</h3>
                <p class="small space-text-muted fw-bold">Your cosmic feast breakdown</p>
              </div>

              <div class="cosmic-summary-details">
                <div class="summary-row d-flex justify-content-between mb-3">
                  <span class="space-text-muted fw-bold">🍽️ Subtotal:</span>
                  <span class="space-text fw-bold">₹{{ getSubtotal() }}</span>
                </div>
                <div class="summary-row d-flex justify-content-between mb-3">
                  <span class="space-text-muted fw-bold">🚀 Delivery Fee:</span>
                  <span class="space-text fw-bold">₹30</span>
                </div>
                <div class="summary-row d-flex justify-content-between mb-3">
                  <span class="space-text-muted fw-bold">💫 Service Fee:</span>
                  <span class="space-text fw-bold">₹10</span>
                </div>
                <div class="summary-row d-flex justify-content-between mb-3">
                  <span class="space-text-muted fw-bold">🏛️ Taxes (5%):</span>
                  <span class="space-text fw-bold">₹{{ Math.round(getSubtotal() * 0.05) }}</span>
                </div>
                <hr class="cosmic-divider">
                <div class="summary-row d-flex justify-content-between mb-4">
                  <span class="h5 fw-bold space-text space-font-primary">💰 Total Amount:</span>
                  <span class="h4 fw-bold cosmic-text-gradient">₹{{ getTotal() }}</span>
                </div>
              </div>

              <div class="cosmic-security-badge text-center">
                <div class="security-icon mb-2">🛡️</div>
                <p class="small space-text-muted fw-bold">
                  🔐 256-bit Cosmic Encryption<br>
                  ✨ Secured by Galactic Standards
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* Cosmic Payment Background */
    .cosmic-payment-background {
      min-height: 100vh;
      background: linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 25%, #16213e 50%, #0f3460 75%, #0c0c0c 100%);
      background-attachment: fixed;
      position: relative;
      overflow-x: hidden;
    }

    .cosmic-payment-background::before {
      content: '';
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-image: 
        radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
        radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.2) 0%, transparent 50%);
      pointer-events: none;
      z-index: 1;
    }

    .cosmic-payment-background > * {
      position: relative;
      z-index: 2;
    }

    /* Cosmic Payment Header */
    .cosmic-payment-header {
      background: rgba(255, 255, 255, 0.08);
      backdrop-filter: blur(20px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.2);
      position: relative;
      z-index: 10;
    }

    .cosmic-back-btn {
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: rgba(255, 255, 255, 0.8);
      text-decoration: none;
      transition: all 0.3s ease;
    }

    .cosmic-back-btn:hover {
      background: rgba(255, 255, 255, 0.2);
      color: rgba(255, 255, 255, 1);
      transform: translateX(-3px);
    }

    /* Cosmic Payment Form */
    .cosmic-payment-form {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 20px;
      position: relative;
      overflow: hidden;
    }

    .cosmic-payment-icon {
      font-size: 3rem;
      filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3));
      animation: payment-float 3s ease-in-out infinite;
    }

    @keyframes payment-float {
      0%, 100% { transform: translateY(0) rotate(-2deg); }
      50% { transform: translateY(-5px) rotate(2deg); }
    }

    .cosmic-input-group {
      position: relative;
    }

    .cosmic-label {
      display: block;
      font-weight: 700;
      font-family: 'Exo 2', sans-serif;
      color: rgba(255, 255, 255, 0.9);
      margin-bottom: 0.5rem;
      font-size: 0.9rem;
    }

    .prefill-indicator {
      display: inline-block;
      background: rgba(34, 197, 94, 0.2);
      border: 1px solid rgba(34, 197, 94, 0.4);
      border-radius: 12px;
      padding: 0.2rem 0.5rem;
      font-size: 0.7rem;
      font-weight: 600;
      color: rgba(34, 197, 94, 1);
      margin-left: 0.5rem;
      animation: prefill-glow 2s ease-in-out infinite alternate;
    }

    @keyframes prefill-glow {
      0% { 
        background: rgba(34, 197, 94, 0.2);
        border-color: rgba(34, 197, 94, 0.4);
      }
      100% { 
        background: rgba(34, 197, 94, 0.3);
        border-color: rgba(34, 197, 94, 0.6);
      }
    }

    .form-control-cosmic.prefilled {
      border-color: rgba(34, 197, 94, 0.5) !important;
      background: rgba(34, 197, 94, 0.05) !important;
      box-shadow: 0 0 0 2px rgba(34, 197, 94, 0.1) !important;
    }

    .cosmic-textarea.prefilled {
      border-color: rgba(34, 197, 94, 0.5) !important;
      background: rgba(34, 197, 94, 0.05) !important;
      box-shadow: 0 0 0 2px rgba(34, 197, 94, 0.1) !important;
    }

    .cosmic-textarea {
      resize: vertical;
      min-height: 80px;
    }

    .cosmic-error-alert {
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.3);
      border-radius: 12px;
      padding: 1rem;
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .error-icon {
      font-size: 1.5rem;
      flex-shrink: 0;
    }

    .error-message {
      color: rgba(255, 255, 255, 0.9);
      font-weight: 600;
      font-family: 'Exo 2', sans-serif;
    }

    .cosmic-place-order {
      position: relative;
      overflow: hidden;
      animation: order-glow 2s ease-in-out infinite alternate;
    }

    @keyframes order-glow {
      0% { box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3); }
      100% { box-shadow: 0 8px 25px rgba(102, 126, 234, 0.5); }
    }

    .cosmic-spinner {
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    /* Order Summary */
    .cosmic-order-summary {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 20px;
    }

    .cosmic-summary-icon {
      font-size: 2rem;
      filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
      animation: summary-pulse 2s ease-in-out infinite;
    }

    @keyframes summary-pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.1); }
    }

    .cosmic-summary-details {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      padding: 1.5rem;
      margin-bottom: 1.5rem;
    }

    .summary-row {
      font-size: 0.95rem;
      transition: all 0.3s ease;
    }

    .summary-row:hover {
      background: rgba(255, 255, 255, 0.05);
      border-radius: 8px;
      padding: 0.5rem;
      margin: -0.5rem;
    }

    .cosmic-divider {
      border: none;
      height: 1px;
      background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%);
      margin: 1.5rem 0;
    }

    .cosmic-security-badge {
      background: rgba(34, 197, 94, 0.1);
      border: 1px solid rgba(34, 197, 94, 0.3);
      border-radius: 12px;
      padding: 1rem;
    }

    .security-icon {
      font-size: 1.5rem;
      filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
    }

    /* Payment Method Options */
    .cosmic-payment-options {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    .cosmic-payment-option {
      background: rgba(255, 255, 255, 0.05);
      border: 2px solid rgba(255, 255, 255, 0.2);
      border-radius: 12px;
      padding: 1rem;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .cosmic-payment-option:hover {
      background: rgba(255, 255, 255, 0.08);
      border-color: rgba(102, 126, 234, 0.4);
      transform: translateY(-2px);
    }

    .cosmic-payment-option.active {
      background: rgba(102, 126, 234, 0.15);
      border-color: rgba(102, 126, 234, 0.6);
      box-shadow: 0 0 20px rgba(102, 126, 234, 0.3);
    }

    .payment-option-icon {
      font-size: 1.5rem;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      flex-shrink: 0;
    }

    .payment-option-content {
      flex: 1;
    }

    .payment-option-title {
      font-weight: 600;
      color: rgba(255, 255, 255, 0.9);
      font-family: 'Exo 2', sans-serif;
      margin-bottom: 0.25rem;
    }

    .payment-option-desc {
      font-size: 0.8rem;
      color: rgba(255, 255, 255, 0.6);
      font-family: 'Exo 2', sans-serif;
    }

    /* COD Info Section */
    .cosmic-cod-info {
      background: rgba(34, 197, 94, 0.1);
      border: 1px solid rgba(34, 197, 94, 0.3);
      border-radius: 12px;
      padding: 1.5rem;
    }

    .cod-info-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .cod-info-icon {
      font-size: 2rem;
      width: 50px;
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(34, 197, 94, 0.2);
      border-radius: 50%;
      flex-shrink: 0;
    }

    .cod-features {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .cod-feature {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: rgba(255, 255, 255, 0.8);
      font-size: 0.9rem;
      font-weight: 500;
    }

    .feature-icon {
      width: 20px;
      font-size: 0.9rem;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .cosmic-payment-icon {
        font-size: 2rem;
      }
      
      .cosmic-summary-icon {
        font-size: 1.5rem;
      }

      .cosmic-payment-options {
        grid-template-columns: 1fr;
      }

      .cosmic-payment-option {
        padding: 0.75rem;
      }

      .payment-option-icon {
        width: 35px;
        height: 35px;
        font-size: 1.2rem;
      }
    }

    /* Payment Selection Prompt */
    .cosmic-selection-prompt {
      background: rgba(255, 255, 255, 0.05);
      border: 2px dashed rgba(255, 255, 255, 0.2);
      border-radius: 16px;
      padding: 2rem;
      margin: 2rem 0;
      transition: all 0.3s ease;
    }

    .cosmic-selection-prompt:hover {
      background: rgba(255, 255, 255, 0.08);
      border-color: rgba(255, 255, 255, 0.3);
    }

    .selection-icon {
      font-size: 3rem;
      animation: selection-float 2s ease-in-out infinite;
    }

    @keyframes selection-float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
    }
  `]
})
export class PaymentPageComponent implements OnInit {
  paymentForm: FormGroup;
  loading = false;
  error: string | null = null;
  selectedPaymentMethod: 'card' | 'cod' | null = null;
  
  // Make Math available in template
  Math = Math;

  constructor(
    private fb: FormBuilder,
    private orderService: OrderService,
    private cartService: CartService,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
    public cosmicNotificationService: CosmicNotificationService
  ) {
    this.paymentForm = this.fb.group({
      // Card fields
      cardNumber: [''],
      expiryDate: [''],
      cvv: [''],
      cardholderName: [''],
      billingAddress: [''],
      // COD fields
      codFullName: [''],
      codContactNumber: [''],
      // Common fields
      deliveryAddress: ['', Validators.required]
    });
    
    // Update validators based on payment method
    this.updateFormValidators();
  }

  ngOnInit(): void {
    // Check if cart has items on page load
    const cartItems = this.cartService.getCartItems();
    if (cartItems.length === 0) {
      // Removed annoying notification - just redirect
      setTimeout(() => {
        this.router.navigate(['/main']);
      }, 2000);
    }
  }

  selectPaymentMethod(method: 'card' | 'cod'): void {
    this.selectedPaymentMethod = method;
    this.updateFormValidators();
    
    // Pre-fill user details when payment method is selected
    this.prefillUserDetails();
    
    // Removed notifications to prevent empty popup issues
  }

  private updateFormValidators(): void {
    // Clear all validators first
    const controls = this.paymentForm.controls;
    Object.keys(controls).forEach(key => {
      if (key !== 'deliveryAddress') {
        controls[key].clearValidators();
      }
    });

    // Add validators based on selected payment method
    if (this.selectedPaymentMethod === 'card') {
      controls['cardNumber'].setValidators([Validators.required]);
      controls['expiryDate'].setValidators([Validators.required]);
      controls['cvv'].setValidators([Validators.required]);
      controls['cardholderName'].setValidators([Validators.required]);
      controls['billingAddress'].setValidators([Validators.required]);
    } else if (this.selectedPaymentMethod === 'cod') {
      controls['codFullName'].setValidators([Validators.required]);
      controls['codContactNumber'].setValidators([Validators.required, Validators.pattern(/^[0-9]{10}$/)]);
    }

    // Update validation status
    Object.keys(controls).forEach(key => {
      controls[key].updateValueAndValidity();
    });
  }

  private prefillUserDetails(): void {
    // Get current user from auth service with proper subscription handling
    const userSubscription = this.authService.user$.subscribe(user => {
      if (user) {
        console.log('🔧 Pre-filling user details:', user);
        this.fillFormWithUserData(user);
      } else {
        // If user data is not available, try to fetch it
        console.log('👤 User data not available, fetching from server...');
        this.authService.fetchUserProfile().subscribe({
          next: (fetchedUser) => {
            console.log('✅ User data fetched, pre-filling form:', fetchedUser);
            this.fillFormWithUserData(fetchedUser);
          },
          error: (error) => {
            console.warn('⚠️ Could not fetch user details for pre-filling:', error);
          }
        });
      }
    });
    
    // Unsubscribe after first emission to avoid memory leaks
    setTimeout(() => userSubscription.unsubscribe(), 100);
  }

  private fillFormWithUserData(user: any): void {
    const formUpdates: any = {};
    let hasUpdates = false;

    if (this.selectedPaymentMethod === 'cod') {
      // Pre-fill COD specific fields
      if (user.name && !this.paymentForm.get('codFullName')?.value) {
        formUpdates.codFullName = user.name;
        hasUpdates = true;
      }
      
      if (user.phone && !this.paymentForm.get('codContactNumber')?.value) {
        // Convert phone to string and clean any non-numeric characters
        const cleanPhone = user.phone.toString().replace(/\D/g, '');
        if (cleanPhone.length >= 10) {
          formUpdates.codContactNumber = cleanPhone.slice(-10); // Take last 10 digits
          hasUpdates = true;
        }
      }
    } else if (this.selectedPaymentMethod === 'card') {
      // Pre-fill card specific fields
      if (user.name && !this.paymentForm.get('cardholderName')?.value) {
        formUpdates.cardholderName = user.name;
        hasUpdates = true;
      }
      
      if (user.address && !this.paymentForm.get('billingAddress')?.value) {
        formUpdates.billingAddress = user.address;
        hasUpdates = true;
      }
    }
    
    // Pre-fill common delivery address if available and not already filled
    if (user.address && !this.paymentForm.get('deliveryAddress')?.value) {
      formUpdates.deliveryAddress = user.address;
      hasUpdates = true;
    }
    
    // Apply all updates at once if there are any
    if (hasUpdates) {
      this.paymentForm.patchValue(formUpdates);
      this.cosmicNotificationService.success('🌟 Your details have been pre-filled!', 'Smart Fill');
      console.log('✅ Form updated with user data:', formUpdates);
    }
  }



  onSubmit(): void {
    if (this.paymentForm.valid && this.selectedPaymentMethod) {
      this.loading = true;
      this.error = null;

      const deliveryAddress = this.paymentForm.value.deliveryAddress;

      if (this.selectedPaymentMethod === 'cod') {
        // Handle Cash on Delivery - Use simplified order placement
        const codInfo = {
          fullName: this.paymentForm.value.codFullName,
          contactNumber: this.paymentForm.value.codContactNumber
        };

        console.log('💵 Placing COD Order with info:', { deliveryAddress, codInfo });

        // Create proper order request for COD
        const restaurantId = this.cartService.getRestaurantId();
        const items = this.cartService.getOrderItems();
        const total = this.getTotal();
        let customerId = this.authService.getCurrentUserId();
        if (!customerId) {
          // Try to get user ID from token as fallback
          const token = localStorage.getItem('jwt');
          if (token) {
            try {
              const payload = JSON.parse(atob(token.split('.')[1]));
              customerId = payload.userId || payload.sub;
            } catch (e) {
              console.error('Error parsing token:', e);
            }
          }
        }

        console.log('🔍 COD Order Debug Info:');
        console.log('  customerId:', customerId);
        console.log('  restaurantId:', restaurantId);
        console.log('  itemsCount:', items.length);
        console.log('  items:', items);
        console.log('  total:', total);
        console.log('  cartItems from service:', this.cartService.getCartItems());
        // Check restaurant observable
        this.cartService.cartRestaurant$.subscribe(restaurant => {
          // Restaurant from cart observable
        });

        if (!customerId || !restaurantId || items.length === 0) {
          console.error('❌ Missing:');
          console.error('  hasCustomerId:', !!customerId, 'value:', customerId);
          console.error('  hasRestaurantId:', !!restaurantId, 'value:', restaurantId);
          console.error('  hasItems:', items.length > 0, 'itemsLength:', items.length);
          
          this.loading = false;
          
          if (items.length === 0) {
            // Removed annoying notification
            setTimeout(() => {
              this.router.navigate(['/main']);
            }, 2000);
          } else if (!restaurantId) {
            // Removed annoying notification
            setTimeout(() => {
              this.router.navigate(['/main']);
            }, 2000);
          } else {
            // Removed annoying notification
          }
          return;
        }

        const orderRequest = {
          userId: customerId,
          restaurantId: restaurantId,
          deliveryAddress: deliveryAddress,
          totalAmount: total,
          items: items,
          paymentMethod: 'Cash' as const, // ✅ Set payment method to Cash for COD
          paymentDetails: {
            cardNumber: '',
            expiryDate: '',
            cvv: '',
            cardholderName: codInfo.fullName || '',
            billingAddress: deliveryAddress
          }
        };

        // Store order summary BEFORE placing order (cart will be cleared by order service)
        const orderSummary = {
          items: this.cartService.getCartItems(),
          subtotal: this.cartService.getCartTotal(),
          deliveryFee: 30,
          serviceFee: 10,
          total: this.getTotal(),
          timestamp: new Date().toISOString()
        };
        
        // Debug: Log what we're storing
        console.log('🛒 Debug COD payment data being stored (BEFORE order service):');
        console.log('  Cart items:', this.cartService.getCartItems());
        console.log('  Cart total:', this.cartService.getCartTotal());
        console.log('  Order summary to store:', orderSummary);

        this.orderService.placeFullOrder(orderRequest).subscribe({
          next: () => {
            this.loading = false;
            this.paymentForm.reset();
            this.selectedPaymentMethod = null; // Reset to no selection
            
            // Store the order summary we captured before the cart was cleared
            localStorage.setItem('lastOrderSummary', JSON.stringify(orderSummary));
            console.log('💾 COD - Stored order summary for success page:', orderSummary);
            
            // Show cosmic success notification
            // Removed annoying notification
            
            // Navigate to payment success page after notification
            setTimeout(() => {
              this.router.navigate(['/payment/success']);
            }, 2000);
          },
          error: (error: any) => {
            this.error = error.error?.message || 'Order placement failed';
            this.loading = false;
            
            // Show cosmic error notification
            // Removed annoying notification
          }
        });
      } else {
        // Handle Card Payment - Use full payment flow
        const restaurantId = this.cartService.getRestaurantId();
        const items = this.cartService.getOrderItems();
        const total = this.getTotal();
        let customerId = this.authService.getCurrentUserId();
        if (!customerId) {
          // Try to get user ID from token as fallback
          const token = localStorage.getItem('jwt');
          if (token) {
            try {
              const payload = JSON.parse(atob(token.split('.')[1]));
              customerId = payload.userId || payload.sub;
            } catch (e) {
              console.error('Error parsing token:', e);
            }
          }
        }

        const paymentDetails = {
          cardNumber: this.paymentForm.value.cardNumber,
          expiryDate: this.paymentForm.value.expiryDate,
          cvv: this.paymentForm.value.cvv,
          cardholderName: this.paymentForm.value.cardholderName,
          billingAddress: this.paymentForm.value.billingAddress
        };

        if (!restaurantId || items.length === 0 || !customerId) {
          this.error = 'Missing required order details';
          this.loading = false;
          return;
        }

        const orderRequest = {
          userId: customerId,
          restaurantId,
          deliveryAddress,
          totalAmount: total,
          items: items.map(item => ({
            menuItemId: item.menuItemId,
            itemName: item.itemName,
            quantity: item.quantity,
            price: item.price
          })),
          paymentMethod: 'Card' as const, // ✅ Set payment method to Card
          paymentDetails
        };

        console.log('💳 Sending card payment orderRequest:', orderRequest);

        // Store order summary BEFORE placing order (cart will be cleared by order service)
        const cardOrderSummary = {
          items: this.cartService.getCartItems(),
          subtotal: this.cartService.getCartTotal(),
          deliveryFee: 30,
          serviceFee: 10,
          total: this.getTotal(),
          timestamp: new Date().toISOString()
        };
        
        // Debug: Log what we're storing
        console.log('💳 Debug card payment data being stored (BEFORE order service):');
        console.log('  Cart items:', this.cartService.getCartItems());
        console.log('  Cart total:', this.cartService.getCartTotal());
        console.log('  Order summary to store:', cardOrderSummary);

        this.orderService.placeFullOrder(orderRequest).subscribe({
          next: () => {
            this.loading = false;
            this.paymentForm.reset();
            this.selectedPaymentMethod = null; // Reset to no selection
            
            // Store the order summary we captured before the cart was cleared
            localStorage.setItem('lastOrderSummary', JSON.stringify(cardOrderSummary));
            console.log('💾 Card - Stored order summary for success page:', cardOrderSummary);
            
            // Show cosmic success notification
            // Removed annoying notification
            
            // Navigate to payment success page after notification
            setTimeout(() => {
              this.router.navigate(['/payment/success']);
            }, 2000);
          },
          error: (error: any) => {
            this.error = error.error?.message || 'Payment failed';
            this.loading = false;
            
            // Show cosmic error notification
            // Removed annoying notification
          }
        });
      }
    }
  }

  getSubtotal(): number {
    return this.cartService.getCartTotal();
  }

  getTotal(): number {
    const subtotal = this.getSubtotal();
    const deliveryFee = 30;
    const serviceFee = 10;
    const taxes = Math.round(subtotal * 0.05); // 5% tax
    return subtotal + deliveryFee + serviceFee + taxes;
  }
}