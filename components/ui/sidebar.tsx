// components/Sidebar.tsx
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  Modal,
} from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;

interface SidebarProps {
  isVisible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  side?: 'left' | 'right';
  width?: number;
}

const Sidebar: React.FC<SidebarProps> = ({
  isVisible,
  onClose,
  children,
  side = 'right',
  width = SCREEN_WIDTH * 0.75,
}) => {
  const translateX = useRef(new Animated.Value(width)).current;

  useEffect(() => {
    Animated.timing(translateX, {
      toValue: isVisible ? 0 : width,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isVisible]);

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>

      <Animated.View
        style={[
          styles.sidebar,
          {
            width,
            [side]: 0,
            transform: [
              {
                translateX:
                  side === 'right'
                    ? translateX
                    : translateX.interpolate({
                        inputRange: [0, width],
                        outputRange: [0, -width],
                      }),
              },
            ],
          },
        ]}
      >
        {children}
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    backgroundColor: '#fff',
    zIndex: 10,
    padding: 20,
  },
});

export default Sidebar;
