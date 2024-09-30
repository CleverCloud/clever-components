import { NotificationIntent } from '../common.types.js';

export type ToastPosition = 'top' | 'top-left' | 'top-right' | 'bottom' | 'bottom-left' | 'bottom-right';

export type ToastAnimation = 'fade' | 'slide' | 'fade-and-slide';

export interface Notification {
  message: string;
  title?: string;
  intent: NotificationIntent;
  options?: ToastOptions;
}

export interface ToastOptions {
  timeout?: number;
  closeable?: boolean;
  showProgress?: boolean;
}

export interface Toast extends Notification {
  key: string;
  dismissing?: boolean;
}
