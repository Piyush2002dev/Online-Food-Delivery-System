import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RestaurantService, Order, MenuItem, OrderItem } from '../../services/restaurant.service';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { CosmicNotificationService } from '../../services/cosmic-notification.service';
import { CosmicNotificationComponent } from '../../components/cosmic-notification.component';
import { CosmicStatusPopupComponent } from '../../components/cosmic-status-popup.component';
import { finalize } from 'rxjs/operators';


@Component({
  selector: 'app-restaurant-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, CosmicNotificationComponent, CosmicStatusPopupComponent],
  template: `
    <div class="space-background">
      <!-- Cosmic Header -->
      <header class="cosmic-restaurant-header py-2">
        <div class="container d-flex justify-content-between align-items-center">
          <div class="header-info">
            <div class="d-flex align-items-center">
              <div class="cosmic-restaurant-icon me-3">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z"/>
                  <line x1="6" x2="18" y1="17" y2="17"/>
                </svg>
              </div>
              <div>
                <h1 class="h5 fw-bold space-text space-font-primary mb-0">{{ restaurantDetails.name }}</h1>
                <p class="space-text-muted mb-0 small fw-bold">📍 {{ restaurantDetails.location }}</p>
              </div>
            </div>
          </div>
          <button class="cosmic-logout-btn" (click)="logout()" [disabled]="logoutLoading">
            <span *ngIf="logoutLoading" class="cosmic-spinner me-2"></span>
            <svg *ngIf="!logoutLoading" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16,17 21,12 16,7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            <span class="ms-2">{{ logoutLoading ? 'Logging out...' : 'Logout' }}</span>
          </button>
        </div>
      </header>
      
      <!-- Main Content -->
      <div class="container py-4" style="padding-top: 5rem !important; margin-top: 1rem;">
        <div class="row g-4">
          <!-- Orders Section -->
          <div class="col-lg-6">
            <div class="glass-card p-3 cosmic-dashboard-card">
              <div class="card-header d-flex align-items-center mb-3">
                <div class="cosmic-dashboard-icon me-3">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M12 1v6m0 6v6"/>
                  <path d="m21 12-6 0m-6 0-6 0"/>
                </svg>
                </div>
                <div>
                  <h2 class="h5 fw-bold mb-0 space-text space-font-primary">🛸 Orders Dashboard</h2>
                  <p class="space-text-muted mb-0 small fw-bold">Manage your cosmic orders</p>
                </div>
              </div>

              <!-- Cosmic Order Stats -->
              <div class="row g-2 mb-3">
                <div class="col-4">
                  <div class="cosmic-stat-card">
                    <div class="stat-icon">📊</div>
                    <div class="stat-number h6 fw-bold space-text mb-1">{{ getTotalOrders() }}</div>
                    <p class="small space-text-muted mb-0 fw-bold">Total Orders</p>
                  </div>
                </div>
                <div class="col-4">
                  <div class="cosmic-stat-card">
                    <div class="stat-icon">⏳</div>
                    <div class="stat-number h6 fw-bold space-text mb-1">{{ getPendingOrders() }}</div>
                    <p class="small space-text-muted mb-0 fw-bold">Pending</p>
                  </div>
                </div>
                <div class="col-4">
                  <div class="cosmic-stat-card">
                    <div class="stat-icon">✅</div>
                    <div class="stat-number h6 fw-bold space-text mb-1">{{ getCompletedOrders() }}</div>
                    <p class="small space-text-completed mb-0 fw-bold">Completed</p>
                  </div>
                </div>
              </div>

              <!-- Orders List -->
              <div class="orders-section">
                <div class="d-flex justify-content-between align-items-center mb-3">
                  <h5 class="fw-semibold d-flex align-items-center space-text space-font-primary mb-0">
                    <span class="me-2">📋</span> Recent Orders
                  </h5>
                  <button class="btn btn-sm btn-outline-info cosmic-flow-guide-btn" 
                          (click)="showCompleteOrderFlowGuide()"
                          title="View complete order flow guide">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="me-1">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="12" y1="16" x2="12" y2="12"/>
                      <circle cx="12" cy="8" r="1"/>
                    </svg>
                    Flow Guide
                  </button>
                </div>
                
              <div *ngIf="loading" class="text-center py-4">
                  <div class="spinner-grow text-purple-500" style="width: 2rem; height: 2rem;"></div>
                  <p class="space-text-muted mt-2 fw-bold">Loading orders...</p>
              </div>
              
                <div *ngIf="!loading && orders.length === 0" class="empty-state text-center py-4">
                  <div class="mb-3">
                    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" class="text-gray-300">
                      <circle cx="12" cy="12" r="10"/>
                      <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
                      <line x1="9" y1="9" x2="9.01" y2="9"/>
                      <line x1="15" y1="9" x2="15.01" y2="9"/>
                    </svg>
                  </div>
                  <h6 class="space-text-muted fw-bold">No orders yet</h6>
                  <p class="text-gray-500 small">Orders will appear here when customers place them</p>
                </div>
                
                <div class="orders-list">
                  <div *ngFor="let order of orders; let i = index" 
                       class="cosmic-order-card"
                       [style.animation-delay]="i * 0.1 + 's'">
                    <div class="d-flex justify-content-between align-items-start">
                      <div class="order-info flex-grow-1">
                        <div class="d-flex align-items-center mb-2">
                          <span class="order-id fw-bold space-text me-2">#{{ i + 1 }}</span>
                          <span class="status-badge" [class]="getStatusClass(order.status)">
                            {{ getStatusEmoji(order.status) }} {{ order.status }}
                          </span>
                        </div>
                        <h6 class="fw-semibold space-text mb-1">{{ order.customerName || 'Customer' }}</h6>
                        <div class="order-meta d-flex align-items-center gap-3 mb-2">
                          <small class="space-text-muted fw-bold">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="me-1">
                              <circle cx="12" cy="12" r="10"/>
                              <polyline points="12,6 12,12 16,14"/>
                            </svg>
                            {{ order.orderTime | date:'short' }}
                          </small>
                          <small class="fw-bold space-text text-success">₹{{ order.totalAmount }}</small>
                        </div>
                        
                        <!-- Order Items -->
                        <div class="order-items mb-2" *ngIf="order.items && order.items.length > 0">
                          <div class="d-flex flex-wrap gap-1">
                            <span *ngFor="let item of order.items.slice(0, 3)" 
                                  class="cosmic-item-tag space-text-muted fw-bold px-2 py-1 rounded-pill small">
                              {{ item.itemName }} ({{ item.quantity }}x)
                            </span>
                            <span *ngIf="order.items.length > 3" 
                                  class="cosmic-item-tag space-text-muted fw-bold px-2 py-1 rounded-pill small">
                              +{{ order.items.length - 3 }} more
                            </span>
                          </div>
                        </div>
                      </div>

                      <div class="order-actions text-end">
                        <div class="d-flex align-items-center gap-2 mb-2">
                          <div class="status-control-container">
                            <select class="form-select form-select-sm status-select" 
                                    [value]="order.status" 
                                    [attr.data-order-id]="order.orderId"
                                    (change)="updateOrderStatus(order.orderId, $event)">
                              <!-- Current status option (always first and selected) -->
                              <option [value]="order.status" [selected]="true" class="fw-bold">
                                {{ getStatusLabel(order.status) }} (Current)
                              </option>
                              <option *ngFor="let status of getValidNextStatuses(order.status)" 
                                      [value]="status.value" 
                                      [disabled]="status.disabled"
                                      [class.text-muted]="status.disabled">
                                {{ status.label }}
                              </option>
                            </select>
                          </div>
                          <button *ngIf="ordersWithInvalidAttempts.has(order.orderId)" 
                                  class="cosmic-info-tooltip pulsing" 
                                  (click)="showStatusFlowInfo(order.status)"
                                  title="⚠️ Invalid status transition attempted! Click for order flow guide">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                              <circle cx="12" cy="12" r="10"/>
                              <line x1="12" y1="16" x2="12" y2="12"/>
                              <circle cx="12" cy="8" r="1"/>
                            </svg>
                          </button>
                        </div>

                        <!-- Delete Button for Completed/Cancelled/Declined Orders -->
                        <button *ngIf="order.status === 'COMPLETED' || order.status === 'CANCELLED' || order.status === 'DECLINED'" 
                                class="cosmic-delete-btn"
                                (click)="deleteOrder(order.orderId)"
                                title="Delete Order">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
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
          </div>

          <!-- Menu Management Section -->
          <div class="col-lg-6">
            <div class="cosmic-dashboard-card glass-card p-3">
              <div class="card-header d-flex justify-content-between align-items-center mb-3">
                <div class="d-flex align-items-center">
                  <div class="cosmic-dashboard-icon me-3">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                    <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z"/>
                    <line x1="6" x2="18" y1="17" y2="17"/>
                  </svg>
                  </div>
                  <div>
                    <h2 class="h5 fw-bold mb-0 space-text">Menu Items ({{ menuItems.length }})</h2>
                    <p class="space-text-muted mb-0 small">Manage your restaurant menu</p>
                  </div>
                </div>
                <button class="btn btn-success add-item-btn position-relative overflow-hidden" (click)="showAddForm = true">
                  <span class="position-relative z-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M5 12h14"/>
                    <path d="M12 5v14"/>
                  </svg>
                    <span class="ms-2">Add Item</span>
                  </span>
                  <div class="button-ripple"></div>
                </button>
              </div>

              <!-- Diet Filters -->
              <div class="filter-section d-flex align-items-center mb-4">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="me-2 text-gray-500">
                  <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46"/>
                </svg>
                <div class="btn-group btn-group-sm filter-buttons">
                  <input type="radio" class="btn-check" name="dietFilter" id="all" [checked]="dietFilter === 'all'" (change)="setDietFilter('all')">
                  <label class="btn btn-outline-secondary filter-btn" for="all">All ({{ menuItems.length }})</label>
                  
                  <input type="radio" class="btn-check" name="dietFilter" id="veg" [checked]="dietFilter === 'veg'" (change)="setDietFilter('veg')">
                  <label class="btn btn-outline-success filter-btn" for="veg">
                    <span class="veg-dot bg-success rounded-circle me-1"></span>
                    Veg ({{ getVegCount() }})
                  </label>
                  
                  <input type="radio" class="btn-check" name="dietFilter" id="non-veg" [checked]="dietFilter === 'non-veg'" (change)="setDietFilter('non-veg')">
                  <label class="btn btn-outline-danger filter-btn" for="non-veg">
                    <span class="veg-dot bg-danger rounded-circle me-1"></span>
                    Non-Veg ({{ getNonVegCount() }})
                  </label>
                </div>
              </div>

              <!-- Menu Items List -->
              <div class="menu-items-section" style="max-height: 500px; overflow-y: auto;">
                <div *ngIf="filteredMenuItems.length === 0" class="empty-state text-center py-4">
                  <div class="mb-3">
                    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" class="text-gray-300">
                      <circle cx="12" cy="12" r="10"/>
                      <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
                      <line x1="9" y1="9" x2="9.01" y2="9"/>
                      <line x1="15" y1="9" x2="15.01" y2="9"/>
                    </svg>
                  </div>
                  <h6 class="text-gray-600">{{ menuItems.length === 0 ? 'No menu items found' : 'No ' + (dietFilter === 'veg' ? 'vegetarian' : 'non-vegetarian') + ' items found' }}</h6>
                  <p class="text-gray-500 small">{{ menuItems.length === 0 ? 'Add your first delicious item!' : 'Try different filters' }}</p>
                </div>
                
                <div *ngFor="let item of filteredMenuItems; let i = index" 
                     class="cosmic-order-card p-4"
                     [style.animation-delay]="i * 0.1 + 's'">
                  <div class="d-flex justify-content-between align-items-start">
                    <div class="item-info flex-grow-1">
                      <div class="d-flex align-items-center gap-2 mb-2">
                        <h6 class="fw-semibold mb-0 space-text">{{ item.name }}</h6>
                        <span class="diet-badge" [class]="item.isVeg === 'yes' ? 'veg' : 'non-veg'">
                          <span class="diet-dot"></span>
                          {{ item.isVeg === 'yes' ? 'Veg' : 'Non-Veg' }}
                        </span>
                      </div>
                      <p class="space-text-muted small mb-2">{{ item.description }}</p>
                      <div class="price-container">
                        <span class="price fw-bold text-success h6 mb-0">₹{{ item.price }}</span>
                      </div>
                    </div>
                    <div class="item-actions d-flex gap-2">
                      <button class="btn btn-sm btn-outline-primary edit-btn" (click)="editItem(item)" title="Edit item">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
                          <path d="m15 5 4 4"/>
                        </svg>
                      </button>
                      <button class="btn btn-sm btn-outline-danger delete-btn" (click)="deleteItem(item.id)" title="Delete item">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
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
        </div>
      </div>
    </div>

    <!-- Add/Edit Menu Item Modal -->
    <div class="modal fade" [class.show]="showAddForm || editingItem" [style.display]="showAddForm || editingItem ? 'block' : 'none'" style="background-color: rgba(0,0,0,0.7);" *ngIf="showAddForm || editingItem">
      <div class="modal-dialog modal-lg">
        <div class="modal-content cosmic-menu-modal glass-card">
          <div class="modal-header cosmic-modal-header">
            <div class="d-flex align-items-center">
              <div class="cosmic-modal-icon me-3">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z"/>
                  <line x1="6" x2="18" y1="17" y2="17"/>
                </svg>
              </div>
              <h5 class="modal-title fw-bold space-text space-font-primary mb-0">{{ editingItem ? '🍽️ Edit Cosmic Dish' : '✨ Add New Cosmic Dish' }}</h5>
            </div>
            <button type="button" class="cosmic-close-btn" (click)="closeModal()">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 6L6 18"/>
                <path d="M6 6l12 12"/>
              </svg>
            </button>
          </div>
          <form [formGroup]="menuForm" (ngSubmit)="onSubmit()">
            <!-- Loading Overlay -->
            <div *ngIf="addingItemLoading" class="modal-loading-overlay">
              <div class="loading-content">
                <div class="cosmic-spinner-large"></div>
                <p class="loading-text">🚀 Launching your cosmic dish to the galaxy...</p>
              </div>
            </div>
            <div class="modal-body cosmic-modal-body">
              <div class="mb-4">
                <label class="form-label fw-bold space-text-muted space-font-secondary">
                  🍽️ Cosmic Dish Name
                </label>
                <div class="position-relative cosmic-input-group">
                  <svg class="cosmic-input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z"/>
                    <line x1="6" x2="18" y1="17" y2="17"/>
                  </svg>
                  <input type="text" class="form-control-cosmic" formControlName="name" placeholder="Enter your cosmic dish name" [disabled]="addingItemLoading">
                </div>
                <div *ngIf="menuForm.get('name')?.touched && menuForm.get('name')?.errors?.['required']" class="text-danger small fw-bold mt-1">
                  🍽️ Dish name is required for your cosmic menu
                </div>
              </div>
              
              <div class="mb-4">
                <label class="form-label fw-bold space-text-muted space-font-secondary">
                  📝 Cosmic Description
                </label>
                <div class="position-relative cosmic-input-group">
                  <svg class="cosmic-input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14,2 14,8 20,8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                    <polyline points="10,9 9,9 8,9"/>
                  </svg>
                  <textarea formControlName="description" rows="2" placeholder="Describe your intergalactic dish flavors..." class="form-control-cosmic" [disabled]="addingItemLoading"></textarea>
                </div>
                <small class="form-text space-text-muted mt-1">
                  💫 Write a cosmic description (10-100 characters): {{ menuForm.get('description')?.value?.length || 0 }}/100
                </small>
                <div *ngIf="menuForm.get('description')?.touched && menuForm.get('description')?.errors?.['required']" class="text-danger small fw-bold mt-1">
                  📝 Description is required to entice space travelers
                </div>
              </div>
              
              <div class="mb-4">
                <label class="form-label fw-bold space-text-muted space-font-secondary">
                  💰 Cosmic Price (₹)
                </label>
                <div class="position-relative cosmic-input-group">
                  <svg class="cosmic-input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="12" y1="1" x2="12" y2="23"/>
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                  </svg>
                  <input type="number" class="form-control-cosmic" formControlName="price" step="0.01" min="0.01" placeholder="0.00" [disabled]="addingItemLoading">
                </div>
                <div *ngIf="menuForm.get('price')?.touched && menuForm.get('price')?.errors?.['required']" class="text-danger small fw-bold mt-1">
                  💰 Price is required for cosmic transactions
                </div>
              </div>
              
              <div class="mb-4">
                <label class="form-label fw-bold space-text-muted space-font-secondary">
                  🌱 Cosmic Diet Classification
                </label>
                <div class="position-relative cosmic-input-group">
                  <svg class="cosmic-input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <circle cx="12" cy="12" r="4"/>
                    <line x1="21.17" y1="8" x2="12" y2="8"/>
                    <line x1="3.95" y1="6.06" x2="8.54" y2="14"/>
                    <line x1="10.88" y1="21.94" x2="15.46" y2="14"/>
                  </svg>
                  <select class="form-control-cosmic" formControlName="isVeg" [disabled]="addingItemLoading">
                    <option value="yes">🟢 Vegetarian - Pure Plant Energy</option>
                    <option value="no">🔴 Non-Vegetarian - Protein Power</option>
                  </select>
                </div>
              </div>
              
              <div *ngIf="error" class="cosmic-alert cosmic-alert-danger text-center" role="alert">
                ⚠️ {{ error }}
              </div>
            </div>
            <div class="modal-footer cosmic-modal-footer">
              <button type="button" class="btn-cosmic-outline me-3" (click)="closeModal()" [disabled]="addingItemLoading">
                <svg class="me-2" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M18 6L6 18"/>
                  <path d="M6 6l12 12"/>
                </svg>
                Cancel Mission
              </button>
              <button type="submit" class="btn-cosmic-primary position-relative" [disabled]="menuForm.invalid || addingItemLoading">
                <span *ngIf="addingItemLoading" class="cosmic-spinner me-2"></span>
                <svg *ngIf="!addingItemLoading" class="me-2" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 5v14"/>
                  <path d="M5 12h14"/>
                </svg>
                <span>{{ editingItem ? '🔄 Update Cosmic Dish' : (addingItemLoading ? '🚀 Launching to Galaxy...' : '✨ Launch Dish to Galaxy') }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Cosmic Notifications Container -->
    <div class="cosmic-notifications-container">
      <app-cosmic-notification 
        *ngFor="let notification of cosmicNotifications$ | async" 
        [notification]="notification"
        [visible]="true">
      </app-cosmic-notification>
    </div>

    <!-- Cosmic Status Popup -->
    <app-cosmic-status-popup
      [visible]="showStatusPopup"
      [message]="statusPopupMessage"
      [autoClose]="true"
      [duration]="12000"
      (closed)="closeStatusPopup()">
    </app-cosmic-status-popup>
  `,
  styles: [`
    /* Cosmic Restaurant Header */
    .cosmic-restaurant-header {
      background: rgba(255, 255, 255, 0.08);
      backdrop-filter: blur(20px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.2);
      position: fixed !important;
      top: 0;
      left: 0;
      right: 0;
      width: 100%;
      z-index: 1000;
      min-height: 60px;
    }

    .cosmic-restaurant-icon {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.2), rgba(67, 233, 123, 0.2));
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      color: rgba(255, 255, 255, 0.9);
      animation: restaurant-pulse 3s ease-in-out infinite;
    }

    @keyframes restaurant-pulse {
      0%, 100% { transform: scale(1); box-shadow: 0 0 15px rgba(102, 126, 234, 0.3); }
      50% { transform: scale(1.05); box-shadow: 0 0 25px rgba(67, 233, 123, 0.4); }
    }

    /* Cosmic Logout Button */
    .cosmic-logout-btn {
      background: rgba(239, 68, 68, 0.1);
      border: 2px solid rgba(239, 68, 68, 0.3);
      border-radius: 8px;
      color: rgba(255, 255, 255, 0.9);
      padding: 0.4rem 0.8rem;
      font-size: 0.85rem;
      font-weight: 500;
      transition: all 0.3s ease;
      backdrop-filter: blur(10px);
      display: flex;
      align-items: center;
    }

    .cosmic-logout-btn:hover {
      background: rgba(239, 68, 68, 0.2);
      border-color: rgba(239, 68, 68, 0.5);
      color: rgba(255, 255, 255, 1);
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
    }

    .cosmic-logout-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }

    /* Dashboard Cards */
    .cosmic-dashboard-card {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 16px;
      max-height: 85vh;
      overflow-y: auto;
    }

    .cosmic-dashboard-icon {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.2), rgba(67, 233, 123, 0.2));
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      color: rgba(255, 255, 255, 0.9);
    }

    /* Cosmic Stat Cards */
    .cosmic-stat-card {
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 12px;
      padding: 0.75rem;
      text-align: center;
      transition: all 0.3s ease;
      backdrop-filter: blur(10px);
      min-height: 80px;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .cosmic-stat-card:hover {
      background: rgba(255, 255, 255, 0.12);
      transform: translateY(-3px);
      box-shadow: 0 8px 25px rgba(255, 255, 255, 0.1);
    }

    .stat-icon {
      font-size: 1.2rem;
      margin-bottom: 0.3rem;
      filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
    }

    /* Order Cards */
    .cosmic-order-card {
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 12px;
      transition: all 0.3s ease;
      margin-bottom: 0.75rem;
      padding: 0.75rem;
    }

    .cosmic-order-card:hover {
      background: rgba(255, 255, 255, 0.12);
      transform: translateY(-1px);
      box-shadow: 0 4px 15px rgba(255, 255, 255, 0.1);
    }

    /* Status Dropdown */
    .cosmic-status-dropdown {
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: 8px;
      color: rgba(255, 255, 255, 0.9);
      padding: 0.5rem;
      font-family: 'Exo 2', sans-serif;
      font-weight: 600;
    }

    .cosmic-status-dropdown:focus {
      background: rgba(255, 255, 255, 0.15);
      border-color: rgba(255, 255, 255, 0.5);
      outline: none;
      box-shadow: 0 0 15px rgba(102, 126, 234, 0.3);
    }

    /* Delete Button */
    .cosmic-delete-btn {
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.3);
      border-radius: 8px;
      color: rgba(255, 255, 255, 0.8);
      padding: 0.5rem;
      transition: all 0.3s ease;
      cursor: pointer;
    }

    .cosmic-delete-btn:hover {
      background: rgba(239, 68, 68, 0.2);
      border-color: rgba(239, 68, 68, 0.5);
      color: rgba(255, 255, 255, 1);
      transform: scale(1.05);
    }

    /* Menu Form */
    .cosmic-menu-form {
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 16px;
      padding: 1.5rem;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .cosmic-restaurant-icon {
        width: 50px;
        height: 50px;
      }
      
      .cosmic-dashboard-icon {
        width: 40px;
        height: 40px;
      }
    }
    .min-h-screen {
      min-height: 100vh;
    }

    .bg-gradient-to-br {
      background: linear-gradient(to bottom right, #faf5ff, #fdf2f8, #fff7ed);
    }

    .backdrop-blur-lg {
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
    }

    .dashboard-card {
      animation: slideInUp 0.6s ease-out forwards;
      opacity: 0;
      transform: translateY(30px);
      background: rgba(255, 255, 255, 0.85);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.3);
    }

    /* 🌌 COSMIC MENU MODAL STYLES */
    .cosmic-menu-modal {
      background: rgba(255, 255, 255, 0.08);
      backdrop-filter: blur(20px);
      border: 2px solid rgba(255, 255, 255, 0.2);
      border-radius: 20px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
      animation: cosmic-modal-entrance 0.5s ease-out forwards;
    }

    .cosmic-modal-header {
      background: rgba(102, 126, 234, 0.1);
      border-bottom: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 20px 20px 0 0;
      padding: 1.5rem;
    }

    .cosmic-modal-icon {
      width: 50px;
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.3), rgba(67, 233, 123, 0.3));
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      color: rgba(255, 255, 255, 0.9);
      animation: cosmic-icon-pulse 2s ease-in-out infinite;
    }

    .cosmic-close-btn {
      background: rgba(239, 68, 68, 0.1);
      border: 2px solid rgba(239, 68, 68, 0.3);
      border-radius: 50%;
      color: rgba(255, 255, 255, 0.8);
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
      cursor: pointer;
    }

    .cosmic-close-btn:hover {
      background: rgba(239, 68, 68, 0.2);
      border-color: rgba(239, 68, 68, 0.5);
      color: rgba(255, 255, 255, 1);
      transform: scale(1.1);
    }

    .cosmic-modal-body {
      padding: 2rem;
      background: rgba(255, 255, 255, 0.02);
    }

    .cosmic-modal-footer {
      background: rgba(67, 233, 123, 0.1);
      border-top: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 0 0 20px 20px;
      padding: 1.5rem;
      display: flex;
      justify-content: flex-end;
      align-items: center;
    }

    /* Cosmic Alert */
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

    /* Cosmic Spinner */
    .cosmic-spinner {
      width: 18px;
      height: 18px;
      border: 2px solid rgba(255, 255, 255, 0.2);
      border-top: 2px solid rgba(255, 255, 255, 0.8);
      border-radius: 50%;
      animation: cosmic-spin 1s linear infinite;
      display: inline-block;
      flex-shrink: 0;
      vertical-align: middle;
    }

    /* Button spinner specific styling */
    .btn-cosmic-primary .cosmic-spinner,
    .btn-cosmic-secondary .cosmic-spinner {
      width: 18px;
      height: 18px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top: 2px solid rgba(255, 255, 255, 1);
      margin-right: 8px;
      flex-shrink: 0;
    }

    .cosmic-logout-btn .cosmic-spinner {
      width: 20px !important;
      height: 20px !important;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top: 2px solid rgba(255, 255, 255, 1);
      flex-shrink: 0;
    }

    /* Info tooltip for declined orders */
    .cosmic-info-tooltip {
      background: rgba(139, 69, 255, 0.1);
      border: 2px solid rgba(139, 69, 255, 0.3);
      border-radius: 10px;
      color: rgba(139, 69, 255, 0.9);
      padding: 8px;
      transition: all 0.3s ease;
      cursor: pointer;
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      backdrop-filter: blur(10px);
    }

    .cosmic-info-tooltip:hover {
      background: rgba(139, 69, 255, 0.2);
      border-color: rgba(139, 69, 255, 0.6);
      color: rgba(255, 255, 255, 1);
      transform: scale(1.1);
      box-shadow: 0 0 15px rgba(139, 69, 255, 0.4);
    }

    .cosmic-info-tooltip:active {
      transform: scale(0.95);
    }

    .cosmic-info-tooltip svg {
      width: 14px !important;
      height: 14px !important;
      flex-shrink: 0;
      transition: all 0.3s ease;
    }

    .cosmic-info-tooltip.pulsing {
      animation: cosmic-pulse 2s ease-in-out infinite;
    }

    @keyframes cosmic-pulse {
      0%, 100% { 
        background: rgba(255, 193, 7, 0.1);
        border-color: rgba(255, 193, 7, 0.4);
        box-shadow: 0 0 10px rgba(255, 193, 7, 0.3);
      }
      50% { 
        background: rgba(255, 193, 7, 0.2);
        border-color: rgba(255, 193, 7, 0.7);
        box-shadow: 0 0 20px rgba(255, 193, 7, 0.5);
        transform: scale(1.05);
      }
    }

    @keyframes cosmic-modal-entrance {
      0% {
        opacity: 0;
        transform: scale(0.8) translateY(-50px);
      }
      100% {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
    }

    @keyframes cosmic-icon-pulse {
      0%, 100% {
        box-shadow: 0 0 15px rgba(102, 126, 234, 0.3);
      }
      50% {
        box-shadow: 0 0 25px rgba(67, 233, 123, 0.5);
      }
    }

    @keyframes cosmic-spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .order-card, .menu-item-card {
      animation: fadeInLeft 0.6s ease-out forwards;
      opacity: 0;
      transform: translateX(-20px);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .order-card:hover, .menu-item-card:hover {
      transform: translateX(0) scale(1.02);
      background: rgba(255, 255, 255, 0.2);
    }

    .stat-card {
      animation: bounceIn 0.6s ease-out forwards;
      transition: all 0.3s ease;
    }

    .stat-card:hover {
      transform: translateY(-5px) scale(1.05);
    }

    .icon-container {
      background: linear-gradient(135deg, #8b5cf6, #ec4899);
      transition: all 0.3s ease;
    }

    .icon-container:hover {
      transform: rotate(10deg) scale(1.1);
    }

    .restaurant-icon {
      background: linear-gradient(135deg, #8b5cf6, #ec4899);
    }

    .logout-btn, .add-item-btn, .submit-btn {
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }

    .logout-btn:hover, .add-item-btn:hover, .submit-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(239, 68, 68, 0.3);
    }

    .button-ripple {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 0;
      height: 0;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.3);
      transform: translate(-50%, -50%);
      transition: width 0.6s, height 0.6s;
    }

    .logout-btn:active .button-ripple,
    .add-item-btn:active .button-ripple,
    .submit-btn:active .button-ripple {
      width: 300px;
      height: 300px;
    }

    /* Status Badge */
    .status-badge {
      font-size: 0.75rem;
      padding: 6px 12px;
      border-radius: 20px;
      font-weight: 600;
      text-transform: uppercase;
      white-space: nowrap;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 80px;
    }

    .status-pending { 
      background: rgba(251, 191, 36, 0.2); 
      color: rgba(251, 191, 36, 1); 
      border: 1px solid rgba(251, 191, 36, 0.3);
    }
    .status-accepted { 
      background: rgba(34, 197, 94, 0.2); 
      color: rgba(34, 197, 94, 1); 
      border: 1px solid rgba(34, 197, 94, 0.3);
    }
    .status-declined { 
      background: rgba(239, 68, 68, 0.2); 
      color: rgba(239, 68, 68, 1); 
      border: 1px solid rgba(239, 68, 68, 0.3);
    }
    .status-in_cooking { 
      background: rgba(139, 92, 246, 0.2); 
      color: rgba(139, 92, 246, 1); 
      border: 1px solid rgba(139, 92, 246, 0.3);
    }
    .status-out_for_delivery { 
      background: rgba(59, 130, 246, 0.2); 
      color: rgba(59, 130, 246, 1); 
      border: 1px solid rgba(59, 130, 246, 0.3);
    }
    .status-completed { 
      background: rgba(16, 185, 129, 0.2); 
      color: rgba(255, 255, 255, 1); 
      border: 1px solid rgba(16, 185, 129, 0.3);
    }
    .status-cancelled { 
      background: rgba(239, 68, 68, 0.2); 
      color: rgba(239, 68, 68, 1); 
      border: 1px solid rgba(239, 68, 68, 0.3);
    }

    /* Cosmic Item Tags */
    .cosmic-item-tag {
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(5px);
      transition: all 0.3s ease;
    }

    .cosmic-item-tag:hover {
      background: rgba(255, 255, 255, 0.15);
      transform: scale(1.05);
    }

    .diet-badge {
      font-size: 0.75rem;
      padding: 2px 8px;
      border-radius: 8px;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .diet-badge.veg {
      background: #dcfce7;
      color: #16a34a;
      border: 1px solid #22c55e;
    }

    .diet-badge.non-veg {
      background: #fecaca;
      color: #dc2626;
      border: 1px solid #ef4444;
    }

    .diet-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
    }

    .diet-badge.veg .diet-dot {
      background: #22c55e;
    }

    .diet-badge.non-veg .diet-dot {
      background: #ef4444;
    }

    .veg-dot {
      width: 8px;
      height: 8px;
      display: inline-block;
    }

    .item-tag {
      font-size: 0.7rem;
      font-weight: 500;
    }

    .status-select {
      background: rgba(255, 255, 255, 0.8);
      border: 1px solid rgba(255, 255, 255, 0.3);
      backdrop-filter: blur(10px);
      min-width: 120px;
    }

    /* Cosmic Input Groups - Fixed icon positioning */
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
      width: 20px;
      height: 20px;
    }

    /* Fix icon positioning for textarea */
    .cosmic-input-group textarea + .cosmic-input-icon,
    .cosmic-input-group:has(textarea) .cosmic-input-icon {
      top: 20px;
      transform: translateY(0);
    }

    .form-control-cosmic:focus ~ .cosmic-input-icon {
      color: rgba(255, 255, 255, 0.9);
      transform: translateY(-50%) scale(1.1);
    }

    .form-control-cosmic:focus ~ textarea ~ .cosmic-input-icon,
    .cosmic-input-group:has(textarea:focus) .cosmic-input-icon {
      transform: translateY(0) scale(1.1);
    }

    /* Modal Improvements */
    .cosmic-menu-modal {
      background: rgba(255, 255, 255, 0.08);
      backdrop-filter: blur(20px);
      border: 2px solid rgba(255, 255, 255, 0.2);
      border-radius: 20px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
      animation: cosmic-modal-entrance 0.5s ease-out forwards;
      max-height: 85vh;
      overflow-y: auto;
    }

    .cosmic-modal-header {
      background: rgba(102, 126, 234, 0.1);
      border-bottom: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 20px 20px 0 0;
      padding: 1.5rem;
    }

    .cosmic-modal-icon {
      width: 50px;
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.3), rgba(67, 233, 123, 0.3));
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      color: rgba(255, 255, 255, 0.9);
      animation: cosmic-icon-pulse 2s ease-in-out infinite;
    }

    .cosmic-close-btn {
      background: rgba(239, 68, 68, 0.1);
      border: 2px solid rgba(239, 68, 68, 0.3);
      border-radius: 50%;
      color: rgba(255, 255, 255, 0.8);
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
      cursor: pointer;
    }

    .cosmic-close-btn:hover {
      background: rgba(239, 68, 68, 0.2);
      border-color: rgba(239, 68, 68, 0.5);
      color: rgba(255, 255, 255, 1);
      transform: scale(1.1);
    }

    .cosmic-modal-body {
      padding: 2rem;
      background: rgba(255, 255, 255, 0.02);
    }

    .cosmic-modal-footer {
      background: rgba(67, 233, 123, 0.1);
      border-top: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 0 0 20px 20px;
      padding: 1.5rem;
      display: flex;
      justify-content: flex-end;
      align-items: center;
    }

    /* Cosmic Alert */
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

    /* Cosmic Spinner */
    .cosmic-spinner {
      width: 18px;
      height: 18px;
      border: 2px solid rgba(255, 255, 255, 0.2);
      border-top: 2px solid rgba(255, 255, 255, 0.8);
      border-radius: 50%;
      animation: cosmic-spin 1s linear infinite;
      display: inline-block;
      flex-shrink: 0;
      vertical-align: middle;
    }

    /* Button spinner specific styling */
    .btn-cosmic-primary .cosmic-spinner,
    .btn-cosmic-secondary .cosmic-spinner {
      width: 18px;
      height: 18px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top: 2px solid rgba(255, 255, 255, 1);
      margin-right: 8px;
      flex-shrink: 0;
    }

    .cosmic-logout-btn .cosmic-spinner {
      width: 20px !important;
      height: 20px !important;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top: 2px solid rgba(255, 255, 255, 1);
      flex-shrink: 0;
    }

    /* Info tooltip for declined orders */
    .cosmic-info-tooltip {
      background: rgba(139, 69, 255, 0.1);
      border: 2px solid rgba(139, 69, 255, 0.3);
      border-radius: 10px;
      color: rgba(139, 69, 255, 0.9);
      padding: 8px;
      transition: all 0.3s ease;
      cursor: pointer;
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      backdrop-filter: blur(10px);
    }

    .cosmic-info-tooltip:hover {
      background: rgba(139, 69, 255, 0.2);
      border-color: rgba(139, 69, 255, 0.6);
      color: rgba(255, 255, 255, 1);
      transform: scale(1.1);
      box-shadow: 0 0 15px rgba(139, 69, 255, 0.4);
    }

    .cosmic-info-tooltip:active {
      transform: scale(0.95);
    }

    .cosmic-info-tooltip svg {
      width: 14px !important;
      height: 14px !important;
      flex-shrink: 0;
      transition: all 0.3s ease;
    }

    @keyframes cosmic-modal-entrance {
      0% {
        opacity: 0;
        transform: scale(0.8) translateY(-50px);
      }
      100% {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
    }

    @keyframes cosmic-icon-pulse {
      0%, 100% {
        box-shadow: 0 0 15px rgba(102, 126, 234, 0.3);
      }
      50% {
        box-shadow: 0 0 25px rgba(67, 233, 123, 0.5);
      }
    }

    @keyframes cosmic-spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .order-card, .menu-item-card {
      animation: fadeInLeft 0.6s ease-out forwards;
      opacity: 0;
      transform: translateX(-20px);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .order-card:hover, .menu-item-card:hover {
      transform: translateX(0) scale(1.02);
      background: rgba(255, 255, 255, 0.2);
    }

    .stat-card {
      animation: bounceIn 0.6s ease-out forwards;
      transition: all 0.3s ease;
    }

    .stat-card:hover {
      transform: translateY(-5px) scale(1.05);
    }

    .icon-container {
      background: linear-gradient(135deg, #8b5cf6, #ec4899);
      transition: all 0.3s ease;
    }

    .icon-container:hover {
      transform: rotate(10deg) scale(1.1);
    }

    .restaurant-icon {
      background: linear-gradient(135deg, #8b5cf6, #ec4899);
    }

    .logout-btn, .add-item-btn, .submit-btn {
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }

    .logout-btn:hover, .add-item-btn:hover, .submit-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(239, 68, 68, 0.3);
    }

    .button-ripple {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 0;
      height: 0;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.3);
      transform: translate(-50%, -50%);
      transition: width 0.6s, height 0.6s;
    }

    .logout-btn:active .button-ripple,
    .add-item-btn:active .button-ripple,
    .submit-btn:active .button-ripple {
      width: 300px;
      height: 300px;
    }

    /* Status Badge */
    .status-badge {
      font-size: 0.75rem;
      padding: 6px 12px;
      border-radius: 20px;
      font-weight: 600;
      text-transform: uppercase;
      white-space: nowrap;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 80px;
    }

    .status-pending { 
      background: rgba(251, 191, 36, 0.2); 
      color: rgba(251, 191, 36, 1); 
      border: 1px solid rgba(251, 191, 36, 0.3);
    }
    .status-accepted { 
      background: rgba(34, 197, 94, 0.2); 
      color: rgba(34, 197, 94, 1); 
      border: 1px solid rgba(34, 197, 94, 0.3);
    }
    .status-declined { 
      background: rgba(239, 68, 68, 0.2); 
      color: rgba(239, 68, 68, 1); 
      border: 1px solid rgba(239, 68, 68, 0.3);
    }
    .status-in_cooking { 
      background: rgba(139, 92, 246, 0.2); 
      color: rgba(139, 92, 246, 1); 
      border: 1px solid rgba(139, 92, 246, 0.3);
    }
    .status-out_for_delivery { 
      background: rgba(59, 130, 246, 0.2); 
      color: rgba(59, 130, 246, 1); 
      border: 1px solid rgba(59, 130, 246, 0.3);
    }
    .status-completed { 
      background: rgba(16, 185, 129, 0.2); 
      color: rgba(255, 255, 255, 1); 
      border: 1px solid rgba(16, 185, 129, 0.3);
    }
    .status-cancelled { 
      background: rgba(239, 68, 68, 0.2); 
      color: rgba(239, 68, 68, 1); 
      border: 1px solid rgba(239, 68, 68, 0.3);
    }

    /* Cosmic Item Tags */
    .cosmic-item-tag {
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(5px);
      transition: all 0.3s ease;
    }

    .cosmic-item-tag:hover {
      background: rgba(255, 255, 255, 0.15);
      transform: scale(1.05);
    }

    .diet-badge {
      font-size: 0.75rem;
      padding: 2px 8px;
      border-radius: 8px;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .diet-badge.veg {
      background: #dcfce7;
      color: #16a34a;
      border: 1px solid #22c55e;
    }

    .diet-badge.non-veg {
      background: #fecaca;
      color: #dc2626;
      border: 1px solid #ef4444;
    }

    .diet-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
    }

    .diet-badge.veg .diet-dot {
      background: #22c55e;
    }

    .diet-badge.non-veg .diet-dot {
      background: #ef4444;
    }

    .veg-dot {
      width: 8px;
      height: 8px;
      display: inline-block;
    }

    .item-tag {
      font-size: 0.7rem;
      font-weight: 500;
    }

    .status-select {
      background: rgba(255, 255, 255, 0.8);
      border: 1px solid rgba(255, 255, 255, 0.3);
      backdrop-filter: blur(10px);
      min-width: 120px;
    }

    /* Cosmic Input Groups - Fixed icon positioning */
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
      width: 20px;
      height: 20px;
    }

    /* Fix icon positioning for textarea */
    .cosmic-input-group textarea + .cosmic-input-icon,
    .cosmic-input-group:has(textarea) .cosmic-input-icon {
      top: 20px;
      transform: translateY(0);
    }

    .form-control-cosmic:focus ~ .cosmic-input-icon {
      color: rgba(255, 255, 255, 0.9);
      transform: translateY(-50%) scale(1.1);
    }

    .form-control-cosmic:focus ~ textarea ~ .cosmic-input-icon,
    .cosmic-input-group:has(textarea:focus) .cosmic-input-icon {
      transform: translateY(0) scale(1.1);
    }

    /* Modal Improvements */
    .cosmic-menu-modal {
      background: rgba(255, 255, 255, 0.08);
      backdrop-filter: blur(20px);
      border: 2px solid rgba(255, 255, 255, 0.2);
      border-radius: 20px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
      animation: cosmic-modal-entrance 0.5s ease-out forwards;
      max-height: 85vh;
      overflow-y: auto;
    }

    .cosmic-modal-header {
      background: rgba(102, 126, 234, 0.1);
      border-bottom: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 20px 20px 0 0;
      padding: 1.5rem;
    }

    .cosmic-modal-icon {
      width: 50px;
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.3), rgba(67, 233, 123, 0.3));
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      color: rgba(255, 255, 255, 0.9);
      animation: cosmic-icon-pulse 2s ease-in-out infinite;
    }

    .cosmic-close-btn {
      background: rgba(239, 68, 68, 0.1);
      border: 2px solid rgba(239, 68, 68, 0.3);
      border-radius: 50%;
      color: rgba(255, 255, 255, 0.8);
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
      cursor: pointer;
    }

    .cosmic-close-btn:hover {
      background: rgba(239, 68, 68, 0.2);
      border-color: rgba(239, 68, 68, 0.5);
      color: rgba(255, 255, 255, 1);
      transform: scale(1.1);
    }

    .cosmic-modal-body {
      padding: 2rem;
      background: rgba(255, 255, 255, 0.02);
    }

    .cosmic-modal-footer {
      background: rgba(67, 233, 123, 0.1);
      border-top: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 0 0 20px 20px;
      padding: 1.5rem;
      display: flex;
      justify-content: flex-end;
      align-items: center;
    }

    /* Cosmic Alert */
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

    /* Cosmic Spinner */
    .cosmic-spinner {
      width: 18px;
      height: 18px;
      border: 2px solid rgba(255, 255, 255, 0.2);
      border-top: 2px solid rgba(255, 255, 255, 0.8);
      border-radius: 50%;
      animation: cosmic-spin 1s linear infinite;
      display: inline-block;
      flex-shrink: 0;
      vertical-align: middle;
    }

    /* Button spinner specific styling */
    .btn-cosmic-primary .cosmic-spinner,
    .btn-cosmic-secondary .cosmic-spinner {
      width: 18px;
      height: 18px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top: 2px solid rgba(255, 255, 255, 1);
      margin-right: 8px;
      flex-shrink: 0;
    }

    .cosmic-logout-btn .cosmic-spinner {
      width: 20px !important;
      height: 20px !important;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top: 2px solid rgba(255, 255, 255, 1);
      flex-shrink: 0;
    }

    /* Info tooltip for declined orders */
    .cosmic-info-tooltip {
      background: rgba(139, 69, 255, 0.1);
      border: 2px solid rgba(139, 69, 255, 0.3);
      border-radius: 10px;
      color: rgba(139, 69, 255, 0.9);
      padding: 8px;
      transition: all 0.3s ease;
      cursor: pointer;
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      backdrop-filter: blur(10px);
    }

    .cosmic-info-tooltip:hover {
      background: rgba(139, 69, 255, 0.2);
      border-color: rgba(139, 69, 255, 0.6);
      color: rgba(255, 255, 255, 1);
      transform: scale(1.1);
      box-shadow: 0 0 15px rgba(139, 69, 255, 0.4);
    }

    .cosmic-info-tooltip:active {
      transform: scale(0.95);
    }

    .cosmic-info-tooltip svg {
      width: 14px !important;
      height: 14px !important;
      flex-shrink: 0;
      transition: all 0.3s ease;
    }

    @keyframes cosmic-modal-entrance {
      0% {
        opacity: 0;
        transform: scale(0.8) translateY(-50px);
      }
      100% {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
    }

    @keyframes cosmic-icon-pulse {
      0%, 100% {
        box-shadow: 0 0 15px rgba(102, 126, 234, 0.3);
      }
      50% {
        box-shadow: 0 0 25px rgba(67, 233, 123, 0.5);
      }
    }

    @keyframes cosmic-spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .order-card, .menu-item-card {
      animation: fadeInLeft 0.6s ease-out forwards;
      opacity: 0;
      transform: translateX(-20px);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .order-card:hover, .menu-item-card:hover {
      transform: translateX(0) scale(1.02);
      background: rgba(255, 255, 255, 0.2);
    }

    .stat-card {
      animation: bounceIn 0.6s ease-out forwards;
      transition: all 0.3s ease;
    }

    .stat-card:hover {
      transform: translateY(-5px) scale(1.05);
    }

    .icon-container {
      background: linear-gradient(135deg, #8b5cf6, #ec4899);
      transition: all 0.3s ease;
    }

    .icon-container:hover {
      transform: rotate(10deg) scale(1.1);
    }

    .restaurant-icon {
      background: linear-gradient(135deg, #8b5cf6, #ec4899);
    }

    .logout-btn, .add-item-btn, .submit-btn {
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }

    .logout-btn:hover, .add-item-btn:hover, .submit-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(239, 68, 68, 0.3);
    }

    .button-ripple {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 0;
      height: 0;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.3);
      transform: translate(-50%, -50%);
      transition: width 0.6s, height 0.6s;
    }

    .logout-btn:active .button-ripple,
    .add-item-btn:active .button-ripple,
    .submit-btn:active .button-ripple {
      width: 300px;
      height: 300px;
    }

    /* Status Badge */
    .status-badge {
      font-size: 0.75rem;
      padding: 6px 12px;
      border-radius: 20px;
      font-weight: 600;
      text-transform: uppercase;
      white-space: nowrap;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 80px;
    }

    .status-pending { 
      background: rgba(251, 191, 36, 0.2); 
      color: rgba(251, 191, 36, 1); 
      border: 1px solid rgba(251, 191, 36, 0.3);
    }
    .status-accepted { 
      background: rgba(34, 197, 94, 0.2); 
      color: rgba(34, 197, 94, 1); 
      border: 1px solid rgba(34, 197, 94, 0.3);
    }
    .status-declined { 
      background: rgba(239, 68, 68, 0.2); 
      color: rgba(239, 68, 68, 1); 
      border: 1px solid rgba(239, 68, 68, 0.3);
    }
    .status-in_cooking { 
      background: rgba(139, 92, 246, 0.2); 
      color: rgba(139, 92, 246, 1); 
      border: 1px solid rgba(139, 92, 246, 0.3);
    }
    .status-out_for_delivery { 
      background: rgba(59, 130, 246, 0.2); 
      color: rgba(59, 130, 246, 1); 
      border: 1px solid rgba(59, 130, 246, 0.3);
    }
    .status-completed { 
      background: rgba(16, 185, 129, 0.2); 
      color: rgba(255, 255, 255, 1); 
      border: 1px solid rgba(16, 185, 129, 0.3);
    }
    .status-cancelled { 
      background: rgba(239, 68, 68, 0.2); 
      color: rgba(239, 68, 68, 1); 
      border: 1px solid rgba(239, 68, 68, 0.3);
    }

    /* Cosmic Item Tags */
    .cosmic-item-tag {
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(5px);
      transition: all 0.3s ease;
    }

    .cosmic-item-tag:hover {
      background: rgba(255, 255, 255, 0.15);
      transform: scale(1.05);
    }

    .diet-badge {
      font-size: 0.75rem;
      padding: 2px 8px;
      border-radius: 8px;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .diet-badge.veg {
      background: #dcfce7;
      color: #16a34a;
      border: 1px solid #22c55e;
    }

    .diet-badge.non-veg {
      background: #fecaca;
      color: #dc2626;
      border: 1px solid #ef4444;
    }

    .diet-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
    }

    .diet-badge.veg .diet-dot {
      background: #22c55e;
    }

    .diet-badge.non-veg .diet-dot {
      background: #ef4444;
    }

    .veg-dot {
      width: 8px;
      height: 8px;
      display: inline-block;
    }

    .item-tag {
      font-size: 0.7rem;
      font-weight: 500;
    }

    .status-select {
      background: rgba(255, 255, 255, 0.8);
      border: 1px solid rgba(255, 255, 255, 0.3);
      backdrop-filter: blur(10px);
      min-width: 120px;
    }

    /* Cosmic Input Groups - Fixed icon positioning */
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
      width: 20px;
      height: 20px;
    }

    /* Fix icon positioning for textarea */
    .cosmic-input-group textarea + .cosmic-input-icon,
    .cosmic-input-group:has(textarea) .cosmic-input-icon {
      top: 20px;
      transform: translateY(0);
    }

    .form-control-cosmic:focus ~ .cosmic-input-icon {
      color: rgba(255, 255, 255, 0.9);
      transform: translateY(-50%) scale(1.1);
    }

    .form-control-cosmic:focus ~ textarea ~ .cosmic-input-icon,
    .cosmic-input-group:has(textarea:focus) .cosmic-input-icon {
      transform: translateY(0) scale(1.1);
    }

    /* Modal Improvements */
    .cosmic-menu-modal {
      background: rgba(255, 255, 255, 0.08);
      backdrop-filter: blur(20px);
      border: 2px solid rgba(255, 255, 255, 0.2);
      border-radius: 20px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
      animation: cosmic-modal-entrance 0.5s ease-out forwards;
      max-height: 85vh;
      overflow-y: auto;
    }

    .cosmic-modal-header {
      background: rgba(102, 126, 234, 0.1);
      border-bottom: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 20px 20px 0 0;
      padding: 1.5rem;
    }

    .cosmic-modal-icon {
      width: 50px;
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.3), rgba(67, 233, 123, 0.3));
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      color: rgba(255, 255, 255, 0.9);
      animation: cosmic-icon-pulse 2s ease-in-out infinite;
    }

    .cosmic-close-btn {
      background: rgba(239, 68, 68, 0.1);
      border: 2px solid rgba(239, 68, 68, 0.3);
      border-radius: 50%;
      color: rgba(255, 255, 255, 0.8);
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
      cursor: pointer;
    }

    .cosmic-close-btn:hover {
      background: rgba(239, 68, 68, 0.2);
      border-color: rgba(239, 68, 68, 0.5);
      color: rgba(255, 255, 255, 1);
      transform: scale(1.1);
    }

    .cosmic-modal-body {
      padding: 2rem;
      background: rgba(255, 255, 255, 0.02);
    }

    .cosmic-modal-footer {
      background: rgba(67, 233, 123, 0.1);
      border-top: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 0 0 20px 20px;
      padding: 1.5rem;
      display: flex;
      justify-content: flex-end;
      align-items: center;
    }

    /* Cosmic Alert */
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

    /* Cosmic Spinner */
    .cosmic-spinner {
      width: 18px;
      height: 18px;
      border: 2px solid rgba(255, 255, 255, 0.2);
      border-top: 2px solid rgba(255, 255, 255, 0.8);
      border-radius: 50%;
      animation: cosmic-spin 1s linear infinite;
      display: inline-block;
      flex-shrink: 0;
      vertical-align: middle;
    }

    /* Button spinner specific styling */
    .btn-cosmic-primary .cosmic-spinner,
    .btn-cosmic-secondary .cosmic-spinner {
      width: 18px;
      height: 18px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top: 2px solid rgba(255, 255, 255, 1);
      margin-right: 8px;
      flex-shrink: 0;
    }

    .cosmic-logout-btn .cosmic-spinner {
      width: 20px !important;
      height: 20px !important;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top: 2px solid rgba(255, 255, 255, 1);
      flex-shrink: 0;
    }

    /* Info tooltip for declined orders */
    .cosmic-info-tooltip {
      background: rgba(139, 69, 255, 0.1);
      border: 2px solid rgba(139, 69, 255, 0.3);
      border-radius: 10px;
      color: rgba(139, 69, 255, 0.9);
      padding: 8px;
      transition: all 0.3s ease;
      cursor: pointer;
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      backdrop-filter: blur(10px);
    }

    .cosmic-info-tooltip:hover {
      background: rgba(139, 69, 255, 0.2);
      border-color: rgba(139, 69, 255, 0.6);
      color: rgba(255, 255, 255, 1);
      transform: scale(1.1);
      box-shadow: 0 0 15px rgba(139, 69, 255, 0.4);
    }

    .cosmic-info-tooltip:active {
      transform: scale(0.95);
    }

    .cosmic-info-tooltip svg {
      width: 14px !important;
      height: 14px !important;
      flex-shrink: 0;
      transition: all 0.3s ease;
    }

    @keyframes cosmic-modal-entrance {
      0% {
        opacity: 0;
        transform: scale(0.8) translateY(-50px);
      }
      100% {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
    }

    @keyframes cosmic-icon-pulse {
      0%, 100% {
        box-shadow: 0 0 15px rgba(102, 126, 234, 0.3);
      }
      50% {
        box-shadow: 0 0 25px rgba(67, 233, 123, 0.5);
      }
    }

    @keyframes cosmic-spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .order-card, .menu-item-card {
      animation: fadeInLeft 0.6s ease-out forwards;
      opacity: 0;
      transform: translateX(-20px);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .order-card:hover, .menu-item-card:hover {
      transform: translateX(0) scale(1.02);
      background: rgba(255, 255, 255, 0.2);
    }

    .stat-card {
      animation: bounceIn 0.6s ease-out forwards;
      transition: all 0.3s ease;
    }

    .stat-card:hover {
      transform: translateY(-5px) scale(1.05);
    }

    .icon-container {
      background: linear-gradient(135deg, #8b5cf6, #ec4899);
      transition: all 0.3s ease;
    }

    .icon-container:hover {
      transform: rotate(10deg) scale(1.1);
    }

    .restaurant-icon {
      background: linear-gradient(135deg, #8b5cf6, #ec4899);
    }

    .logout-btn, .add-item-btn, .submit-btn {
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }

    .logout-btn:hover, .add-item-btn:hover, .submit-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(239, 68, 68, 0.3);
    }

    .button-ripple {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 0;
      height: 0;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.3);
      transform: translate(-50%, -50%);
      transition: width 0.6s, height 0.6s;
    }

    .logout-btn:active .button-ripple,
    .add-item-btn:active .button-ripple,
    .submit-btn:active .button-ripple {
      width: 300px;
      height: 300px;
    }

    /* Status Badge */
    .status-badge {
      font-size: 0.75rem;
      padding: 6px 12px;
      border-radius: 20px;
      font-weight: 600;
      text-transform: uppercase;
      white-space: nowrap;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 80px;
    }

    .status-pending { 
      background: rgba(251, 191, 36, 0.2); 
      color: rgba(251, 191, 36, 1); 
      border: 1px solid rgba(251, 191, 36, 0.3);
    }
    .status-accepted { 
      background: rgba(34, 197, 94, 0.2); 
      color: rgba(34, 197, 94, 1); 
      border: 1px solid rgba(34, 197, 94, 0.3);
    }
    .status-declined { 
      background: rgba(239, 68, 68, 0.2); 
      color: rgba(239, 68, 68, 1); 
      border: 1px solid rgba(239, 68, 68, 0.3);
    }
    .status-in_cooking { 
      background: rgba(139, 92, 246, 0.2); 
      color: rgba(139, 92, 246, 1); 
      border: 1px solid rgba(139, 92, 246, 0.3);
    }
    .status-out_for_delivery { 
      background: rgba(59, 130, 246, 0.2); 
      color: rgba(59, 130, 246, 1); 
      border: 1px solid rgba(59, 130, 246, 0.3);
    }
    .status-completed { 
      background: rgba(16, 185, 129, 0.2); 
      color: rgba(255, 255, 255, 1); 
      border: 1px solid rgba(16, 185, 129, 0.3);
    }
    .status-cancelled { 
      background: rgba(239, 68, 68, 0.2); 
      color: rgba(239, 68, 68, 1); 
      border: 1px solid rgba(239, 68, 68, 0.3);
    }

    /* Cosmic Item Tags */
    .cosmic-item-tag {
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(5px);
      transition: all 0.3s ease;
    }

    .cosmic-item-tag:hover {
      background: rgba(255, 255, 255, 0.15);
      transform: scale(1.05);
    }

    .diet-badge {
      font-size: 0.75rem;
      padding: 2px 8px;
      border-radius: 8px;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .diet-badge.veg {
      background: #dcfce7;
      color: #16a34a;
      border: 1px solid #22c55e;
    }

    .diet-badge.non-veg {
      background: #fecaca;
      color: #dc2626;
      border: 1px solid #ef4444;
    }

    .diet-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
    }

    .diet-badge.veg .diet-dot {
      background: #22c55e;
    }

    .diet-badge.non-veg .diet-dot {
      background: #ef4444;
    }

    .veg-dot {
      width: 8px;
      height: 8px;
      display: inline-block;
    }

    .item-tag {
      font-size: 0.7rem;
      font-weight: 500;
    }

    .status-select {
      background: rgba(255, 255, 255, 0.8);
      border: 1px solid rgba(255, 255, 255, 0.3);
      backdrop-filter: blur(10px);
      min-width: 120px;
    }

    /* Cosmic Input Groups - Fixed icon positioning */
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
      width: 20px;
      height: 20px;
    }

    /* Fix icon positioning for textarea */
    .cosmic-input-group textarea + .cosmic-input-icon,
    .cosmic-input-group:has(textarea) .cosmic-input-icon {
      top: 20px;
      transform: translateY(0);
    }

    .form-control-cosmic:focus ~ .cosmic-input-icon {
      color: rgba(255, 255, 255, 0.9);
      transform: translateY(-50%) scale(1.1);
    }

    .form-control-cosmic:focus ~ textarea ~ .cosmic-input-icon,
    .cosmic-input-group:has(textarea:focus) .cosmic-input-icon {
      transform: translateY(0) scale(1.1);
    }

    /* Modal Improvements */
    .cosmic-menu-modal {
      background: rgba(255, 255, 255, 0.08);
      backdrop-filter: blur(20px);
      border: 2px solid rgba(255, 255, 255, 0.2);
      border-radius: 20px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
      animation: cosmic-modal-entrance 0.5s ease-out forwards;
      max-height: 85vh;
      overflow-y: auto;
    }

    .cosmic-modal-header {
      background: rgba(102, 126, 234, 0.1);
      border-bottom: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 20px 20px 0 0;
      padding: 1.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: relative;
    }

    .cosmic-close-btn {
      background: rgba(239, 68, 68, 0.1);
      border: 2px solid rgba(239, 68, 68, 0.3);
      border-radius: 50%;
      color: rgba(255, 255, 255, 0.8);
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
      cursor: pointer;
      position: absolute;
      top: 1rem;
      right: 1rem;
    }

    .cosmic-close-btn:hover {
      background: rgba(239, 68, 68, 0.2);
      border-color: rgba(239, 68, 68, 0.5);
      color: rgba(255, 255, 255, 1);
      transform: scale(1.1);
    }

    .cosmic-modal-body {
      padding: 1.5rem;
      background: rgba(255, 255, 255, 0.02);
    }

    .cosmic-modal-footer {
      background: rgba(67, 233, 123, 0.1);
      border-top: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 0 0 20px 20px;
      padding: 1.5rem;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      gap: 1rem;
    }

    /* Modal form spacing improvements */
    .cosmic-modal-body .mb-4 {
      margin-bottom: 1.5rem !important;
    }

    .cosmic-modal-body .mb-4:last-child {
      margin-bottom: 1rem !important;
    }

    /* Delete Button - Fixed icon compression */
    .cosmic-delete-btn {
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.3);
      border-radius: 8px;
      color: rgba(255, 255, 255, 0.8);
      padding: 8px;
      transition: all 0.3s ease;
      cursor: pointer;
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .cosmic-delete-btn:hover {
      background: rgba(239, 68, 68, 0.2);
      border-color: rgba(239, 68, 68, 0.5);
      color: rgba(255, 255, 255, 1);
      transform: scale(1.05);
    }

    .cosmic-delete-btn svg {
      width: 16px !important;
      height: 16px !important;
      flex-shrink: 0;
    }

    /* Logout Button - Fixed icon compression */
    .cosmic-logout-btn {
      background: rgba(239, 68, 68, 0.1);
      border: 2px solid rgba(239, 68, 68, 0.3);
      border-radius: 12px;
      color: rgba(255, 255, 255, 0.9);
      padding: 0.75rem 1.5rem;
      font-weight: 600;
      font-family: 'Exo 2', sans-serif;
      transition: all 0.3s ease;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }

    .cosmic-logout-btn:hover {
      background: rgba(239, 68, 68, 0.2);
      border-color: rgba(239, 68, 68, 0.5);
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(239, 68, 68, 0.3);
    }

    .cosmic-logout-btn svg {
      width: 20px !important;
      height: 20px !important;
      flex-shrink: 0;
    }

    .cosmic-logout-btn .cosmic-spinner {
      width: 20px !important;
      height: 20px !important;
      flex-shrink: 0;
    }

    /* Shadow for cards */
    .shadow-2xl {
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    }

    .counter {
      animation: countUp 1s ease-out;
    }

    @keyframes slideInUp {
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes fadeInLeft {
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    @keyframes bounceIn {
      0% {
        opacity: 0;
        transform: scale(0.3);
      }
      50% {
        opacity: 1;
        transform: scale(1.05);
      }
      70% {
        transform: scale(0.9);
      }
      100% {
        opacity: 1;
        transform: scale(1);
      }
    }

    @keyframes countUp {
      from {
        transform: translateY(20px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    /* Mobile Responsiveness */
    @media (max-width: 768px) {
      .container {
        padding: 0 1rem;
      }
      
      .dashboard-card {
        margin-bottom: 1rem;
      }
      
      .order-card, .menu-item-card {
        padding: 1rem !important;
      }
    }

    /* Completed text color */
    .space-text-completed {
      color: rgba(34, 197, 94, 0.9) !important;
      font-weight: 600;
    }

    /* Restaurant Typewriter Styles */
    .restaurant-description {
      max-width: 400px;
      min-height: 20px;
    }

    .restaurant-typewriter {
      font-size: 0.85rem;
      font-style: italic;
      font-weight: 500;
      text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
      letter-spacing: 0.3px;
    }

    /* Cosmic Notifications Container */
    .cosmic-notifications-container {
      position: fixed;
      top: 2rem;
      right: 2rem;
      z-index: 9999;
      pointer-events: none;
      max-width: 400px;
    }

    .cosmic-notifications-container > * {
      pointer-events: auto;
      margin-bottom: 1rem;
    }

    @media (max-width: 768px) {
      .cosmic-notifications-container {
        top: 1rem;
        right: 1rem;
        left: 1rem;
        max-width: none;
      }
    }

    /* Price Styling */
    .price {
      color: #22c55e !important;
      text-shadow: 0 1px 3px rgba(34, 197, 94, 0.3);
      font-weight: 700 !important;
    }

    /* Modal Loading Overlay */
    .modal-loading-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.8);
      backdrop-filter: blur(10px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      border-radius: 20px;
    }

    .loading-content {
      text-align: center;
      color: rgba(255, 255, 255, 0.9);
    }

    .cosmic-spinner-large {
      width: 60px;
      height: 60px;
      border: 4px solid rgba(255, 255, 255, 0.2);
      border-top: 4px solid rgba(67, 233, 123, 0.8);
      border-radius: 50%;
      animation: cosmic-spin 1s linear infinite;
      margin: 0 auto 1rem;
    }

    .loading-text {
      font-size: 1.1rem;
      font-weight: 600;
      margin: 0;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
    }

    /* Cosmic Select Dropdown */
    .form-control-cosmic[type="select"],
    .form-control-cosmic select,
    select.form-control-cosmic {
      background: rgba(255, 255, 255, 0.1) !important;
      border: 2px solid rgba(255, 255, 255, 0.2) !important;
      border-radius: 15px !important;
      color: rgba(255, 255, 255, 0.9) !important;
      backdrop-filter: blur(10px) !important;
      transition: all 0.3s ease !important;
      padding: 0.75rem 2.5rem 0.75rem 3rem !important;
      font-size: 0.95rem !important;
      font-weight: 500 !important;
    }

    /* Dropdown Options Styling */
    .form-control-cosmic option {
      background: rgba(20, 25, 40, 0.95) !important;
      color: rgba(255, 255, 255, 0.9) !important;
      padding: 10px 15px !important;
      border: none !important;
      font-weight: 500 !important;
    }

    .form-control-cosmic option:hover,
    .form-control-cosmic option:focus,
    .form-control-cosmic option:checked {
      background: rgba(139, 69, 255, 0.8) !important;
      color: rgba(255, 255, 255, 1) !important;
    }

    .form-control-cosmic:focus {
      border-color: rgba(139, 69, 255, 0.8) !important;
      box-shadow: 0 0 20px rgba(139, 69, 255, 0.3) !important;
      outline: none !important;
    }

    .form-control-cosmic:disabled {
      opacity: 0.6 !important;
      cursor: not-allowed !important;
      background: rgba(255, 255, 255, 0.05) !important;
    }

    .btn-cosmic-outline:disabled {
      opacity: 0.6 !important;
      cursor: not-allowed !important;
    }

    /* Status Select Styling - Enhanced */
    .status-select {
      background: rgba(255, 255, 255, 0.1) !important;
      border: 2px solid rgba(255, 255, 255, 0.2) !important;
      border-radius: 12px !important;
      color: rgba(255, 255, 255, 0.9) !important;
      backdrop-filter: blur(10px) !important;
      transition: all 0.3s ease !important;
      padding: 0.5rem 2rem 0.5rem 1rem !important;
      font-size: 0.9rem !important;
      font-weight: 500 !important;
      font-family: 'Exo 2', sans-serif !important;
      -webkit-appearance: none !important;
      -moz-appearance: none !important;
      appearance: none !important;
      cursor: pointer !important;
      position: relative !important;
      background-clip: padding-box !important;
    }

    .status-select:focus {
      border-color: rgba(139, 69, 255, 0.8) !important;
      box-shadow: 0 0 20px rgba(139, 69, 255, 0.3) !important;
      outline: none !important;
      background: rgba(255, 255, 255, 0.15) !important;
    }

    .status-select:hover {
      background: rgba(255, 255, 255, 0.15) !important;
      border-color: rgba(255, 255, 255, 0.3) !important;
    }

    /* Custom dropdown arrow - Using pseudo-element for better control */
    .status-select {
      padding-right: 2.5rem !important;
      position: relative !important;
    }

    .status-select::after {
      content: '▼' !important;
      position: absolute !important;
      right: 0.75rem !important;
      top: 50% !important;
      transform: translateY(-50%) !important;
      color: rgba(255, 255, 255, 0.8) !important;
      font-size: 0.8rem !important;
      pointer-events: none !important;
      transition: all 0.3s ease !important;
      z-index: 10 !important;
    }

    .status-select:hover::after {
      color: rgba(255, 255, 255, 1) !important;
      transform: translateY(-50%) scale(1.1) !important;
    }

    .status-select:focus::after {
      color: rgba(139, 69, 255, 1) !important;
    }

    /* Ensure text doesn't overlap with arrow */
    .status-select {
      text-overflow: ellipsis !important;
      white-space: nowrap !important;
      overflow: hidden !important;
    }

    /* Prevent any background conflicts */
    .status-select,
    .status-select:focus,
    .status-select:hover,
    .status-select:active {
      background-image: none !important;
    }

    /* Dropdown Options Styling - Enhanced for consistency */
    .status-select option {
      background: rgba(20, 25, 40, 0.98) !important;
      color: rgba(255, 255, 255, 0.9) !important;
      padding: 12px 16px !important;
      border: none !important;
      font-weight: 500 !important;
      font-family: 'Exo 2', sans-serif !important;
      font-size: 0.9rem !important;
      transition: all 0.2s ease !important;
      -webkit-appearance: none !important;
      -moz-appearance: none !important;
      appearance: none !important;
    }

    /* Disabled options - clearly grayed out */
    .status-select option:disabled,
    .status-select option[disabled] {
      color: rgba(255, 255, 255, 0.3) !important;
      background: rgba(0, 0, 0, 0.4) !important;
      font-style: italic !important;
      font-weight: 400 !important;
      opacity: 0.6 !important;
    }

    /* Enabled options - consistent styling */
    .status-select option:not(:disabled),
    .status-select option:not([disabled]) {
      color: rgba(255, 255, 255, 0.9) !important;
      background: rgba(20, 25, 40, 0.98) !important;
      font-weight: 500 !important;
      opacity: 1 !important;
    }

    /* Hover effect for enabled options */
    .status-select option:not(:disabled):hover,
    .status-select option:not([disabled]):hover {
      background: linear-gradient(135deg, rgba(139, 69, 255, 0.2), rgba(67, 233, 123, 0.2)) !important;
      color: rgba(255, 255, 255, 1) !important;
      font-weight: 600 !important;
    }

    /* Selected/checked option */
    .status-select option:checked,
    .status-select option[selected] {
      background: linear-gradient(135deg, rgba(67, 233, 123, 0.4), rgba(102, 126, 234, 0.4)) !important;
      color: rgba(255, 255, 255, 1) !important;
      font-weight: 700 !important;
      box-shadow: inset 0 0 10px rgba(67, 233, 123, 0.3) !important;
    }

    /* Focus state for accessibility */
    .status-select option:focus {
      background: linear-gradient(135deg, rgba(139, 69, 255, 0.3), rgba(67, 233, 123, 0.3)) !important;
      color: rgba(255, 255, 255, 1) !important;
      font-weight: 600 !important;
    }

    /* Specific status option styling for better consistency */
    .status-select option[value="PENDING"] { 
      color: rgba(255, 255, 255, 0.9) !important; 
      background: rgba(20, 25, 40, 0.98) !important;
    }
    .status-select option[value="ACCEPTED"] { 
      color: rgba(255, 255, 255, 0.9) !important; 
      background: rgba(20, 25, 40, 0.98) !important;
    }
    .status-select option[value="DECLINED"] { 
      color: rgba(255, 255, 255, 0.9) !important; 
      background: rgba(20, 25, 40, 0.98) !important;
    }
    .status-select option[value="IN_COOKING"] { 
      color: rgba(255, 255, 255, 0.9) !important; 
      background: rgba(20, 25, 40, 0.98) !important;
    }
    .status-select option[value="OUT_FOR_DELIVERY"] { 
      color: rgba(255, 255, 255, 0.9) !important; 
      background: rgba(20, 25, 40, 0.98) !important;
    }
    .status-select option[value="COMPLETED"] { 
      color: rgba(255, 255, 255, 0.9) !important; 
      background: rgba(20, 25, 40, 0.98) !important;
    }
    .status-select option[value="CANCELLED"] { 
      color: rgba(255, 255, 255, 0.9) !important; 
      background: rgba(20, 25, 40, 0.98) !important;
    }

    /* Browser-specific fixes for option styling */
    .status-select::-ms-expand {
      display: none !important;
    }

    /* Firefox specific styling */
    .status-select:-moz-focusring {
      color: transparent !important;
      text-shadow: 0 0 0 rgba(255, 255, 255, 0.9) !important;
    }

    /* Safari/WebKit specific styling */
    .status-select::-webkit-select-placeholder {
      color: rgba(255, 255, 255, 0.9) !important;
    }

    /* Additional fallback styling for better consistency */
    .status-select option {
      text-shadow: none !important;
      -webkit-text-fill-color: rgba(255, 255, 255, 0.9) !important;
    }

    /* Ensure all options have consistent text color */
    .status-select option,
    .status-select option:not(:disabled),
    .status-select option:not([disabled]) {
      color: rgba(255, 255, 255, 0.9) !important;
      -webkit-text-fill-color: rgba(255, 255, 255, 0.9) !important;
    }

    /* Override any browser default styling */
    .status-select {
      color-scheme: dark !important;
    }

    /* Flow Guide Button Styling */
    .cosmic-flow-guide-btn {
      background: rgba(139, 69, 255, 0.1) !important;
      border: 2px solid rgba(139, 69, 255, 0.3) !important;
      border-radius: 8px !important;
      color: rgba(139, 69, 255, 0.9) !important;
      padding: 0.4rem 0.8rem !important;
      font-size: 0.8rem !important;
      font-weight: 500 !important;
      transition: all 0.3s ease !important;
      backdrop-filter: blur(10px) !important;
    }

    .cosmic-flow-guide-btn:hover {
      background: rgba(139, 69, 255, 0.2) !important;
      border-color: rgba(139, 69, 255, 0.6) !important;
      color: rgba(255, 255, 255, 1) !important;
      transform: translateY(-1px) !important;
      box-shadow: 0 4px 12px rgba(139, 69, 255, 0.3) !important;
    }

    .cosmic-flow-guide-btn:active {
      transform: translateY(0) !important;
    }

    /* Status Control Container */
    .status-control-container {
      position: relative;
      min-width: 140px;
    }

    .status-control-container::before {
      content: '';
      position: absolute;
      top: -2px;
      left: -2px;
      right: -2px;
      bottom: -2px;
      background: linear-gradient(135deg, rgba(139, 69, 255, 0.2), rgba(67, 233, 123, 0.2));
      border-radius: 14px;
      z-index: -1;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .status-control-container:hover::before {
      opacity: 1;
    }

    /* Mobile Responsiveness for Status Controls */
    @media (max-width: 768px) {
      .status-control-container {
        min-width: 120px;
      }
      
      .status-select {
        font-size: 0.8rem !important;
        padding: 0.4rem 1.5rem 0.4rem 0.8rem !important;
      }
      
      .status-select::after {
        right: 0.5rem !important;
        font-size: 0.7rem !important;
      }
      
      .cosmic-info-tooltip {
        width: 32px;
        height: 32px;
      }
      
      .cosmic-info-tooltip svg {
        width: 12px !important;
        height: 12px !important;
      }
    }

    /* Orders List Container */
    .orders-list {
      max-height: 350px;
      overflow-y: auto;
      padding-right: 0.5rem;
    }

    /* Custom scrollbar for orders list */
    .orders-list::-webkit-scrollbar {
      width: 6px;
    }

    .orders-list::-webkit-scrollbar-track {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 3px;
    }

    .orders-list::-webkit-scrollbar-thumb {
      background: rgba(102, 126, 234, 0.6);
      border-radius: 3px;
    }

    .orders-list::-webkit-scrollbar-thumb:hover {
      background: rgba(102, 126, 234, 0.8);
    }

    /* Mobile responsiveness for header */
    @media (max-width: 768px) {
      .cosmic-restaurant-header {
        min-height: 50px;
        padding: 0.5rem 0;
      }

      .cosmic-restaurant-icon {
        width: 35px;
        height: 35px;
      }

      .cosmic-logout-btn {
        padding: 0.3rem 0.6rem;
        font-size: 0.8rem;
      }

      .cosmic-logout-btn span {
        display: none;
      }

      .cosmic-logout-btn svg {
        margin: 0;
      }

      .container {
        padding-top: 4rem !important;
      }
    }
  `]
})
export class RestaurantDashboardComponent implements OnInit {
  orders: Order[] = [];
  menuItems: MenuItem[] = [];
  loading = true;
  error: string | null = null;
  showAddForm = false;
  editingItem: MenuItem | null = null;
  dietFilter = 'all';
  menuForm: FormGroup;
  restaurantDetails = { name: 'Restaurant Dashboard', location: 'Location' };
  logoutLoading = false;
  addingItemLoading = false; // Add loading state for adding items
  cosmicNotifications$: any;
  
  // Status popup properties
  showStatusPopup = false;
  statusPopupMessage = '';
  
  // Track orders with invalid status attempts to show cosmic tooltip
  ordersWithInvalidAttempts = new Set<number>();

  // Restaurant descriptions for typewriter effect
  restaurantDescriptions = [
    'Crafting cosmic culinary experiences...',
    'Where stellar flavors meet earthly satisfaction...',
    'Serving dishes from across the galaxy...',
    'Your neighborhood cosmic kitchen awaits...',
    'Master chefs creating interstellar delights...',
    'A universe of flavors awaits you here...',
    'Fresh ingredients, cosmic preparations daily...',
    'Every meal is a journey through space and taste...'
  ];

  constructor(
    private restaurantService: RestaurantService,
    private authService: AuthService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef,
    private cosmicNotification: CosmicNotificationService
  ) {
    this.menuForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50)]], // Backend requires 5-50 chars
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]], // Match backend requirements
      price: ['', [Validators.required, Validators.min(0.01)]],
      isVeg: ['yes', Validators.required]
    });
    
    // Initialize notifications observable
    this.cosmicNotifications$ = this.cosmicNotification.notifications$;
  }

  // Add validation helper for better error messages
  validateFormBeforeSubmit(): string | null {
    const formData = this.menuForm.value;
    
    if (!formData.name || formData.name.trim().length < 5) {
      return '🚫 Dish name must be at least 5 characters long';
    }
    
    if (formData.name.trim().length > 50) {
      return '🚫 Dish name must be 50 characters or less';
    }
    
    if (!formData.description || formData.description.trim().length < 10) {
      return '🚫 Description must be at least 10 characters long';
    }
    
    if (formData.description.trim().length > 200) {
      return '🚫 Description must be 200 characters or less';
    }
    
    if (!formData.price || formData.price <= 0) {
      return '🚫 Please enter a valid price greater than ₹0';
    }
    
    return null; // No validation errors
  }

  ngOnInit(): void {
    const userId = this.authService.getCurrentUserId();
    if (userId) {
      this.fetchRestaurantData(userId);
    }
  }

  async fetchRestaurantData(restaurantId: number): Promise<void> {
    this.loading = true;
    this.error = null;

    try {
      // Fetch restaurant details
      await this.fetchRestaurantDetails(restaurantId);
      
      // Fetch menu items
      this.restaurantService.fetchMenuItems(restaurantId).subscribe({
        next: (items) => {
          this.menuItems = items;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error fetching menu:', error);
          
          // Handle 404 as empty menu (normal for new restaurants)
          if (error.status === 404) {
            console.log('ℹ️ No menu items found for new restaurant - this is normal');
            this.menuItems = []; // Set empty array for new restaurants
            this.error = null; // Don't show error for empty menu
            this.loading = false;
          } else {
            // Only show error for actual problems (500, 403, etc.)
            this.error = error.message;
            this.loading = false;
          }
        }
      });

      // Fetch orders
      this.restaurantService.fetchRestaurantOrders(restaurantId).subscribe({
        next: (orders) => {
          this.orders = orders;
          console.log('Orders loaded:', this.orders);
          this.cdr.detectChanges(); // Trigger change detection
        },
        error: (error) => {
          console.error('Error fetching orders:', error);
        }
      });
    } catch (err: any) {
      this.error = err.message;
      this.loading = false;
    }
  }

  async fetchRestaurantDetails(restaurantId: number): Promise<void> {
    try {
      this.restaurantService.fetchRestaurantById(restaurantId).subscribe({
        next: (restaurant: any) => {
          console.log('🏪 Restaurant data received:', restaurant);
          this.restaurantDetails = {
            name: restaurant.name || restaurant.restaurantName || 'Restaurant Dashboard',
            location: restaurant.address || restaurant.location || restaurant.area || 'Location not available'
          };
          console.log('🏪 Updated restaurant details:', this.restaurantDetails);
          this.cdr.detectChanges(); // Force UI update
        },
        error: (error) => {
          console.error('❌ Error fetching restaurant details:', error);
          this.restaurantDetails = {
            name: 'Restaurant Dashboard',
            location: 'Location not available'
          };
        }
      });
    } catch (err) {
      console.error('❌ Error fetching restaurant details:', err);
      this.restaurantDetails = {
        name: 'Restaurant Dashboard', 
        location: 'Location not available'
      };
    }
  }

  get filteredMenuItems(): MenuItem[] {
    return this.menuItems.filter(item => {
      if (this.dietFilter === 'veg') return item.isVeg === 'yes';
      if (this.dietFilter === 'non-veg') return item.isVeg === 'no';
      return true;
    });
  }

  setDietFilter(filter: string): void {
    this.dietFilter = filter;
  }

  getVegCount(): number {
    return this.menuItems.filter(item => item.isVeg === 'yes').length;
  }

  getNonVegCount(): number {
    return this.menuItems.filter(item => item.isVeg === 'no').length;
  }

  getPendingOrders(): number {
    if (!this.orders || this.orders.length === 0) {
      return 0;
    }
    
    // Only count orders with PENDING status, not all active orders
    const pendingCount = this.orders.filter(order => 
      order.status === 'PENDING'
    ).length;
    
    return pendingCount;
  }

  getCompletedOrders(): number {
    if (!this.orders || this.orders.length === 0) {
      return 0;
    }
    
    const completedCount = this.orders.filter(order => order.status === 'COMPLETED').length;
    return completedCount;
  }

  getTotalOrders(): number {
    return this.orders.length;
  }

  getActiveOrders(): number {
    return this.orders.filter(order => 
      !['COMPLETED', 'CANCELLED', 'DECLINED'].includes(order.status)
    ).length;
  }

  editItem(item: MenuItem): void {
    this.editingItem = item;
    this.menuForm.patchValue({
      name: item.name,
      description: item.description,
      price: item.price,
      isVeg: item.isVeg
    });
  }

  deleteItem(itemId: number): void {
    if (!confirm('Are you sure you want to delete this item?')) return;
    
    const restaurantId = this.authService.getCurrentUserId();
    if (!restaurantId) {
      this.cosmicNotification.error('Authentication Required', 'Restaurant authentication is required to delete menu items.');
      return;
    }

    // Store the current menu items to restore on error
    const previousMenuItems = [...this.menuItems];
    
    this.loading = true;
    console.log('🗑️ Attempting to delete menu item:', itemId);
    
    this.restaurantService.deleteMenuItem(restaurantId, itemId).subscribe({
      next: () => {
        console.log('✅ Menu item deleted successfully:', itemId);
        // Create new array to trigger change detection
        this.menuItems = this.menuItems.filter(item => item.id !== itemId);
        this.error = null; // Clear any existing error state
        this.cdr.detectChanges(); // Force change detection
        this.cosmicNotification.success('Cosmic Dish Removed', '🗑️ Menu item has been sent to the digital void! Your cosmic menu is now updated.');
        this.loading = false;
      },
      error: (error) => {
        console.log('🔍 Checking error details:', error);
        
        // Check if it's actually a successful deletion (status 200 with text response)
        if (error.status === 200 && error.error?.text?.includes('Item Deleted')) {
          console.log('✅ Menu item deleted successfully (text response):', itemId);
          // Treat as success - backend returned "Item Deleted..." text
          this.menuItems = this.menuItems.filter(item => item.id !== itemId);
          this.error = null; // Clear any existing error state
          this.cdr.detectChanges();
          this.cosmicNotification.success('Cosmic Dish Removed', '🗑️ Menu item has been sent to the digital void! Your cosmic menu is now updated.');
          this.loading = false;
          return;
        }
        
        console.error('❌ Error deleting menu item:', error);
        console.error('❌ Full error details:', JSON.stringify(error, null, 2));
        
        // Ensure the menu items array is not modified on actual error
        this.menuItems = previousMenuItems;
        this.cdr.detectChanges();
        
        this.error = error.error?.message || error.message || 'Failed to delete item';
        
        // Provide specific error message based on status
        if (error.status === 400) {
          this.cosmicNotification.error('Cannot Delete Item', 'This menu item cannot be deleted. It may be referenced in active orders or have restrictions.');
        } else if (error.status === 403) {
          this.cosmicNotification.error('Permission Denied', 'You do not have permission to delete this menu item.');
        } else if (error.status === 404) {
          this.cosmicNotification.error('Item Not Found', 'This menu item no longer exists or has already been deleted.');
        } else {
          this.cosmicNotification.error('Delete Failed', this.error || 'Failed to delete menu item. Please try again.');
        }
        
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.menuForm.valid) {
      const restaurantId = this.authService.getCurrentUserId();
      if (!restaurantId) {
        this.cosmicNotification.error('Authentication Required', 'Restaurant authentication is required to manage menu items.');
        return;
      }

      this.addingItemLoading = true; // Set loading state for adding item
      this.error = null;
      this.menuForm.disable(); // Disable form during submission

      const formData = this.menuForm.value;

      if (this.editingItem) {
        // Update existing item
        this.restaurantService.updateMenuItem(restaurantId, this.editingItem.id, formData).subscribe({
          next: (updatedItem) => {
            console.log('Updated item received:', updatedItem);
            const index = this.menuItems.findIndex(item => item.id === this.editingItem!.id);
            if (index !== -1) {
              // Create a new array to trigger change detection
              const updatedItems = [...this.menuItems];
              updatedItems[index] = updatedItem;
              this.menuItems = updatedItems;
            }
            this.cosmicNotification.success('Dish Updated', '🍽️ Menu item updated successfully in the cosmic kitchen!');
            this.closeModal();
            this.loading = false;
            this.menuForm.enable();
          },
          error: (error) => {
            console.error('Error updating menu item:', error);
            this.error = error.error?.message || 'Failed to update item';
            this.cosmicNotification.error('Update Failed', this.error || 'Failed to update menu item. Please try again.');
            this.loading = false;
            this.menuForm.enable();
          }
        });
      } else {
        // Add new item
        this.restaurantService.addMenuItem(restaurantId, formData).subscribe({
          next: (response: any) => {
            console.log('✅ Backend response for new item:', response);
            
            // Backend returns ResponseMessageDto with just a message, not the item data
            // So we need to refresh the menu items to get the updated list
            this.cosmicNotification.success('Cosmic Dish Added', '🍽️ New cosmic dish launched successfully to the galaxy!');
            this.closeModal();
            this.addingItemLoading = false; // Reset loading state
            this.menuForm.enable();
            
            // Refresh menu items to get the latest data including the new item
            this.refreshMenuItems();
          },
          error: (error) => {
            console.error('❌ Error adding menu item:', error);
            console.error('❌ Full error details:', JSON.stringify(error, null, 2));
            console.error('❌ Form data sent:', formData);
            console.error('❌ Restaurant ID:', restaurantId);
            
            this.error = error.error?.message || error.message || 'Failed to add item';
            
            // Provide specific error message based on status and backend validation
            if (error.status === 400) {
              if (error.error?.description?.includes('Description must be between 10 and 100 characters')) {
                this.cosmicNotification.error('Description Length Error', 'Your cosmic description must be between 10-100 characters. Current length: ' + (formData.description?.length || 0) + ' characters.');
              } else if (error.error?.name) {
                this.cosmicNotification.error('Name Validation Error', error.error.name);
              } else if (error.error?.price) {
                this.cosmicNotification.error('Price Validation Error', error.error.price);
              } else {
                this.cosmicNotification.error('Validation Error', this.error || 'Please check all fields and try again.');
              }
            } else if (error.status === 401) {
              this.cosmicNotification.error('Authentication Required', 'Please log in again to add menu items.');
            } else if (error.status === 403) {
              this.cosmicNotification.error('Permission Denied', 'You do not have permission to add menu items.');
            } else if (error.status === 409) {
              this.cosmicNotification.error('Item Already Exists', 'A menu item with this name already exists.');
            } else {
              this.cosmicNotification.error('Add Failed', this.error || 'Failed to add menu item. Please try again.');
            }
            
            this.addingItemLoading = false; // Reset loading state
            this.menuForm.enable();
          }
        });
      }
    } else {
      this.cosmicNotification.warning('Form Validation', 'Please fill in all required fields correctly before launching your cosmic dish.');
    }
  }

  closeModal(): void {
    this.showAddForm = false;
    this.editingItem = null;
    this.error = null; // Clear any error messages
    this.loading = false; // Ensure loading state is reset
    this.addingItemLoading = false; // Reset adding item loading state
    this.menuForm.reset({
      name: '',
      description: '',
      price: '',
      isVeg: 'yes'
    });
    this.menuForm.enable(); // Ensure form is enabled
    this.cdr.detectChanges(); // Force change detection to update UI
  }

  updateOrderStatus(orderId: number, event: any): void {
    const newStatus = event.target.value;
    const currentOrder = this.orders.find(order => order.orderId === orderId);
    
    if (!currentOrder) return;
    
    console.log('🚀 Status change attempt:', {
      orderId,
      currentStatus: currentOrder.status,
      newStatus,
      timestamp: new Date().toISOString()
    });
    
    // ✨ COSMIC STATUS VALIDATION - Ensure proper order flow
    const validationResult = this.validateStatusTransition(currentOrder.status, newStatus);
    console.log('🚀 Validation result:', validationResult);
    
    if (!validationResult.isValid) {
      console.log('🚀 Status validation failed:', validationResult);
      console.log('🚀 Current status:', currentOrder.status, 'New status:', newStatus);
      
      // Add this order to invalid attempts to show cosmic tooltip
      this.ordersWithInvalidAttempts.add(orderId);
      
      // Show cosmic status popup instead of toastr
      this.statusPopupMessage = validationResult.message;
      this.showStatusPopup = true;
      
      console.log('🚀 Popup message set:', this.statusPopupMessage);
      console.log('🚀 Popup visibility:', this.showStatusPopup);
      console.log('🚀 Added order to invalid attempts:', orderId);
      
      // Force change detection to ensure popup appears
      this.cdr.detectChanges();
      console.log('🚀 Change detection triggered');
      
      // Reset the dropdown to current status
      event.target.value = currentOrder.status;
      return;
    }

    const restaurantId = this.authService.getCurrentUserId();
    if (!restaurantId) return;
  
    const payload = {
      orderId,
      status: newStatus,
      restaurantId
    };
  
    console.log('🚀 Sending status update payload:', payload);
    console.log('🚀 Current order details:', currentOrder);
  
    this.restaurantService.updateOrderStatus(payload).subscribe({
      next: (updatedOrder) => {
        console.log('✅ Status update successful:', updatedOrder);
        const orderIndex = this.orders.findIndex(order => order.orderId === updatedOrder.orderId);
        if (orderIndex !== -1) {
          // Update the order in the array
          this.orders[orderIndex] = { ...this.orders[orderIndex], ...updatedOrder };
          
          // Remove from invalid attempts since status was successfully updated
          this.ordersWithInvalidAttempts.delete(updatedOrder.orderId);
          
          // Force complete re-render of the component
          this.cdr.markForCheck();
          this.cdr.detectChanges();
          
          console.log('✅ Order updated in array:', this.orders[orderIndex]);
        }
        this.cosmicNotification.success('Cosmic Order Updated', `🌟 Order status successfully transformed to ${newStatus}! The cosmic kitchen is buzzing with activity.`);
      },
      error: (error) => {
        console.error('❌ Error updating order status:', error);
        console.error('❌ Full error details:', JSON.stringify(error, null, 2));
        console.error('❌ Error status:', error.status);
        console.error('❌ Error message:', error.error);
        console.error('❌ Error type:', typeof error.error);
        
        // Enhanced error detection for invalid status transitions
        const errorMessage = error.error?.message || error.error || error.message || '';
        const errorString = typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage);
        
        console.log('🚀 Error message string:', errorString);
        
        // Check for various invalid transition error patterns
        const isInvalidTransitionError = error.status === 400 && (
          errorString.toLowerCase().includes('invalid status transition') ||
          errorString.toLowerCase().includes('not allowed') ||
          errorString.toLowerCase().includes('invalid transition') ||
          errorString.toLowerCase().includes('status transition') ||
          errorString.toLowerCase().includes('cannot change') ||
          errorString.toLowerCase().includes('restart needed') ||
          errorString.toLowerCase().includes('business rules') ||
          errorString.toLowerCase().includes('order processing state')
        );
        
        console.log('🚀 Is invalid transition error:', isInvalidTransitionError);
        
        if (isInvalidTransitionError) {
          // Show cosmic tip for invalid transitions instead of backend restart message
          const flowMessage = this.getStatusFlowMessage(currentOrder.status, newStatus);
          this.statusPopupMessage = `🚀 Cosmic Order Flow: ${flowMessage}`;
          this.showStatusPopup = true;
          console.log('🚀 Setting popup message:', this.statusPopupMessage);
          console.log('🚀 Setting showStatusPopup to true');
          this.cdr.detectChanges();
          
          // Force another change detection cycle to ensure popup appears
          setTimeout(() => {
            this.cdr.detectChanges();
            console.log('🚀 Popup should be visible now');
          }, 100);
        } else if (error.status === 400) {
          // For any 400 error related to status changes, show cosmic tip as fallback
          console.log('🚀 400 error detected - showing cosmic tip as fallback');
          const flowMessage = this.getStatusFlowMessage(currentOrder.status, newStatus);
          this.statusPopupMessage = `🚀 Cosmic Order Flow: ${flowMessage}`;
          this.showStatusPopup = true;
          console.log('🚀 Fallback popup state:', { showStatusPopup: this.showStatusPopup, statusPopupMessage: this.statusPopupMessage });
          this.cdr.detectChanges();
          
          // Force another change detection cycle to ensure popup appears
          setTimeout(() => {
            this.cdr.detectChanges();
            console.log('🚀 Fallback popup should be visible now');
          }, 100);
        } else if (error.status === 403) {
          this.cosmicNotification.error(
            'Permission Denied',
            'You do not have permission to update this order status.',
            4000
          );
        } else if (error.status === 404) {
          this.cosmicNotification.error(
            'Order Not Found',
            'This order no longer exists in the system.',
            4000
          );
        } else {
          this.cosmicNotification.error(
            'Update Failed',
            'Failed to update order status. Please try again or contact support.',
            4000
          );
        }
        
        // Reset the dropdown to current status on error
        event.target.value = currentOrder.status;
      }
    });
  }

  private validateStatusTransition(currentStatus: string, newStatus: string): { isValid: boolean; message: string } {
    console.log('🔍 Validating status transition:', { currentStatus, newStatus });
    
    // Define valid status flow paths with comprehensive business logic
    const statusFlow: { [key: string]: string[] } = {
      'PENDING': ['ACCEPTED', 'DECLINED', 'CANCELLED'],
      'ACCEPTED': ['IN_COOKING', 'DECLINED', 'CANCELLED'], // Allow declining accepted orders
      'IN_COOKING': ['OUT_FOR_DELIVERY', 'DECLINED', 'CANCELLED'], // Allow declining during cooking
      'OUT_FOR_DELIVERY': ['COMPLETED', 'DECLINED', 'CANCELLED'], // Allow declining during delivery
      'DECLINED': ['CANCELLED'], // Allow declined orders to be cancelled for deletion
      'COMPLETED': [], // Terminal state - cannot be changed
      'CANCELLED': [] // Terminal state - cannot be changed
    };

    // Special validation for obvious invalid transitions that should be caught frontend
    const obviousInvalidTransitions: { [key: string]: string[] } = {
      'PENDING': ['IN_COOKING', 'OUT_FOR_DELIVERY', 'COMPLETED'], // Cannot skip steps
      'ACCEPTED': ['PENDING', 'OUT_FOR_DELIVERY', 'COMPLETED'], // Cannot go back or skip
      'IN_COOKING': ['PENDING', 'ACCEPTED', 'COMPLETED'], // Cannot go back or skip
      'OUT_FOR_DELIVERY': ['PENDING', 'ACCEPTED', 'IN_COOKING'], // Cannot go back
      'DECLINED': ['PENDING', 'ACCEPTED', 'IN_COOKING', 'OUT_FOR_DELIVERY', 'COMPLETED'], // Cannot reactivate
      'COMPLETED': ['PENDING', 'ACCEPTED', 'IN_COOKING', 'OUT_FOR_DELIVERY', 'DECLINED', 'CANCELLED'], // Final state
      'CANCELLED': ['PENDING', 'ACCEPTED', 'IN_COOKING', 'OUT_FOR_DELIVERY', 'DECLINED', 'COMPLETED'] // Final state
    };

    console.log('🔍 Status flow for', currentStatus, ':', statusFlow[currentStatus]);

    // Allow same status (no change)
    if (currentStatus === newStatus) {
      console.log('🔍 Same status - no change needed');
      return { isValid: true, message: '' };
    }

    // Check for obvious invalid transitions first (frontend validation)
    const obviousInvalid = obviousInvalidTransitions[currentStatus] || [];
    if (obviousInvalid.includes(newStatus)) {
      const flowMessage = this.getStatusFlowMessage(currentStatus, newStatus);
      console.log('🔍 Obvious invalid transition caught frontend - showing message:', flowMessage);
      return {
        isValid: false,
        message: `🚀 Cosmic Order Flow: ${flowMessage}`
      };
    }

    // Check if transition is valid
    const validNextStates = statusFlow[currentStatus] || [];
    console.log('🔍 Valid next states:', validNextStates);
    console.log('🔍 Is', newStatus, 'in valid states?', validNextStates.includes(newStatus));
    
    if (!validNextStates.includes(newStatus)) {
      const flowMessage = this.getStatusFlowMessage(currentStatus, newStatus);
      console.log('🔍 Invalid transition - showing message:', flowMessage);
      return {
        isValid: false,
        message: `🚀 Cosmic Order Flow: ${flowMessage}`
      };
    }

    console.log('🔍 Valid transition - proceeding');
    return { isValid: true, message: '' };
  }

  getValidNextStatuses(currentStatus: string): Array<{value: string, label: string, disabled: boolean}> {
    const statusFlow: { [key: string]: string[] } = {
      'PENDING': ['ACCEPTED', 'DECLINED', 'CANCELLED'],
      'ACCEPTED': ['IN_COOKING', 'DECLINED', 'CANCELLED'],
      'IN_COOKING': ['OUT_FOR_DELIVERY', 'DECLINED', 'CANCELLED'],
      'OUT_FOR_DELIVERY': ['COMPLETED', 'DECLINED', 'CANCELLED'],
      'DECLINED': ['CANCELLED'],
      'COMPLETED': [],
      'CANCELLED': []
    };

    const validNextStates = statusFlow[currentStatus] || [];
    const allStatuses = [
      { value: 'PENDING', label: '⏳ Pending' },
      { value: 'ACCEPTED', label: '✅ Accepted' },
      { value: 'DECLINED', label: '❌ Declined' },
      { value: 'IN_COOKING', label: '👨‍🍳 In Cooking' },
      { value: 'OUT_FOR_DELIVERY', label: '🚚 Out for Delivery' },
      { value: 'COMPLETED', label: '🎉 Completed' },
      { value: 'CANCELLED', label: '🚫 Cancelled' }
    ];

    // Filter out current status since we show it separately at the top
    return allStatuses
      .filter(status => status.value !== currentStatus)
      .map(status => ({
        value: status.value,
        label: status.label,
        // Only valid next states are enabled
        disabled: !validNextStates.includes(status.value)
      }));
  }

  // Track by function to ensure proper order rendering  
  trackByOrderId(index: number, order: any): any {
    return order.orderId;
  }

  // Get status label for display
  getStatusLabel(status: string): string {
    const statusLabels: { [key: string]: string } = {
      'PENDING': '⏳ Pending',
      'ACCEPTED': '✅ Accepted',
      'DECLINED': '❌ Declined',
      'IN_COOKING': '👨‍🍳 In Cooking',
      'OUT_FOR_DELIVERY': '🚚 Out for Delivery',
      'COMPLETED': '🎉 Completed',
      'CANCELLED': '🚫 Cancelled'
    };
    return statusLabels[status] || status;
  }

  private getStatusFlowMessage(currentStatus: string, newStatus: string): string {
    // Comprehensive status flow messages with specific guidance
    const flowMessages: { [key: string]: { [key: string]: string } } = {
      'PENDING': {
        'COMPLETED': '❌ Cannot complete a pending order! Pending orders must be ACCEPTED first, then follow the flow: ACCEPTED → IN_COOKING → OUT_FOR_DELIVERY → COMPLETED.',
        'IN_COOKING': '❌ Cannot start cooking a pending order! Pending orders must be ACCEPTED first, then IN_COOKING.',
        'OUT_FOR_DELIVERY': '❌ Cannot deliver a pending order! Pending orders must be ACCEPTED → IN_COOKING → OUT_FOR_DELIVERY.',
        'default': '✅ Pending orders can be: ACCEPTED (to start processing), DECLINED (if you cannot fulfill), or CANCELLED (if customer cancels).'
      },
      'ACCEPTED': {
        'COMPLETED': '❌ Cannot complete an accepted order directly! Follow the proper flow: ACCEPTED → IN_COOKING → OUT_FOR_DELIVERY → COMPLETED.',
        'OUT_FOR_DELIVERY': '❌ Cannot deliver without cooking! Accepted orders must go to IN_COOKING first, then OUT_FOR_DELIVERY.',
        'PENDING': '❌ Cannot go back to pending! Once accepted, orders must move forward in the flow.',
        'default': '✅ Accepted orders can be: IN_COOKING (to start preparation), DECLINED (if you cannot fulfill), or CANCELLED (if needed).'
      },
      'IN_COOKING': {
        'COMPLETED': '❌ Cannot complete while still cooking! Cooking orders must go to OUT_FOR_DELIVERY first, then COMPLETED.',
        'PENDING': '❌ Cannot go back to pending! Cooking orders must move forward to OUT_FOR_DELIVERY.',
        'ACCEPTED': '❌ Cannot go back to accepted! Cooking orders must move forward to OUT_FOR_DELIVERY.',
        'default': '✅ Cooking orders can be: OUT_FOR_DELIVERY (when ready), DECLINED (if cannot fulfill), or CANCELLED (if needed).'
      },
      'OUT_FOR_DELIVERY': {
        'PENDING': '❌ Cannot go back to pending! Delivery orders must be completed.',
        'ACCEPTED': '❌ Cannot go back to accepted! Delivery orders must be completed.',
        'IN_COOKING': '❌ Cannot go back to cooking! Delivery orders must be completed.',
        'default': '✅ Delivery orders can be: COMPLETED (when delivered), DECLINED (if delivery fails), or CANCELLED (if needed).'
      },
      'DECLINED': {
        'PENDING': '❌ Cannot reactivate declined orders! Declined orders can only be CANCELLED for deletion.',
        'ACCEPTED': '❌ Cannot reactivate declined orders! Declined orders can only be CANCELLED for deletion.',
        'IN_COOKING': '❌ Cannot reactivate declined orders! Declined orders can only be CANCELLED for deletion.',
        'OUT_FOR_DELIVERY': '❌ Cannot reactivate declined orders! Declined orders can only be CANCELLED for deletion.',
        'COMPLETED': '❌ Cannot complete declined orders! Declined orders can only be CANCELLED for deletion.',
        'default': '❌ Declined orders cannot be reactivated! They can only be changed to CANCELLED for deletion purposes.'
      },
      'COMPLETED': {
        'PENDING': '❌ Completed orders are final! Cannot change completed orders.',
        'ACCEPTED': '❌ Completed orders are final! Cannot change completed orders.',
        'IN_COOKING': '❌ Completed orders are final! Cannot change completed orders.',
        'OUT_FOR_DELIVERY': '❌ Completed orders are final! Cannot change completed orders.',
        'DECLINED': '❌ Completed orders are final! Cannot change completed orders.',
        'CANCELLED': '❌ Completed orders are final! Cannot change completed orders.',
        'default': '❌ Completed orders are final and cannot be changed! This protects order history and customer satisfaction.'
      },
      'CANCELLED': {
        'PENDING': '❌ Cancelled orders are final! Cannot reactivate cancelled orders.',
        'ACCEPTED': '❌ Cancelled orders are final! Cannot reactivate cancelled orders.',
        'IN_COOKING': '❌ Cancelled orders are final! Cannot reactivate cancelled orders.',
        'OUT_FOR_DELIVERY': '❌ Cancelled orders are final! Cannot reactivate cancelled orders.',
        'DECLINED': '❌ Cancelled orders are final! Cannot reactivate cancelled orders.',
        'COMPLETED': '❌ Cancelled orders are final! Cannot reactivate cancelled orders.',
        'default': '❌ Cancelled orders are final and cannot be changed! This maintains order integrity and prevents confusion.'
      }
    };
    
    const currentFlow = flowMessages[currentStatus];
    if (!currentFlow) {
      return '❌ Invalid order status! Please contact support.';
    }
    
    // Return specific message for the attempted transition, or default message
    return currentFlow[newStatus] || currentFlow['default'] || '❌ Invalid status transition! Please follow the proper order flow.';
  }

  deleteOrder(orderId: number): void {
    const order = this.orders.find(o => o.orderId === orderId);
    if (!order) {
      this.cosmicNotification.error('Order Not Found', 'The specified order could not be found.');
      return;
    }

    console.log('Attempting to delete order:', order);

    // Allow deletion of final state orders including declined
    const deletableStatuses = ['COMPLETED', 'CANCELLED', 'DECLINED'];
    if (!deletableStatuses.includes(order.status)) {
      this.cosmicNotification.warning(
        'Cannot Delete Order',
        `Orders with status "${order.status}" cannot be deleted. Only completed, cancelled, and declined orders can be removed.`,
        4000
      );
      return;
    }

    if (!confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
      return;
    }

    const restaurantId = this.authService.getCurrentUserId();
    if (!restaurantId) {
      this.cosmicNotification.error('Authentication Required', 'Restaurant authentication is required to delete orders.');
      return;
    }

    console.log('Deleting order with ID:', orderId, 'Restaurant ID:', restaurantId);

    this.restaurantService.deleteOrder(orderId).subscribe({
      next: () => {
        // Remove order from local array
        this.orders = this.orders.filter(order => order.orderId !== orderId);
        this.cdr.detectChanges(); // Trigger change detection for counts
        this.cosmicNotification.success(
          'Cosmic Order Removed',
          `🗑️ Order has been successfully sent to the digital void! Your cosmic kitchen is now cleaner and more organized.`,
          3000
        );
      },
      error: (error) => {
        console.error('Error deleting order:', error);
        console.error('Full error object:', JSON.stringify(error, null, 2));
        
        // Handle specific error cases with cosmic notifications
        if (error.status === 400 && order.status === 'DECLINED') {
          this.cosmicNotification.warning(
            'Backend Business Rules',
            `The backend enforces strict business rules preventing deletion of declined orders. Contact your system administrator to manually remove this order, use the admin panel if available, or archive the order instead of deleting it.`,
            8000
          );
        } else if (error.status === 400) {
          this.cosmicNotification.warning(
            'Backend Restriction',
            `The backend business logic prevents this deletion. Check if the order is being processed by another system, verify pending payments or refunds, or contact support for manual intervention.`,
            7000
          );
        } else if (error.status === 403) {
          this.cosmicNotification.error(
            'Permission Denied',
            'You do not have permission to delete this order.',
            4000
          );
        } else if (error.status === 404) {
          this.cosmicNotification.error(
            'Order Not Found',
            'This order no longer exists in the system.',
            4000
          );
        } else if (error.status === 409) {
          this.cosmicNotification.warning(
            'Order Conflict',
            'Order is currently being processed and cannot be deleted.',
            5000
          );
        } else {
          this.cosmicNotification.error(
            'Delete Failed',
            'An unexpected error occurred. Please try again or contact support.',
            4000
          );
        }
      }
    });
  }

  getStatusClass(status: string): string {
    const statusLower = status.toLowerCase();
    return `status-${statusLower}`;
  }

  getStatusEmoji(status: string): string {
    const emojiMap: { [key: string]: string } = {
      'PENDING': '⏳',
      'ACCEPTED': '✅',
      'DECLINED': '❌',
      'IN_COOKING': '👨‍🍳',
      'OUT_FOR_DELIVERY': '🚚',
      'COMPLETED': '✅',
      'CANCELLED': '❌'
    };
    return emojiMap[status] || '📋';
  }
  

  logout(): void {
    this.logoutLoading = true;
    setTimeout(() => {
      this.authService.logout();
      this.logoutLoading = false;
    }, 1500); // 1.5 second delay for smooth logout experience
  }

  closeStatusPopup(): void {
    console.log('🔧 Dashboard closing status popup');
    console.log('🔧 Current popup state before closing:', { showStatusPopup: this.showStatusPopup, statusPopupMessage: this.statusPopupMessage });
    this.showStatusPopup = false;
    this.statusPopupMessage = '';
    this.cdr.detectChanges();
    console.log('🔧 Popup state after closing:', { showStatusPopup: this.showStatusPopup, statusPopupMessage: this.statusPopupMessage });
  }

  showStatusFlowInfo(currentStatus: string): void {
    const flowInfo = this.getStatusFlowMessage(currentStatus, '');
    const statusFlow = this.getStatusFlowDiagram(currentStatus);
    const completeFlow = this.getCompleteOrderFlowGuide();
    this.statusPopupMessage = `${flowInfo.replace('❌', 'ℹ️').replace('✅', 'ℹ️')}\n\n${statusFlow}\n\n${completeFlow}`;
    this.showStatusPopup = true;
    this.cdr.detectChanges();
  }

  showCompleteOrderFlowGuide(): void {
    const completeFlow = this.getCompleteOrderFlowGuide();
    this.statusPopupMessage = `🚀 Complete Cosmic Order Flow Guide\n\n${completeFlow}`;
    this.showStatusPopup = true;
    this.cdr.detectChanges();
  }

  private getCompleteOrderFlowGuide(): string {
    return `📋 COMPLETE ORDER FLOW GUIDE:

🟢 VALID TRANSITIONS:
• PENDING → ACCEPTED (Start processing)
• PENDING → DECLINED (Cannot fulfill)
• PENDING → CANCELLED (Customer cancels)

• ACCEPTED → IN_COOKING (Start preparation)
• ACCEPTED → DECLINED (Cannot fulfill)
• ACCEPTED → CANCELLED (Cancel order)

• IN_COOKING → OUT_FOR_DELIVERY (Ready for delivery)
• IN_COOKING → DECLINED (Cannot fulfill)
• IN_COOKING → CANCELLED (Cancel order)

• OUT_FOR_DELIVERY → COMPLETED (Delivered successfully)
• OUT_FOR_DELIVERY → DECLINED (Delivery failed)
• OUT_FOR_DELIVERY → CANCELLED (Cancel delivery)

• DECLINED → CANCELLED (For deletion only)

❌ INVALID TRANSITIONS:
• Cannot skip steps (e.g., PENDING → COMPLETED)
• Cannot go backwards (e.g., IN_COOKING → PENDING)
• Cannot change final states (COMPLETED, CANCELLED)
• Cannot reactivate declined orders

💡 TIPS:
• Follow the flow: PENDING → ACCEPTED → IN_COOKING → OUT_FOR_DELIVERY → COMPLETED
• Use DECLINED if you cannot fulfill the order
• Use CANCELLED for customer cancellations or deletion
• Once COMPLETED or CANCELLED, orders cannot be changed`;
  }

  private getStatusFlowDiagram(currentStatus: string): string {
    const flowDiagrams: { [key: string]: string } = {
      'PENDING': '📋 Flow: PENDING → ACCEPTED → IN_COOKING → OUT_FOR_DELIVERY → COMPLETED\n   OR: PENDING → DECLINED/CANCELLED',
      'ACCEPTED': '📋 Flow: ACCEPTED → IN_COOKING → OUT_FOR_DELIVERY → COMPLETED\n   OR: ACCEPTED → DECLINED/CANCELLED',
      'IN_COOKING': '📋 Flow: IN_COOKING → OUT_FOR_DELIVERY → COMPLETED\n   OR: IN_COOKING → DECLINED/CANCELLED',
      'OUT_FOR_DELIVERY': '📋 Flow: OUT_FOR_DELIVERY → COMPLETED\n   OR: OUT_FOR_DELIVERY → DECLINED/CANCELLED',
      'DECLINED': '📋 Flow: DECLINED → CANCELLED (for deletion only)',
      'COMPLETED': '📋 Flow: COMPLETED (Final State - No Changes Allowed)',
      'CANCELLED': '📋 Flow: CANCELLED (Final State - No Changes Allowed)'
    };
    
    return flowDiagrams[currentStatus] || '📋 Status flow information not available';
  }

  // Helper method to show backend limitation information
  showBackendLimitationInfo(): void {
    this.cosmicNotification.info(
      'Backend Integration Info',
      `🔧 Current Backend Status:
• API Base URL: http://localhost:9095
• Some operations may be restricted by backend business logic
• Status changes and deletions are controlled by the backend service

💡 If operations fail, it's due to backend policies, not frontend issues.`,
      6000
    );
  }

  // Debug method to log order and system state
  debugOrderSystem(): void {
    console.group('🔧 ORDER SYSTEM DEBUG INFO');
    console.log('📊 Current Orders:', this.orders);
    console.log('👤 Current User ID:', this.authService.getCurrentUserId());
    console.log('🌐 API Base URL:', 'http://localhost:9095');
    console.log('🔒 Auth Status:', this.authService.getCurrentUserId() ? 'Logged In' : 'Not Logged In');
    console.groupEnd();
  }

  refreshMenuItems(): void {
    const restaurantId = this.authService.getCurrentUserId();
    if (restaurantId) {
      this.restaurantService.fetchMenuItems(restaurantId).subscribe({
        next: (items: MenuItem[]) => {
          this.menuItems = items;
          this.cdr.detectChanges();
          console.log('🔄 Menu items refreshed:', items);
        },
        error: (error: any) => {
          console.error('❌ Error refreshing menu items:', error);
          
          // Handle 404 as empty menu (normal for new restaurants)
          if (error.status === 404) {
            console.log('ℹ️ No menu items found during refresh - setting empty menu');
            this.menuItems = []; // Set empty array for new restaurants
            this.error = null; // Don't show error for empty menu
            this.cdr.detectChanges();
          }
          // For other errors, don't update the error state to avoid disrupting the UI
        }
      });
    }
  }


} 