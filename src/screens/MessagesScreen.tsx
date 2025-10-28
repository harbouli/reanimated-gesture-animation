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

const chatSpeed = {
  slow: [1000, 500],
  medium: [500, 500],
  fast: [250, 250],
  'insane 🚀': [50, 100],
};

export const MessagesScreen = (): React.JSX.Element => {
  const [messages, setMessages] = useState<ChatItemType[]>(
    [...Array(20).keys()].map(generateNewMessage),
  );

  const timeout = useRef<number | null>(null);
  const [speed, setSpeed] = useState<keyof typeof chatSpeed>('slow');
  const isDarkMode = useColorScheme() === 'dark';

  const generateData = () => {
    if (timeout.current) {
      clearTimeout(timeout.current);
    }
    const selectedSpeed = chatSpeed[speed];
    const timer = Math.random() * selectedSpeed[0] + selectedSpeed[1];

    timeout.current = setTimeout(() => {
      setMessages(data => {
        return [generateNewMessage(), ...data];
      });
      generateData();
    }, timer);
  };

  useEffect(() => {
    generateData();

    // Cleanup on unmount
    return () => {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
    };
  }, [speed]);

  const speedOptions = Object.keys(chatSpeed) as Array<keyof typeof chatSpeed>;

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? '#1a1a1a' : '#fff' },
      ]}
      edges={['bottom']}
    >
      <TikTokMessages
        data={messages}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <ChatItem item={item} isSender={false} />}
      />
      <View style={styles.tabContainer}>
        {speedOptions.map(option => (
          <TouchableOpacity
            key={option}
            style={[
              styles.tab,
              speed === option && styles.activeTab,
              {
                backgroundColor:
                  speed === option
                    ? isDarkMode
                      ? '#4a4a4a'
                      : '#007AFF'
                    : isDarkMode
                    ? '#2a2a2a'
                    : '#f0f0f0',
              },
            ]}
            onPress={() => setSpeed(option)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.tabText,
                speed === option && styles.activeTabText,
                {
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 8,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  activeTab: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  activeTabText: {
    fontWeight: '700',
  },
});
