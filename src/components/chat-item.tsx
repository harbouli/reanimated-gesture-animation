import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { ChatItem as ChatItemType } from '../__mock__/chat';

/**
 * Props for the ChatItem component
 */
type Props = {
  item: ChatItemType;  // Chat message data (user info, message text)
  isSender?: boolean;  // If true, displays as sender (right-aligned, blue bubble)
};

/**
 * ChatItem - Displays an individual chat message bubble
 * Supports both sender and receiver layouts:
 * - Receiver: Left-aligned, shows avatar and username, gray bubble
 * - Sender: Right-aligned, no avatar/username, blue bubble
 */
export const ChatItem: React.FC<Props> = ({ item, isSender = false }) => {
  return (
    <View
      style={[
        styles.container,
        isSender ? styles.containerRight : styles.containerLeft,
      ]}
    >
      {/* Avatar only shown for received messages (not sender) */}
      {!isSender && (
        <Image source={{ uri: item.user.avatar }} style={styles.avatar} />
      )}

      {/* Message bubble */}
      <View
        style={[
          styles.bubble,
          isSender ? styles.bubbleRight : styles.bubbleLeft,
        ]}
      >
        {/* Username only shown for received messages */}
        {!isSender && <Text style={styles.username}>{item.user.name}</Text>}

        {/* Message text */}
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </View>
  );
};

/**
 * Styles for the ChatItem component
 */
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',    // Arrange avatar and bubble horizontally
    alignItems: 'flex-end',  // Align items to bottom (avatar aligns with bubble bottom)
    marginVertical: 6,       // Vertical spacing between messages
    paddingHorizontal: 10,   // Horizontal padding from screen edges
  },
  containerLeft: {
    justifyContent: 'flex-start',  // Align to left for received messages
  },
  containerRight: {
    justifyContent: 'flex-end',    // Align to right for sent messages
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,  // Make circular (50% of width/height)
    marginRight: 8,    // Space between avatar and bubble
  },
  bubble: {
    maxWidth: '75%',        // Prevent bubble from taking full width
    borderRadius: 16,       // Rounded corners
    paddingVertical: 8,     // Vertical padding inside bubble
    paddingHorizontal: 12,  // Horizontal padding inside bubble
  },
  bubbleLeft: {
    backgroundColor: '#f1f0f0',  // Light gray for received messages
    borderTopLeftRadius: 0,      // Sharp corner where bubble meets avatar
  },
  bubbleRight: {
    backgroundColor: '#4f93ff',  // Blue for sent messages
    borderTopRightRadius: 0,     // Sharp corner on right side
  },
  username: {
    fontSize: 12,
    color: '#555',       // Gray text
    fontWeight: '600',
    marginBottom: 2,     // Space between username and message
  },
  description: {
    fontSize: 15,
    color: '#000',       // Black text for message content
  },
});
