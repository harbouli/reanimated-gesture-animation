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

const { width } = Dimensions.get('window');
const height = width / 1.4;
const D = width * 1.2;
const innerR = D / 2;

const styles = StyleSheet.create({
  container: {
    width,
    height,
  },
});

interface CircularSelectionProps {
  channels: Channel[];
  index: SharedValue<number>;
  isActive: SharedValue<number>;
}

const springConfig = {
  damping: 25,
  mass: 1.2,
  stiffness: 120,
  overshootClamping: false,
  restSpeedThreshold: 0.001,
  restDisplacementThreshold: 0.001,
};

function mod(n: number, m: number) {
  'worklet';
  return ((n % m) + m) % m;
}

export default ({ channels, index, isActive }: CircularSelectionProps) => {
  const l = Math.sin(Math.PI / channels.length);
  const r = (innerR * l) / (1 - l);
  const R = innerR + 2 * r;
  const cx = width / 2 - r;
  const cy = R - r;
  const segment = (2 * Math.PI) / channels.length;

  // Gesture state
  const translationX = useSharedValue(0);
  const velocityX = useSharedValue(0);
  const offsetRotation = useSharedValue(0);
  const startAngle = useSharedValue(0);

  // Center point of the circular selection
  const centerX = width / 2;
  const centerY = R - height / 2;

  // Calculate angle from touch position
  const calculateAngle = (x: number, y: number) => {
    'worklet';
    const dx = x - centerX;
    const dy = y - centerY;
    return Math.atan2(dy, dx);
  };

  const panGesture = Gesture.Pan()
    .onStart(event => {
      // Cancel any ongoing animation
      cancelAnimation(index);
      isActive.value = 1;

      // Store the starting angle
      startAngle.value = calculateAngle(event.x, event.y);
      offsetRotation.value = index.value * segment;
    })
    .onChange(event => {
      // Calculate current angle from touch position
      const currentAngle = calculateAngle(event.x, event.y);

      // Calculate the angle difference
      let angleDelta = currentAngle - startAngle.value;

      // Handle angle wrapping (when crossing -π to π boundary)
      if (angleDelta > Math.PI) {
        angleDelta -= 2 * Math.PI;
      } else if (angleDelta < -Math.PI) {
        angleDelta += 2 * Math.PI;
      }

      // Update the index based on rotation
      // Negative because we rotate counter-clockwise visually
      const rotationDelta = -angleDelta;
      const indexDelta = rotationDelta / segment;

      index.value = mod(
        offsetRotation.value / segment + indexDelta,
        channels.length,
      );

      // Store velocity for momentum
      velocityX.value = event.velocityX;
      translationX.value = event.translationX;
    })
    .onEnd(() => {
      // Calculate snap point based on velocity
      const currentIndex = index.value;

      // Use velocity to determine momentum
      const velocityFactor = -velocityX.value / (width * 0.5); // Scale velocity
      const targetIndex = currentIndex + velocityFactor * 0.3;

      // Snap to nearest channel
      let snapIndex = Math.round(targetIndex);
      snapIndex = mod(snapIndex, channels.length);

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
    });

  // Animated rotation style
  const animatedRotationStyle = useAnimatedStyle(() => {
    const rotateZ = interpolate(
      index.value,
      [0, channels.length],
      [0, 2 * -Math.PI],
      Extrapolation.CLAMP,
    );

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
        <LinearGradient
          style={{
            ...StyleSheet.absoluteFill,
            borderRadius: R,
            width: R * 2,
            height: R * 2,
            left: -(R - width / 2),
          }}
          colors={['#ffffffff', '#9d9d9dff', '#757575ff']}
        />
        <Animated.View style={[StyleSheet.absoluteFill, animatedRotationStyle]}>
          {channels.map(({ cover }, key) => {
            return (
              <View
                key={key}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
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
