
export type PlantStage = 'seed' | 'sprout' | 'growing' | 'mature' | 'ready';
export type PlantRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
export type PetType = 'dog' | 'cat' | 'rabbit' | 'bird' | 'bee' | 'butterfly' | 'dragon';

export interface Plant {
  id: string;
  name: string;
  emoji: string;
  description: string;
  growthTime: number;
  sellPrice: number;
  unlockCost: number;
  isUnlocked: boolean;
  rarity: PlantRarity;
}

export interface Pet {
  id: string;
  name: string;
  emoji: string;
  description: string;
  type: PetType;
  ability: PetAbility;
  unlockCost: number;
  isUnlocked: boolean;
  level: number;
}

export interface PetAbility {
  type: 'growth_boost' | 'weed_prevention' | 'rare_finder' | 'auto_water' | 'coin_boost';
  value: number;
  description: string;
}

export interface PlantedPlot {
  plotId: number;
  plant: Plant;
  plantedAt: number;
  stage: PlantStage;
  lastWatered: number;
  health: number;
  hasWeeds: boolean;
  petBoostActive?: boolean;
}

export interface GameState {
  coins: number;
  plots: (PlantedPlot | null)[];
  unlockedPlants: string[];
  pets: Pet[];
  activePet: string | null;
  tools: {
    wateringCan: number;
    shovel: number;
  };
  rarePlantsFound: number;
}
