import React from 'react';
import { TextInput, TextInputProps, StyleSheet } from 'react-native';

type InputProps = TextInputProps & {
  className?: string; // Optional, for Tailwind/nativewind if used
};

export const Input = React.forwardRef<TextInput, InputProps>(
  ({ style, className, ...props }, ref) => {
    return (
      <TextInput
        ref={ref}
        style={[styles.input, style]}
        placeholderTextColor="#9ca3af" // Tailwind's muted-foreground equivalent
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

const styles = StyleSheet.create({
  input: {
    height: 40,
    width: '100%',
    borderWidth: 1,
    borderRadius: 6,
    borderColor: '#d1d5db', // Tailwind border-input
    backgroundColor: '#fff', // Tailwind bg-background
    paddingHorizontal: 12,
    fontSize: 16,
  },
});
