// import {
//   View,
//   Text,
//   FlatList,
//   Image,
//   Dimensions,
//   StyleSheet,
// } from 'react-native';
// import React from 'react';
// import Animated, {
//   clamp,
//   FadeIn,
//   FadeOut,
//   interpolate,
//   interpolateColor,
//   SharedValue,
//   useAnimatedScrollHandler,
//   useAnimatedStyle,
//   useSharedValue,
// } from 'react-native-reanimated';
// import {  scheduleOnRN } from 'react-native-worklets';
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
const { width } = Dimensions.get('screen');
const _itemSize = width * 0.24;
const _spacingSize = 12;
const _itemTotalSize = _itemSize + _spacingSize;
type Props = {};

export const CircularSlider = (props: Props) => {
  const scrollX = useSharedValue(0);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const onScrolll = useAnimatedScrollHandler(e => {
    scrollX.value = clamp(
      e.contentOffset.x / _itemTotalSize,
      0,
      images.length - 1,
    );
    const newAcrtiveIndex = Math.round(scrollX.value);
    if (activeIndex !== newAcrtiveIndex) {
      scheduleOnRN(setActiveIndex, newAcrtiveIndex);
    }
  });
  return (
    <SafeAreaView
      style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'black' }}
    >
      <View style={{ ...StyleSheet.absoluteFill }}>
        <Animated.Image
          exiting={FadeOut.duration(500)}
          entering={FadeIn.duration(500)}
          key={`index-${activeIndex}`}
          source={{ uri: images[activeIndex] }}
          style={{ flex: 1 }}
        />
      </View>
      <Animated.FlatList
        data={images}
        keyExtractor={(_, index) => String(index)}
        contentContainerStyle={{
          paddingHorizontal: (width - _itemSize) / 2,
          gap: _spacingSize,
        }}
        horizontal
        style={{
          flexGrow: 0,
          height: _itemSize * 2,
        }}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <CarouselItem item={item} index={index} x={scrollX} />
        )}
        onScroll={onScrolll}
        scrollEventThrottle={1000 / 60}
        snapToInterval={_itemTotalSize}
        decelerationRate={'fast'}
      />
    </SafeAreaView>
  );
};

const CarouselItem = ({
  index,
  item,
  x,
}: {
  index: number;
  item: string;
  x: SharedValue<number>;
}) => {
  const stylez = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            x?.value || 0,
            [index - 1, index, index + 1],
            [_itemSize / 3, 0, _itemSize / 3],
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
          borderRadius: _itemSize / 2,
        },
        stylez,
      ]}
    >
      <Image
        style={{
          width: _itemSize,
          height: _itemSize,
          borderRadius: _itemSize / 2,
        }}
        source={{ uri: item }}
      />
    </Animated.View>
  );
};
