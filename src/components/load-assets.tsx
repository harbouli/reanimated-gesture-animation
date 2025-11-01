import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet, Image } from 'react-native';

const usePromiseAll = <T extends unknown>(
  promises: Promise<T>[],
  cb: () => void,
) =>
  useEffect(() => {
    (async () => {
      await Promise.all(promises);
      cb();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

const loadImageAsync = (source: number): Promise<void> => {
  return new Promise((resolve, reject) => {
    Image.getSize(
      Image.resolveAssetSource(source).uri,
      () => resolve(),
      error => reject(error),
    );
  });
};

const useLoadAssets = (assets: number[]): boolean => {
  const [ready, setReady] = useState(false);
  usePromiseAll(
    assets.map(asset => loadImageAsync(asset)),
    () => setReady(true),
  );
  return ready;
};

interface LoadAssetsProps {
  assets: number[];
  children: React.ReactElement;
}

const LoadAssets: React.FC<LoadAssetsProps> = ({ assets, children }) => {
  const ready = useLoadAssets(assets);

  if (!ready) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return children;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
});

export default LoadAssets;
