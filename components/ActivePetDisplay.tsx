
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Pet } from '@/types/GameTypes';
import { colors } from '@/styles/commonStyles';
import * as Haptics from 'expo-haptics';

interface ActivePetDisplayProps {
  pet: Pet | null;
  onPress: () => void;
}

export function ActivePetDisplay({ pet, onPress }: ActivePetDisplayProps) {
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  if (!pet) {
    return (
      <TouchableOpacity style={styles.container} onPress={handlePress}>
        <View style={styles.emptyPet}>
          <Text style={styles.emptyEmoji}>🐾</Text>
          <Text style={styles.emptyText}>No Pet Active</Text>
          <Text style={styles.tapText}>Tap to select</Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <View style={styles.activePet}>
        <Text style={styles.petEmoji}>{pet.emoji}</Text>
        <View style={styles.petInfo}>
          <Text style={styles.petName}>{pet.name}</Text>
          <Text style={styles.abilityText}>{pet.ability.description}</Text>
        </View>
        <Text style={styles.changeText}>Change</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  emptyPet: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.secondary,
    borderStyle: 'dashed',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  emptyEmoji: {
    fontSize: 40,
    marginBottom: 8,
    opacity: 0.5,
  },
  emptyText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  tapText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  activePet: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.highlight,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  petEmoji: {
    fontSize: 48,
    marginRight: 12,
  },
  petInfo: {
    flex: 1,
  },
  petName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  abilityText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  changeText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
});
