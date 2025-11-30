
import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { colors } from '@/styles/commonStyles';
import { useGameState } from '@/hooks/useGameState';
import { PlotCard } from '@/components/PlotCard';
import { ActionButtons } from '@/components/ActionButtons';
import { PlantSelectionModal } from '@/components/PlantSelectionModal';
import { StatsHeader } from '@/components/StatsHeader';

export default function HomeScreen() {
  const {
    gameState,
    selectedPlot,
    setSelectedPlot,
    plantSeed,
    waterPlant,
    removeWeeds,
    harvestPlant,
    unlockPlant,
  } = useGameState();

  const [showPlantModal, setShowPlantModal] = useState(false);

  const handlePlotPress = (plotId: number) => {
    setSelectedPlot(plotId === selectedPlot ? null : plotId);
  };

  const handlePlantSeed = () => {
    setShowPlantModal(true);
  };

  const handleSelectPlant = (plant: any) => {
    if (selectedPlot !== null) {
      plantSeed(selectedPlot, plant);
      setShowPlantModal(false);
    }
  };

  const plotsUsed = gameState.plots.filter((p) => p !== null).length;

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>🌱 Plant & Grow</Text>
          <Text style={styles.subtitle}>Grow your garden and harvest rewards!</Text>
        </View>

        <StatsHeader
          coins={gameState.coins}
          plotsUsed={plotsUsed}
          totalPlots={gameState.plots.length}
        />

        <View style={styles.gardenGrid}>
          {gameState.plots.map((plot, index) => (
            <View key={index} style={styles.plotWrapper}>
              <PlotCard
                plot={plot}
                plotId={index}
                onPress={() => handlePlotPress(index)}
                isSelected={selectedPlot === index}
              />
            </View>
          ))}
        </View>

        {selectedPlot !== null && (
          <View style={styles.actionsContainer}>
            <ActionButtons
              plot={gameState.plots[selectedPlot]}
              onWater={() => waterPlant(selectedPlot)}
              onRemoveWeeds={() => removeWeeds(selectedPlot)}
              onHarvest={() => harvestPlant(selectedPlot)}
              onPlant={handlePlantSeed}
            />
          </View>
        )}

        <View style={styles.instructions}>
          <Text style={styles.instructionText}>
            💡 Tap a plot to select it, then use the buttons to interact!
          </Text>
          <Text style={styles.instructionText}>
            🌱 Plant seeds, water them, remove weeds, and harvest when ready!
          </Text>
        </View>
      </ScrollView>

      <PlantSelectionModal
        visible={showPlantModal}
        onClose={() => setShowPlantModal(false)}
        onSelectPlant={handleSelectPlant}
        unlockedPlants={gameState.unlockedPlants}
        coins={gameState.coins}
        onUnlockPlant={unlockPlant}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: 48,
    paddingBottom: 120,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  gardenGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: 8,
    marginTop: 16,
  },
  plotWrapper: {
    width: '45%',
  },
  actionsContainer: {
    marginTop: 16,
    marginBottom: 16,
  },
  instructions: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: colors.accent,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.secondary,
  },
  instructionText: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 8,
    lineHeight: 20,
  },
});
