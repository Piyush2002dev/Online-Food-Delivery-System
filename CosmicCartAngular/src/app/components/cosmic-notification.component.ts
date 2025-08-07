import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface CosmicNotification {
  id?: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  autoClose?: boolean;
}

@Component({
  selector: 'app-cosmic-notification',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="cosmic-notification-overlay" 
         [class.left-position]="position === 'left'"
         *ngIf="visible && notification">
      <div class="cosmic-notification" 
           [ngClass]="'cosmic-' + notification.type"
           [class.notification-enter]="visible"
           [class.notification-exit]="!visible">
        
        <!-- Notification Icon -->
        <div class="notification-icon">
          <svg *ngIf="notification.type === 'success'" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 6L9 17l-5-5"/>
          </svg>
          <svg *ngIf="notification.type === 'error'" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="15" y1="9" x2="9" y2="15"/>
            <line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
          <svg *ngIf="notification.type === 'warning'" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <circle cx="12" cy="17" r="1"/>
          </svg>
          <svg *ngIf="notification.type === 'info'" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="16" x2="12" y2="12"/>
            <circle cx="12" cy="8" r="1"/>
          </svg>
        </div>

        <!-- Notification Content -->
        <div class="notification-content">
          <div class="notification-title">{{ notification.title }}</div>
          <div class="notification-message">{{ notification.message }}</div>
        </div>

        <!-- Close Button -->
        <button class="notification-close" (click)="close()">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        <!-- Progress Bar for Auto Close -->
        <div class="notification-progress" *ngIf="notification.autoClose !== false">
          <div class="progress-bar" [style.animation-duration]="(notification.duration || 3000) + 'ms'"></div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .cosmic-notification-overlay {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 10000;
      pointer-events: none;
    }

    .cosmic-notification-overlay.left-position {
      top: 80px;
      left: 20px;
      right: auto;
    }

    .cosmic-notification {
      background: rgba(0, 0, 0, 0.9);
      backdrop-filter: blur(20px);
      border: 2px solid rgba(255, 255, 255, 0.2);
      border-radius: 16px;
      padding: 1rem;
      min-width: 300px;
      max-width: 400px;
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
      pointer-events: auto;
      position: relative;
      overflow: hidden;
      transition: all 0.3s ease;
    }

    .notification-enter {
      animation: cosmic-notification-entrance 0.6s ease-out forwards;
    }

    .notification-exit {
      animation: cosmic-notification-exit 1.8s ease-in forwards;
    }

    @keyframes cosmic-notification-entrance {
      from {
        opacity: 0;
        transform: translateX(100%) translateY(-20px) scale(0.8);
      }
      to {
        opacity: 1;
        transform: translateX(0) translateY(0) scale(1);
      }
    }

    @keyframes cosmic-notification-exit {
      0% {
        transform: translateX(0) scale(1);
        opacity: 1;
      }
      30% {
        transform: translateX(10px) scale(1.02);
        opacity: 0.9;
      }
      60% {
        transform: translateX(20px) scale(0.98);
        opacity: 0.6;
      }
      80% {
        transform: translateX(50px) scale(0.95);
        opacity: 0.3;
      }
      100% {
        transform: translateX(100px) scale(0.9);
        opacity: 0;
      }
    }

    .cosmic-success {
      border-color: rgba(34, 197, 94, 0.5);
      background: radial-gradient(circle at top right, rgba(34, 197, 94, 0.2), rgba(0, 0, 0, 0.9));
    }

    .cosmic-error {
      border-color: rgba(239, 68, 68, 0.5);
      background: radial-gradient(circle at top right, rgba(239, 68, 68, 0.2), rgba(0, 0, 0, 0.9));
    }

    .cosmic-warning {
      border-color: rgba(251, 191, 36, 0.5);
      background: radial-gradient(circle at top right, rgba(251, 191, 36, 0.2), rgba(0, 0, 0, 0.9));
    }

    .cosmic-info {
      border-color: rgba(59, 130, 246, 0.5);
      background: radial-gradient(circle at top right, rgba(59, 130, 246, 0.2), rgba(0, 0, 0, 0.9));
    }

    .notification-icon {
      width: 24px;
      height: 24px;
      flex-shrink: 0;
      margin-top: 0.25rem;
    }

    .cosmic-success .notification-icon {
      color: rgba(34, 197, 94, 1);
    }

    .cosmic-error .notification-icon {
      color: rgba(239, 68, 68, 1);
    }

    .cosmic-warning .notification-icon {
      color: rgba(251, 191, 36, 1);
    }

    .cosmic-info .notification-icon {
      color: rgba(59, 130, 246, 1);
    }

    .notification-content {
      flex-grow: 1;
      min-width: 0;
    }

    .notification-title {
      font-weight: 700;
      font-size: 0.9rem;
      color: rgba(255, 255, 255, 0.95);
      margin-bottom: 0.25rem;
      font-family: 'Exo 2', sans-serif;
    }

    .notification-message {
      font-size: 0.8rem;
      color: rgba(255, 255, 255, 0.8);
      line-height: 1.4;
      font-family: 'Exo 2', sans-serif;
    }

    .notification-close {
      background: transparent;
      border: none;
      color: rgba(255, 255, 255, 0.6);
      cursor: pointer;
      width: 20px;
      height: 20px;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      transition: all 0.3s ease;
      margin-top: 0.25rem;
    }

    .notification-close:hover {
      color: rgba(255, 255, 255, 1);
      background: rgba(255, 255, 255, 0.1);
    }

    .notification-progress {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: rgba(255, 255, 255, 0.1);
      overflow: hidden;
    }

    .progress-bar {
      height: 100%;
      width: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8), transparent);
      transform: translateX(-100%);
      animation: progress-bar-animation 3000ms linear forwards;
    }

    @keyframes progress-bar-animation {
      from {
        transform: translateX(-100%);
      }
      to {
        transform: translateX(0);
      }
    }

    /* Mobile responsiveness */
    @media (max-width: 768px) {
      .cosmic-notification-overlay {
        top: 10px;
        right: 10px;
        left: 10px;
      }

      .cosmic-notification-overlay.left-position {
        top: 70px;
        left: 10px;
        right: 10px;
      }

      .cosmic-notification {
        min-width: unset;
        max-width: unset;
        width: 100%;
      }
    }
  `]
})
export class CosmicNotificationComponent implements OnInit, OnDestroy {
  @Input() notification!: CosmicNotification;
  @Input() visible: boolean = true;
  @Input() position: 'right' | 'left' = 'right';

  private timeoutId: any;

  ngOnInit(): void {
    if (this.notification && this.notification.autoClose !== false) {
      const duration = this.notification.duration || 3000;
      this.timeoutId = setTimeout(() => {
        this.close();
      }, duration);
    }
  }

  ngOnDestroy(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }

  close(): void {
    this.visible = false;
    // Allow time for exit animation
    setTimeout(() => {
      // Emit close event or handle cleanup
    }, 300);
  }
} 