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

/**
 * Props for TikTokMessages component
 * Extends FlatListProps with custom renderItem
 */
type Props<T> = FlatListProps<T> & {
  renderItem: ListRenderItem<T>;
};

/**
 * AnimatedItem - Wrapper component for individual chat messages
 * Provides enter animation for new messages appearing in the list
 *
 * Animation behavior:
 * - New messages fade in from bottom (translateY: 100 -> 0)
 * - Spring animation for natural, bouncy effect
 * - Opacity transitions from 0 to 1
 *
 * @param index - Position of item in the list
 * @param children - The chat item to be animated
 */
function AnimatedItem({
  index,
  children,
}: {
  index: number;
  children?: React.ReactNode;
}) {
  // Animated index value with spring physics for smooth transitions
  const newIndex = useDerivedValue(() =>
    withSpring(index, { damping: 80, stiffness: 200 }),
  );

  return (
    <Animated.View
      entering={FadeInDown.springify()
        .damping(80)        // Controls bounce (higher = less bounce)
        .stiffness(200)     // Controls speed (higher = faster)
        .withInitialValues({
          opacity: 0,       // Start invisible
          transform: [
            {
              translateY: 100,  // Start 100px below final position
            },
          ],
        })}
    >
      <Animated.View>{children}</Animated.View>
    </Animated.View>
  );
}
/**
 * TikTokMessages - Animated FlatList for displaying chat messages
 * Creates a TikTok-style live chat experience with smooth animations
 *
 * Features:
 * - Inverted list (new messages appear at bottom, scroll up to see older)
 * - Smooth enter animations for new messages (fade + slide from bottom)
 * - Layout transitions when items shift position (spring physics)
 * - Wraps each message in AnimatedItem for consistent animation behavior
 *
 * @param renderItem - Function to render each chat item
 * @param rest - All other FlatList props (data, style, etc.)
 */
export function TikTokMessages<T>({ renderItem, ...rest }: Props<T>) {
  // Extract and exclude CellRendererComponent to avoid conflicts
  const { CellRendererComponent, ...flatListProps } = rest;

  return (
    <>
      <Animated.FlatList
        {...flatListProps}
        inverted  // New messages at bottom, scroll up for history
        contentContainerStyle={{ paddingVertical: 80 }}  // Space for speed controls
        itemLayoutAnimation={LinearTransition.springify()
          .damping(80)      // Controls bounce when items reposition
          .stiffness(200)}  // Controls speed of repositioning
        renderItem={props => (
          // Wrap each item with animation logic
          <AnimatedItem index={props.index}>{renderItem(props)}</AnimatedItem>
        )}
      />
    </>
  );
}

const styles = StyleSheet.create({});
