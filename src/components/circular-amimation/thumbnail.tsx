/**
 * Thumbnail Component
 *
 * Displays a single channel thumbnail image in full-width format.
 * This is a simple presentational component that renders a channel's cover image
 * with a 16:9 aspect ratio (640:360).
 *
 * Used by the Thumbnails component to render individual carousel items.
 */

import * as React from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';

import { Channel } from '../../types/navigation';

// Get device width for full-width thumbnails
const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    width,
    aspectRatio: 640 / 360, // 16:9 aspect ratio for thumbnail images
  },
  cover: {
    ...StyleSheet.absoluteFill, // Fills the entire container
    width: undefined, // Allows aspect ratio to control dimensions
    height: undefined, // Allows aspect ratio to control dimensions
  },
});

/**
 * Props for the Thumbnail component
 */
interface ThumbnailProps {
  /** Channel data containing the cover image to display */
  channel: Channel;
}

/**
 * Thumbnail functional component
 * Renders a channel's cover image as a thumbnail
 */
export default ({ channel: { cover } }: ThumbnailProps) => {
  return (
    <>
      <View style={styles.container}>
        {/* Display the channel cover image */}
        <Image source={cover} style={styles.cover} />
      </View>
    </>
  );
};
