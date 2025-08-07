import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-typewriter',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="typewriter-container" [ngClass]="containerClass">
      <span class="typewriter-text" [ngStyle]="{ 'color': textColor }">{{ displayText }}</span>
      <span class="typewriter-cursor" 
            [ngClass]="{ 'blinking': showCursor }"
            [ngStyle]="{ 'color': cursorColor || textColor }">|</span>
    </span>
  `,
  styles: [`
    .typewriter-container {
      display: inline-block;
      font-family: inherit;
    }

    .typewriter-text {
      font-family: inherit;
      white-space: pre-wrap;
    }

    .typewriter-cursor {
      font-weight: 400;
      animation: none;
    }

    .typewriter-cursor.blinking {
      animation: typewriter-blink 1s infinite;
    }

    @keyframes typewriter-blink {
      0%, 50% {
        opacity: 1;
      }
      51%, 100% {
        opacity: 0;
      }
    }

    /* Cosmic theme variations */
    .cosmic-typewriter {
      background: linear-gradient(45deg, #667eea, #764ba2, #f093fb, #f5576c);
      background-size: 400% 400%;
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      animation: cosmic-gradient 3s ease infinite;
    }

    @keyframes cosmic-gradient {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }

    .neon-typewriter {
      text-shadow: 
        0 0 5px currentColor,
        0 0 10px currentColor,
        0 0 15px currentColor,
        0 0 20px currentColor;
    }
  `]
})
export class TypewriterComponent implements OnInit, OnDestroy {
  @Input() texts: string[] = [];
  @Input() speed: number = 100; // milliseconds per character
  @Input() deleteSpeed: number = 50; // milliseconds per character when deleting
  @Input() pauseDuration: number = 2000; // pause between texts
  @Input() loop: boolean = true;
  @Input() showCursor: boolean = true;
  @Input() textColor: string = 'inherit';
  @Input() cursorColor: string = '';
  @Input() containerClass: string = '';
  @Input() startDelay: number = 0; // delay before starting animation

  displayText: string = '';
  private currentTextIndex: number = 0;
  private currentCharIndex: number = 0;
  private isDeleting: boolean = false;
  private timeoutId: any;

  ngOnInit(): void {
    if (this.texts.length > 0) {
      if (this.startDelay > 0) {
        setTimeout(() => {
          this.startTypewriter();
        }, this.startDelay);
      } else {
        this.startTypewriter();
      }
    }
  }

  ngOnDestroy(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }

  private startTypewriter(): void {
    this.typeWriter();
  }

  private typeWriter(): void {
    const currentText = this.texts[this.currentTextIndex];
    
    if (this.isDeleting) {
      // Delete characters
      this.displayText = currentText.substring(0, this.currentCharIndex - 1);
      this.currentCharIndex--;
      
      if (this.currentCharIndex === 0) {
        this.isDeleting = false;
        this.currentTextIndex = (this.currentTextIndex + 1) % this.texts.length;
        
        // Check if we should loop or stop
        if (!this.loop && this.currentTextIndex === 0) {
          return; // Stop animation
        }
        
        this.timeoutId = setTimeout(() => this.typeWriter(), this.pauseDuration / 2);
        return;
      }
      
      this.timeoutId = setTimeout(() => this.typeWriter(), this.deleteSpeed);
    } else {
      // Type characters
      this.displayText = currentText.substring(0, this.currentCharIndex + 1);
      this.currentCharIndex++;
      
      if (this.currentCharIndex === currentText.length) {
        // Finished typing current text
        if (this.texts.length > 1) {
          // Start deleting after pause
          this.timeoutId = setTimeout(() => {
            this.isDeleting = true;
            this.typeWriter();
          }, this.pauseDuration);
        } else if (this.loop) {
          // Single text, restart after pause
          this.timeoutId = setTimeout(() => {
            this.currentCharIndex = 0;
            this.displayText = '';
            this.typeWriter();
          }, this.pauseDuration);
        }
        return;
      }
      
      this.timeoutId = setTimeout(() => this.typeWriter(), this.speed);
    }
  }

  // Public method to restart animation
  restart(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    this.currentTextIndex = 0;
    this.currentCharIndex = 0;
    this.isDeleting = false;
    this.displayText = '';
    this.startTypewriter();
  }

  // Public method to stop animation
  stop(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }
} 