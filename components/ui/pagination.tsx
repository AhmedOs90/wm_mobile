import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  GestureResponderEvent,
} from 'react-native';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react-native';

type PaginationLinkProps = {
  isActive?: boolean;
  label?: string;
  onPress?: (event: GestureResponderEvent) => void;
};

export const Pagination = ({ children }: { children: React.ReactNode }) => (
  <View style={styles.pagination}>{children}</View>
);

export const PaginationContent = ({ children }: { children: React.ReactNode }) => (
  <View style={styles.paginationContent}>{children}</View>
);

export const PaginationItem = ({ children }: { children: React.ReactNode }) => (
  <View style={styles.paginationItem}>{children}</View>
);

export const PaginationLink: React.FC<PaginationLinkProps> = ({
  isActive,
  label,
  onPress,
}) => (
  <TouchableOpacity
    style={[styles.pageButton, isActive && styles.activePage]}
    onPress={onPress}
  >
    <Text style={isActive ? styles.activeText : styles.pageText}>{label}</Text>
  </TouchableOpacity>
);

export const PaginationPrevious = ({ onPress }: { onPress?: () => void }) => (
  <TouchableOpacity style={styles.navButton} onPress={onPress}>
    <ChevronLeft size={16} />
    <Text style={styles.navText}>Previous</Text>
  </TouchableOpacity>
);

export const PaginationNext = ({ onPress }: { onPress?: () => void }) => (
  <TouchableOpacity style={styles.navButton} onPress={onPress}>
    <Text style={styles.navText}>Next</Text>
    <ChevronRight size={16} />
  </TouchableOpacity>
);

export const PaginationEllipsis = () => (
  <View style={styles.ellipsis}>
    <MoreHorizontal size={16} />
  </View>
);

const styles = StyleSheet.create({
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 16,
  },
  paginationContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  paginationItem: {
    marginHorizontal: 2,
  },
  pageButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#f1f1f1',
  },
  activePage: {
    backgroundColor: '#222',
  },
  pageText: {
    fontSize: 14,
    color: '#222',
  },
  activeText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold',
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 4,
  },
  navText: {
    fontSize: 14,
  },
  ellipsis: {
    height: 36,
    width: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
