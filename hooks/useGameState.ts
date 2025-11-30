
import { useState, useEffect, useCallback, useRef } from 'react';
import { GameState, PlantedPlot, Plant, PlantStage, Pet } from '@/types/GameTypes';
import { PLANTS_DATA } from '@/data/plantsData';
import { PETS_DATA } from '@/data/petsData';

const INITIAL_STATE: GameState = {
  coins: 50,
  plots: Array(6).fill(null),
  unlockedPlants: ['tomato', 'carrot'],
  pets: PETS_DATA.map(pet => ({ ...pet })),
  activePet: null,
  tools: {
    wateringCan: 1,
    shovel: 1,
  },
  rarePlantsFound: 0,
};

export function useGameState() {
  const [gameState, setGameState] = useState<GameState>(INITIAL_STATE);
  const [selectedPlot, setSelectedPlot] = useState<number | null>(null);
  const lastAutoWaterRef = useRef<number>(Date.now());

  const getActivePet = useCallback(() => {
    if (!gameState.activePet) return null;
    return gameState.pets.find(pet => pet.id === gameState.activePet && pet.isUnlocked);
  }, [gameState.activePet, gameState.pets]);

  const getGrowthMultiplier = useCallback(() => {
    const activePet = getActivePet();
    if (activePet && activePet.ability.type === 'growth_boost') {
      return activePet.ability.value;
    }
    return 1;
  }, [getActivePet]);

  const getCoinMultiplier = useCallback(() => {
    const activePet = getActivePet();
    if (activePet && activePet.ability.type === 'coin_boost') {
      return activePet.ability.value;
    }
    return 1;
  }, [getActivePet]);

  const shouldPreventWeeds = useCallback(() => {
    const activePet = getActivePet();
    if (activePet && activePet.ability.type === 'weed_prevention') {
      return Math.random() < activePet.ability.value;
    }
    return false;
  }, [getActivePet]);

  const canFindRarePlant = useCallback(() => {
    const activePet = getActivePet();
    if (activePet && activePet.ability.type === 'rare_finder') {
      return Math.random() < activePet.ability.value;
    }
    return false;
  }, [getActivePet]);

  // Auto-water functionality
  useEffect(() => {
    const activePet = getActivePet();
    if (!activePet || activePet.ability.type !== 'auto_water') return;

    const interval = setInterval(() => {
      const now = Date.now();
      if (now - lastAutoWaterRef.current >= 30000) {
        setGameState((prev) => {
          const updatedPlots = prev.plots.map((plot) => {
            if (!plot || plot.stage === 'ready') return plot;
            return {
              ...plot,
              lastWatered: now,
              health: Math.min(100, plot.health + 5),
            };
          });
          return { ...prev, plots: updatedPlots };
        });
        lastAutoWaterRef.current = now;
        console.log('Auto-watered all plants!');
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [getActivePet]);

  // Update plant stages based on time
  useEffect(() => {
    const interval = setInterval(() => {
      setGameState((prev) => {
        const now = Date.now();
        const growthMultiplier = getGrowthMultiplier();
        const updatedPlots = prev.plots.map((plot) => {
          if (!plot) return null;

          const adjustedGrowthTime = plot.plant.growthTime * growthMultiplier;
          const timeSincePlanted = (now - plot.plantedAt) / 1000;
          const progress = timeSincePlanted / adjustedGrowthTime;

          let newStage: PlantStage = 'seed';
          if (progress >= 1) {
            newStage = 'ready';
          } else if (progress >= 0.75) {
            newStage = 'mature';
          } else if (progress >= 0.5) {
            newStage = 'growing';
          } else if (progress >= 0.25) {
            newStage = 'sprout';
          }

          const preventWeeds = shouldPreventWeeds();
          const hasWeeds = plot.hasWeeds || (!preventWeeds && Math.random() > 0.98 && newStage !== 'ready');

          return {
            ...plot,
            stage: newStage,
            hasWeeds,
            petBoostActive: growthMultiplier < 1,
          };
        });

        return {
          ...prev,
          plots: updatedPlots,
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [getGrowthMultiplier, shouldPreventWeeds]);

  const plantSeed = useCallback((plotId: number, plant: Plant) => {
    setGameState((prev) => {
      const newPlots = [...prev.plots];
      newPlots[plotId] = {
        plotId,
        plant,
        plantedAt: Date.now(),
        stage: 'seed',
        lastWatered: Date.now(),
        health: 100,
        hasWeeds: false,
        petBoostActive: false,
      };
      return { ...prev, plots: newPlots };
    });
    setSelectedPlot(null);
  }, []);

  const waterPlant = useCallback((plotId: number) => {
    setGameState((prev) => {
      const newPlots = [...prev.plots];
      const plot = newPlots[plotId];
      if (plot) {
        newPlots[plotId] = {
          ...plot,
          lastWatered: Date.now(),
          health: Math.min(100, plot.health + 10),
        };
      }
      return { ...prev, plots: newPlots };
    });
  }, []);

  const removeWeeds = useCallback((plotId: number) => {
    setGameState((prev) => {
      const newPlots = [...prev.plots];
      const plot = newPlots[plotId];
      if (plot) {
        newPlots[plotId] = {
          ...plot,
          hasWeeds: false,
          health: Math.min(100, plot.health + 5),
        };
      }
      return { ...prev, plots: newPlots };
    });
  }, []);

  const harvestPlant = useCallback((plotId: number) => {
    setGameState((prev) => {
      const plot = prev.plots[plotId];
      if (!plot || plot.stage !== 'ready') return prev;

      const newPlots = [...prev.plots];
      newPlots[plotId] = null;

      const coinMultiplier = getCoinMultiplier();
      const earnedCoins = Math.floor(plot.plant.sellPrice * coinMultiplier);

      let rarePlantsFound = prev.rarePlantsFound;
      if (plot.plant.rarity === 'legendary' || plot.plant.rarity === 'epic') {
        rarePlantsFound += 1;
      }

      return {
        ...prev,
        plots: newPlots,
        coins: prev.coins + earnedCoins,
        rarePlantsFound,
      };
    });
  }, [getCoinMultiplier]);

  const unlockPlant = useCallback((plantId: string) => {
    const plant = PLANTS_DATA.find((p) => p.id === plantId);
    if (!plant) return;

    setGameState((prev) => {
      if (prev.coins < plant.unlockCost) return prev;
      if (prev.unlockedPlants.includes(plantId)) return prev;

      return {
        ...prev,
        coins: prev.coins - plant.unlockCost,
        unlockedPlants: [...prev.unlockedPlants, plantId],
      };
    });
  }, []);

  const unlockPet = useCallback((petId: string) => {
    setGameState((prev) => {
      const petIndex = prev.pets.findIndex(p => p.id === petId);
      if (petIndex === -1) return prev;

      const pet = prev.pets[petIndex];
      if (prev.coins < pet.unlockCost || pet.isUnlocked) return prev;

      const newPets = [...prev.pets];
      newPets[petIndex] = { ...pet, isUnlocked: true };

      return {
        ...prev,
        coins: prev.coins - pet.unlockCost,
        pets: newPets,
      };
    });
  }, []);

  const setActivePet = useCallback((petId: string | null) => {
    setGameState((prev) => {
      if (petId && !prev.pets.find(p => p.id === petId && p.isUnlocked)) {
        return prev;
      }
      return { ...prev, activePet: petId };
    });
  }, []);

  const discoverRarePlant = useCallback(() => {
    if (!canFindRarePlant()) return null;

    const rarePlants = PLANTS_DATA.filter(
      p => (p.rarity === 'legendary' || p.rarity === 'epic') && !gameState.unlockedPlants.includes(p.id)
    );

    if (rarePlants.length === 0) return null;

    const randomPlant = rarePlants[Math.floor(Math.random() * rarePlants.length)];
    
    setGameState((prev) => ({
      ...prev,
      unlockedPlants: [...prev.unlockedPlants, randomPlant.id],
      rarePlantsFound: prev.rarePlantsFound + 1,
    }));

    return randomPlant;
  }, [canFindRarePlant, gameState.unlockedPlants]);

  return {
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
  };
}
