import * as React from 'react';
import { View, StyleSheet } from 'react-native';

import CircularSelection from './circular-selection';
import { Thumbnails } from './thumbnails';
import { Channel } from '../../types/navigation';
import { useSharedValue } from 'react-native-reanimated';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: '#1a1b1c',
  },
});

interface ChannelsProps {
  channels: Channel[];
}

export const Channels = ({ channels }: ChannelsProps) => {
  const index = useSharedValue(0);
  const isActive = useSharedValue(0);
  return (
    <View style={styles.container}>
      <Thumbnails {...{ channels }} index={index} />
      <CircularSelection isActive={isActive} {...{ channels }} index={index} />
    </View>
  );
};
