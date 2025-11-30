
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { AvatarDisplay } from './AvatarDisplay';
import { AvatarAction } from '@/types/AvatarTypes';

interface GardenCharacterProps {
  currentAction?: AvatarAction;
}

export function GardenCharacter({ currentAction = 'idle' }: GardenCharacterProps) {
  const [action, setAction] = useState<AvatarAction>(currentAction);
  const bounceAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setAction(currentAction);
    
    if (currentAction !== 'idle') {
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: -10,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      const timeout = setTimeout(() => {
        setAction('idle');
      }, 2000);

      return () => clearTimeout(timeout);
    }
  }, [currentAction]);

  return (
    <Animated.View style={[styles.container, { transform: [{ translateY: bounceAnim }] }]}>
      <AvatarDisplay size={100} action={action} showLabel={true} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 16,
  },
});
