/**
 * React Native App with Reanimated v4 and Gesture Handler
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  useColorScheme,
  StatusBar,
  View,
  StyleSheet,
  Image,
  Text,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { CircularSlider } from './src/components/circuler-slider';
import { TikTokMessages } from './src/components/tiktok-messages';
import {
  ChatItem as ChatItemType,
  generateNewMessage,
} from './src/__mock__/chat';
import { ChatItem } from './src/components/chat-item';
const chatSpeed = {
  slow: [1000, 500],
  medium: [500, 500],
  fast: [250, 250],
  'insane 🚀': [50, 100],
};

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [messages, setMessages] = useState<ChatItemType[]>(
    [...Array(20).keys()].map(generateNewMessage),
  );

  const timeout = useRef<number | null>(null);
  const [speed, setSpeed] = useState<keyof typeof chatSpeed>('insane 🚀');
  const generateData = () => {
    if (timeout.current) {
      clearTimeout(timeout.current);
    }
    const selectedSpeed = chatSpeed[speed];
    const timer = Math.random() * selectedSpeed[0] + selectedSpeed[1];

    // console.log("Calling setData in ", timer);
    timeout.current = setTimeout(() => {
      // console.log("Called for ", timer);
      setMessages(data => {
        return [generateNewMessage(), ...data];
      });
      generateData();
    }, timer);
  };

  useEffect(() => {
    generateData();
  }, [speed]);

  const backgroundStyle = {
    flex: 1,
    backgroundColor: isDarkMode ? '#1a1a1a' : '#fff',
  };

  return (
    <GestureHandlerRootView style={backgroundStyle}>
      <SafeAreaProvider>
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor={backgroundStyle.backgroundColor}
        />
        <TikTokMessages
          data={messages}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => <ChatItem item={item} isSender={false} />}
        />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default App;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  amount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#00C853',
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});
