// components/NavigationMenu.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Pressable,
} from 'react-native';
import { ChevronDown } from 'lucide-react-native'; // or use any icon lib

type MenuItem = {
  label: string;
  onPress: () => void;
};

interface NavigationMenuProps {
  title: string;
  items: MenuItem[];
}

export const NavigationMenu: React.FC<NavigationMenuProps> = ({
  title,
  items,
}) => {
  const [visible, setVisible] = useState(false);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.trigger}
        onPress={() => setVisible(true)}
      >
        <Text style={styles.triggerText}>{title}</Text>
        <ChevronDown size={16} />
      </TouchableOpacity>

      <Modal transparent visible={visible} animationType="fade">
        <Pressable style={styles.backdrop} onPress={() => setVisible(false)} />
        <View style={styles.menu}>
          {items.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={() => {
                setVisible(false);
                item.onPress();
              }}
            >
              <Text style={styles.menuItemText}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Modal>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
  },
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#eee',
    borderRadius: 6,
  },
  triggerText: {
    marginRight: 4,
    fontWeight: '600',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  menu: {
    position: 'absolute',
    top: 70,
    left: 16,
    right: 16,
    backgroundColor: '#fff',
    paddingVertical: 8,
    borderRadius: 6,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
    elevation: 6,
  },
  menuItem: {
    padding: 12,
  },
  menuItemText: {
    fontSize: 16,
  },
});
