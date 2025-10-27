import {
  FlatList,
  FlatListProps,
  ListRenderItem,
  StyleSheet,
} from 'react-native';
import React from 'react';
import Animated, {
  FadeInDown,
  interpolate,
  LinearTransition,
  useAnimatedStyle,
  useDerivedValue,
  withSpring,
} from 'react-native-reanimated';
import { MAX_MESSAGES } from '../__mock__/chat';

type Props<T> = FlatListProps<T> & {
  renderItem: ListRenderItem<T>;
};
function AnimatedItem({
  index,
  children,
}: {
  index: number;
  children?: React.ReactNode;
}) {
  const newIndex = useDerivedValue(() =>
    withSpring(index, { damping: 80, stiffness: 200 }),
  );
  const stylez = useAnimatedStyle(() => ({
    opacity: interpolate(newIndex.value, [0, 1], [1, 1 - 0.8 / MAX_MESSAGES]),
  }));

  return (
    <Animated.View
      entering={FadeInDown.springify()
        .damping(80)
        .stiffness(200)
        .withInitialValues({
          opacity: 0,
          transform: [
            {
              translateY: 100,
            },
          ],
        })}
    >
      <Animated.View style={stylez}>{children}</Animated.View>
    </Animated.View>
  );
}
export function TikTokMessages<T>({ renderItem, ...rest }: Props<T>) {
  const { CellRendererComponent, ...flatListProps } = rest;
  return (
    <>
      <Animated.FlatList
        {...flatListProps}
        inverted
        contentContainerStyle={{ paddingVertical: 20 }}
        itemLayoutAnimation={LinearTransition.springify()
          .damping(80)
          .stiffness(200)}
        renderItem={props => (
          <AnimatedItem index={props.index}>{renderItem(props)}</AnimatedItem>
        )}
      />
    </>
  );
}

const styles = StyleSheet.create({});
