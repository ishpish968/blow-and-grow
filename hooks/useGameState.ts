
import { useState, useEffect, useCallback } from 'react';
import { GameState, PlantedPlot, Plant, PlantStage } from '@/types/GameTypes';
import { PLANTS_DATA } from '@/data/plantsData';

const INITIAL_STATE: GameState = {
  coins: 50,
  plots: Array(6).fill(null),
  unlockedPlants: ['tomato', 'carrot'],
  tools: {
    wateringCan: 1,
    shovel: 1,
  },
};

export function useGameState() {
  const [gameState, setGameState] = useState<GameState>(INITIAL_STATE);
  const [selectedPlot, setSelectedPlot] = useState<number | null>(null);

  // Update plant stages based on time
  useEffect(() => {
    const interval = setInterval(() => {
      setGameState((prev) => {
        const now = Date.now();
        const updatedPlots = prev.plots.map((plot) => {
          if (!plot) return null;

          const timeSincePlanted = (now - plot.plantedAt) / 1000;
          const progress = timeSincePlanted / plot.plant.growthTime;

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

          // Randomly add weeds
          const hasWeeds = plot.hasWeeds || (Math.random() > 0.98 && newStage !== 'ready');

          return {
            ...plot,
            stage: newStage,
            hasWeeds,
          };
        });

        return {
          ...prev,
          plots: updatedPlots,
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

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

      return {
        ...prev,
        plots: newPlots,
        coins: prev.coins + plot.plant.sellPrice,
      };
    });
  }, []);

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

  return {
    gameState,
    selectedPlot,
    setSelectedPlot,
    plantSeed,
    waterPlant,
    removeWeeds,
    harvestPlant,
    unlockPlant,
  };
}
