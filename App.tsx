/**
 * React Native App with Reanimated v4 and Gesture Handler
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { useColorScheme, StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { OnboardingScreen } from './src/screens/OnboardingScreen';
import { MessagesScreen } from './src/screens/MessagesScreen';
import { CircularSliderScreen } from './src/screens/CircularSliderScreen';
import { AnimationSelectionScreen } from './src/screens/AnimationSelectionScreen';
import { RootStackParamList } from './src/types/navigation';
import { LiveCoding } from './src/screens/LiveCoding';
import { GesturePlayground } from './src/screens/GesturePlayground';
import { TextAnimation } from './src/screens/text-animated-screen';
import { FlatListAnimationScreen } from './src/screens/FlatListAnimationScreen';
import { CircularProgressBarScreen } from './src/screens/CircularProgressBarScreen';
import { CircularPlaygroundScreen } from './src/screens/CircularPlaygroundScreen';

import { Shader1 } from './src/shader/shader-1';

const Stack = createNativeStackNavigator<RootStackParamList>();

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

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
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Onboarding"
            screenOptions={{
              headerShown: false,
              contentStyle: {
                backgroundColor: backgroundStyle.backgroundColor,
              },
            }}
          >
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            <Stack.Screen name="LiveCoding" component={LiveCoding} />
            <Stack.Screen
              name="AnimationSelection"
              component={AnimationSelectionScreen}
            />
            <Stack.Screen
              name="Messages"
              options={{ presentation: 'formSheet' }}
              component={MessagesScreen}
            />
            <Stack.Screen
              name="CircularSlider"
              component={CircularSliderScreen}
            />
            <Stack.Screen
              name="GesturePlayground"
              component={GesturePlayground}
            />
            <Stack.Screen name="TextAnimation" component={TextAnimation} />
            <Stack.Screen name="LiquidGlass" component={Shader1} />
            <Stack.Screen
              name="FlatListAnimation"
              component={FlatListAnimationScreen}
            />
            <Stack.Screen
              name="CircularProgressBar"
              component={CircularProgressBarScreen}
            />
            <Stack.Screen
              name="CircularPlayground"
              component={CircularPlaygroundScreen}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default App;
