/**
 * Channels Component
 *
 * The main container component that orchestrates the circular playground experience.
 * Combines two synchronized components:
 * - Thumbnails: Full-width horizontal swipeable carousel at the top
 * - CircularSelection: Circular icon carousel at the bottom
 *
 * Both components share the same index and isActive state via Reanimated shared values,
 * ensuring they stay perfectly synchronized during gestures and animations.
 *
 * Architecture:
 * - Acts as the composition root for the circular playground feature
 * - Manages shared state between child components
 * - Provides the overall layout structure
 */

import * as React from 'react';
import { View, StyleSheet } from 'react-native';

import CircularSelection from './circular-selection';
import { Thumbnails } from './thumbnails';
import { Channel } from '../../types/navigation';
import { useSharedValue } from 'react-native-reanimated';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between', // Pushes Thumbnails to top, CircularSelection to bottom
    backgroundColor: '#dedede', // Light gray background
  },
});

/**
 * Props for the Channels component
 */
interface ChannelsProps {
  /** Array of channel data to display in both components */
  channels: Channel[];
}

/**
 * Channels functional component
 * Orchestrates the synchronized circular playground experience
 */
export const Channels = ({ channels }: ChannelsProps) => {
  /**
   * Shared value representing the current selected channel index
   * Used by both Thumbnails and CircularSelection to stay synchronized
   * Range: 0 to channels.length - 1 (wraps around for circular behavior)
   */
  const index = useSharedValue(0);

  /**
   * Shared value indicating if user is actively interacting with either component
   * - 0: User is not touching (animations can auto-complete)
   * - 1: User is actively touching (prevents competing animations)
   */
  const isActive = useSharedValue(0);

  return (
    <View style={styles.container}>
      {/* Top section: Horizontal swipeable thumbnails */}
      <Thumbnails {...{ channels, index, isActive }} />

      {/* Bottom section: Circular rotatable icon selection */}
      <CircularSelection isActive={isActive} {...{ channels }} index={index} />
    </View>
  );
};
