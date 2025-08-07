import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService, User } from '../../services/auth.service';
import { OrderService } from '../../services/order.service';
import { Order, OrderItem } from '../../services/restaurant.service';
import { CosmicNotificationService } from '../../services/cosmic-notification.service';
import { CosmicNotificationComponent } from '../../components/cosmic-notification.component';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, CosmicNotificationComponent],
  template: `
    <div class="space-background">
      <!-- Cosmic Notifications -->
      <app-cosmic-notification 
        *ngFor="let notification of cosmicNotificationService.notifications$ | async" 
        [notification]="notification">
      </app-cosmic-notification>
      
      <!-- Cosmic Header -->
      <header class="cosmic-profile-header">
        <div class="container d-flex justify-content-between align-items-center">
          <div class="d-flex align-items-center">
            <div class="cosmic-profile-icon me-3">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <h1 class="h3 fw-bold space-text space-font-primary mb-0">🧑‍🚀 Cosmic Profile</h1>
          </div>
          <div>
            <a routerLink="/main" class="cosmic-nav-btn me-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17"/>
                <circle cx="17" cy="20" r="1"/>
                <circle cx="9" cy="20" r="1"/>
              </svg>
              🌌 Browse Galaxy
            </a>
            <button class="cosmic-logout-btn" (click)="logout()" [disabled]="logoutLoading">
              <span *ngIf="logoutLoading" class="cosmic-loading-spinner me-2"></span>
              <svg *ngIf="!logoutLoading" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16,17 21,12 16,7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              {{ logoutLoading ? '🚀 Logging out...' : '🚀 Logout' }}
            </button>
          </div>
        </div>
      </header>
      
      <div class="container py-4" style="padding-top: 6rem !important;">
        <div class="row">
          <div class="col-lg-8">
            <div class="glass-card p-4 mb-4 cosmic-info-card">
              <div class="d-flex align-items-center mb-4">
                <div class="cosmic-section-icon me-3">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5"/>
                    <path d="M8.5 8.5v.01"/>
                    <path d="M16 15.5v.01"/>
                    <path d="M12 12v.01"/>
                  </svg>
                </div>
                <h4 class="space-text space-font-primary fw-bold mb-0">👤 Space Traveler Info</h4>
              </div>
              <!-- Loading State -->
              <div *ngIf="!user" class="cosmic-loading-state text-center py-4">
                <div class="cosmic-spinner-small mb-3"></div>
                <p class="space-text-muted fw-bold">🚀 Loading Space Traveler Data...</p>
              </div>
              
              <!-- User Details -->
              <div *ngIf="user" class="cosmic-user-details">
                <div class="cosmic-detail-row">
                  <span class="cosmic-label">🏷️ Cosmic Name:</span>
                  <span class="cosmic-value">{{ user.name || 'Anonymous Space Traveler' }}</span>
                </div>
                <div class="cosmic-detail-row">
                  <span class="cosmic-label">📧 Galactic Email:</span>
                  <span class="cosmic-value">{{ user.email || 'Not provided' }}</span>
                </div>
                <div class="cosmic-detail-row">
                  <span class="cosmic-label">📱 Space Communicator:</span>
                  <span class="cosmic-value">{{ user.phone ? '+91-' + user.phone : 'Not provided' }}</span>
                </div>
                <div class="cosmic-detail-row">
                  <span class="cosmic-label">🌍 Home Coordinates:</span>
                  <span class="cosmic-value">{{ user.address || 'Unknown Galaxy' }}</span>
                </div>
                <div class="cosmic-detail-row">
                  <span class="cosmic-label">🍽️ Total Orders:</span>
                  <span class="cosmic-value">{{ orders.length }} cosmic meals</span>
                </div>
              </div>
            </div>
            
            <div class="glass-card p-4 cosmic-orders-card" *ngIf="orderHistoryVisible">
              <div class="d-flex align-items-center justify-content-between mb-4">
                <div class="d-flex align-items-center">
                <div class="cosmic-section-icon me-3">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
                    <rect width="8" height="4" x="8" y="2" rx="1" ry="1"/>
                  </svg>
                </div>
                <h4 class="space-text space-font-primary fw-bold mb-0">📜 Cosmic Order History</h4>
              </div>
                <div class="d-flex gap-2">
                  <button 
                    (click)="refreshOrders()" 
                    [disabled]="ordersLoading"
                    class="btn btn-sm"
                    style="background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: rgba(255,255,255,0.9); border-radius: 8px;"
                    title="Refresh Orders">
                    <svg *ngIf="!ordersLoading" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="1 4 1 10 7 10"/>
                      <polyline points="23 20 23 14 17 14"/>
                      <path d="m20.49 9A9 9 0 1 1 5.64 5.64L1 10m22.36 4A9 9 0 1 1 18.36 18.36L23 14"/>
                    </svg>
                    <div *ngIf="ordersLoading" class="spinner-border spinner-border-sm" role="status">
                      <span class="visually-hidden">Loading...</span>
                    </div>
                  </button>
                  <button 
                    (click)="scrollToOrders()" 
                    class="btn btn-sm"
                    style="background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.2); color: rgba(255,255,255,0.9); border-radius: 8px;"
                    title="Hide Order History">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M18 6L6 18M6 6l12 12"/>
                    </svg>
                  </button>
                </div>
              </div>
              <!-- No Orders State -->
              <div *ngIf="orders.length === 0 && !ordersLoading" class="cosmic-no-orders-state text-center py-5">
                <div class="cosmic-empty-icon mb-3">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="3"/>
                    <path d="M12 1v6M12 17v6M4.22 4.22l4.24 4.24M15.54 15.54l4.24 4.24M1 12h6M17 12h6M4.22 19.78l4.24-4.24M15.54 8.46l4.24-4.24"/>
                  </svg>
                </div>
                <h5 class="space-text space-font-primary fw-bold mb-2">🌌 No Cosmic Orders Yet!</h5>
                <p class="space-text-muted mb-4">Your intergalactic food journey awaits! Start exploring the cosmic flavors of the galaxy.</p>
                <a routerLink="/main" class="cosmic-action-btn primary">
                  <svg class="me-2" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z"/>
                    <line x1="6" x2="18" y1="17" y2="17"/>
                  </svg>
                  🚀 Start Your Cosmic Journey
                </a>
              </div>
              
              <!-- Loading State -->
              <div *ngIf="ordersLoading" class="cosmic-loading-state text-center py-4">
                <div class="cosmic-spinner-small mb-3"></div>
                <p class="space-text-muted fw-bold">🔍 Scanning the cosmos for your orders...</p>
              </div>
              
              <div *ngFor="let order of orders" class="border rounded p-3 mb-3 cosmic-order-item">
                <div class="d-flex justify-content-between align-items-start">
                  <div class="flex-grow-1">
                    <div class="d-flex align-items-center mb-1">
                      <h6 class="mb-0 space-text me-2">{{ getOrderDisplayName(order) }}</h6>
                      <small class="badge bg-primary me-2">#{{ getUserFriendlyOrderNumber(order) }}</small>
                      <small class="badge bg-secondary" style="font-size: 0.65rem;">ID: {{ order.orderId }}</small>
                    </div>
                    <small class="space-text-muted d-block mb-2">{{ order.orderTime | date:'medium' }}</small>
                    <div class="order-items-preview">
                      <small class="space-text-muted" *ngIf="order.items && order.items.length > 0">
                        <span *ngFor="let item of order.items; let i = index" class="me-2">
                          {{ item.itemName }}
                          <span *ngIf="item.quantity > 1">({{ item.quantity }}x)</span><span *ngIf="i < order.items.length - 1">,</span>
                        </span>
                      </small>
                      <small class="space-text-muted" *ngIf="!order.items || order.items.length === 0">
                        🍽️ Cosmic feast details loading...
                      </small>
                    </div>
                  </div>
                  <div class="text-end ms-3">
                    <div class="fw-bold space-text">₹{{ order.totalAmount }}</div>
                    <span class="badge" [class]="'bg-' + getStatusColor(order.status)">{{ getStatusLabel(order.status) }}</span>
                  </div>
                </div>
                <div class="mt-2 d-flex justify-content-between align-items-center">
                  <div class="flex-grow-1">
                    <small class="space-text-muted">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="me-1">
                        <path d="M12 2l9 7-9 7-9-7 9-7z"/>
                        <path d="M21 9v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9"/>
                      </svg>
                      {{ order.deliveryAddress || 'Cosmic coordinates' }}
                    </small>
                  </div>
                  <div *ngIf="order.status !== 'COMPLETED' && order.status !== 'CANCELLED'">
                    <button class="btn btn-sm cosmic-track-btn" (click)="trackOrder(order.orderId)">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="me-1">
                        <circle cx="12" cy="12" r="3"/>
                        <path d="M12 1v6M12 17v6M4.22 4.22l4.24 4.24M15.54 15.54l4.24 4.24M1 12h6M17 12h6M4.22 19.78l4.24-4.24M15.54 8.46l4.24-4.24"/>
                      </svg>
                      🔍 Track Order
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="col-lg-4">
            <div class="glass-card p-4 cosmic-actions-card">
              <div class="d-flex align-items-center mb-4">
                <div class="cosmic-section-icon me-3">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                  </svg>
                </div>
                <h5 class="space-text space-font-primary fw-bold mb-0">⚡ Quick Actions</h5>
              </div>
              <div class="d-grid gap-3">
                <a routerLink="/main" class="cosmic-action-btn primary">
                  <svg class="me-2" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z"/>
                    <line x1="6" x2="18" y1="17" y2="17"/>
                  </svg>
                  🌌 Browse Cosmic Restaurants
                </a>
                <a routerLink="/cart" class="cosmic-action-btn secondary">
                  <svg class="me-2" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17"/>
                    <circle cx="17" cy="20" r="1"/>
                    <circle cx="9" cy="20" r="1"/>
                  </svg>
                  🛸 View Cosmic Cart
                </a>
                <button class="cosmic-action-btn tertiary" (click)="scrollToOrders()">
                  <svg class="me-2" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
                    <rect width="8" height="4" x="8" y="2" rx="1" ry="1"/>
                  </svg>
                  {{ orderHistoryVisible ? '📜 Hide Order History' : '📜 Show Order History' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* Cosmic Profile Header */
    .cosmic-profile-header {
      background: rgba(255, 255, 255, 0.08);
      backdrop-filter: blur(20px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.2);
      position: fixed !important;
      top: 0;
      left: 0;
      right: 0;
      width: 100%;
      z-index: 1000;
      padding: 0.75rem 0;
    }

    .cosmic-profile-icon {
      width: 50px;
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.2), rgba(67, 233, 123, 0.2));
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      color: rgba(255, 255, 255, 0.9);
      animation: profile-pulse 3s ease-in-out infinite;
    }

    @keyframes profile-pulse {
      0%, 100% { 
        box-shadow: 0 0 15px rgba(102, 126, 234, 0.3);
        transform: scale(1);
      }
      50% { 
        box-shadow: 0 0 25px rgba(67, 233, 123, 0.4);
        transform: scale(1.02);
      }
    }

    .cosmic-nav-btn {
      background: rgba(102, 126, 234, 0.1);
      border: 2px solid rgba(102, 126, 234, 0.3);
      border-radius: 12px;
      color: rgba(255, 255, 255, 0.9);
      padding: 0.5rem 1rem;
      font-weight: 600;
      font-family: 'Exo 2', sans-serif;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      transition: all 0.3s ease;
    }

    .cosmic-nav-btn:hover {
      background: rgba(102, 126, 234, 0.2);
      border-color: rgba(102, 126, 234, 0.5);
      color: rgba(255, 255, 255, 1);
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
    }

    .cosmic-logout-btn {
      background: rgba(239, 68, 68, 0.1);
      border: 2px solid rgba(239, 68, 68, 0.3);
      border-radius: 12px;
      color: rgba(255, 255, 255, 0.9);
      padding: 0.5rem 1rem;
      font-weight: 600;
      font-family: 'Exo 2', sans-serif;
      display: inline-flex;
      align-items: center;
      transition: all 0.3s ease;
      cursor: pointer;
    }

    .cosmic-logout-btn:hover {
      background: rgba(239, 68, 68, 0.2);
      border-color: rgba(239, 68, 68, 0.5);
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(239, 68, 68, 0.3);
    }

    /* Profile Cards */
    .cosmic-info-card, .cosmic-orders-card, .cosmic-actions-card {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 20px;
    }

    .cosmic-section-icon {
      width: 45px;
      height: 45px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.2), rgba(67, 233, 123, 0.2));
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      color: rgba(255, 255, 255, 0.9);
    }

    /* User Details */
    .cosmic-user-details {
      margin-top: 1rem;
    }

    .cosmic-detail-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .cosmic-detail-row:last-child {
      border-bottom: none;
    }

    .cosmic-label {
      color: rgba(255, 255, 255, 0.8);
      font-family: 'Exo 2', sans-serif;
      font-weight: 600;
      font-size: 0.9rem;
    }

    .cosmic-value {
      color: rgba(255, 255, 255, 0.95);
      font-family: 'Orbitron', monospace;
      font-weight: 500;
      text-align: right;
    }

    /* Cosmic Action Buttons */
    .cosmic-action-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0.75rem 1rem;
      border-radius: 12px;
      text-decoration: none;
      font-weight: 600;
      font-family: 'Exo 2', sans-serif;
      transition: all 0.3s ease;
      border: 2px solid transparent;
    }

    .cosmic-action-btn.primary {
      background: rgba(102, 126, 234, 0.15);
      border-color: rgba(102, 126, 234, 0.3);
      color: rgba(255, 255, 255, 0.9);
    }

    .cosmic-action-btn.primary:hover {
      background: rgba(102, 126, 234, 0.25);
      border-color: rgba(102, 126, 234, 0.5);
      color: rgba(255, 255, 255, 1);
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
    }

    .cosmic-action-btn.secondary {
      background: rgba(67, 233, 123, 0.15);
      border-color: rgba(67, 233, 123, 0.3);
      color: rgba(255, 255, 255, 0.9);
    }

    .cosmic-action-btn.secondary:hover {
      background: rgba(67, 233, 123, 0.25);
      border-color: rgba(67, 233, 123, 0.5);
      color: rgba(255, 255, 255, 1);
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(67, 233, 123, 0.3);
    }

    .cosmic-action-btn.tertiary {
      background: rgba(240, 147, 251, 0.15);
      border-color: rgba(240, 147, 251, 0.3);
      color: rgba(255, 255, 255, 0.9);
    }

    .cosmic-action-btn.tertiary:hover {
      background: rgba(240, 147, 251, 0.25);
      border-color: rgba(240, 147, 251, 0.5);
      color: rgba(255, 255, 255, 1);
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(240, 147, 251, 0.3);
    }

    /* Cosmic Loading Spinner */
    .cosmic-loading-spinner {
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255, 255, 255, 0.2);
      border-top: 2px solid rgba(255, 255, 255, 0.8);
      border-radius: 50%;
      animation: cosmic-loading-spin 1s linear infinite;
    }

    /* Loading State */
    .cosmic-loading-state {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      padding: 2rem;
    }

    .cosmic-spinner-small {
      width: 30px;
      height: 30px;
      border: 3px solid rgba(255, 255, 255, 0.2);
      border-top: 3px solid rgba(102, 126, 234, 0.8);
      border-radius: 50%;
      animation: cosmic-loading-spin 1s linear infinite;
      margin: 0 auto;
    }

    @keyframes cosmic-loading-spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    /* No Orders State */
    .cosmic-no-orders-state {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      padding: 2rem 1rem;
    }

    .cosmic-empty-icon {
      width: 60px;
      height: 60px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(67, 233, 123, 0.1));
      border: 2px solid rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      color: rgba(255, 255, 255, 0.7);
      animation: cosmic-empty-pulse 2s ease-in-out infinite;
    }

    @keyframes cosmic-empty-pulse {
      0%, 100% { 
        opacity: 0.7;
        transform: scale(1);
      }
      50% { 
        opacity: 1;
        transform: scale(1.05);
      }
    }

    /* Order Items */
    .cosmic-order-item {
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.1) !important;
      border-radius: 12px !important;
      transition: all 0.3s ease;
    }

    .cosmic-order-item:hover {
      background: rgba(255, 255, 255, 0.05);
      border-color: rgba(255, 255, 255, 0.2) !important;
      transform: translateY(-2px);
    }

    .cosmic-track-btn {
      background: rgba(102, 126, 234, 0.1);
      border: 1px solid rgba(102, 126, 234, 0.3);
      color: rgba(255, 255, 255, 0.9);
      border-radius: 8px;
      padding: 0.25rem 0.75rem;
      font-size: 0.8rem;
      font-weight: 600;
      transition: all 0.3s ease;
    }

    .cosmic-track-btn:hover {
      background: rgba(102, 126, 234, 0.2);
      border-color: rgba(102, 126, 234, 0.5);
      color: rgba(255, 255, 255, 1);
      transform: scale(1.05);
    }

    .order-items-preview {
      max-width: 100%;
      overflow: hidden;
    }

    .order-items-preview small {
      line-height: 1.4;
      font-size: 0.75rem;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .cosmic-profile-icon {
        width: 40px;
        height: 40px;
      }
      
      .cosmic-section-icon {
        width: 35px;
        height: 35px;
      }
      
      .cosmic-nav-btn, .cosmic-logout-btn {
        padding: 0.4rem 0.8rem;
        font-size: 0.85rem;
      }
    }
  `]
})
export class UserProfileComponent implements OnInit {
  user: User | null = null;
  orders: Order[] = [];
  logoutLoading = false;
  ordersLoading = false;
  orderHistoryVisible = false; // Initially hide order history for cleaner interface

  constructor(
    private authService: AuthService,
    private orderService: OrderService,
    public cosmicNotificationService: CosmicNotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Check if returning from order tracking and restore order history visibility
    const isReturningFromTracking = sessionStorage.getItem('returnToProfile') === 'true';
    const savedOrderHistoryVisible = sessionStorage.getItem('orderHistoryVisible');
    
    if (isReturningFromTracking && savedOrderHistoryVisible) {
      this.orderHistoryVisible = savedOrderHistoryVisible === 'true';
      // Clear the session storage flags
      sessionStorage.removeItem('returnToProfile');
      sessionStorage.removeItem('orderHistoryVisible');
      console.log('🔄 Restored order history visibility:', this.orderHistoryVisible);
    }

    // Subscribe to user data from auth service
    this.authService.user$.subscribe(user => {
      if (user) {
      this.user = user;
        console.log('👤 User updated via subscription:', user);
        // Reload orders when user changes
        this.loadCustomerOrders();
      }
    });
    
    // Get current user immediately and try to load profile if needed
    const currentUser = this.authService.getCurrentUser();
    const userId = this.authService.getCurrentUserId();
    
    if (currentUser) {
      this.user = currentUser;
      console.log('👤 Current user found:', currentUser);
      // Load orders immediately if user is available
      this.loadCustomerOrders();
    } else if (userId) {
      console.log('🔑 User ID found, fetching profile:', userId);
      // Try to fetch real user profile from backend
      this.authService.fetchUserProfile().subscribe({
        next: (userData) => {
          this.user = userData;
          console.log('✅ User profile loaded from backend:', userData);
          // Load orders after user profile is fetched
          this.loadCustomerOrders();
        },
        error: (error) => {
          console.warn('⚠️ Could not fetch user profile, using demo data:', error.status);
          // User is authenticated but no profile data - create realistic demo user
          this.user = {
            id: userId,
            name: 'John Doe',
            email: 'john.doe@email.com',
            phone: '+91-9876543210',
            address: '123 Main Street, Bangalore, Karnataka'
          };
          // Load orders with demo user
          this.loadCustomerOrders();
        }
      });
    } else {
      console.log('❌ No user authentication found');
      // Not authenticated - create guest user
      this.user = {
        id: 1,
        name: 'Guest User',
        email: 'guest@example.com',
        phone: '+91-0000000000',
        address: 'Demo Address'
      };
      // Load demo orders for guest
      this.loadCustomerOrders();
    }
  }

  private loadCustomerOrders(): void {
    const userId = this.authService.getCurrentUserId();
    console.log('🔍 Loading orders for user ID:', userId);
    
    if (!userId) {
      console.warn('❌ No user ID available, showing no orders');
      this.orders = []; // Empty array for no user ID
      return;
    }

    // Set loading state
    this.ordersLoading = true;

    // Fetch real customer orders from backend
    console.log('🌐 Fetching orders from backend...');
    this.orderService.fetchCustomerOrders().subscribe({
      next: (orders) => {
        this.ordersLoading = false;
        console.log('✅ Raw backend response:', orders);
        if (orders && orders.length > 0) {
          this.orders = orders;
          console.log('✅ Customer orders loaded successfully:', orders.length, 'orders');
          console.log('📊 Order details:', orders);
        } else {
          console.log('📝 No orders found - user hasn\'t placed any orders yet');
          this.orders = []; // Empty array for no orders
        }
      },
      error: (error) => {
        this.ordersLoading = false;
        console.error('❌ Backend API call failed:', {
          status: error.status,
          statusText: error.statusText,
          message: error.message,
          url: error.url,
          error: error.error,
          headers: error.headers
        });
        
        if (error.status === 403) {
          console.error('🚫 Authorization failed - check user roles and authentication');
        } else if (error.status === 401) {
          console.error('🔑 Authentication failed - check JWT token');
        } else if (error.status === 404) {
          console.error('🔍 API endpoint not found - check URL routing');
        } else if (error.status === 0) {
          console.error('🌐 Network error - check if backend services are running');
        }
        
        console.log('📝 Using empty orders array due to API failure');
        this.orders = []; // Empty array when API fails
      }
    });
  }



  refreshOrders(): void {
    console.log('🔄 Manually refreshing orders...');
    this.loadCustomerOrders();
  }

  trackOrder(orderId: number): void {
    // Save current order history visibility state before navigating
    sessionStorage.setItem('orderHistoryVisible', this.orderHistoryVisible.toString());
    sessionStorage.setItem('returnToProfile', 'true');
    
    this.cosmicNotificationService.info('🔍 Opening cosmic order tracker...', 'Tracking Order');
    // Navigate using Angular router to preserve authentication state
    this.router.navigate(['/order-tracking'], { queryParams: { orderId: orderId } });
  }

  scrollToOrders(): void {
    // Toggle order history visibility
    this.orderHistoryVisible = !this.orderHistoryVisible;
    
    if (this.orderHistoryVisible) {
      this.cosmicNotificationService.info('📜 Order history expanded', 'Order History');
      // Scroll to the order history section after a short delay to allow animation
      setTimeout(() => {
        const orderSection = document.querySelector('.cosmic-orders-card');
        if (orderSection) {
          orderSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 300);
    } else {
      this.cosmicNotificationService.info('📜 Order history collapsed', 'Order History');
    }
  }

  logout(): void {
    this.logoutLoading = true;
    setTimeout(() => {
      this.authService.logout();
      this.logoutLoading = false;
    }, 1500); // 1.5 second delay for smooth logout experience
  }

  getStatusColor(status: string): string {
    switch (status.toUpperCase()) {
      case 'COMPLETED':
      case 'DELIVERED': 
        return 'success';
      case 'IN_COOKING':
      case 'PREPARING': 
        return 'warning';
      case 'OUT_FOR_DELIVERY':
        return 'info';
      case 'ACCEPTED':
        return 'primary';
      case 'PENDING':
        return 'secondary';
      case 'CANCELLED':
      case 'DECLINED': 
        return 'danger';
      default: 
        return 'primary';
    }
  }

  getStatusLabel(status: string): string {
    switch (status.toUpperCase()) {
      case 'COMPLETED': return '🎉 Completed';
      case 'DELIVERED': return '✅ Delivered';
      case 'IN_COOKING': return '👨‍🍳 In Cooking';
      case 'PREPARING': return '⏳ Preparing';
      case 'OUT_FOR_DELIVERY': return '🚚 Out for Delivery';
      case 'ACCEPTED': return '✅ Accepted';
      case 'PENDING': return '⏳ Pending';
      case 'CANCELLED': return '🚫 Cancelled';
      case 'DECLINED': return '❌ Declined';
      default: return status;
    }
  }

  getOrderDisplayName(order: any): string {
    // If order has items, create a descriptive name based on items
    if (order.items && order.items.length > 0) {
      const itemNames = order.items.map((item: any) => item.itemName).filter((name: string) => name);
      
      if (itemNames.length === 1) {
        return `🍽️ ${itemNames[0]}`;
      } else if (itemNames.length === 2) {
        return `🍽️ ${itemNames[0]} & ${itemNames[1]}`;
      } else if (itemNames.length > 2) {
        return `🍽️ ${itemNames[0]} + ${itemNames.length - 1} more`;
      }
    }
    
    // Fallback based on order amount/status
    if (order.totalAmount) {
      const amount = order.totalAmount;
      if (amount >= 500) {
        return '🍛 Cosmic Feast';
      } else if (amount >= 300) {
        return '🍜 Galactic Meal';
      } else {
        return '🥗 Stellar Snack';
      }
    }
    
    return '🍽️ Cosmic Order';
  }

  getUserFriendlyOrderNumber(order: any): number {
    // Create a user-friendly sequential number based on order position
    // Sort orders by order time to maintain chronological order
    const sortedOrders = [...this.orders].sort((a, b) => 
      new Date(a.orderTime).getTime() - new Date(b.orderTime).getTime()
    );
    
    // Find the index of current order and add 1 for 1-based numbering
    const index = sortedOrders.findIndex(o => o.orderId === order.orderId);
    return index >= 0 ? index + 1 : this.orders.length;
  }
} 