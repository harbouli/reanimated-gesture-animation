import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
const uri =
  'https://plus.unsplash.com/premium_photo-1757423357777-eedac57abcbb?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687';
export const LiquidGlassScreen = () => {
  return (
    <View style={styles.container}>
      <View style={{ ...StyleSheet.absoluteFill }}>
        <Image source={{ uri }} style={{ flex: 1 }} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
