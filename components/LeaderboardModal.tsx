
import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { colors } from '@/styles/commonStyles';
import { UserProfile } from '@/types/ProfileTypes';

interface LeaderboardModalProps {
  visible: boolean;
  onClose: () => void;
  profiles: UserProfile[];
  currentProfileId?: string;
}

export function LeaderboardModal({ visible, onClose, profiles, currentProfileId }: LeaderboardModalProps) {
  const getRankEmoji = (index: number) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `${index + 1}.`;
  };

  const getScore = (profile: UserProfile) => {
    return profile.stats.totalCoinsEarned + (profile.stats.rarePlantsFound * 100);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>🏆 Leaderboard</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            {profiles.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyEmoji}>🌱</Text>
                <Text style={styles.emptyText}>No gardeners yet!</Text>
                <Text style={styles.emptySubtext}>Be the first to start growing</Text>
              </View>
            ) : (
              <React.Fragment>
                {profiles.map((profile, index) => {
                  const isCurrentUser = profile.id === currentProfileId;
                  const score = getScore(profile);

                  return (
                    <View
                      key={profile.id}
                      style={[
                        styles.profileCard,
                        isCurrentUser && styles.currentUserCard,
                        index < 3 && styles.topThreeCard,
                      ]}
                    >
                      <View style={styles.rankContainer}>
                        <Text style={styles.rankText}>{getRankEmoji(index)}</Text>
                      </View>

                      <Text style={styles.avatar}>{profile.avatar}</Text>

                      <View style={styles.profileInfo}>
                        <Text style={[styles.username, isCurrentUser && styles.currentUsername]}>
                          {profile.username}
                          {isCurrentUser && ' (You)'}
                        </Text>
                        <View style={styles.statsRow}>
                          <Text style={styles.statText}>💰 {profile.stats.totalCoinsEarned}</Text>
                          <Text style={styles.statText}>🌱 {profile.stats.rarePlantsFound}</Text>
                          <Text style={styles.statText}>🏆 {score}</Text>
                        </View>
                      </View>
                    </View>
                  );
                })}
              </React.Fragment>
            )}
          </ScrollView>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Score = Coins Earned + (Rare Plants × 100)</Text>
          </View>
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
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
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
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    fontSize: 20,
    color: colors.text,
    fontWeight: '600',
  },
  scrollView: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: colors.secondary,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  currentUserCard: {
    borderColor: colors.primary,
    backgroundColor: colors.accent,
  },
  topThreeCard: {
    borderWidth: 3,
  },
  rankContainer: {
    width: 40,
    alignItems: 'center',
  },
  rankText: {
    fontSize: 20,
    fontWeight: '700',
  },
  avatar: {
    fontSize: 32,
    marginRight: 12,
  },
  profileInfo: {
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  currentUsername: {
    color: colors.primary,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.secondary,
    marginTop: 8,
  },
  footerText: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
