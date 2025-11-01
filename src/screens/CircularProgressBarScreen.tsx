import { View, StyleSheet, Text, TextInput } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CircularProgressBar } from '../components/circular-progress-bar';
import { useSharedValue, withSpring } from 'react-native-reanimated';
import { useDebounce } from '../hooks/useDebounce';
import { Sentence } from '../components/sentence';
import { scheduleOnRN } from 'react-native-worklets';
import { useFont } from '@shopify/react-native-skia';

/**
 * CircularProgressBar - Blank screen for circular progress bar animation
 * Ready for implementation
 */

const SPACING = 8;
const GOAL = 9000;
const STROCK = 30;
const RADIUS = 120;
export const CircularProgressBarScreen = () => {
  const [balance, setBalance] = useState<number>(900 * 2 + 500);
  const balanceDebaunce = useDebounce(balance, 500);
  const end = useSharedValue(0);
  const font = useFont(require('../fonts/Euclid Circular B Bold.ttf'), 60);

  const handleProgressChange = (progress: number) => {
    'worklet';
    const newBalance = Math.round(progress * GOAL);

    scheduleOnRN(setBalance, newBalance);
  };

  useEffect(() => {
    const calculatesPercentage = (balanceDebaunce / GOAL) * 100;

    end.value = withSpring(calculatesPercentage / 100, {
      damping: 300,
      stiffness: 800,
    });
  }, [balanceDebaunce]);

  if (!font) {
    return <View />;
  }
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.containerProgress}>
          {font && (
            <CircularProgressBar
              radius={RADIUS}
              font={font}
              strock={STROCK}
              end={end}
              perstage={(balance / GOAL) * 100}
              onProgressChange={handleProgressChange}
            />
          )}
        </View>
        <View>
          <Text style={styles.title}>Balance:</Text>
          <Text style={styles.text}>€{balance.toFixed(2)}</Text>
        </View>

        <View>
          <Text style={styles.title}>Goal:</Text>
          <Text style={styles.text}>€{GOAL.toFixed(2)}</Text>
        </View>
      </View>

      <View style={styles.contentContainer}>
        <TextInput
          placeholder="Enter you balnce"
          placeholderTextColor={'#fff'}
          style={{ width: '100%', color: '#fff' }}
          value={balance.toString()}
          onChangeText={txt =>
            setBalance(isNaN(Number(txt)) ? balance : Number(txt))
          }
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: SPACING * 3,
    paddingHorizontal: SPACING * 3,
    alignItems: 'center',
    backgroundColor: '#0c0b10',
  },
  text: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  title: { fontSize: 32, fontWeight: '300', color: '#dedede' },
  contentContainer: {
    gap: 10,
    width: '100%',
    backgroundColor: '#19191f',
    padding: SPACING * 3,
    borderRadius: SPACING,
  },
  containerProgress: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
