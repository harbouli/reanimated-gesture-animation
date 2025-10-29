import { View, StyleSheet } from 'react-native';
import React from 'react';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

/**
 * GesturePlayground - Interactive gesture-based animation demo
 * Features pan, pinch, and rotation gestures on an animated box
 */
export const GesturePlayground = () => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const startScale = useSharedValue(0);
  const rotate = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
      { rotate: `${rotate.value}rad` },
    ],
  }));

  // Pan gesture handler - allows dragging the box
  const panHandler = Gesture.Pan()
    .onChange(e => {
      translateX.value = e.translationX;
      translateY.value = e.translationY;
    })
    .onEnd(() => {
      translateX.value = withSpring(0, { duration: 300 });
      translateY.value = withSpring(0, { duration: 300 });
    });

  // Rotation gesture handler - allows rotating the box
  const rotateHandler = Gesture.Rotation()
    .onChange(e => {
      rotate.value = e.rotation;
    })
    .onEnd(() => {
      rotate.value = withTiming(0);
    });

  // Pinch gesture handler - allows scaling the box
  const pinchHandler = Gesture.Pinch()
    .onChange(e => {
      scale.value = e.scale + startScale.value;
      startScale.value = e.scale;
    })
    .onEnd(() => {
      scale.value = withTiming(1, { duration: 100 });
    });

  // Combine all gestures to work simultaneously
  const composedGesture = Gesture.Simultaneous(
    panHandler,
    pinchHandler,
    rotateHandler,
  );

  return (
    <GestureDetector gesture={composedGesture}>
      <View style={styles.container}>
        <Animated.View style={[styles.box, animatedStyle]} />
      </View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  box: {
    backgroundColor: '#6200ee',
    width: 100,
    height: 100,
    borderRadius: 20,
  },
});
