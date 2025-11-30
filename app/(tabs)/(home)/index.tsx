
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { colors } from '@/styles/commonStyles';
import { useGameState } from '@/hooks/useGameState';
import { PlotCard } from '@/components/PlotCard';
import { PlantSelectionModal } from '@/components/PlantSelectionModal';
import { PetSelectionModal } from '@/components/PetSelectionModal';
import { RarePlantDiscovery } from '@/components/RarePlantDiscovery';
import { StatsHeader } from '@/components/StatsHeader';
import { ActionButtons } from '@/components/ActionButtons';
import { ActivePetDisplay } from '@/components/ActivePetDisplay';
import { GardenCharacter } from '@/components/GardenCharacter';
import { AvatarAction } from '@/types/AvatarTypes';
import { PLANTS_DATA } from '@/data/plantsData';
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
  } = useGameState();

  const [showPlantModal, setShowPlantModal] = useState(false);
  const [showPetModal, setShowPetModal] = useState(false);
  const [discoveredPlant, setDiscoveredPlant] = useState<any>(null);
  const [characterAction, setCharacterAction] = useState<AvatarAction>('idle');

  const selectedPlotData = selectedPlot !== null ? gameState.plots[selectedPlot] : null;
  const activePet = getActivePet();

  const handlePlotPress = (plotId: number) => {
    setSelectedPlot(plotId);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handlePlant = () => {
    if (selectedPlot === null) {
      Alert.alert('No Plot Selected', 'Please select an empty plot first');
      return;
    }
    setShowPlantModal(true);
  };

  const handlePlantSelect = (plantId: string) => {
    if (selectedPlot === null) return;

    const plant = PLANTS_DATA.find((p) => p.id === plantId);
    if (!plant) return;

    plantSeed(selectedPlot, plant);
    setShowPlantModal(false);
    setCharacterAction('planting');
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    setTimeout(() => {
      setCharacterAction('idle');
    }, 2000);
  };

  const handleWater = () => {
    if (selectedPlot === null || !selectedPlotData) {
      Alert.alert('No Plant Selected', 'Please select a planted plot first');
      return;
    }

    if (selectedPlotData.stage === 'ready') {
      Alert.alert('Plant Ready', 'This plant is ready to harvest!');
      return;
    }

    waterPlant(selectedPlot);
    setCharacterAction('watering');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    setTimeout(() => {
      setCharacterAction('idle');
    }, 2000);
  };

  const handleRemoveWeeds = () => {
    if (selectedPlot === null || !selectedPlotData) {
      Alert.alert('No Plant Selected', 'Please select a planted plot first');
      return;
    }

    if (!selectedPlotData.hasWeeds) {
      Alert.alert('No Weeds', 'This plot has no weeds to remove');
      return;
    }

    removeWeeds(selectedPlot);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handleHarvest = () => {
    if (selectedPlot === null || !selectedPlotData) {
      Alert.alert('No Plant Selected', 'Please select a planted plot first');
      return;
    }

    if (selectedPlotData.stage !== 'ready') {
      Alert.alert('Not Ready', 'This plant is not ready to harvest yet');
      return;
    }

    harvestPlant(selectedPlot);
    setCharacterAction('harvesting');
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    setTimeout(() => {
      setCharacterAction('happy');
      setTimeout(() => {
        setCharacterAction('idle');
      }, 1500);
    }, 1000);

    const rarePlant = discoverRarePlant();
    if (rarePlant) {
      setTimeout(() => {
        setDiscoveredPlant(rarePlant);
      }, 500);
    }
  };

  const handleUnlockPlant = (plantId: string) => {
    const plant = PLANTS_DATA.find((p) => p.id === plantId);
    if (!plant) return;

    if (gameState.coins < plant.unlockCost) {
      Alert.alert('Not Enough Coins', `You need ${plant.unlockCost} coins to unlock this plant`);
      return;
    }

    unlockPlant(plantId);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert('Plant Unlocked!', `${plant.name} is now available to plant!`);
  };

  const handleUnlockPet = (petId: string) => {
    const pet = gameState.pets.find((p) => p.id === petId);
    if (!pet) return;

    if (gameState.coins < pet.unlockCost) {
      Alert.alert('Not Enough Coins', `You need ${pet.unlockCost} coins to unlock this pet`);
      return;
    }

    unlockPet(petId);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert('Pet Unlocked!', `${pet.name} is now available!`);
  };

  const handleSetActivePet = (petId: string | null) => {
    setActivePet(petId);
    if (petId) {
      const pet = gameState.pets.find((p) => p.id === petId);
      if (pet) {
        Alert.alert('Pet Activated!', `${pet.name} is now helping in your garden!`);
      }
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <StatsHeader coins={gameState.coins} />

        <GardenCharacter currentAction={characterAction} />

        {activePet && <ActivePetDisplay pet={activePet} />}

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

        <ActionButtons
          selectedPlot={selectedPlotData}
          onPlant={handlePlant}
          onWater={handleWater}
          onRemoveWeeds={handleRemoveWeeds}
          onHarvest={handleHarvest}
        />

        <View style={styles.bottomButtons}>
          <TouchableOpacity
            style={styles.shopButton}
            onPress={() => setShowPlantModal(true)}
          >
            <Text style={styles.shopButtonText}>🌱 Plant Shop</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.petButton}
            onPress={() => setShowPetModal(true)}
          >
            <Text style={styles.petButtonText}>🐾 Pet Shop</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <PlantSelectionModal
        visible={showPlantModal}
        onClose={() => setShowPlantModal(false)}
        onSelectPlant={handlePlantSelect}
        onUnlockPlant={handleUnlockPlant}
        unlockedPlants={gameState.unlockedPlants}
        currentCoins={gameState.coins}
      />

      <PetSelectionModal
        visible={showPetModal}
        onClose={() => setShowPetModal(false)}
        pets={gameState.pets}
        activePetId={gameState.activePet}
        currentCoins={gameState.coins}
        onUnlockPet={handleUnlockPet}
        onSetActivePet={handleSetActivePet}
      />

      {discoveredPlant && (
        <RarePlantDiscovery
          plant={discoveredPlant}
          onClose={() => setDiscoveredPlant(null)}
        />
      )}
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
    paddingHorizontal: 16,
    paddingBottom: 140,
  },
  gardenGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  plotWrapper: {
    width: '48%',
    marginBottom: 8,
  },
  bottomButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  shopButton: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  shopButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  petButton: {
    flex: 1,
    backgroundColor: colors.highlight,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  petButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
