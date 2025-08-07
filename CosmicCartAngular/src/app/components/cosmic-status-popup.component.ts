import { Component, Input, OnInit, OnDestroy, OnChanges, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cosmic-status-popup',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="cosmic-status-overlay" *ngIf="visible" (click)="close()">
      <div class="cosmic-status-popup" (click)="$event.stopPropagation()">
        
        <!-- Cosmic Header -->
        <div class="popup-header">
          <div class="cosmic-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="16" x2="12" y2="12"/>
              <circle cx="12" cy="8" r="1"/>
            </svg>
          </div>
          <h4 class="popup-title">🚀 Cosmic Order Flow</h4>
        </div>

        <!-- Message Content -->
        <div class="popup-content">
          <p class="popup-message">{{ message }}</p>
        </div>

        <!-- Action Buttons -->
        <div class="popup-actions">
          <button class="cosmic-btn-primary" (click)="close()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="me-2">
              <path d="M20 6L9 17l-5-5"/>
            </svg>
            Got it!
          </button>
        </div>

        <!-- Cosmic particles animation -->
        <div class="cosmic-particles">
          <div class="particle particle-1">✨</div>
          <div class="particle particle-2">⭐</div>
          <div class="particle particle-3">💫</div>
          <div class="particle particle-4">🌟</div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .cosmic-status-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.7);
      backdrop-filter: blur(10px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      animation: overlay-fade-in 0.3s ease-out forwards;
    }

    @keyframes overlay-fade-in {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .cosmic-status-popup {
      background: linear-gradient(135deg, rgba(0, 0, 0, 0.9), rgba(30, 30, 50, 0.95));
      border: 2px solid rgba(102, 126, 234, 0.4);
      border-radius: 20px;
      padding: 1.5rem;
      max-width: 500px;
      width: 90%;
      max-height: 80vh;
      overflow-y: auto;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.8);
      position: relative;
      animation: popup-entrance 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
      margin: 20px;
    }

    @keyframes popup-entrance {
      from {
        opacity: 0;
        transform: scale(0.7) translateY(-50px);
      }
      to {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
    }

    .popup-header {
      text-align: center;
      margin-bottom: 1.5rem;
    }

    .cosmic-icon {
      width: 60px;
      height: 60px;
      margin: 0 auto 1rem;
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.3), rgba(67, 233, 123, 0.3));
      border: 2px solid rgba(102, 126, 234, 0.5);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: rgba(102, 126, 234, 1);
      animation: icon-pulse 2s ease-in-out infinite;
    }

    @keyframes icon-pulse {
      0%, 100% {
        box-shadow: 0 0 15px rgba(102, 126, 234, 0.4);
        transform: scale(1);
      }
      50% {
        box-shadow: 0 0 25px rgba(102, 126, 234, 0.7);
        transform: scale(1.05);
      }
    }

    .popup-title {
      color: rgba(255, 255, 255, 0.95);
      font-family: 'Exo 2', sans-serif;
      font-weight: 700;
      margin: 0;
      text-shadow: 0 2px 10px rgba(102, 126, 234, 0.3);
    }

    .popup-content {
      text-align: center;
      margin-bottom: 2rem;
    }

    .popup-message {
      color: rgba(255, 255, 255, 0.9);
      font-size: 0.9rem;
      line-height: 1.5;
      margin: 0;
      white-space: pre-wrap;
      word-wrap: break-word;
      max-height: 300px;
      overflow-y: auto;
      padding-right: 10px;
    }

    /* Custom scrollbar for message */
    .popup-message::-webkit-scrollbar {
      width: 6px;
    }

    .popup-message::-webkit-scrollbar-track {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 3px;
    }

    .popup-message::-webkit-scrollbar-thumb {
      background: rgba(102, 126, 234, 0.6);
      border-radius: 3px;
    }

    .popup-message::-webkit-scrollbar-thumb:hover {
      background: rgba(102, 126, 234, 0.8);
    }

    .popup-actions {
      text-align: center;
    }

    .cosmic-btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border: 2px solid rgba(255, 255, 255, 0.2);
      border-radius: 12px;
      color: white;
      padding: 0.75rem 1.5rem;
      font-weight: 600;
      font-family: 'Exo 2', sans-serif;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s ease;
      text-transform: none;
    }

    .cosmic-btn-primary:hover {
      transform: translateY(-3px);
      box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
      border-color: rgba(255, 255, 255, 0.4);
    }

    /* Cosmic particles */
    .cosmic-particles {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      overflow: hidden;
    }

    .particle {
      position: absolute;
      font-size: 1rem;
      opacity: 0.6;
      animation: float-particle 4s linear infinite;
    }

    .particle-1 {
      top: 20%;
      left: 10%;
      animation-delay: 0s;
    }

    .particle-2 {
      top: 60%;
      right: 15%;
      animation-delay: 1s;
    }

    .particle-3 {
      bottom: 30%;
      left: 20%;
      animation-delay: 2s;
    }

    .particle-4 {
      top: 40%;
      right: 25%;
      animation-delay: 3s;
    }

    @keyframes float-particle {
      0% {
        transform: translateY(0) rotate(0deg);
        opacity: 0.6;
      }
      50% {
        transform: translateY(-20px) rotate(180deg);
        opacity: 1;
      }
      100% {
        transform: translateY(0) rotate(360deg);
        opacity: 0.6;
      }
    }

    /* Mobile responsiveness */
    @media (max-width: 768px) {
      .cosmic-status-popup {
        margin: 1rem;
        padding: 1.5rem;
      }

      .popup-title {
        font-size: 1.2rem;
      }

      .popup-message {
        font-size: 0.9rem;
      }
    }
  `]
})
export class CosmicStatusPopupComponent implements OnInit, OnDestroy, OnChanges {
  @Input() message: string = '';
  @Input() visible: boolean = false;
  @Input() autoClose: boolean = true;
  @Input() duration: number = 3000;
  @Output() closed = new EventEmitter<void>();

  private timeoutId: any;

  ngOnInit(): void {
    console.log('🔧 Popup ngOnInit - visible:', this.visible, 'message:', this.message);
    if (this.autoClose && this.visible) {
      this.timeoutId = setTimeout(() => {
        this.close();
      }, this.duration);
    }
  }

  ngOnChanges(): void {
    console.log('🔧 Popup ngOnChanges - visible:', this.visible, 'message:', this.message);
    
    // Clear any existing timer
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
    
    // Set up new timer if popup is visible and auto-close is enabled
    if (this.autoClose && this.visible) {
      console.log('🔧 Setting up auto-close timer for', this.duration, 'ms');
      this.timeoutId = setTimeout(() => {
        console.log('🔧 Auto-close timer triggered');
        this.close();
      }, this.duration);
    }
  }

  ngOnDestroy(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }

  close(): void {
    console.log('🔧 Popup closing');
    this.visible = false;
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
    this.closed.emit();
  }
} 