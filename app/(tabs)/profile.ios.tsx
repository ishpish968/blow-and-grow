
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors } from '@/styles/commonStyles';
import { useProfile } from '@/hooks/useProfile';
import { useGameState } from '@/hooks/useGameState';
import { LeaderboardModal } from '@/components/LeaderboardModal';
import { router } from 'expo-router';

export default function ProfileScreen() {
  const { currentProfile, getLeaderboard } = useProfile();
  const { gameState } = useGameState();
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  if (!currentProfile) {
    return (
      <View style={styles.container}>
        <View style={styles.setupPrompt}>
          <Text style={styles.setupEmoji}>🌱</Text>
          <Text style={styles.setupTitle}>Create Your Profile</Text>
          <Text style={styles.setupText}>
            Track your progress and compete with other gardeners!
          </Text>
          <TouchableOpacity
            style={styles.setupButton}
            onPress={() => router.push('/(tabs)/profile-setup')}
          >
            <Text style={styles.setupButtonText}>Create Profile</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const unlockedAchievements = currentProfile.achievements.filter(a => a.unlocked);
  const achievementProgress = (unlockedAchievements.length / currentProfile.achievements.length) * 100;

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.avatar}>{currentProfile.avatar}</Text>
          <Text style={styles.username}>{currentProfile.username}</Text>
          <Text style={styles.joinDate}>
            Joined {new Date(currentProfile.createdAt).toLocaleDateString()}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.leaderboardButton}
          onPress={() => setShowLeaderboard(true)}
        >
          <Text style={styles.leaderboardEmoji}>🏆</Text>
          <Text style={styles.leaderboardText}>View Leaderboard</Text>
        </TouchableOpacity>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>📊 Statistics</Text>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Total Plants Grown:</Text>
            <Text style={styles.statValue}>{currentProfile.stats.totalPlantsGrown}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Total Coins Earned:</Text>
            <Text style={styles.statValue}>{currentProfile.stats.totalCoinsEarned}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Current Coins:</Text>
            <Text style={styles.statValue}>{gameState.coins}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Plants Unlocked:</Text>
            <Text style={styles.statValue}>{currentProfile.stats.plantsUnlocked}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Pets Unlocked:</Text>
            <Text style={styles.statValue}>{currentProfile.stats.petsUnlocked}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Rare Plants Found:</Text>
            <Text style={styles.statValue}>{currentProfile.stats.rarePlantsFound}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Total Harvests:</Text>
            <Text style={styles.statValue}>{currentProfile.stats.totalHarvests}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Highest Balance:</Text>
            <Text style={styles.statValue}>{currentProfile.stats.highestCoinBalance}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.achievementHeader}>
            <Text style={styles.cardTitle}>🏆 Achievements</Text>
            <Text style={styles.achievementProgress}>
              {unlockedAchievements.length}/{currentProfile.achievements.length}
            </Text>
          </View>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { width: `${achievementProgress}%` }]} />
          </View>
          {currentProfile.achievements.map((achievement, index) => (
            <View
              key={index}
              style={[
                styles.achievementRow,
                !achievement.unlocked && styles.achievementLocked,
              ]}
            >
              <Text style={styles.achievementEmoji}>{achievement.emoji}</Text>
              <View style={styles.achievementInfo}>
                <Text style={[styles.achievementName, !achievement.unlocked && styles.lockedText]}>
                  {achievement.name}
                </Text>
                <Text style={styles.achievementDesc}>{achievement.description}</Text>
                {!achievement.unlocked && achievement.target && (
                  <Text style={styles.achievementProgressText}>
                    Progress: {achievement.progress}/{achievement.target}
                  </Text>
                )}
                {achievement.unlocked && achievement.unlockedAt && (
                  <Text style={styles.unlockedDate}>
                    Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                  </Text>
                )}
              </View>
              {achievement.unlocked && <Text style={styles.checkmark}>✓</Text>}
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>ℹ️ About Blow and Grow</Text>
          <Text style={styles.aboutText}>
            Build your garden empire by planting seeds, caring for your plants, and harvesting them for coins. 
            Unlock exotic plants, collect rare pets, and compete with other gardeners on the leaderboard!
          </Text>
          <Text style={styles.aboutText}>
            Your plants grow even when you&apos;re away, so check back often to harvest and expand your garden!
          </Text>
        </View>
      </ScrollView>

      <LeaderboardModal
        visible={showLeaderboard}
        onClose={() => setShowLeaderboard(false)}
        profiles={getLeaderboard()}
        currentProfileId={currentProfile.id}
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
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 120,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    fontSize: 80,
    marginBottom: 12,
  },
  username: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 4,
  },
  joinDate: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  leaderboardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.highlight,
    marginBottom: 16,
    paddingVertical: 14,
    borderRadius: 12,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  leaderboardEmoji: {
    fontSize: 20,
    marginRight: 8,
  },
  leaderboardText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: colors.secondary,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statLabel: {
    fontSize: 16,
    color: colors.text,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
  },
  achievementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  achievementProgress: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: colors.accent,
    borderRadius: 4,
    marginBottom: 16,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  achievementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    opacity: 1,
  },
  achievementLocked: {
    opacity: 0.5,
  },
  achievementEmoji: {
    fontSize: 32,
    marginRight: 16,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  lockedText: {
    color: colors.textSecondary,
  },
  achievementDesc: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  achievementProgressText: {
    fontSize: 12,
    color: colors.primary,
    marginTop: 4,
    fontWeight: '600',
  },
  unlockedDate: {
    fontSize: 12,
    color: colors.primary,
    marginTop: 4,
    fontStyle: 'italic',
  },
  checkmark: {
    fontSize: 24,
    color: colors.primary,
    fontWeight: '700',
  },
  aboutText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 22,
    marginBottom: 12,
  },
  setupPrompt: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  setupEmoji: {
    fontSize: 80,
    marginBottom: 16,
  },
  setupTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  setupText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  setupButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  setupButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
