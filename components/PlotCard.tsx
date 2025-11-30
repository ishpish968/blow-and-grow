
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { PlantedPlot, PlantStage } from '@/types/GameTypes';
import { colors } from '@/styles/commonStyles';
import * as Haptics from 'expo-haptics';

interface PlotCardProps {
  plot: PlantedPlot | null;
  plotId: number;
  onPress: () => void;
  isSelected: boolean;
}

const STAGE_EMOJIS: Record<PlantStage, string> = {
  seed: '🌱',
  sprout: '🌿',
  growing: '🪴',
  mature: '🌾',
  ready: '',
};

export function PlotCard({ plot, plotId, onPress, isSelected }: PlotCardProps) {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    onPress();
  };

  const getProgressPercentage = () => {
    if (!plot) return 0;
    const now = Date.now();
    const timeSincePlanted = (now - plot.plantedAt) / 1000;
    const progress = Math.min(100, (timeSincePlanted / plot.plant.growthTime) * 100);
    return progress;
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={[
          styles.plotCard,
          isSelected && styles.selectedPlot,
          !plot && styles.emptyPlot,
        ]}
        onPress={handlePress}
        activeOpacity={0.7}
      >
        {plot ? (
          <View style={styles.plantContent}>
            <Text style={styles.plantEmoji}>
              {plot.stage === 'ready' ? plot.plant.emoji : STAGE_EMOJIS[plot.stage]}
            </Text>
            {plot.hasWeeds && <Text style={styles.weedEmoji}>🌿</Text>}
            <Text style={styles.plantName}>{plot.plant.name}</Text>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${getProgressPercentage()}%` },
                ]}
              />
            </View>
            {plot.stage === 'ready' && (
              <Text style={styles.readyText}>Ready! 🎉</Text>
            )}
          </View>
        ) : (
          <View style={styles.emptyContent}>
            <Text style={styles.emptyEmoji}>🌍</Text>
            <Text style={styles.emptyText}>Empty Plot</Text>
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  plotCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    margin: 8,
    minHeight: 140,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.secondary,
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
    elevation: 4,
  },
  selectedPlot: {
    borderColor: colors.primary,
    borderWidth: 3,
  },
  emptyPlot: {
    backgroundColor: colors.accent,
    borderStyle: 'dashed',
  },
  plantContent: {
    alignItems: 'center',
    width: '100%',
  },
  plantEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  weedEmoji: {
    position: 'absolute',
    top: 0,
    right: 0,
    fontSize: 24,
  },
  plantName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: colors.accent,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.secondary,
    borderRadius: 4,
  },
  readyText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.highlight,
    marginTop: 4,
  },
  emptyContent: {
    alignItems: 'center',
  },
  emptyEmoji: {
    fontSize: 40,
    marginBottom: 8,
    opacity: 0.5,
  },
  emptyText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});
