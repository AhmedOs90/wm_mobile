import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Modal from 'react-native-modal';
import { X } from 'lucide-react-native';
import type * as Animatable from 'react-native-animatable';

const SCREEN_WIDTH = Dimensions.get('window').width;

type Side = 'left' | 'right' | 'bottom' | 'top';

interface SheetProps {
  isVisible: boolean;
  onClose: () => void;
  side?: Side;
  children: React.ReactNode;
}

const Sheet: React.FC<SheetProps> = ({ isVisible, onClose, children, side = 'right' }) => {
  const getAnimation = (): { in: Animatable.Animation; out: Animatable.Animation } => {
  switch (side) {
    case 'left':
      return { in: 'slideInLeft', out: 'slideOutLeft' };
    case 'right':
      return { in: 'slideInRight', out: 'slideOutRight' };
    case 'bottom':
      return { in: 'slideInUp', out: 'slideOutDown' };
    case 'top':
      return { in: 'slideInDown', out: 'slideOutUp' };
    default:
      return { in: 'slideInRight', out: 'slideOutRight' };
  }
};


  return (
    <Modal
      isVisible={isVisible}
      animationIn={getAnimation().in as Animatable.Animation}
animationOut={getAnimation().out as Animatable.Animation}

      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      style={styles.modal}
      useNativeDriver
    >
      <View
        style={[
          styles.sheet,
          side === 'left' || side === 'right' ? { width: SCREEN_WIDTH * 0.75 } : {},
        ]}
      >
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <X size={20} color="#333" />
        </TouchableOpacity>
        {children}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    maxHeight: '90%',
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 10,
  },
});

export default Sheet;
