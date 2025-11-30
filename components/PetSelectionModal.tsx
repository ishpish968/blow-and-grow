
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
import { Pet } from '@/types/GameTypes';
import { colors } from '@/styles/commonStyles';
import * as Haptics from 'expo-haptics';

interface PetSelectionModalProps {
  visible: boolean;
  onClose: () => void;
  pets: Pet[];
  activePetId: string | null;
  coins: number;
  onUnlockPet: (petId: string) => void;
  onSelectPet: (petId: string | null) => void;
}

export function PetSelectionModal({
  visible,
  onClose,
  pets,
  activePetId,
  coins,
  onUnlockPet,
  onSelectPet,
}: PetSelectionModalProps) {
  const handleSelectPet = (pet: Pet) => {
    if (pet.isUnlocked) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      if (activePetId === pet.id) {
        onSelectPet(null);
      } else {
        onSelectPet(pet.id);
      }
    }
  };

  const handleUnlock = (pet: Pet) => {
    if (coins >= pet.unlockCost) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      onUnlockPet(pet.id);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  const getAbilityColor = (type: string) => {
    switch (type) {
      case 'growth_boost':
        return '#4CAF50';
      case 'coin_boost':
        return '#FFD700';
      case 'weed_prevention':
        return '#8BC34A';
      case 'auto_water':
        return '#2196F3';
      case 'rare_finder':
        return '#9C27B0';
      default:
        return colors.primary;
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
            <Text style={styles.title}>Pet Companions 🐾</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.subtitle}>
            Select a pet to help you grow your garden!
          </Text>

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.petList}
            showsVerticalScrollIndicator={false}
          >
            {pets.map((pet) => {
              const isUnlocked = pet.isUnlocked;
              const isActive = activePetId === pet.id;
              const canAfford = coins >= pet.unlockCost;

              return (
                <TouchableOpacity
                  key={pet.id}
                  style={[
                    styles.petCard,
                    !isUnlocked && styles.lockedCard,
                    isActive && styles.activeCard,
                  ]}
                  onPress={() =>
                    isUnlocked ? handleSelectPet(pet) : handleUnlock(pet)
                  }
                  disabled={!isUnlocked && !canAfford}
                >
                  <Text style={styles.petEmoji}>{pet.emoji}</Text>
                  <View style={styles.petInfo}>
                    <View style={styles.petHeader}>
                      <Text style={styles.petName}>{pet.name}</Text>
                      {isActive && (
                        <View style={styles.activeBadge}>
                          <Text style={styles.activeText}>Active</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.petDescription}>
                      {pet.description}
                    </Text>
                    <View
                      style={[
                        styles.abilityBadge,
                        { backgroundColor: getAbilityColor(pet.ability.type) },
                      ]}
                    >
                      <Text style={styles.abilityText}>
                        {pet.ability.description}
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
                            ? `Unlock: ${pet.unlockCost} 💰`
                            : `Need: ${pet.unlockCost} 💰`}
                        </Text>
                      </View>
                    )}
                  </View>
                  {isUnlocked && (
                    <Text style={styles.selectArrow}>
                      {isActive ? '✓' : '→'}
                    </Text>
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
    maxHeight: height * 0.85,
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
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    paddingHorizontal: 20,
    paddingTop: 12,
    textAlign: 'center',
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
  petList: {
    padding: 16,
    paddingBottom: 32,
  },
  petCard: {
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
  activeCard: {
    borderColor: colors.highlight,
    borderWidth: 3,
    backgroundColor: colors.accent,
  },
  petEmoji: {
    fontSize: 48,
    marginRight: 16,
  },
  petInfo: {
    flex: 1,
  },
  petHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  petName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginRight: 8,
  },
  activeBadge: {
    backgroundColor: colors.highlight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  activeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  petDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  abilityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  abilityText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
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
    fontWeight: '700',
  },
});
