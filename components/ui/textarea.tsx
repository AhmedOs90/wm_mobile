// components/Textarea.tsx
import React from 'react';
import { TextInput, TextInputProps, StyleSheet } from 'react-native';

interface TextareaProps extends TextInputProps {}

export const Textarea = React.forwardRef<TextInput, TextareaProps>(
  ({ style, ...props }, ref) => {
    return (
      <TextInput
        ref={ref}
        style={[styles.textarea, style]}
        multiline
        numberOfLines={4}
        textAlignVertical="top"
        {...props}
      />
    );
  }
);
const styles = StyleSheet.create({
  textarea: {
    minHeight: 80,
    width: '100%',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    backgroundColor: '#fff',
    color: '#000',
  },
});
