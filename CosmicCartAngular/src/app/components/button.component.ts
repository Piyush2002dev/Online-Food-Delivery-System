import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      [type]="type"
      [disabled]="disabled"
      [class]="buttonClasses"
      (click)="onClick.emit($event)"
    >
      <ng-content></ng-content>
    </button>
  `,
  styles: []
})
export class ButtonComponent {
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() variant: 'primary' | 'secondary' | 'success' | 'danger' | 'ghost' = 'primary';
  @Input() size: 'sm' | 'md' | 'lg' | 'full' = 'md';
  @Input() disabled: boolean = false;
  @Input() className: string = '';
  @Output() onClick = new EventEmitter<Event>();

  get buttonClasses(): string {
    const baseClasses = 'btn d-flex align-items-center justify-content-center transition-all transform-scale';
    const variantClass = this.getVariantClass();
    const sizeClass = this.getSizeClass();
    
    return `${baseClasses} ${variantClass} ${sizeClass} ${this.className}`;
  }

  private getVariantClass(): string {
    switch (this.variant) {
      case 'primary': return 'btn-orange';
      case 'secondary': return 'btn-outline-orange';
      case 'success': return 'btn-green';
      case 'danger': return 'btn btn-danger';
      case 'ghost': return 'btn btn-link text-gray-600';
      default: return 'btn-orange';
    }
  }

  private getSizeClass(): string {
    switch (this.size) {
      case 'sm': return 'btn-sm';
      case 'md': return '';
      case 'lg': return 'btn-lg';
      case 'full': return 'w-100';
      default: return '';
    }
  }
} 