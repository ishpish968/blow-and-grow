
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Plant } from '@/types/GameTypes';
import { PLANTS_DATA } from '@/data/plantsData';
import { colors } from '@/styles/commonStyles';
import * as Haptics from 'expo-haptics';

interface PlantSelectionModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectPlant: (plant: Plant) => void;
  unlockedPlants: string[];
  coins: number;
  onUnlockPlant: (plantId: string) => void;
}

export function PlantSelectionModal({
  visible,
  onClose,
  onSelectPlant,
  unlockedPlants,
  coins,
  onUnlockPlant,
}: PlantSelectionModalProps) {
  const handleSelectPlant = (plant: Plant) => {
    if (unlockedPlants.includes(plant.id)) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onSelectPlant(plant);
    }
  };

  const handleUnlock = (plant: Plant) => {
    if (coins >= plant.unlockCost) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      onUnlockPlant(plant.id);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Select a Plant 🌱</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.plantList}
            showsVerticalScrollIndicator={false}
          >
            {PLANTS_DATA.map((plant) => {
              const isUnlocked = unlockedPlants.includes(plant.id);
              const canAfford = coins >= plant.unlockCost;

              return (
                <TouchableOpacity
                  key={plant.id}
                  style={[
                    styles.plantCard,
                    !isUnlocked && styles.lockedCard,
                  ]}
                  onPress={() =>
                    isUnlocked ? handleSelectPlant(plant) : handleUnlock(plant)
                  }
                  disabled={!isUnlocked && !canAfford}
                >
                  <Text style={styles.plantEmoji}>{plant.emoji}</Text>
                  <View style={styles.plantInfo}>
                    <Text style={styles.plantName}>{plant.name}</Text>
                    <Text style={styles.plantDescription}>
                      {plant.description}
                    </Text>
                    <View style={styles.plantStats}>
                      <Text style={styles.statText}>
                        ⏱️ {plant.growthTime}s
                      </Text>
                      <Text style={styles.statText}>
                        💰 {plant.sellPrice}
                      </Text>
                    </View>
                    {!isUnlocked && (
                      <View
                        style={[
                          styles.unlockBadge,
                          !canAfford && styles.cantAffordBadge,
                        ]}
                      >
                        <Text style={styles.unlockText}>
                          {canAfford
                            ? `Unlock: ${plant.unlockCost} 💰`
                            : `Need: ${plant.unlockCost} 💰`}
                        </Text>
                      </View>
                    )}
                  </View>
                  {isUnlocked && (
                    <Text style={styles.selectArrow}>→</Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: height * 0.8,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.accent,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    fontSize: 20,
    color: colors.text,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  plantList: {
    padding: 16,
    paddingBottom: 32,
  },
  plantCard: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.secondary,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  lockedCard: {
    opacity: 0.7,
    borderColor: colors.textSecondary,
  },
  plantEmoji: {
    fontSize: 48,
    marginRight: 16,
  },
  plantInfo: {
    flex: 1,
  },
  plantName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  plantDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  plantStats: {
    flexDirection: 'row',
    gap: 12,
  },
  statText: {
    fontSize: 12,
    color: colors.text,
    fontWeight: '500',
  },
  unlockBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  cantAffordBadge: {
    backgroundColor: colors.textSecondary,
  },
  unlockText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  selectArrow: {
    fontSize: 24,
    color: colors.primary,
    marginLeft: 8,
  },
});
