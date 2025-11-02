import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  SharedValue,
  useAnimatedStyle,
  interpolate,
  interpolateColor,
  Extrapolation,
  useDerivedValue,
} from 'react-native-reanimated';
import {
  Canvas,
  Image as SkiaImage,
  useImage,
  Circle,
  Group,
  Skia,
  ColorMatrix,
} from '@shopify/react-native-skia';

const margin = 10;
const activeColor = 'rgb(59, 130, 246)'; // Light blue for active
const nonActiveColor = 'rgb(229, 231, 235)'; // Light gray for inactive

// Identity matrix (colorful - no change)
const identityMatrix = [
  1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0,
];

// Grayscale matrix
const grayscaleMatrix = [
  0.213, 0.715, 0.072, 0.0, 0.0, 0.213, 0.715, 0.072, 0.0, 0.0, 0.213, 0.715,
  0.072, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0,
];

interface ChannelIconProps {
  name: string;
  radius: number;
  currentIndex: number;
  index: SharedValue<number>;
  length: number;
  cover?: number;
}

export default ({
  radius,
  currentIndex,
  index,
  cover,
  length,
}: ChannelIconProps) => {
  // Load the image using Skia's useImage hook
  const image = useImage(cover);

  const scale = useDerivedValue(() => {
    const distance = Math.abs(index.value - currentIndex);
    const wrappedDistance = Math.min(distance, Math.abs(distance - length));
    return interpolate(wrappedDistance, [0, 1], [1.1, 1]);
  });

  // Interpolate color matrix for smooth grayscale transition
  const colorMatrix = useDerivedValue(() => {
    'worklet';
    const distance = Math.abs(index.value - currentIndex);
    const wrappedDistance = Math.min(distance, Math.abs(distance - length));

    // Interpolate between 0 (colorful) and 1 (grayscale)
    // At index: 0, at index±1: 1, smooth transition in between
    const matrixWeight = interpolate(
      wrappedDistance,
      [0, 1],
      [0, 1],
      Extrapolation.CLAMP,
    );

    // Interpolate each value in the matrix
    const interpolatedMatrix = identityMatrix.map((identityValue, i) => {
      const grayscaleValue = grayscaleMatrix[i];
      return identityValue + (grayscaleValue - identityValue) * matrixWeight;
    });

    return interpolatedMatrix;
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const size = (radius - margin) * 2;
  const centerRadius = radius - margin;

  // Create circular clip path
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
        <Canvas
          style={{
            width: size,
            height: size,
          }}
        >
          {/* Background circle */}
          <Circle cx={centerRadius} cy={centerRadius} r={centerRadius} />

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
                <ColorMatrix matrix={colorMatrix} />
              </SkiaImage>
            </Group>
          )}
        </Canvas>
      </Animated.View>
    </View>
  );
};
