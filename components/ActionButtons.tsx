
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { PlantedPlot } from '@/types/GameTypes';
import { colors } from '@/styles/commonStyles';
import * as Haptics from 'expo-haptics';

interface ActionButtonsProps {
  plot: PlantedPlot | null;
  onWater: () => void;
  onRemoveWeeds: () => void;
  onHarvest: () => void;
  onPlant: () => void;
}

export function ActionButtons({
  plot,
  onWater,
  onRemoveWeeds,
  onHarvest,
  onPlant,
}: ActionButtonsProps) {
  const handlePress = (action: () => void) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    action();
  };

  if (!plot) {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={[styles.button, styles.plantButton]}
          onPress={() => handlePress(onPlant)}
        >
          <Text style={styles.buttonEmoji}>🌱</Text>
          <Text style={styles.buttonText}>Plant Seed</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {plot.stage === 'ready' ? (
        <TouchableOpacity
          style={[styles.button, styles.harvestButton]}
          onPress={() => handlePress(onHarvest)}
        >
          <Text style={styles.buttonEmoji}>✂️</Text>
          <Text style={styles.buttonText}>Harvest (+{plot.plant.sellPrice} 💰)</Text>
        </TouchableOpacity>
      ) : (
        <>
          <TouchableOpacity
            style={[styles.button, styles.waterButton]}
            onPress={() => handlePress(onWater)}
          >
            <Text style={styles.buttonEmoji}>💧</Text>
            <Text style={styles.buttonText}>Water</Text>
          </TouchableOpacity>
          {plot.hasWeeds && (
            <TouchableOpacity
              style={[styles.button, styles.weedButton]}
              onPress={() => handlePress(onRemoveWeeds)}
            >
              <Text style={styles.buttonEmoji}>🧹</Text>
              <Text style={styles.buttonText}>Remove Weeds</Text>
            </TouchableOpacity>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    paddingHorizontal: 16,
    marginTop: 16,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    minWidth: 140,
    justifyContent: 'center',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  plantButton: {
    backgroundColor: colors.primary,
  },
  waterButton: {
    backgroundColor: '#4A90E2',
  },
  weedButton: {
    backgroundColor: '#F5A623',
  },
  harvestButton: {
    backgroundColor: colors.highlight,
  },
  buttonEmoji: {
    fontSize: 20,
    marginRight: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
