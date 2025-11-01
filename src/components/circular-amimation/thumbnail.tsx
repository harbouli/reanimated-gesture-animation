import * as React from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';

import { Channel } from '../../types/navigation';

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    width,
    aspectRatio: 640 / 360,
  },
  cover: {
    ...StyleSheet.absoluteFill,
    width: undefined,
    height: undefined,
  },
});

interface ThumbnailProps {
  channel: Channel;
}

export default ({ channel: { cover } }: ThumbnailProps) => {
  return (
    <>
      <View style={styles.container}>
        <Image source={cover} style={styles.cover} />
      </View>
    </>
  );
};
