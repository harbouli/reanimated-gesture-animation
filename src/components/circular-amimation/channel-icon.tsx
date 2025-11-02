/**
 * ChannelIcon Component
 *
 * A circular icon that represents a channel in the circular selection carousel.
 * Features:
 * - Dynamic scaling based on selection proximity (closer to selected = larger)
 * - Grayscale to color transition effect based on selection state
 * - Circular clipping using Skia for perfect circular images
 * - Wrapped distance calculation for smooth circular carousel behavior
 */

import * as React from 'react';
import { View } from 'react-native';
import Animated, {
  SharedValue,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  useDerivedValue,
} from 'react-native-reanimated';
import {
  Canvas,
  Image as SkiaImage,
  useImage,
  Group,
  Skia,
  ColorMatrix,
} from '@shopify/react-native-skia';

/**
 * Margin spacing between the channel icon and its container
 * Provides breathing room for the scale animation
 */
const margin = 10;

/**
 * Identity matrix (colorful - no change to image colors)
 * This is the standard color transformation matrix that preserves original colors
 */
const identityMatrix = [
  1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0,
];

/**
 * Grayscale transformation matrix
 * Converts colored images to grayscale using the luminosity method
 * Formula: 0.213*R + 0.715*G + 0.072*B for each RGB channel
 */
const grayscaleMatrix = [
  0.213, 0.715, 0.072, 0.0, 0.0, 0.213, 0.715, 0.072, 0.0, 0.0, 0.213, 0.715,
  0.072, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0,
];

/**
 * Props for the ChannelIcon component
 */
interface ChannelIconProps {
  /** Channel name/identifier (currently used for key generation) */
  name: string;
  /** Radius of the icon container (includes margin) */
  radius: number;
  /** The static index position of this icon in the circular array */
  currentIndex: number;
  /** The current selected index (animated shared value) */
  index: SharedValue<number>;
  /** Total number of channels in the circular selection */
  length: number;
  /** Optional image resource for the channel cover */
  cover?: number;
}

/**
 * ChannelIcon functional component
 * Renders an individual channel icon with animations and visual effects
 */
export default ({
  radius,
  currentIndex,
  index,
  cover,
  length,
}: ChannelIconProps) => {
  // Load the cover image using Skia's image loader
  const image = useImage(cover);

  /**
   * Calculate scale based on distance from selected index
   * Uses wrapped distance for circular carousel behavior
   * - At selected index (distance = 0): scale = 1.1 (10% larger)
   * - At adjacent indices (distance = 1): scale = 1.0 (normal size)
   */
  const scale = useDerivedValue(() => {
    // Calculate absolute distance between current selection and this icon
    const distance = Math.abs(index.value - currentIndex);

    // Handle circular wrapping (e.g., if index=0 and currentIndex=9, wrapped distance is 1, not 9)
    const wrappedDistance = Math.min(distance, Math.abs(distance - length));

    // Interpolate scale: selected icon is 1.1x, adjacent icons are 1.0x
    return interpolate(wrappedDistance, [0, 1], [1.1, 1]);
  });

  /**
   * Interpolate color matrix for smooth grayscale transition
   * Creates a smooth transition from colored (selected) to grayscale (unselected)
   */
  const colorMatrix = useDerivedValue(() => {
    'worklet';

    // Calculate distance from selected index
    const distance = Math.abs(index.value - currentIndex);
    const wrappedDistance = Math.min(distance, Math.abs(distance - length));

    /**
     * Calculate matrix weight for interpolation
     * - At selected index (wrappedDistance = 0): weight = 0 (fully colored)
     * - At adjacent indices (wrappedDistance = 1): weight = 1 (fully grayscale)
     */
    const matrixWeight = interpolate(
      wrappedDistance,
      [0, 1],
      [0, 1],
      Extrapolation.CLAMP,
    );

    /**
     * Interpolate each value in the color transformation matrix
     * Blends between identity matrix (colorful) and grayscale matrix
     */
    const interpolatedMatrix = identityMatrix.map((identityValue, i) => {
      const grayscaleValue = grayscaleMatrix[i];
      return identityValue + (grayscaleValue - identityValue) * matrixWeight;
    });

    return interpolatedMatrix;
  });

  /**
   * Animated style for scale transformation
   * Applied to the Animated.View wrapper
   */
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  // Calculate the actual icon size (accounting for margin)
  const size = (radius - margin) * 2;
  const centerRadius = radius - margin;

  /**
   * Create circular clip path using Skia
   * This ensures images are perfectly circular regardless of their original shape
   * Memoized to avoid recreating the path on every render
   */
  const clipPath = React.useMemo(() => {
    const path = Skia.Path.Make();
    path.addCircle(centerRadius, centerRadius, centerRadius);
    return path;
  }, [centerRadius]);

  return (
    <View
      style={{
        width: radius * 2,
        height: radius * 2,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* Animated container for scale effect */}
      <Animated.View
        style={[
          {
            width: size,
            height: size,
            overflow: 'hidden',
          },
          animatedStyle,
        ]}
      >
        {/* Skia Canvas for rendering image with effects */}
        <Canvas
          style={{
            width: size,
            height: size,
          }}
        >
          {/* Image rendered with circular clip and color matrix filter */}
          {image && (
            <Group clip={clipPath}>
              <SkiaImage
                image={image}
                x={0}
                y={0}
                width={size}
                height={size}
                fit="cover"
              >
                {/* Apply color matrix for grayscale transition */}
                <ColorMatrix matrix={colorMatrix} />
              </SkiaImage>
            </Group>
          )}
        </Canvas>
      </Animated.View>
    </View>
  );
};
