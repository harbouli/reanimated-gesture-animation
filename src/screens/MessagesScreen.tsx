import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TikTokMessages } from '../components/tiktok-messages';
import { ChatItem as ChatItemType, generateNewMessage } from '../__mock__/chat';
import { ChatItem } from '../components/chat-item';

/**
 * Chat speed configuration object
 * Each speed has a tuple [randomRange, baseDelay]:
 * - randomRange: Maximum random time variation in milliseconds
 * - baseDelay: Base delay added to the random time
 * Total delay = (Math.random() * randomRange) + baseDelay
 */
const chatSpeed = {
  slow: [1000, 500],      // 500-1500ms between messages
  medium: [500, 500],     // 500-1000ms between messages
  fast: [250, 250],       // 250-500ms between messages
  'insane 🚀': [50, 100], // 100-150ms between messages
};

/**
 * MessagesScreen component - Displays a TikTok-style live chat interface
 * Features:
 * - Auto-generating messages at configurable speeds
 * - Dark/light mode support
 * - Speed control tabs (slow, medium, fast, insane)
 * - Animated message list with TikTok-style effects
 */
export const MessagesScreen = (): React.JSX.Element => {
  // Initialize messages state with 20 randomly generated messages
  const [messages, setMessages] = useState<ChatItemType[]>(
    [...Array(20).keys()].map(generateNewMessage),
  );

  // Reference to the timeout for message generation (used for cleanup)
  const timeout = useRef<number | null>(null);

  // Current speed setting for message generation
  const [speed, setSpeed] = useState<keyof typeof chatSpeed>('slow');

  // Detect system color scheme for dark/light mode
  const isDarkMode = useColorScheme() === 'dark';

  /**
   * Recursively generates new messages at intervals based on the selected speed
   * - Clears any existing timeout to prevent memory leaks
   * - Calculates a random delay based on the current speed setting
   * - Adds a new message to the beginning of the messages array
   * - Calls itself recursively to continue generating messages
   */
  const generateData = () => {
    // Clear any existing timeout before creating a new one
    if (timeout.current) {
      clearTimeout(timeout.current);
    }

    // Get the speed configuration [randomRange, baseDelay]
    const selectedSpeed = chatSpeed[speed];

    // Calculate random delay: (0 to randomRange) + baseDelay
    const timer = Math.random() * selectedSpeed[0] + selectedSpeed[1];

    // Schedule the next message generation
    timeout.current = setTimeout(() => {
      // Add new message to the beginning of the array
      setMessages(data => {
        return [generateNewMessage(), ...data];
      });

      // Recursively call to generate the next message
      generateData();
    }, timer);
  };

  /**
   * Effect hook that starts message generation and handles cleanup
   * - Runs when component mounts or when speed changes
   * - Starts the message generation loop
   * - Returns cleanup function to clear timeout on unmount or speed change
   */
  useEffect(() => {
    // Start generating messages
    generateData();

    // Cleanup function: clear timeout when component unmounts or speed changes
    return () => {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
    };
  }, [speed]); // Re-run effect when speed changes

  // Get all available speed options as an array of keys
  const speedOptions = Object.keys(chatSpeed) as Array<keyof typeof chatSpeed>;

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? '#1a1a1a' : '#fff' },
      ]}
      edges={['bottom']} // Only apply safe area to bottom edge
    >
      {/* TikTok-style animated message list */}
      <TikTokMessages
        data={messages}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <ChatItem item={item} isSender={false} />}
      />

      {/* Speed control tabs positioned at the bottom */}
      <View style={styles.tabContainer}>
        {speedOptions.map(option => (
          <TouchableOpacity
            key={option}
            style={[
              styles.tab,
              speed === option && styles.activeTab, // Add shadow/elevation when active
              {
                // Dynamic background color based on active state and theme
                backgroundColor:
                  speed === option
                    ? isDarkMode
                      ? '#4a4a4a'  // Active dark mode
                      : '#007AFF'  // Active light mode (iOS blue)
                    : isDarkMode
                    ? '#2a2a2a'    // Inactive dark mode
                    : '#f0f0f0',   // Inactive light mode
              },
            ]}
            onPress={() => setSpeed(option)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.tabText,
                speed === option && styles.activeTabText, // Bolder font when active
                {
                  // Dynamic text color based on active state and theme
                  color:
                    speed === option ? '#fff' : isDarkMode ? '#aaa' : '#666',
                },
              ]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
};

/**
 * Styles for the MessagesScreen component
 */
const styles = StyleSheet.create({
  container: {
    flex: 1, // Fill entire screen
  },
  tabContainer: {
    flexDirection: 'row',    // Arrange tabs horizontally
    padding: 16,             // Spacing around the tabs
    gap: 8,                  // Space between each tab
    position: 'absolute',    // Position over the message list
    bottom: 0,               // Anchor to bottom of screen
    left: 0,
    right: 0,
    zIndex: 1,               // Ensure tabs appear above messages
  },
  tab: {
    flex: 1,                 // Equal width for all tabs
    paddingVertical: 10,     // Vertical padding inside tab
    paddingHorizontal: 16,   // Horizontal padding inside tab
    borderRadius: 8,         // Rounded corners
    alignItems: 'center',    // Center text horizontally
  },
  activeTab: {
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // Elevation for Android
    elevation: 3,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    textTransform: 'capitalize', // Capitalize first letter of each word
  },
  activeTabText: {
    fontWeight: '700', // Bolder text for active tab
  },
});
