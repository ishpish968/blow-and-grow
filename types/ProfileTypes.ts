
export interface UserProfile {
  id: string;
  username: string;
  createdAt: number;
  avatar: string;
  stats: ProfileStats;
  achievements: Achievement[];
}

export interface ProfileStats {
  totalPlantsGrown: number;
  totalCoinsEarned: number;
  plantsUnlocked: number;
  petsUnlocked: number;
  rarePlantsFound: number;
  totalHarvests: number;
  highestCoinBalance: number;
  playTime: number;
  giantBeanstalkUnlocked: boolean;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  emoji: string;
  unlocked: boolean;
  unlockedAt?: number;
  progress?: number;
  target?: number;
}

export const ACHIEVEMENTS_DATA: Achievement[] = [
  {
    id: 'first_seed',
    name: 'First Seed',
    description: 'Plant your first seed',
    emoji: '🌱',
    unlocked: false,
    progress: 0,
    target: 1,
  },
  {
    id: 'first_harvest',
    name: 'First Harvest',
    description: 'Harvest your first plant',
    emoji: '💰',
    unlocked: false,
    progress: 0,
    target: 1,
  },
  {
    id: 'plant_collector',
    name: 'Plant Collector',
    description: 'Unlock 5 different plants',
    emoji: '🌻',
    unlocked: false,
    progress: 0,
    target: 5,
  },
  {
    id: 'master_gardener',
    name: 'Master Gardener',
    description: 'Unlock 15 different plants',
    emoji: '🏆',
    unlocked: false,
    progress: 0,
    target: 15,
  },
  {
    id: 'coin_hoarder',
    name: 'Coin Hoarder',
    description: 'Accumulate 1000 coins',
    emoji: '💎',
    unlocked: false,
    progress: 0,
    target: 1000,
  },
  {
    id: 'harvest_master',
    name: 'Harvest Master',
    description: 'Harvest 50 plants',
    emoji: '🌾',
    unlocked: false,
    progress: 0,
    target: 50,
  },
  {
    id: 'pet_lover',
    name: 'Pet Lover',
    description: 'Unlock 3 pets',
    emoji: '🐾',
    unlocked: false,
    progress: 0,
    target: 3,
  },
  {
    id: 'rare_hunter',
    name: 'Rare Hunter',
    description: 'Find 5 rare plants',
    emoji: '🔍',
    unlocked: false,
    progress: 0,
    target: 5,
  },
  {
    id: 'exotic_collector',
    name: 'Exotic Collector',
    description: 'Unlock 10 legendary plants',
    emoji: '⭐',
    unlocked: false,
    progress: 0,
    target: 10,
  },
  {
    id: 'beanstalk_legend',
    name: 'Beanstalk Legend',
    description: 'Unlock the Giant Beanstalk',
    emoji: '🌱',
    unlocked: false,
    progress: 0,
    target: 1,
  },
  {
    id: 'wealthy_gardener',
    name: 'Wealthy Gardener',
    description: 'Earn 5000 total coins',
    emoji: '💰',
    unlocked: false,
    progress: 0,
    target: 5000,
  },
  {
    id: 'full_garden',
    name: 'Full Garden',
    description: 'Have all plots planted at once',
    emoji: '🌿',
    unlocked: false,
    progress: 0,
    target: 6,
  },
];
