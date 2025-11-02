/**
 * Thumbnails Component
 *
 * Manages a horizontal carousel of full-width thumbnail images that users can swipe through.
 * Features:
 * - Horizontal pan gesture handling for swiping between channels
 * - Smooth spring animations with momentum-based scrolling
 * - Circular wrapping (last item connects to first item seamlessly)
 * - Velocity-aware snapping to nearest channel
 * - Synchronized with the circular selection component via shared values
 */

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

/**
 * Spring configuration for smooth animations with damping
 * - damping: Controls how quickly the animation settles (lower = more bouncy)
 * - mass: Affects the "weight" of the animation (higher = slower)
 * - stiffness: Controls the spring strength (higher = faster)
 * - overshootClamping: false allows the animation to overshoot slightly
 * - restSpeedThreshold/restDisplacementThreshold: Fine-tune when animation is considered "finished"
 */
const springConfig = {
  damping: 18,
  mass: 1.8,
  stiffness: 70,
  overshootClamping: false,
  restSpeedThreshold: 0.001,
  restDisplacementThreshold: 0.001,
};

/**
 * Modulo function for proper wrapping in circular carousel
 * Handles negative numbers correctly (unlike JavaScript's % operator)
 * @param n - The number to wrap
 * @param m - The modulo value (total number of items)
 * @returns The wrapped value between 0 and m-1
 * @example mod(-1, 5) returns 4 (wraps to end)
 * @example mod(5, 5) returns 0 (wraps to beginning)
 */
function mod(n: number, m: number) {
  'worklet';
  return ((n % m) + m) % m;
}

const styles = StyleSheet.create({
  container: {
    flex: 0.8, // Takes 80% of available space
  },
  content: {
    flex: 1,
    backgroundColor: 'red',
    flexGrow: 0,
  },
});

/**
 * Props for the Thumbnails component
 */
interface ThumbnailsProps {
  /** Array of channel data to display */
  channels: Channel[];
  /** Shared value representing the current selected index (synced with CircularSelection) */
  index: SharedValue<number>;
  /** Shared value indicating if user is actively interacting (1 = active, 0 = inactive) */
  isActive: SharedValue<number>;
}

/**
 * Thumbnails functional component
 * Renders a swipeable horizontal carousel of channel thumbnails
 */
export const Thumbnails = ({ channels, index, isActive }: ThumbnailsProps) => {
  // Tracks the current horizontal translation during a pan gesture
  const translationX = useSharedValue(0);

  // Stores the velocity of the pan gesture for momentum scrolling
  const velocityX = useSharedValue(0);

  // Stores the offset position when gesture starts (for calculating total translation)
  const offsetX = useSharedValue(0);

  /**
   * Generates interpolation config for a specific thumbnail item
   * Handles the special case for index 0 to enable circular wrapping
   *
   * @param index - The index of the thumbnail item
   * @returns Interpolation configuration with inputRange and outputRange
   *
   * How it works:
   * - For index 0: Special handling to wrap from last item to first
   * - For other indices: Standard left-center-right positioning
   */
  const intp = (index: number) => {
    'worklet';
    return index === 0
      ? {
          // Special case for first item: handles wrapping from last to first
          inputRange: [0, 1, 1, channels.length - 1, channels.length],
          outputRange: [0, -width, width, width, 0],
        }
      : {
          // Standard case: previous item off-screen left, current centered, next off-screen right
          inputRange: [index - 1, index, index + 1],
          outputRange: [width, 0, -width],
        };
  };

  /**
   * Pan gesture handler for swiping thumbnails
   * Handles three phases: onStart, onUpdate, and onEnd
   */
  const panGesture = Gesture.Pan()
    .onStart(() => {
      // Cancel any ongoing animation when user starts touching
      cancelAnimation(index);

      // Mark as active (prevents other animations from interfering)
      isActive.value = 1;

      // Store the current offset based on current index
      offsetX.value = -index.value * width;
    })
    .onUpdate(event => {
      // Update translation and velocity as user drags
      translationX.value = event.translationX;
      velocityX.value = event.velocityX;

      // Calculate new index based on total translation
      const totalTranslate = offsetX.value + translationX.value;
      const newIndex = -totalTranslate / width;

      // Ensure proper circular wrapping using modulo
      index.value = mod(newIndex, channels.length);
    })
    .onEnd(() => {
      // Calculate snap point based on current position and velocity
      const currentIndex = index.value;

      // Velocity factor determines how much momentum affects the final position
      // Negative because leftward swipe (negative velocity) should increase index
      const velocityFactor = -velocityX.value / (width * 0.8);
      const targetIndex = currentIndex + velocityFactor;

      // Snap to nearest channel (rounds to closest integer)
      let snapIndex = Math.round(targetIndex);
      snapIndex = mod(snapIndex, channels.length);

      /**
       * Calculate shortest path for wrapping
       * Example: Going from index 9 to 0 in a 10-item carousel
       * - Direct path: diff = -9 (go backwards 9 items)
       * - Wrapped path: diff + channels.length = 1 (go forward 1 item)
       * We choose the shorter path for smoother animation
       */
      const diff = snapIndex - currentIndex;
      const shortestPath =
        diff > channels.length / 2
          ? diff - channels.length
          : diff < -channels.length / 2
          ? diff + channels.length
          : diff;

      // Animate to snap point using spring physics
      index.value = withSpring(
        currentIndex + shortestPath,
        springConfig,
        finished => {
          // When animation completes, mark as inactive
          if (finished) {
            isActive.value = 0;
          }
        },
      );

      // Reset translation and update offset for next gesture
      translationX.value = 0;
      offsetX.value = -snapIndex * width;
    });

  /**
   * Individual thumbnail item component
   * Each thumbnail is positioned absolutely and animated based on the current index
   */
  const ThumbnailItem = ({
    channel,
    itemIndex,
  }: {
    channel: Channel;
    itemIndex: number;
  }) => {
    /**
     * Animated style that positions the thumbnail based on current index
     * Uses interpolation to smoothly translate items in and out of view
     */
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
    <View style={styles.container}>
      <SafeAreaView />
      {/* Wrap content in GestureDetector to handle pan gestures */}
      <GestureDetector gesture={panGesture}>
        <View style={styles.content}>
          {/* Render all thumbnails (they'll be positioned off-screen or on-screen based on index) */}
          {channels.map((channel, key) => (
            <ThumbnailItem
              key={`channel-${channel.id}-index-${key}`}
              channel={channel}
              itemIndex={key}
            />
          ))}
        </View>
      </GestureDetector>
    </View>
  );
};
