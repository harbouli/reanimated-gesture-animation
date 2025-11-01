import {
  View,
  StyleSheet,
  FlatList,
  Text,
  Dimensions,
  Image,
} from 'react-native';
import React from 'react';
import Animated, {
  interpolate,
  SharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { flatListData, FlatListDataType } from '../__mock__/flatlist';
const { height } = Dimensions.get('screen');
const ITEM_SIZE = height * 0.72;
const SPACING = 4;
const TOTAL_SIZE = ITEM_SIZE + SPACING * 2;
const AnimatedListItem: React.FC<{
  item: FlatListDataType;
  index: number;
  scrollY: SharedValue<number>;
}> = ({ item, index, scrollY }) => {
  const stylez = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollY.value,
      [index - 1, index, index + 1],
      [0.7, 1, 0.7],
    ),
    transform: [
      {
        scale: interpolate(
          scrollY.value,
          [index - 1, index, index + 1],
          [0.9, 1, 0.9],
        ),
      },
    ],
  }));

  return (
    <Animated.View
      style={[
        styles.itemContainer,
        { height: ITEM_SIZE, padding: SPACING * 2 },
        stylez,
      ]}
    >
      <Image
        source={{ uri: item.image }}
        blurRadius={50}
        style={{ ...StyleSheet.absoluteFill, borderRadius: SPACING * 2 }}
      />
      <Image
        source={{ uri: item.image }}
        style={{
          height: ITEM_SIZE * 0.4,
          width: '100%',
          flex: 1,
          borderRadius: SPACING * 2,
        }}
      />
      <View style={{ gap: SPACING * 2 }}>
        <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#fff' }}>
          {item.title}
        </Text>
        <Text numberOfLines={3} style={{ color: '#ddd' }}>
          {item.description}
        </Text>
      </View>
      <View
        style={{ flexDirection: 'row', gap: SPACING, alignItems: 'center' }}
      >
        <Image
          style={{ height: 24, aspectRatio: 1, borderRadius: 12 }}
          source={{ uri: item.author.avatar }}
        />
        <Text style={{ color: '#ddd' }}>{item.author.name}</Text>
      </View>
    </Animated.View>
  );
};

export const FlatListAnimationScreen = () => {
  const scrollY = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler(e => {
    console.log(e.contentOffset.y / TOTAL_SIZE);
    scrollY.value = e.contentOffset.y / TOTAL_SIZE;
  });
  return (
    <View style={styles.container}>
      <Animated.FlatList
        data={flatListData}
        renderItem={({ item, index }) => (
          <AnimatedListItem item={item} scrollY={scrollY} index={index} />
        )}
        keyExtractor={(_, index) => String(index)}
        snapToInterval={TOTAL_SIZE}
        contentContainerStyle={styles.listContent}
        scrollEventThrottle={1000 / 60}
        onScroll={onScroll}
        decelerationRate={'fast'}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#6200ee',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#e0d0ff',
  },
  listContent: {
    paddingHorizontal: SPACING * 3,
    paddingVertical: (height - TOTAL_SIZE) / 2,
    gap: SPACING * 2,
  },
  itemContainer: {
    height: ITEM_SIZE,
    flex: 1,
    borderRadius: 8,
    gap: SPACING * 2,
  },
  itemContent: {
    padding: 16,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 14,
    color: '#666',
  },
});
