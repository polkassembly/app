import { NavigationDarkTheme } from "@/constants/Colors";
import { KEY_ACCESS_TOKEN, storage } from "@/store";
import { ThemeProvider } from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

export default function RootLayout() {
  const [loaded] = useFonts({
    LilitaOneRegular: require("@/assets/fonts/LilitaOne-Regular.ttf"),
    Recharge: require("@/assets/fonts/Recharge.ttf"),
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

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
      <SafeAreaProvider>
        <Content />
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}

function Content() {
  const router = useRouter();
  
  let needsLogin;
  try {
    needsLogin = storage.getString(KEY_ACCESS_TOKEN) === null;
  }catch (error) {
    console.error("Failed to read access token:", error);
    needsLogin = true;
  }

  useEffect(() => {
    if (needsLogin) {
      router.replace("/auth");
    }
  }, []);

  return (
    <ThemeProvider value={NavigationDarkTheme}>
      <Stack>
        <Stack.Screen name="auth" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
