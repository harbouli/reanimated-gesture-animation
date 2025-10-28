import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

type AnimationSelectionScreenProps = {
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    'AnimationSelection'
  >;
};

type AnimationItem = {
  id: string;
  title: string;
  description: string;
  screen: keyof RootStackParamList;
};

const animations: AnimationItem[] = [
  {
    id: '1',
    title: 'TikTok Messages',
    description: 'Animated chat messages with live updates',
    screen: 'Messages',
  },
  {
    id: '2',
    title: 'Circular Slider',
    description: 'Interactive circular image carousel',
    screen: 'CircularSlider',
  },
];

export const AnimationSelectionScreen = ({
  navigation,
}: AnimationSelectionScreenProps): React.JSX.Element => {
  const isDarkMode = useColorScheme() === 'dark';

  const handlePress = (screen: keyof RootStackParamList) => {
    navigation.navigate(screen);
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? '#1a1a1a' : '#fff' },
      ]}
    >
      <Text
        style={[
          styles.title,
          { color: isDarkMode ? '#fff' : '#000' },
        ]}
      >
        Select Animation
      </Text>
      <Text
        style={[
          styles.subtitle,
          { color: isDarkMode ? '#aaa' : '#666' },
        ]}
      >
        Choose an animation to view
      </Text>

      <View style={styles.listContainer}>
        {animations.map((animation) => (
          <TouchableOpacity
            key={animation.id}
            style={[
              styles.card,
              {
                backgroundColor: isDarkMode ? '#2a2a2a' : '#f5f5f5',
                borderColor: isDarkMode ? '#3a3a3a' : '#e0e0e0',
              },
            ]}
            onPress={() => handlePress(animation.screen)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.cardTitle,
                { color: isDarkMode ? '#fff' : '#000' },
              ]}
            >
              {animation.title}
            </Text>
            <Text
              style={[
                styles.cardDescription,
                { color: isDarkMode ? '#aaa' : '#666' },
              ]}
            >
              {animation.description}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
  },
  listContainer: {
    gap: 16,
  },
  card: {
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
});
