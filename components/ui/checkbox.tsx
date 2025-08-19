import { Check } from "lucide-react-native";
import React, { useState } from "react";
import { TouchableOpacity } from "react-native";
import { cn } from "../../lib/utils"; // assuming nativewind config

interface CheckboxProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export const Checkbox = ({
  checked: checkedProp,
  onChange,
  disabled = false,
  className,
}: CheckboxProps) => {
  const [internalChecked, setChecked] = useState(false);
  const isControlled = checkedProp !== undefined;
  const checked = isControlled ? checkedProp : internalChecked;

  const toggle = () => {
    if (disabled) return;
    const newValue = !checked;
    if (!isControlled) setChecked(newValue);
    onChange?.(newValue);
  };

  return (
    <TouchableOpacity
      onPress={toggle}
      activeOpacity={0.7}
      disabled={disabled}
      className={cn(
        "h-4 w-4 rounded-sm border border-primary items-center justify-center",
        checked && "bg-primary text-primary-foreground",
        disabled && "opacity-50",
        className
      )}
    >
      {checked && <Check size={12} color="white" />}
    </TouchableOpacity>
  );
};
