import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

/**
 * Props for the AnimationSelectionScreen component
 */
type AnimationSelectionScreenProps = {
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    'AnimationSelection'
  >;
};

/**
 * Type definition for individual animation items in the selection menu
 */
type AnimationItem = {
  id: string; // Unique identifier for the animation
  title: string; // Display title
  description: string; // Brief description of the animation
  screen: keyof RootStackParamList; // Target screen to navigate to
};

/**
 * Available animations in the app
 * Each item represents a different React Native Reanimated demo
 */
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
  {
    id: '3',
    title: 'Gesture Playground',
    description: 'Pan, pinch, and rotate gestures on animated box',
    screen: 'GesturePlayground',
  },
  {
    id: '4',
    title: 'Custom Animation',
    description: 'Your workspace for custom animations',
    screen: 'TextAnimation',
  },
  {
    id: '5',
    title: 'Liquid Glass',
    description: 'Liquid glass effect with React Native Skia',
    screen: 'LiquidGlass',
  },
  {
    id: '6',
    title: 'FlatList Animation',
    description: 'Staggered entrance animations for FlatList items',
    screen: 'FlatListAnimation',
  },
  {
    id: '7',
    title: 'Circular Progress Bar',
    description: 'Animated circular progress indicator',
    screen: 'CircularProgressBar',
  },
  {
    id: '8',
    title: 'Circular Playground',
    description: 'Experimental playground for circular animations',
    screen: 'CircularPlayground',
  },
];

/**
 * AnimationSelectionScreen - Main menu for selecting animation demos
 * Displays a list of available React Native Reanimated animations
 * Features:
 * - Dark/light mode support
 * - Card-based navigation to different demo screens
 * - Responsive theming based on system preferences
 */
export const AnimationSelectionScreen = ({
  navigation,
}: AnimationSelectionScreenProps): React.JSX.Element => {
  // Detect system color scheme
  const isDarkMode = useColorScheme() === 'dark';

  /**
   * Handles navigation to the selected animation screen
   * @param screen - The key of the screen to navigate to
   */
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
      {/* Main title */}
      <Text style={[styles.title, { color: isDarkMode ? '#fff' : '#000' }]}>
        Select Animation
      </Text>

      {/* Subtitle instruction */}
      <Text style={[styles.subtitle, { color: isDarkMode ? '#aaa' : '#666' }]}>
        Choose an animation to view
      </Text>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* List of animation cards */}
        <View style={styles.listContainer}>
          {animations.map(animation => (
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
      </ScrollView>
    </SafeAreaView>
  );
};

/**
 * Styles for the AnimationSelectionScreen
 */
const styles = StyleSheet.create({
  container: {
    flex: 1, // Fill entire screen
    padding: 20, // Spacing around content
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8, // Space between title and subtitle
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24, // Space between subtitle and cards
  },
  listContainer: {
    gap: 16, // Vertical spacing between cards
  },
  card: {
    padding: 20, // Internal padding
    borderRadius: 12, // Rounded corners
    borderWidth: 1, // Subtle border
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8, // Space between title and description
  },
  cardDescription: {
    fontSize: 14,
    lineHeight: 20, // Better text readability
  },
});
