import React from 'react';
import { Fill, ImageShader, useImage } from '@shopify/react-native-skia';

export const Pattern = () => {
  const flower = useImage(
    'https://plus.unsplash.com/premium_photo-1757423357777-eedac57abcbb?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687',
  );

  return (
    <Fill>
      <ImageShader image={flower} fit="contain" tx="repeat" ty="repeat" />
    </Fill>
  );
};
