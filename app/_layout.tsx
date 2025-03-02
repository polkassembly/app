import { NavigationDarkTheme } from "@/lib/constants/Colors";
import { KEY_ACCESS_TOKEN, storage } from "@/lib/store";
import { ThemeProvider } from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
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
    PoppinsRegular: require("../assets/fonts/Poppins-Regular.ttf"),
    PoppinsMedium: require("@/assets/fonts/Poppins-Medium.ttf"),
    PoppinsSemiBold: require("@/assets/fonts/Poppins-SemiBold.ttf"),
  });

  // New state to track authentication status
  const [needsLogin, setNeedsLogin] = useState<boolean | null>(null);

  // Perform the login check early
  useEffect(() => {
    try {
      const token = storage.getString(KEY_ACCESS_TOKEN);
      console.log("Access token:", token);
      setNeedsLogin(token === null);
    } catch (error) {
      console.error("Failed to read access token:", error);
      setNeedsLogin(true);
    }
  }, []);

  // Once fonts and login check are done, hide the splash screen.
  useEffect(() => {
    if (loaded && needsLogin !== null) {
      SplashScreen.hideAsync();
    }
  }, [loaded, needsLogin]);

  if (!loaded || needsLogin === null) {
    return null;
  }

  console.log("needsLogin", needsLogin);
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <Content needsLogin={needsLogin} />
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}

function Content({ needsLogin }: { needsLogin: boolean }) {
  const router = useRouter();

  // Immediately redirect if login is required.
  useEffect(() => {
    if (needsLogin) {
      router.replace("/auth");
    }
  }, [needsLogin, router]);

  // Only render main stack if the user is logged in.
  if (needsLogin) {
    return null;
  }

  return (
    <ThemeProvider value={NavigationDarkTheme}>
      <Stack>
        <Stack.Screen name="auth" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="settings" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
        <Stack.Screen name="proposal" options={{ headerShown: false }} />
        <Stack.Screen name="batch-vote" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
