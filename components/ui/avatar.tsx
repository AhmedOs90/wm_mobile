// components/ui/Avatar.tsx
import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';

interface AvatarProps {
  uri?: string;
  fallbackText?: string;
  size?: number;
}

const Avatar = ({ uri, fallbackText = '?', size = 40 }: AvatarProps) => {
  return (
    <View style={[styles.container, { width: size, height: size, borderRadius: size / 2 }]}>
      {uri ? (
        <Image source={{ uri }} style={[styles.image, { width: size, height: size, borderRadius: size / 2 }]} />
      ) : (
        <View style={styles.fallback}>
          <Text style={styles.fallbackText}>{fallbackText}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    backgroundColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    resizeMode: 'cover',
  },
  fallback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fallbackText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Avatar;
