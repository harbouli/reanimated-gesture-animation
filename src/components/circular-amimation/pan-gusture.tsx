import * as React from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  useDerivedValue,
  SharedValue,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

const springConfig = {
  damping: 15,
  mass: 1,
  stiffness: 150,
  overshootClamping: false,
  restSpeedThreshold: 0.01,
  restDisplacementThreshold: 0.01,
};

interface PanGestureProps {
  index: SharedValue<number>;
  isActive: SharedValue<number>;
  ratio: number;
  length: number;
}

export const PanGesture = ({
  index,
  ratio,
  length,
  isActive,
}: PanGestureProps) => {
  const translationX = useSharedValue(0);
  const velocityX = useSharedValue(0);
  const offsetX = useSharedValue(0);
  const prevTranslateX = useSharedValue(0);

  // Track the current translate value for index calculation
  const translateX = useDerivedValue(() => {
    return offsetX.value + translationX.value;
  });

  // Update index continuously based on translation
  useDerivedValue(() => {
    const diff = translateX.value - prevTranslateX.value;
    const increment = diff / ratio;

    // Update the index with proper modulo wrapping
    let newIndex = index.value - increment;

    // Ensure the index wraps around correctly
    while (newIndex < 0) newIndex += length;
    while (newIndex >= length) newIndex -= length;

    index.value = newIndex;
    prevTranslateX.value = translateX.value;
  });

  const panGesture = Gesture.Pan()
    .onStart(() => {
      // Mark as active and stop any ongoing animation
      isActive.value = 1;
      offsetX.value = translateX.value;
    })
    .onUpdate(event => {
      translationX.value = event.translationX;
      velocityX.value = event.velocityX;
    })
    .onEnd(() => {
      // Calculate snap points (floor and ceil of current index)
      const currentIndex = index.value;
      const floorIndex = Math.floor(currentIndex);
      const ceilIndex = Math.ceil(currentIndex);

      // Calculate which snap point to use based on velocity
      const velocityFactor = velocityX.value / -ratio;
      const targetIndex = currentIndex + velocityFactor;

      // Determine the closest snap point
      let snapToIndex: number;
      if (
        Math.abs(targetIndex - floorIndex) < Math.abs(targetIndex - ceilIndex)
      ) {
        snapToIndex = floorIndex;
      } else {
        snapToIndex = ceilIndex;
      }

      // Ensure snap index is within bounds and wrap if needed
      while (snapToIndex < 0) snapToIndex += length;
      while (snapToIndex >= length) snapToIndex -= length;

      // Animate to the snap point
      index.value = withSpring(
        snapToIndex,
        {
          ...springConfig,
          velocity: velocityFactor,
        },
        finished => {
          if (finished) {
            isActive.value = 0;
          }
        },
      );

      // Reset translation values
      translationX.value = 0;
      offsetX.value = -snapToIndex * ratio;
      prevTranslateX.value = -snapToIndex * ratio;
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[StyleSheet.absoluteFill, animatedStyle]} />
    </GestureDetector>
  );
};
