
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/styles/commonStyles';

interface StatsHeaderProps {
  coins: number;
  plotsUsed: number;
  totalPlots: number;
}

export function StatsHeader({ coins, plotsUsed, totalPlots }: StatsHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.statCard}>
        <Text style={styles.statEmoji}>💰</Text>
        <View>
          <Text style={styles.statLabel}>Coins</Text>
          <Text style={styles.statValue}>{coins}</Text>
        </View>
      </View>
      <View style={styles.statCard}>
        <Text style={styles.statEmoji}>🌱</Text>
        <View>
          <Text style={styles.statLabel}>Plots</Text>
          <Text style={styles.statValue}>
            {plotsUsed}/{totalPlots}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  statCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: colors.secondary,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  statEmoji: {
    fontSize: 32,
    marginRight: 12,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
});
