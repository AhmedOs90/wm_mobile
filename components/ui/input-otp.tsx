import React, { useRef, useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  TextStyle,
} from 'react-native';

type InputOTPProps = {
  length?: number;
  onChange?: (value: string) => void;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
};

export const InputOTP = ({
  length = 6,
  onChange,
  containerStyle,
  inputStyle,
}: InputOTPProps) => {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(''));
  const inputsRef = useRef<Array<TextInput | null>>([]);

  const handleChange = (text: string, index: number) => {
    if (/[^0-9a-zA-Z]/.test(text)) return;

    const newOtp = [...otp];
    newOtp[index] = text;

    setOtp(newOtp);
    onChange?.(newOtp.join(''));

    if (text && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {otp.map((char, i) => (
        <TextInput
          key={i}
          ref={(ref) => { inputsRef.current[i] = ref; }}
          value={char}
          onChangeText={(text) => handleChange(text.slice(-1), i)}
          onKeyPress={(e) => handleKeyPress(e, i)}
          style={[styles.input, inputStyle]}
          keyboardType="default"
          maxLength={1}
          returnKeyType="done"
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    width: 40,
    height: 48,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    textAlign: 'center',
    fontSize: 20,
  },
});

