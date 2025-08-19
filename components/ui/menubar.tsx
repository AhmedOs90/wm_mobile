// components/Menubar.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  Modal,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

type MenubarItem = {
  label: string;
  icon?: keyof typeof MaterialIcons.glyphMap;
  onPress?: () => void;
  disabled?: boolean;
};

type MenubarProps = {
  items: MenubarItem[];
  triggerLabel?: string;
};

export function Menubar({ items, triggerLabel = 'Menu' }: MenubarProps) {
  const [visible, setVisible] = useState(false);

  const open = () => setVisible(true);
  const close = () => setVisible(false);

  return (
    <View>
      <Pressable style={styles.trigger} onPress={open}>
        <Text style={styles.triggerText}>{triggerLabel}</Text>
        <MaterialIcons name="arrow-drop-down" size={20} />
      </Pressable>

      <Modal
        animationType="fade"
        transparent
        visible={visible}
        onRequestClose={close}
      >
        <Pressable style={styles.backdrop} onPress={close}>
          <View style={styles.menu}>
            {items.map((item, i) => (
              <TouchableOpacity
                key={i}
                onPress={() => {
                  if (!item.disabled && item.onPress) item.onPress();
                  close();
                }}
                disabled={item.disabled}
                style={[
                  styles.menuItem,
                  item.disabled && { opacity: 0.4 },
                ]}
              >
                {item.icon && (
                  <MaterialIcons
                    name={item.icon}
                    size={18}
                    style={{ marginRight: 8 }}
                  />
                )}
                <Text style={styles.menuItemText}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}
const styles = StyleSheet.create({
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#eee',
    borderRadius: 6,
  },
  triggerText: {
    fontSize: 16,
    marginRight: 4,
  },
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#00000044',
  },
  menu: {
    marginHorizontal: 50,
    backgroundColor: 'white',
    borderRadius: 8,
    paddingVertical: 8,
    elevation: 5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  menuItemText: {
    fontSize: 16,
  },
});
