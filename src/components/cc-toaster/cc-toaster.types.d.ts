import { NotificationIntent } from '../common.types.js';

type ToastPosition = 'top' | 'top-left' | 'top-right' | 'bottom' | 'bottom-left' | 'bottom-right';

type ToastAnimation = 'fade' | 'slide' | 'fade-and-slide';

interface Notification {
  message: string;
  title?: string;
  intent: NotificationIntent;
  options?: ToastOptions;
}

interface ToastOptions {
  timeout?: number;
  closeable?: boolean;
  showProgress?: boolean;
}

interface Toast extends Notification {
  key: string;
}
