
import { useState, useEffect, useCallback } from 'react';
import { UserProfile, ProfileStats, Achievement, ACHIEVEMENTS_DATA } from '@/types/ProfileTypes';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PROFILE_KEY = '@garden_user_profile';
const ALL_PROFILES_KEY = '@garden_all_profiles';

const AVATAR_EMOJIS = ['👨‍🌾', '👩‍🌾', '🧑‍🌾', '🌱', '🌻', '🌺', '🌸', '🌼', '🌷', '🌹'];

export function useProfile() {
  const [currentProfile, setCurrentProfile] = useState<UserProfile | null>(null);
  const [allProfiles, setAllProfiles] = useState<UserProfile[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    loadProfile();
    loadAllProfiles();
  }, []);

  const loadProfile = async () => {
    try {
      const savedProfile = await AsyncStorage.getItem(PROFILE_KEY);
      if (savedProfile) {
        const profile: UserProfile = JSON.parse(savedProfile);
        console.log('Loaded user profile:', profile.username);
        setCurrentProfile(profile);
      } else {
        console.log('No profile found');
        setCurrentProfile(null);
      }
      setIsLoaded(true);
    } catch (error) {
      console.error('Error loading profile:', error);
      setIsLoaded(true);
    }
  };

  const loadAllProfiles = async () => {
    try {
      const savedProfiles = await AsyncStorage.getItem(ALL_PROFILES_KEY);
      if (savedProfiles) {
        const profiles: UserProfile[] = JSON.parse(savedProfiles);
        setAllProfiles(profiles);
      }
    } catch (error) {
      console.error('Error loading all profiles:', error);
    }
  };

  const saveProfile = async (profile: UserProfile) => {
    try {
      await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
      
      // Update in all profiles list
      const savedProfiles = await AsyncStorage.getItem(ALL_PROFILES_KEY);
      let profiles: UserProfile[] = savedProfiles ? JSON.parse(savedProfiles) : [];
      
      const existingIndex = profiles.findIndex(p => p.id === profile.id);
      if (existingIndex >= 0) {
        profiles[existingIndex] = profile;
      } else {
        profiles.push(profile);
      }
      
      await AsyncStorage.setItem(ALL_PROFILES_KEY, JSON.stringify(profiles));
      setAllProfiles(profiles);
      
      console.log('Profile saved:', profile.username);
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  const createProfile = useCallback(async (username: string) => {
    const randomAvatar = AVATAR_EMOJIS[Math.floor(Math.random() * AVATAR_EMOJIS.length)];
    
    const newProfile: UserProfile = {
      id: Date.now().toString(),
      username,
      createdAt: Date.now(),
      avatar: randomAvatar,
      stats: {
        totalPlantsGrown: 0,
        totalCoinsEarned: 0,
        plantsUnlocked: 2,
        petsUnlocked: 0,
        rarePlantsFound: 0,
        totalHarvests: 0,
        highestCoinBalance: 50,
        playTime: 0,
        giantBeanstalkUnlocked: false,
      },
      achievements: ACHIEVEMENTS_DATA.map(a => ({ ...a })),
    };

    await saveProfile(newProfile);
    setCurrentProfile(newProfile);
    return newProfile;
  }, []);

  const updateStats = useCallback(async (updates: Partial<ProfileStats>) => {
    if (!currentProfile) return;

    const updatedProfile: UserProfile = {
      ...currentProfile,
      stats: {
        ...currentProfile.stats,
        ...updates,
      },
    };

    // Check and unlock achievements
    updatedProfile.achievements = checkAchievements(updatedProfile);

    await saveProfile(updatedProfile);
    setCurrentProfile(updatedProfile);
  }, [currentProfile]);

  const checkAchievements = (profile: UserProfile): Achievement[] => {
    return profile.achievements.map(achievement => {
      if (achievement.unlocked) return achievement;

      let progress = 0;
      let shouldUnlock = false;

      switch (achievement.id) {
        case 'first_seed':
          progress = profile.stats.totalPlantsGrown > 0 ? 1 : 0;
          shouldUnlock = progress >= 1;
          break;
        case 'first_harvest':
          progress = profile.stats.totalHarvests;
          shouldUnlock = progress >= 1;
          break;
        case 'plant_collector':
          progress = profile.stats.plantsUnlocked;
          shouldUnlock = progress >= 5;
          break;
        case 'master_gardener':
          progress = profile.stats.plantsUnlocked;
          shouldUnlock = progress >= 15;
          break;
        case 'coin_hoarder':
          progress = profile.stats.highestCoinBalance;
          shouldUnlock = progress >= 1000;
          break;
        case 'harvest_master':
          progress = profile.stats.totalHarvests;
          shouldUnlock = progress >= 50;
          break;
        case 'pet_lover':
          progress = profile.stats.petsUnlocked;
          shouldUnlock = progress >= 3;
          break;
        case 'rare_hunter':
          progress = profile.stats.rarePlantsFound;
          shouldUnlock = progress >= 5;
          break;
        case 'exotic_collector':
          progress = profile.stats.plantsUnlocked;
          shouldUnlock = progress >= 10;
          break;
        case 'beanstalk_legend':
          progress = profile.stats.giantBeanstalkUnlocked ? 1 : 0;
          shouldUnlock = progress >= 1;
          break;
        case 'wealthy_gardener':
          progress = profile.stats.totalCoinsEarned;
          shouldUnlock = progress >= 5000;
          break;
        case 'full_garden':
          progress = achievement.progress || 0;
          shouldUnlock = progress >= 6;
          break;
      }

      return {
        ...achievement,
        progress,
        unlocked: shouldUnlock,
        unlockedAt: shouldUnlock && !achievement.unlocked ? Date.now() : achievement.unlockedAt,
      };
    });
  };

  const switchProfile = useCallback(async (profileId: string) => {
    const profile = allProfiles.find(p => p.id === profileId);
    if (profile) {
      await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
      setCurrentProfile(profile);
    }
  }, [allProfiles]);

  const deleteProfile = useCallback(async (profileId: string) => {
    try {
      const updatedProfiles = allProfiles.filter(p => p.id !== profileId);
      await AsyncStorage.setItem(ALL_PROFILES_KEY, JSON.stringify(updatedProfiles));
      setAllProfiles(updatedProfiles);

      if (currentProfile?.id === profileId) {
        if (updatedProfiles.length > 0) {
          await switchProfile(updatedProfiles[0].id);
        } else {
          await AsyncStorage.removeItem(PROFILE_KEY);
          setCurrentProfile(null);
        }
      }
    } catch (error) {
      console.error('Error deleting profile:', error);
    }
  }, [allProfiles, currentProfile, switchProfile]);

  const clearProfile = useCallback(async () => {
    try {
      console.log('Clearing current profile...');
      await AsyncStorage.removeItem(PROFILE_KEY);
      setCurrentProfile(null);
      console.log('Profile cleared successfully');
    } catch (error) {
      console.error('Error clearing profile:', error);
    }
  }, []);

  const getLeaderboard = useCallback(() => {
    return [...allProfiles].sort((a, b) => {
      const scoreA = a.stats.totalCoinsEarned + (a.stats.rarePlantsFound * 100);
      const scoreB = b.stats.totalCoinsEarned + (b.stats.rarePlantsFound * 100);
      return scoreB - scoreA;
    });
  }, [allProfiles]);

  return {
    currentProfile,
    allProfiles,
    isLoaded,
    createProfile,
    updateStats,
    switchProfile,
    deleteProfile,
    clearProfile,
    getLeaderboard,
  };
}
