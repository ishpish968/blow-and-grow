
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { colors } from '@/styles/commonStyles';
import { useGameState } from '@/hooks/useGameState';
import { PlotCard } from '@/components/PlotCard';
import { ActionButtons } from '@/components/ActionButtons';
import { PlantSelectionModal } from '@/components/PlantSelectionModal';
import { PetSelectionModal } from '@/components/PetSelectionModal';
import { ActivePetDisplay } from '@/components/ActivePetDisplay';
import { RarePlantDiscovery } from '@/components/RarePlantDiscovery';
import { StatsHeader } from '@/components/StatsHeader';
import { Plant } from '@/types/GameTypes';
import * as Haptics from 'expo-haptics';

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
    unlockPet,
    setActivePet,
    discoverRarePlant,
    getActivePet,
    isLoaded,
  } = useGameState();

  const [showPlantModal, setShowPlantModal] = useState(false);
  const [showPetModal, setShowPetModal] = useState(false);
  const [discoveredPlant, setDiscoveredPlant] = useState<Plant | null>(null);

  const activePet = getActivePet();

  useEffect(() => {
    if (!activePet) return;

    const interval = setInterval(() => {
      const plant = discoverRarePlant();
      if (plant) {
        setDiscoveredPlant(plant);
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [activePet, discoverRarePlant]);

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

  const handleDiscoverPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const plant = discoverRarePlant();
    if (plant) {
      setDiscoveredPlant(plant);
    } else {
      console.log('No rare plant discovered this time');
    }
  };

  const plotsUsed = gameState.plots.filter((p) => p !== null).length;

  if (!isLoaded) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading your garden...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>🌱 Plant & Grow</Text>
          <Text style={styles.subtitle}>Grow your garden with pet companions!</Text>
          <Text style={styles.offlineText}>✨ Plants grow even when you&apos;re away!</Text>
        </View>

        <StatsHeader
          coins={gameState.coins}
          plotsUsed={plotsUsed}
          totalPlots={gameState.plots.length}
        />

        <ActivePetDisplay
          pet={activePet}
          onPress={() => setShowPetModal(true)}
        />

        {activePet && activePet.ability.type === 'rare_finder' && (
          <TouchableOpacity
            style={styles.discoverButton}
            onPress={handleDiscoverPress}
          >
            <Text style={styles.discoverEmoji}>🔍</Text>
            <Text style={styles.discoverText}>Search for Rare Plants</Text>
          </TouchableOpacity>
        )}

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
            🐾 Select a pet companion to help you grow exotic plants!
          </Text>
          <Text style={styles.instructionText}>
            ✨ Rare plants found: {gameState.rarePlantsFound}
          </Text>
          <Text style={styles.instructionText}>
            🌱 Try to unlock the legendary Giant Beanstalk!
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

      <PetSelectionModal
        visible={showPetModal}
        onClose={() => setShowPetModal(false)}
        pets={gameState.pets}
        activePetId={gameState.activePet}
        coins={gameState.coins}
        onUnlockPet={unlockPet}
        onSelectPet={setActivePet}
      />

      <RarePlantDiscovery
        plant={discoveredPlant}
        onClose={() => setDiscoveredPlant(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.text,
    fontWeight: '600',
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
  offlineText: {
    fontSize: 14,
    color: colors.highlight,
    textAlign: 'center',
    marginTop: 4,
    fontWeight: '600',
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
  discoverButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.highlight,
    marginHorizontal: 16,
    marginVertical: 8,
    paddingVertical: 14,
    borderRadius: 12,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  discoverEmoji: {
    fontSize: 20,
    marginRight: 8,
  },
  discoverText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
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
