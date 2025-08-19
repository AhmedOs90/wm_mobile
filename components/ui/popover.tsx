// components/Popover.tsx
import React, { useState, useRef } from 'react';
import {
  View,
  Modal,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  Text,
  LayoutRectangle,
  findNodeHandle,
  UIManager,
} from 'react-native';

type PopoverProps = {
  content: React.ReactNode;
  children: React.ReactNode;
};

export const Popover: React.FC<PopoverProps> = ({ children, content }) => {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState<LayoutRectangle | null>(null);
  const triggerRef = useRef(null);

  const open = () => {
    if (triggerRef.current) {
      const handle = findNodeHandle(triggerRef.current);
      if (handle) {
        UIManager.measure(handle, (_x, _y, width, height, pageX, pageY) => {
          setPosition({ x: pageX, y: pageY, width, height });
          setVisible(true);
        });
      }
    }
  };

  return (
    <>
      <TouchableOpacity ref={triggerRef} onPress={open}>
        {children}
      </TouchableOpacity>

      <Modal transparent visible={visible} animationType="fade">
        <Pressable style={StyleSheet.absoluteFill} onPress={() => setVisible(false)} />
        <View
          style={[
            styles.popoverContent,
            position && {
              top: position.y + position.height + 4,
              left: position.x,
            },
          ]}
        >
          {content}
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  popoverContent: {
    position: 'absolute',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    zIndex: 1000,
  },
});
