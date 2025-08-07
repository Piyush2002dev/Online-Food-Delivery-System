import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/landing-page/landing-page.component').then(m => m.LandingPageComponent) },
  { path: 'customer/login', loadComponent: () => import('./pages/customer-login/customer-login.component').then(m => m.CustomerLoginComponent) },
  { path: 'customer/register', loadComponent: () => import('./pages/customer-register/customer-register.component').then(m => m.CustomerRegisterComponent) },
  { path: 'restaurant/login', loadComponent: () => import('./pages/restaurant-login/restaurant-login.component').then(m => m.RestaurantLoginComponent) },
  { path: 'restaurant/register', loadComponent: () => import('./pages/restaurant-register/restaurant-register.component').then(m => m.RestaurantRegisterComponent) },
  { path: 'restaurant/dashboard', loadComponent: () => import('./pages/restaurant-dashboard/restaurant-dashboard.component').then(m => m.RestaurantDashboardComponent) },
  { path: 'main', loadComponent: () => import('./pages/main-page/main-page.component').then(m => m.MainPageComponent) },
  { path: 'restaurant/:id', loadComponent: () => import('./pages/restaurant-page/restaurant-page.component').then(m => m.RestaurantPageComponent) },
  { path: 'cart', loadComponent: () => import('./pages/cart-page/cart-page.component').then(m => m.CartPageComponent) },
  { path: 'payment', loadComponent: () => import('./pages/payment-page/payment-page.component').then(m => m.PaymentPageComponent) },
  { path: 'payment/success', loadComponent: () => import('./pages/payment-success/payment-success.component').then(m => m.PaymentSuccessComponent) },
  { path: 'order-tracking', loadComponent: () => import('./pages/order-tracking/order-tracking.component').then(m => m.OrderTrackingComponent) },
  { path: 'profile', loadComponent: () => import('./pages/user-profile/user-profile.component').then(m => m.UserProfileComponent) },
  { path: '**', redirectTo: '' }
];
