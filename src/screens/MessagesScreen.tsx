import React, { useEffect, useRef, useState } from 'react';
import { TikTokMessages } from '../components/tiktok-messages';
import {
  ChatItem as ChatItemType,
  generateNewMessage,
} from '../__mock__/chat';
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

  return (
    <TikTokMessages
      data={messages}
      showsVerticalScrollIndicator={false}
      renderItem={({ item }) => <ChatItem item={item} isSender={false} />}
    />
  );
};
