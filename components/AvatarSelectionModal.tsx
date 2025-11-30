
import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, Image } from 'react-native';
import { colors } from '@/styles/commonStyles';
import { AVATAR_SPRITES, AvatarSprite } from '@/types/AvatarTypes';

interface AvatarSelectionModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (avatarId: string) => void;
  currentAvatarId: string;
}

export function AvatarSelectionModal({ visible, onClose, onSelect, currentAvatarId }: AvatarSelectionModalProps) {
  const handleSelect = (avatarId: string) => {
    onSelect(avatarId);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>Choose Your Avatar</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.subtitle}>Select your gardener character</Text>
            
            <View style={styles.avatarGrid}>
              {AVATAR_SPRITES.map((sprite, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.avatarCard,
                    currentAvatarId === sprite.id && styles.selectedCard,
                  ]}
                  onPress={() => handleSelect(sprite.id)}
                >
                  <View style={styles.avatarImageContainer}>
                    <Image
                      source={sprite.image}
                      style={styles.avatarImage}
                      resizeMode="contain"
                    />
                  </View>
                  <Text style={styles.avatarName}>{sprite.name}</Text>
                  <Text style={styles.avatarDescription}>{sprite.description}</Text>
                  {currentAvatarId === sprite.id && (
                    <View style={styles.selectedBadge}>
                      <Text style={styles.selectedText}>✓ Selected</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.comingSoon}>
              <Text style={styles.comingSoonTitle}>🎨 More Avatars Coming Soon!</Text>
              <Text style={styles.comingSoonText}>
                Unlock new characters as you progress through the game
              </Text>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: colors.secondary,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
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
    fontWeight: '700',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 20,
    textAlign: 'center',
  },
  avatarGrid: {
    gap: 16,
  },
  avatarCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.secondary,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  selectedCard: {
    borderColor: colors.primary,
    borderWidth: 3,
    backgroundColor: colors.accent,
  },
  avatarImageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: colors.secondary,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  avatarDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  selectedBadge: {
    marginTop: 12,
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
  },
  selectedText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  comingSoon: {
    marginTop: 24,
    padding: 20,
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.secondary,
    alignItems: 'center',
  },
  comingSoonTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  comingSoonText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
