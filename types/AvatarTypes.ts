
export interface AvatarSprite {
  id: string;
  name: string;
  image: any;
  description: string;
}

export const AVATAR_SPRITES: AvatarSprite[] = [
  {
    id: 'girl_planting',
    name: 'Girl Gardener',
    image: require('@/assets/images/19a9ea05-d331-4b57-b7b6-15b35d9bbd0a.png'),
    description: 'A focused gardener tending to her plants',
  },
  {
    id: 'girl_happy',
    name: 'Happy Girl',
    image: require('@/assets/images/14a4bf2c-a4de-47fa-8a74-5a2cb5dde395.png'),
    description: 'A cheerful gardener full of joy!',
  },
  {
    id: 'boy_planting',
    name: 'Boy Gardener',
    image: require('@/assets/images/9eddb83c-3b7e-4ea0-83f9-fcd8c48b7884.png'),
    description: 'A dedicated gardener caring for his plants',
  },
  {
    id: 'boy_excited',
    name: 'Excited Boy',
    image: require('@/assets/images/9f158100-17f7-4db4-abba-8fe83d81227c.png'),
    description: 'An enthusiastic gardener ready to grow!',
  },
  {
    id: 'boy_neutral',
    name: 'Calm Boy',
    image: require('@/assets/images/c2fc3544-f7ec-4e50-8fef-7b24f378d7c7.png'),
    description: 'A peaceful gardener enjoying the garden',
  },
  {
    id: 'girl_default',
    name: 'Classic Gardener',
    image: require('@/assets/images/3c4f974f-6943-409e-8eb8-0382ef14fffd.png'),
    description: 'The original happy gardener!',
  },
];

export type AvatarAction = 'idle' | 'planting' | 'watering' | 'harvesting' | 'happy';
