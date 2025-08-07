import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface CosmicNotification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  autoClose?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CosmicNotificationService {
  private notificationsSubject = new BehaviorSubject<CosmicNotification[]>([]);
  public notifications$ = this.notificationsSubject.asObservable();

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  show(notification: Omit<CosmicNotification, 'id'>): string {
    const id = this.generateId();
    const newNotification: CosmicNotification = {
      ...notification,
      id,
      duration: notification.duration || 4500, // Increased from 3000 to 4500
      autoClose: notification.autoClose !== false
    };

    const currentNotifications = this.notificationsSubject.value;
    this.notificationsSubject.next([...currentNotifications, newNotification]);

    // Auto remove after duration
    if (newNotification.autoClose) {
      setTimeout(() => {
        this.remove(id);
      }, newNotification.duration! + 500); // Increased extra time from 300 to 500
    }

    return id;
  }

  success(title: string, message: string, duration?: number): string {
    return this.show({
      type: 'success',
      title,
      message,
      duration
    });
  }

  error(title: string, message: string, duration?: number): string {
    return this.show({
      type: 'error',
      title,
      message,
      duration: duration || 5000 // Errors stay longer
    });
  }

  warning(title: string, message: string, duration?: number): string {
    return this.show({
      type: 'warning',
      title,
      message,
      duration: duration || 4000
    });
  }

  info(title: string, message: string, duration?: number): string {
    return this.show({
      type: 'info',
      title,
      message,
      duration
    });
  }

  remove(id: string): void {
    const currentNotifications = this.notificationsSubject.value;
    this.notificationsSubject.next(
      currentNotifications.filter(notification => notification.id !== id)
    );
  }

  clear(): void {
    this.notificationsSubject.next([]);
  }
} 