import React from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  GestureResponderEvent,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import type { ReactNode } from 'react';

type Variant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
type Size = 'default' | 'sm' | 'lg' | 'icon';

export interface ButtonProps {
  onPress?: (event: GestureResponderEvent) => void;
  children?: ReactNode; // ✅ Made optional
  variant?: Variant;
  size?: Size;
  style?: ViewStyle;
  textStyle?: TextStyle;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  disabled?: boolean;
  loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  onPress,
  children,
  variant = 'default',
  size = 'default',
  style,
  textStyle,
  iconLeft,
  iconRight,
  disabled = false,
  loading = false,
}) => {
  const variantStyles = stylesByVariant[variant] || stylesByVariant.default;
  const sizeStyles = stylesBySize[size] || stylesBySize.default;

  if (
    __DEV__ &&
    children &&
    typeof children !== 'string' &&
    typeof children !== 'number' &&
    !React.isValidElement(children)
  ) {
    console.warn(
      'Button received an invalid `children` prop. Expected string, number, or valid React element.'
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.base,
        variantStyles.button,
        sizeStyles.button,
        disabled && styles.disabled,
        style,
      ]}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator size="small" color={variantStyles.text.color} />
      ) : (
        <View style={styles.content}>
          {iconLeft}
          {typeof children === 'string' || typeof children === 'number' ? (
            <Text style={[variantStyles.text, sizeStyles.text, textStyle]}>{children}</Text>
          ) : (
            children ?? null // ✅ Safe fallback
          )}
          {iconRight}
        </View>
      )}
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  base: {
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  disabled: {
    opacity: 0.6,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
});

const stylesByVariant: Record<string, { button: ViewStyle; text: TextStyle }> = {
  default: {
    button: {
      backgroundColor: '#2563EB', // blue-600
    },
    text: {
      color: '#ffffff',
      fontWeight: '600',
    },
  },
  destructive: {
    button: {
      backgroundColor: '#DC2626', // red-600
    },
    text: {
      color: '#ffffff',
      fontWeight: '600',
    },
  },
  outline: {
    button: {
      borderWidth: 1,
      borderColor: '#D1D5DB', // gray-300
      backgroundColor: '#ffffff',
    },
    text: {
      color: '#111827', // gray-900
      fontWeight: '500',
    },
  },
  secondary: {
    button: {
      backgroundColor: '#E5E7EB', // gray-200
    },
    text: {
      color: '#111827',
      fontWeight: '500',
    },
  },
  ghost: {
    button: {
      backgroundColor: 'transparent',
    },
    text: {
      color: '#374151',
      fontWeight: '500',
    },
  },
  link: {
    button: {
      backgroundColor: 'transparent',
    },
    text: {
      color: '#2563EB',
      textDecorationLine: 'underline',
    },
  },
};

const stylesBySize: Record<string, { button: ViewStyle; text: TextStyle }> = {
  default: {
    button: {
      paddingVertical: 10,
      paddingHorizontal: 16,
    },
    text: {
      fontSize: 14,
    },
  },
  sm: {
    button: {
      paddingVertical: 8,
      paddingHorizontal: 12,
    },
    text: {
      fontSize: 13,
    },
  },
  lg: {
    button: {
      paddingVertical: 12,
      paddingHorizontal: 20,
    },
    text: {
      fontSize: 16,
    },
  },
  icon: {
    button: {
      padding: 10,
      width: 44,
      height: 44,
    },
    text: {
      fontSize: 0, // no text for icon-only button
    },
  },
};
