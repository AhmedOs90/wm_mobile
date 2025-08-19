import React from 'react';
import { View } from 'react-native';
import ToastLib from 'react-native-toast-message';
import type { ReactNode, ReactElement } from 'react';
import { toastConfig } from './toast'; // <-- your RN UI config file

// --- Types to match your web imports ---
export type ToastProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  duration?: number;
variant?: 'default' | 'destructive' | 'success' | 'error';
};

export type ToastActionElement = ReactElement<any>;

// --- Provider/Viewport shims ---
// On RN, the library renders the portal itself; we mount it here.
export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <View style={{ flex: 1 }}>
      {children}
      <ToastLib config={toastConfig} />
    </View>
  );
};

// No-op, kept only for API compatibility with web
export const ToastViewport: React.FC<{ className?: string }> = () => null;

// These are no-op component shims to satisfy imports/types.
// RN toasts are driven programmatically via Toast.show(...).
export const Toast: React.FC<ToastProps & { className?: string; variant?: 'default' | 'destructive' }> = () => null;

export const ToastTitle: React.FC<{ className?: string; children?: ReactNode }> = ({ children }) => <>{children}</>;
export const ToastDescription: React.FC<{ className?: string; children?: ReactNode }> = ({ children }) => <>{children}</>;

// Close/Action are not used by the RN lib directly; keep placeholders if your code imports them.
export const ToastClose: React.FC<any> = () => null;
export const ToastAction: React.FC<any> = () => null;
