import { View, Pressable } from 'react-native';
import React from 'react';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  FlipInXDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

const PressableAnimated = Animated.createAnimatedComponent(Pressable);

export const LiveCoding = () => {
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

  const myFunc = () => {
    'worklet';
    console.log('first');
  };

  const panHandler = Gesture.Pan()
    .onChange(e => {
      translateX.value = e.translationX;
      translateY.value = e.translationY;
      myFunc();
    })
    .onEnd(e => {
      translateX.value = withSpring(0, { duration: 300 });
      translateY.value = withSpring(0, { duration: 300 });
    });
  const rotateHandler = Gesture.Rotation()
    .onChange(e => {
      rotate.value = e.rotation;
    })
    .onEnd(() => (rotate.value = withTiming(0)));

  const pincHandler = Gesture.Pinch()
    .onChange(e => {
      scale.value = e.scale + startScale.value;
      startScale.value = e.scale;
    })
    .onEnd(() => {
      scale.value = withTiming(1, { duration: 100 });
    });
  const composeGuster = Gesture.Simultaneous(
    panHandler,
    pincHandler,
    rotateHandler,
  );
  return (
    <GestureDetector gesture={composeGuster}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Animated.View
          style={[
            {
              backgroundColor: 'black',
              width: 80,
              height: 80,
              borderRadius: 20,
            },
            animatedStyle,
          ]}
        />
      </View>
    </GestureDetector>
  );
};
