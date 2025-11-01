import React from 'react';
import LoadAssets from '../components/load-assets';
import { channels } from '../__mock__/channles';
import { Channels } from '../components/circular-amimation/channels';

/**
 * CircularPlayground Screen
 * A playground screen for circular animations and interactions
 * Features a black background for better visual contrast
 */
export const CircularPlaygroundScreen = (): React.JSX.Element => {
  return (
    <LoadAssets assets={channels.map(channel => channel.cover)}>
      <Channels {...{ channels }} />
    </LoadAssets>
  );
};
