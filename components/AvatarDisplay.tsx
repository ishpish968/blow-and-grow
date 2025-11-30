
import React from 'react';
import { View, Image, StyleSheet, Text } from 'react-native';
import { colors } from '@/styles/commonStyles';
import { AvatarAction, AVATAR_SPRITES } from '@/types/AvatarTypes';

interface AvatarDisplayProps {
  size?: number;
  action?: AvatarAction;
  showLabel?: boolean;
  avatarId?: string;
}

export function AvatarDisplay({ size = 80, action = 'idle', showLabel = false, avatarId = 'girl_planting' }: AvatarDisplayProps) {
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

  const avatar = AVATAR_SPRITES.find(sprite => sprite.id === avatarId) || AVATAR_SPRITES[0];

  return (
    <View style={styles.container}>
      <View style={[styles.avatarContainer, { width: size, height: size }]}>
        <Image
          source={avatar.image}
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
