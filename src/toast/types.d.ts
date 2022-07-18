export type ToastPosition = "top" | "top-left" | "top-right" | "bottom" | "bottom-left" | "bottom-right";

export type ToastAnimation = "fade" | "slide" | "fade-and-slide";

export type NotificationIntent = "info" | "success" | "warning" | "danger";

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
  key: string,
  dismissing: boolean,
}
