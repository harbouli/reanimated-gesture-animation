/**
 * Image URLs for the circular slider carousel
 * Collection of high-quality images from Unsplash
 */
const images = [
  'https://plus.unsplash.com/premium_photo-1757423357777-eedac57abcbb?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687',
  'https://images.unsplash.com/photo-1761216674297-6ffa4d89400c?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687',
  'https://images.unsplash.com/photo-1761416465088-e0fed7334fe3?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=735',
  'https://images.unsplash.com/photo-1761346978359-34e6ebe21c6e?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=719',
  'https://plus.unsplash.com/premium_photo-1761407212024-927ff260917d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687',
  'https://plus.unsplash.com/premium_photo-1757423357777-eedac57abcbb?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687',
  'https://images.unsplash.com/photo-1761216674297-6ffa4d89400c?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687',
  'https://images.unsplash.com/photo-1761416465088-e0fed7334fe3?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=735',
];
// const { width } = Dimensions.get('screen');
// const _itemSize = width * 0.24;
// const _itemSpacing = 12;
// const _itemTotalSize = _itemSize + _itemSpacing;
// type Props = {};

// export const CircularSlider = (props: Props) => {
//   const scrollX = useSharedValue(0);
//   const [activeIndex, setActiveIndex] = React.useState(0);
//   const onScroll = useAnimatedScrollHandler(e => {
//     scrollX.value = clamp(
//       e.contentOffset.x / _itemTotalSize,
//       0,
//       images.length - 1,
//     );
//     const newActiveIndex = Math.round(scrollX.value);

//     if (newActiveIndex !== activeIndex) {
//       scheduleOnRN(setActiveIndex, newActiveIndex);
//     }
//   });
//   return (
//     <View
//       style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'black' }}
//     >
//       <View style={[StyleSheet.absoluteFill]}>
//         <Animated.Image
//           entering={FadeIn.duration(500)}
//           exiting={FadeOut.duration(500)}
//           key={`index-${activeIndex}`}
//           source={{ uri: images[activeIndex] }}
//           style={{ flex: 1 }}
//         />
//       </View>
//       <Animated.FlatList
//         data={images}
//         keyExtractor={(_, index) => String(index)}
//         contentContainerStyle={{
//           paddingHorizontal: (width - _itemSize) / 2,
//           gap: _itemSpacing,
//         }}
//         horizontal
//         style={{
//           flexGrow: 0,
//           height: _itemSize * 2,
//         }}
//         showsHorizontalScrollIndicator={false}
//         renderItem={({ item, index }) => (
//           <CarouselItem imageUri={item} index={index} scrollX={scrollX} />
//         )}
//         onScroll={onScroll}
//         scrollEventThrottle={1000 / 60}
//         snapToInterval={_itemTotalSize}
//         decelerationRate={'fast'}
//       />
//     </View>
//   );
// };
// const CarouselItem = ({
//   imageUri,
//   index,
//   scrollX,
// }: {
//   imageUri: string;
//   index: number;
//   scrollX: SharedValue<number>;
// }) => {
//   const stylez = useAnimatedStyle(() => {
//     return {
//       borderWidth: 4,
//       borderColor: interpolateColor(
//         scrollX.value,
//         [index - 1, index, index + 1],
//         ['transparent', 'white', 'transparent'],
//       ),
//       transform: [
//         {
//           translateY: interpolate(
//             scrollX?.value || 0,
//             [index - 1, index, index + 1],
//             [_itemSize / 3, 0, _itemSize / 3],
//           ),
//         },
//       ],
//     };
//   });
//   return (
//     <Animated.View
//       style={[
//         { width: _itemSize, height: _itemSize, borderRadius: _itemSize / 2 },
//         stylez,
//       ]}
//     >
//       <Image
//         source={{ uri: imageUri }}
//         style={{
//           flex: 1,
//           borderRadius: _itemSize / 2,
//         }}
//       />
//     </Animated.View>
//   );
// };

import { View, Text, Image, Dimensions, StyleSheet } from 'react-native';
import React from 'react';
import Animated, {
  clamp,
  FadeIn,
  FadeOut,
  interpolate,
  SharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { SafeAreaView } from 'react-native-safe-area-context';

// Sizing constants for the carousel
const { width } = Dimensions.get('screen');
const _itemSize = width * 0.24; // Each thumbnail is 24% of screen width
const _spacingSize = 12; // Space between thumbnails
const _itemTotalSize = _itemSize + _spacingSize; // Total size including spacing

type Props = {};

/**
 * CircularSlider - Interactive image carousel component
 * Features:
 * - Horizontal scrolling circular thumbnails at bottom
 * - Full-screen background image that changes with scroll
 * - Smooth fade transitions between background images
 * - Snap-to-position scrolling for precise selection
 * - Animated vertical translation effect on thumbnails (creates arc effect)
 */
export const CircularSlider = (props: Props) => {
  // Shared value tracking the scroll position (normalized to item index)
  const scrollX = useSharedValue(0);

  // Active image index (state for background image key)
  const [activeIndex, setActiveIndex] = React.useState(0);

  /**
   * Scroll handler that updates scrollX and active index
   * - Converts scroll offset to item index
   * - Clamps value to valid range
   * - Updates activeIndex on React thread when changed
   */
  const onScrolll = useAnimatedScrollHandler(e => {
    // Convert pixel offset to item index (0-based, can be fractional)
    scrollX.value = clamp(
      e.contentOffset.x / _itemTotalSize,
      0,
      images.length - 1,
    );

    // Round to nearest integer for active index
    const newActiveIndex = Math.round(scrollX.value);

    // Update React state on JS thread (scheduleOnRN schedules work on React thread)
    if (activeIndex !== newActiveIndex) {
      scheduleOnRN(setActiveIndex, newActiveIndex);
    }
  });

  return (
    <SafeAreaView
      style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'black' }}
    >
      {/* Full-screen background image layer */}
      <View style={{ ...StyleSheet.absoluteFill }}>
        <Animated.Image
          exiting={FadeOut.duration(500)} // Fade out when changing
          entering={FadeIn.duration(500)} // Fade in new image
          key={`index-${activeIndex}`} // Key change triggers animation
          source={{ uri: images[activeIndex] }}
          style={{ flex: 1 }}
        />
      </View>

      {/* Horizontal scrolling carousel at bottom */}
      <Animated.FlatList
        data={images}
        keyExtractor={(_, index) => String(index)}
        contentContainerStyle={{
          paddingHorizontal: (width - _itemSize) / 2, // Center first/last items
          gap: _spacingSize,
        }}
        horizontal
        style={{
          flexGrow: 0,
          height: _itemSize * 2, // Extra height for animated vertical movement
        }}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <CarouselItem item={item} index={index} x={scrollX} />
        )}
        onScroll={onScrolll}
        scrollEventThrottle={1000 / 60} // 60fps scroll updates
        snapToInterval={_itemTotalSize} // Snap to each item
        decelerationRate={'fast'} // Quick snap behavior
      />
    </SafeAreaView>
  );
};

/**
 * CarouselItem - Individual thumbnail in the carousel
 * Creates an arc/circular effect by animating vertical position
 * based on distance from center
 *
 * @param index - Position of this item in the list
 * @param item - Image URL to display
 * @param x - Shared scroll position value (item index, can be fractional)
 */
const CarouselItem = ({
  index,
  item,
  x,
}: {
  index: number;
  item: string;
  x: SharedValue<number>;
}) => {
  // Animated style that creates the arc effect
  const stylez = useAnimatedStyle(() => {
    return {
      transform: [
        {
          // Vertical translation based on distance from center
          // - Center item (index matches x): translateY = 0 (highest point)
          // - Adjacent items: translateY = _itemSize/3 (lower)
          // - Creates smooth arc as you scroll
          translateY: interpolate(
            x?.value || 0,
            [index - 1, index, index + 1], // Input range: prev, current, next
            [_itemSize / 3, 0, _itemSize / 3], // Output range: down, center, down
          ),
        },
      ],
    };
  });

  return (
    <Animated.View
      style={[
        {
          width: _itemSize,
          height: _itemSize,
          borderRadius: _itemSize / 2, // Make circular
        },
        stylez, // Apply animated translation
      ]}
    >
      <Image
        style={{
          width: _itemSize,
          height: _itemSize,
          borderRadius: _itemSize / 2, // Match container border radius
        }}
        source={{ uri: item }}
      />
    </Animated.View>
  );
};
