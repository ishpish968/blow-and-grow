
export interface AvatarSprite {
  id: string;
  name: string;
  image: any;
  description: string;
}

export const AVATAR_SPRITES: AvatarSprite[] = [
  {
    id: 'girl_default',
    name: 'Happy Gardener',
    image: require('@/assets/images/3c4f974f-6943-409e-8eb8-0382ef14fffd.png'),
    description: 'A cheerful gardener ready to grow!',
  },
];

export type AvatarAction = 'idle' | 'planting' | 'watering' | 'harvesting' | 'happy';
