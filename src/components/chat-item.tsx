import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { ChatItem as ChatItemType } from '../__mock__/chat';

type Props = {
  item: ChatItemType;
  isSender?: boolean;
};

export const ChatItem: React.FC<Props> = ({ item, isSender = false }) => {
  return (
    <View
      style={[
        styles.container,
        isSender ? styles.containerRight : styles.containerLeft,
      ]}
    >
      {!isSender && (
        <Image source={{ uri: item.user.avatar }} style={styles.avatar} />
      )}
      <View
        style={[
          styles.bubble,
          isSender ? styles.bubbleRight : styles.bubbleLeft,
        ]}
      >
        {!isSender && <Text style={styles.username}>{item.user.name}</Text>}
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginVertical: 6,
    paddingHorizontal: 10,
  },
  containerLeft: {
    justifyContent: 'flex-start',
  },
  containerRight: {
    justifyContent: 'flex-end',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 8,
  },
  bubble: {
    maxWidth: '75%',
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  bubbleLeft: {
    backgroundColor: '#f1f0f0',
    borderTopLeftRadius: 0,
  },
  bubbleRight: {
    backgroundColor: '#4f93ff',
    borderTopRightRadius: 0,
  },
  username: {
    fontSize: 12,
    color: '#555',
    fontWeight: '600',
    marginBottom: 2,
  },
  description: {
    fontSize: 15,
    color: '#000',
  },
});
