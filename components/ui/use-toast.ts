import Toast from 'react-native-toast-message';

export type ToastVariant = 'default' | 'destructive';

type Options = {
  title?: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number; // ms
};

function show({ title, description, variant = 'default', duration = 4000 }: Options) {
  Toast.show({
    type: variant,      // must match keys in your toastConfig: 'default' | 'destructive'
    text1: title,
    text2: description,
    visibilityTime: duration,
  });
}

export function toast(opts: Options) {
  // keep a similar return for API parity if you stored the handle
  show(opts);
  return {
    id: 'rn',                   // dummy id, RN lib doesn’t manage ids per toast publicly
    dismiss: () => Toast.hide(),
    update: (next: Options) => show(next), // re-show with new props
  };
}

export function useToast() {
  return {
    toasts: [],                 // keep shape compatible with your old hook
    toast,                      // programmatic API
    dismiss: () => Toast.hide()
  };
}
