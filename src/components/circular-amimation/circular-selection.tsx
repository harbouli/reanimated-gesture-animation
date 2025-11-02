/**
 * CircularSelection Component
 *
 * A circular carousel of channel icons arranged in a perfect circle with rotational gestures.
 * Features:
 * - Touch-based circular rotation (follows finger around circle center)
 * - Mathematical circle layout using trigonometry for perfect spacing
 * - Smooth spring animations with momentum-based rotation
 * - Synchronized with thumbnails component via shared values
 * - Beautiful gradient background effect
 * - Circular wrapping for infinite rotation in both directions
 *
 * Mathematical Concepts:
 * - Uses sine law and trigonometry to calculate icon sizes and positions
 * - Implements polar coordinates for circular layout
 * - Handles angle wrapping across the -π to π boundary
 */

import * as React from 'react';
import { Dimensions, View, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import ChannelIcon from './channel-icon';
import { Channel } from '../../types/navigation';
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  cancelAnimation,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

// Screen dimensions
const { width } = Dimensions.get('window');

/**
 * Visual layout calculations
 * - height: 1.4 aspect ratio from width
 * - D: Diameter of the circular layout (120% of screen width for dramatic effect)
 * - innerR: Inner radius (half of diameter)
 */
const height = width / 1.4;
const D = width * 1.2;
const innerR = D / 2;

const styles = StyleSheet.create({
  container: {
    width,
    height,
  },
});

/**
 * Props for the CircularSelection component
 */
interface CircularSelectionProps {
  /** Array of channel data to display in the circle */
  channels: Channel[];
  /** Shared value representing the current selected index (synced with Thumbnails) */
  index: SharedValue<number>;
  /** Shared value indicating if user is actively interacting (1 = active, 0 = inactive) */
  isActive: SharedValue<number>;
}

/**
 * Spring configuration for rotation animations
 * Tuned for responsive, natural-feeling circular motion
 * - Higher stiffness and damping than Thumbnails for snappier circular rotation
 */
const springConfig = {
  damping: 13,
  mass: 1.2,
  stiffness: 120,
  overshootClamping: false,
  restSpeedThreshold: 0.001,
  restDisplacementThreshold: 0.001,
};

/**
 * Modulo function for proper wrapping in circular carousel
 * Handles negative numbers correctly (unlike JavaScript's % operator)
 */
function mod(n: number, m: number) {
  'worklet';
  return ((n % m) + m) % m;
}

/**
 * CircularSelection functional component
 * Renders channels in a circular layout with rotational gesture control
 */
export default ({ channels, index, isActive }: CircularSelectionProps) => {
  /**
   * Mathematical calculations for circular layout
   *
   * Using the sine law to calculate the perfect icon radius for a regular polygon
   * inscribed in a circle:
   *
   * l = sin(π / n) where n is the number of channels
   * This gives us the "half-chord" length for the polygon
   *
   * r = (innerR × l) / (1 - l)
   * This calculates the radius of each icon so they fit perfectly around the circle
   *
   * R = innerR + 2r
   * The total radius including the icons
   *
   * cx, cy: Center point for positioning each icon
   * segment: Angle between each icon (2π divided by number of channels)
   */
  const l = Math.sin(Math.PI / channels.length);
  const r = (innerR * l) / (1 - l);
  const R = innerR + 2 * r;
  const cx = width / 2 - r;
  const cy = R - r;
  const segment = (2 * Math.PI) / channels.length;

  /**
   * Gesture state shared values
   */
  // Tracks horizontal translation during gesture (not used for angle calc, kept for reference)
  const translationX = useSharedValue(0);
  // Tracks horizontal velocity for momentum calculation
  const velocityX = useSharedValue(0);
  // Stores the rotation offset when gesture starts
  const offsetRotation = useSharedValue(0);
  // Stores the angle where the touch started
  const startAngle = useSharedValue(0);

  /**
   * Center point of the circular selection
   * Used as the pivot point for angle calculations
   */
  const centerX = width / 2;
  const centerY = R - height / 2;

  /**
   * Calculate angle from touch position relative to circle center
   * Uses Math.atan2 to get the angle in radians (-π to π)
   *
   * @param x - Touch x-coordinate
   * @param y - Touch y-coordinate
   * @returns Angle in radians
   */
  const calculateAngle = (x: number, y: number) => {
    'worklet';
    const dx = x - centerX;
    const dy = y - centerY;
    return Math.atan2(dy, dx);
  };

  /**
   * Pan gesture handler for circular rotation
   * Converts linear touch movement into angular rotation
   */
  const panGesture = Gesture.Pan()
    .onStart(event => {
      // Cancel any ongoing animation
      cancelAnimation(index);
      isActive.value = 1;

      // Store the starting angle and rotation offset
      startAngle.value = calculateAngle(event.x, event.y);
      offsetRotation.value = index.value * segment;
    })
    .onChange(event => {
      // Calculate current angle from touch position
      const currentAngle = calculateAngle(event.x, event.y);

      // Calculate the angle difference (delta) since gesture started
      let angleDelta = currentAngle - startAngle.value;

      /**
       * Handle angle wrapping when crossing the -π to π boundary
       * Example: If you go from angle 3.0 to -3.0, that's actually a small rotation,
       * not a full 6-radian rotation. We detect this and correct it.
       */
      if (angleDelta > Math.PI) {
        angleDelta -= 2 * Math.PI;
      } else if (angleDelta < -Math.PI) {
        angleDelta += 2 * Math.PI;
      }

      /**
       * Update the index based on rotation
       * - Negative sign because visual rotation is counter-clockwise for positive angle changes
       * - Convert angle delta to index delta by dividing by segment size
       */
      const rotationDelta = -angleDelta;
      const indexDelta = rotationDelta / segment;

      // Apply the delta to the stored offset and wrap using modulo
      index.value = mod(
        offsetRotation.value / segment + indexDelta,
        channels.length,
      );

      // Store velocity for momentum calculation
      velocityX.value = event.velocityX;
      translationX.value = event.translationX;
    })
    .onEnd(() => {
      // Calculate snap point based on velocity
      const currentIndex = index.value;

      /**
       * Use horizontal velocity to determine momentum
       * - Scale velocity by screen width (0.5 factor)
       * - Multiply by 0.3 to dampen the momentum effect
       * - Negative sign because leftward swipe should rotate clockwise (increase index)
       */
      const velocityFactor = -velocityX.value / (width * 0.5);
      const targetIndex = currentIndex + velocityFactor * 0.3;

      // Snap to nearest channel
      let snapIndex = Math.round(targetIndex);
      snapIndex = mod(snapIndex, channels.length);

      /**
       * Calculate shortest path for wrapping
       * Ensures rotation takes the shorter circular route
       */
      const diff = snapIndex - currentIndex;
      const shortestPath =
        diff > channels.length / 2
          ? diff - channels.length
          : diff < -channels.length / 2
          ? diff + channels.length
          : diff;

      // Animate to snap point with spring physics
      index.value = withSpring(
        currentIndex + shortestPath,
        springConfig,
        finished => {
          if (finished) {
            isActive.value = 0;
          }
        },
      );
    });

  /**
   * Animated rotation style for the entire circular selection
   * Rotates all icons together as a single unit around the center point
   */
  const animatedRotationStyle = useAnimatedStyle(() => {
    // Convert index to rotation angle (0 to -2π for full rotation)
    const rotateZ = interpolate(
      index.value,
      [0, channels.length],
      [0, 2 * -Math.PI],
      Extrapolation.CLAMP,
    );

    /**
     * Transform sequence:
     * 1. Translate to center point (move pivot to center of circle)
     * 2. Rotate around that point
     * 3. Translate back (restore original position)
     */
    return {
      transform: [
        { translateY: R - height / 2 },
        { rotateZ: `${rotateZ}rad` },
        { translateY: -(R - height / 2) },
      ],
    };
  });

  return (
    <GestureDetector gesture={panGesture}>
      <View style={styles.container}>
        {/* Gradient background creating a metallic circular effect */}
        <LinearGradient
          style={{
            ...StyleSheet.absoluteFill,
            borderRadius: R,
            width: R * 2,
            height: R * 2,
            left: -(R - width / 2), // Center the gradient circle
          }}
          colors={['#ffffffff', '#9d9d9dff', '#757575ff']}
        />

        {/* Animated container that rotates all channel icons */}
        <Animated.View style={[StyleSheet.absoluteFill, animatedRotationStyle]}>
          {/* Render each channel icon in a circular layout */}
          {channels.map(({ cover }, key) => {
            return (
              <View
                key={key}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  /**
                   * Position each icon in a circle using polar coordinates
                   * Transform sequence:
                   * 1. translateX(cx), translateY(cy): Move to starting position
                   * 2. rotateZ(key × segment): Rotate to this icon's position on the circle
                   * 3. translateY(-cy): Move outward from center (radius of circle)
                   */
                  transform: [
                    { translateX: cx },
                    { translateY: cy },
                    { rotateZ: `${key * segment}rad` },
                    { translateY: -cy },
                  ],
                }}
              >
                <ChannelIcon
                  name={`${key + 1}`}
                  radius={r}
                  currentIndex={key}
                  cover={cover}
                  length={channels.length}
                  index={index}
                />
              </View>
            );
          })}
        </Animated.View>
      </View>
    </GestureDetector>
  );
};
