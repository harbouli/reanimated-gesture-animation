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
import { MessagesScreen } from './src/screens/MessagesScreen';
import { CircularSliderScreen } from './src/screens/CircularSliderScreen';
import { AnimationSelectionScreen } from './src/screens/AnimationSelectionScreen';
import { RootStackParamList } from './src/types/navigation';

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
            initialRouteName="AnimationSelection"
            screenOptions={{
              headerShown: false,
              contentStyle: {
                backgroundColor: backgroundStyle.backgroundColor,
              },
            }}
          >
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
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default App;
