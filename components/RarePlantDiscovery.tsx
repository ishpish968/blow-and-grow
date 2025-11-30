
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Animated } from 'react-native';
import { Plant } from '@/types/GameTypes';
import { colors } from '@/styles/commonStyles';
import * as Haptics from 'expo-haptics';

interface RarePlantDiscoveryProps {
  plant: Plant | null;
  onClose: () => void;
}

export function RarePlantDiscovery({ plant, onClose }: RarePlantDiscoveryProps) {
  const [scaleAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    if (plant) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }).start();
    }
  }, [plant, scaleAnim]);

  if (!plant) return null;

  const handleClose = () => {
    Animated.timing(scaleAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      onClose();
    });
  };

  return (
    <Modal
      visible={!!plant}
      transparent={true}
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.container,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Text style={styles.title}>🎉 Rare Discovery! 🎉</Text>
          <Text style={styles.emoji}>{plant.emoji}</Text>
          <Text style={styles.plantName}>{plant.name}</Text>
          <Text style={styles.description}>{plant.description}</Text>
          <View style={styles.rarityBadge}>
            <Text style={styles.rarityText}>
              {plant.rarity.toUpperCase()}
            </Text>
          </View>
          <Text style={styles.message}>
            Your pet found this exotic plant!
          </Text>
          <TouchableOpacity style={styles.button} onPress={handleClose}>
            <Text style={styles.buttonText}>Awesome!</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    backgroundColor: colors.card,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    maxWidth: 400,
    width: '100%',
    borderWidth: 3,
    borderColor: colors.highlight,
    boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.3)',
    elevation: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  emoji: {
    fontSize: 80,
    marginBottom: 16,
  },
  plantName: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  rarityBadge: {
    backgroundColor: colors.highlight,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    marginBottom: 16,
  },
  rarityText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  message: {
    fontSize: 14,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 12,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
