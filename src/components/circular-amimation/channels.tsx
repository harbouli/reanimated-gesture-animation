import * as React from 'react';
import { View, StyleSheet } from 'react-native';

import CircularSelection from './circular-selection';
import Thumbnails from './thumbnails';
import { Channel } from '../../types/navigation';

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
  return (
    <View style={styles.container}>
      <Thumbnails {...{ channels }} />
      <CircularSelection {...{ channels }} />
    </View>
  );
};
