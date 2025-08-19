import React, { useState, useRef } from "react";
import {
  View,
  TouchableOpacity,
  Animated,
  LayoutAnimation,
  Platform,
  UIManager,
  StyleSheet,
} from "react-native";
import { ChevronDown } from "lucide-react-native";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export const Collapsible = ({
  children,
  defaultOpen = false,
}: {
  children: React.ReactNode;
  defaultOpen?: boolean;
}) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <CollapsibleContext.Provider value={{ open, setOpen }}>
      {children}
    </CollapsibleContext.Provider>
  );
};

const CollapsibleContext = React.createContext<{
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}>({
  open: false,
  setOpen: () => {},
});

type CollapsibleTriggerProps = {
  children: React.ReactNode | ((open: boolean) => React.ReactNode);
};

export const CollapsibleTrigger = ({
  children,
}: CollapsibleTriggerProps) => {
  const { open, setOpen } = React.useContext(CollapsibleContext);

  const handlePress = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpen(!open);
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      {typeof children === "function" ? (children as (open: boolean) => React.ReactNode)(open) : children}
    </TouchableOpacity>
  );
};

export const CollapsibleContent = ({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: any;
}) => {
  const { open } = React.useContext(CollapsibleContext);
  const animation = useRef(new Animated.Value(open ? 1 : 0)).current;

  React.useEffect(() => {
    Animated.timing(animation, {
      toValue: open ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [open]);

  const height = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1000], // Max height; adjust if needed
  });

  return (
    <Animated.View style={[{ overflow: "hidden", height }, style]}>
      {children}
    </Animated.View>
  );
};
