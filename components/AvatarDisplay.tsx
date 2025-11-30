
import React from 'react';
import { View, Image, StyleSheet, Text } from 'react-native';
import { colors } from '@/styles/commonStyles';
import { AvatarAction } from '@/types/AvatarTypes';

interface AvatarDisplayProps {
  size?: number;
  action?: AvatarAction;
  showLabel?: boolean;
}

export function AvatarDisplay({ size = 80, action = 'idle', showLabel = false }: AvatarDisplayProps) {
  const getActionLabel = () => {
    switch (action) {
      case 'planting':
        return 'Planting...';
      case 'watering':
        return 'Watering...';
      case 'harvesting':
        return 'Harvesting!';
      case 'happy':
        return 'Happy!';
      default:
        return '';
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.avatarContainer, { width: size, height: size }]}>
        <Image
          source={require('@/assets/images/3c4f974f-6943-409e-8eb8-0382ef14fffd.png')}
          style={[styles.avatar, { width: size, height: size }]}
          resizeMode="contain"
        />
      </View>
      {showLabel && action !== 'idle' && (
        <View style={styles.labelContainer}>
          <Text style={styles.label}>{getActionLabel()}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  avatarContainer: {
    borderRadius: 100,
    overflow: 'hidden',
    backgroundColor: colors.accent,
    borderWidth: 3,
    borderColor: colors.secondary,
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.15)',
    elevation: 5,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  labelContainer: {
    marginTop: 8,
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  label: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
});
