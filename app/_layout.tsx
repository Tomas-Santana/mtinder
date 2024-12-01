import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/useColorScheme';
import { SafeAreaView, StatusBar, useWindowDimensions } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const queryClient = new QueryClient()

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    "TiltNeon-Regular": require('../assets/fonts/TiltNeon-Regular.ttf'),
  });

  const { height, width } = useWindowDimensions();
  const adjustedHeight = height + 30;

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView>
        <ThemeProvider value={DarkTheme}>
          <StatusBar barStyle="dark-content" backgroundColor="#191919" />
            <Stack screenOptions={{
              headerShown: false,
              animation: "default",
              contentStyle: {
                backgroundColor: "#191919", //change to transparent when we have the bg ready
                height: adjustedHeight
              }
            }}
            >
            </Stack>
        </ThemeProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
      
  );
}
