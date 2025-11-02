import * as React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';

import Thumbnail from './thumbnail';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Channel } from '../../types/navigation';
import Animated, {
  interpolate,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  cancelAnimation,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

const { width } = Dimensions.get('window');

// Spring configuration for smooth animations with damping
const springConfig = {
  damping: 25,
  mass: 1.2,
  stiffness: 120,
  overshootClamping: false,
  restSpeedThreshold: 0.001,
  restDisplacementThreshold: 0.001,
};

// Modulo function for proper wrapping
function mod(n: number, m: number) {
  'worklet';
  return ((n % m) + m) % m;
}

const styles = StyleSheet.create({
  container: {
    flex: 0.8,
  },
  content: {
    flex: 1,
  },
});

interface ThumbnailsProps {
  channels: Channel[];
  index: SharedValue<number>;
  isActive: SharedValue<number>;
}

export const Thumbnails = ({ channels, index, isActive }: ThumbnailsProps) => {
  const translationX = useSharedValue(0);
  const velocityX = useSharedValue(0);
  const offsetX = useSharedValue(0);

  const intp = (index: number) => {
    'worklet';
    return index === 0
      ? {
          inputRange: [0, 1, 1, channels.length - 1, channels.length],
          outputRange: [0, -width, width, width, 0],
        }
      : {
          inputRange: [index - 1, index, index + 1],
          outputRange: [width, 0, -width],
        };
  };

  // Pan gesture for swiping thumbnails
  const panGesture = Gesture.Pan()
    .onStart(() => {
      // Cancel any ongoing animation and mark as active
      cancelAnimation(index);
      isActive.value = 1;
      offsetX.value = -index.value * width;
    })
    .onUpdate(event => {
      translationX.value = event.translationX;
      velocityX.value = event.velocityX;

      // Update index based on translation
      const totalTranslate = offsetX.value + translationX.value;
      const newIndex = -totalTranslate / width;

      // Ensure proper wrapping
      index.value = mod(newIndex, channels.length);
    })
    .onEnd(() => {
      // Calculate snap point based on current position and velocity
      const currentIndex = index.value;
      const velocityFactor = -velocityX.value / (width * 0.8);
      const targetIndex = currentIndex + velocityFactor;

      // Snap to nearest channel
      let snapIndex = Math.round(targetIndex);
      snapIndex = mod(snapIndex, channels.length);

      // Calculate shortest path for wrapping
      const diff = snapIndex - currentIndex;
      const shortestPath =
        diff > channels.length / 2
          ? diff - channels.length
          : diff < -channels.length / 2
          ? diff + channels.length
          : diff;

      // Animate to snap point
      index.value = withSpring(
        currentIndex + shortestPath,
        springConfig,
        finished => {
          if (finished) {
            isActive.value = 0;
          }
        },
      );

      // Reset translation
      translationX.value = 0;
      offsetX.value = -snapIndex * width;
    });

  const ThumbnailItem = ({
    channel,
    itemIndex,
  }: {
    channel: Channel;
    itemIndex: number;
  }) => {
    const animatedStyle = useAnimatedStyle(() => {
      const itemIntp = intp(itemIndex);
      const translateX = interpolate(
        index.value,
        itemIntp.inputRange,
        itemIntp.outputRange,
      );
      return {
        transform: [{ translateX }],
      };
    });

    return (
      <Animated.View style={[StyleSheet.absoluteFill, animatedStyle]}>
        <Thumbnail {...{ channel }} />
      </Animated.View>
    );
  };

  return (
    <GestureDetector gesture={panGesture}>
      <View style={styles.container}>
        <SafeAreaView />
        <View style={styles.content}>
          {channels.map((channel, key) => (
            <ThumbnailItem
              key={`channel-${channel.id}-index-${key}`}
              channel={channel}
              itemIndex={key}
            />
          ))}
        </View>
      </View>
    </GestureDetector>
  );
};
