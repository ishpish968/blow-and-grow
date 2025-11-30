
export type PlantStage = 'seed' | 'sprout' | 'growing' | 'mature' | 'ready';

export interface Plant {
  id: string;
  name: string;
  emoji: string;
  description: string;
  growthTime: number; // in seconds
  sellPrice: number;
  unlockCost: number;
  isUnlocked: boolean;
}

export interface PlantedPlot {
  plotId: number;
  plant: Plant;
  plantedAt: number;
  stage: PlantStage;
  lastWatered: number;
  health: number;
  hasWeeds: boolean;
}

export interface GameState {
  coins: number;
  plots: (PlantedPlot | null)[];
  unlockedPlants: string[];
  tools: {
    wateringCan: number;
    shovel: number;
  };
}
