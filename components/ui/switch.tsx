import React from 'react';
import { Switch as RNSwitch } from 'react-native';

type SwitchProps = {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
};

const Switch: React.FC<SwitchProps> = ({ value, onValueChange, disabled }) => {
  return (
    <RNSwitch
      trackColor={{ false: '#d1d5db', true: '#4f46e5' }} // input / primary
      thumbColor="#ffffff" // background
      ios_backgroundColor="#d1d5db"
      onValueChange={onValueChange}
      value={value}
      disabled={disabled}
    />
  );
};

export { Switch };
