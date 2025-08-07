import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-form-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormInputComponent),
      multi: true
    }
  ],
  template: `
    <div class="mb-3">
      <label class="form-label fw-medium text-gray-700">
        {{ label }}
      </label>
      <div class="position-relative">
        <textarea
          *ngIf="type === 'textarea'"
          [name]="name"
          [required]="required"
          [rows]="rows || 3"
          [class]="'form-control resize-none ' + (iconClass ? 'ps-5' : '')"
          [placeholder]="placeholder"
          [value]="value"
          (input)="onInput($event)"
          (blur)="onTouched()"
        ></textarea>
        <input
          *ngIf="type !== 'textarea'"
          [type]="type"
          [name]="name"
          [required]="required"
          [class]="'form-control ' + (iconClass ? 'ps-5' : '')"
          [placeholder]="placeholder"
          [value]="value"
          (input)="onInput($event)"
          (blur)="onTouched()"
        />
      </div>
    </div>
  `,
  styles: []
})
export class FormInputComponent implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() type: string = 'text';
  @Input() name: string = '';
  @Input() placeholder: string = '';
  @Input() required: boolean = false;
  @Input() iconClass: string = '';
  @Input() rows?: number;
  @Output() valueChange = new EventEmitter<string>();

  value: string = '';
  onChange = (value: string) => {};
  onTouched = () => {};

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement | HTMLTextAreaElement;
    this.value = target.value;
    this.onChange(this.value);
    this.valueChange.emit(this.value);
  }

  writeValue(value: string): void {
    this.value = value || '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    // Handle disabled state if needed
  }
} 