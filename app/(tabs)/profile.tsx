
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { colors } from '@/styles/commonStyles';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.emoji}>👨‍🌾</Text>
          <Text style={styles.title}>Gardener Profile</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>🏆 Achievements</Text>
          <View style={styles.achievementRow}>
            <Text style={styles.achievementEmoji}>🌱</Text>
            <View style={styles.achievementInfo}>
              <Text style={styles.achievementName}>First Seed</Text>
              <Text style={styles.achievementDesc}>Plant your first seed</Text>
            </View>
          </View>
          <View style={styles.achievementRow}>
            <Text style={styles.achievementEmoji}>💰</Text>
            <View style={styles.achievementInfo}>
              <Text style={styles.achievementName}>First Harvest</Text>
              <Text style={styles.achievementDesc}>Harvest your first plant</Text>
            </View>
          </View>
          <View style={styles.achievementRow}>
            <Text style={styles.achievementEmoji}>🌻</Text>
            <View style={styles.achievementInfo}>
              <Text style={styles.achievementName}>Plant Collector</Text>
              <Text style={styles.achievementDesc}>Unlock 5 different plants</Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>📊 Statistics</Text>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Total Plants Grown:</Text>
            <Text style={styles.statValue}>0</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Total Coins Earned:</Text>
            <Text style={styles.statValue}>0</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Plants Unlocked:</Text>
            <Text style={styles.statValue}>2/8</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>ℹ️ About</Text>
          <Text style={styles.aboutText}>
            Welcome to Plant & Grow! Build your garden empire by planting seeds, caring for your plants, and harvesting them for coins. Unlock new plants and watch your garden flourish!
          </Text>
        </View>
      </ScrollView>
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
    paddingBottom: 120,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  emoji: {
    fontSize: 64,
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
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
  achievementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
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
  achievementDesc: {
    fontSize: 14,
    color: colors.textSecondary,
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
  aboutText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 22,
  },
});
