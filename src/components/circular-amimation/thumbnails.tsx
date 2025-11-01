import * as React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';

import Thumbnail from './thumbnail';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Channel } from '../../types/navigation';

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 0.8,
  },
  content: {
    flex: 1,
  },
});

interface ThumbnailsProps {
  channels: Channel[];
}

export default ({ channels }: ThumbnailsProps) => {
  return (
    <View style={styles.container}>
      <SafeAreaView />
      <View style={styles.content}>
        {channels.map((channel, key) => {
          return (
            <View
              style={{
                ...StyleSheet.absoluteFill,
              }}
              {...{ key }}
            >
              <Thumbnail {...{ channel }} />
            </View>
          );
        })}
      </View>
    </View>
  );
};
