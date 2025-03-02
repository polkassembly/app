import { NavigationDarkTheme } from "@/lib/constants/Colors";
import { useAuthStore } from "@/lib/store/authStore";
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
    PoppinsRegular: require("../assets/fonts/Poppins-Regular.ttf"),
    PoppinsMedium: require("@/assets/fonts/Poppins-Medium.ttf"),
    PoppinsSemiBold: require("@/assets/fonts/Poppins-SemiBold.ttf"),
  });
  const accessToken = useAuthStore((state) => state.accessToken);

  // Once fonts are loaded, hide the splash screen.
  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  // Determine if user needs to log in
  const needsLogin = accessToken === null;

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

  if (needsLogin) {
    return (
      <ThemeProvider value={NavigationDarkTheme}>
        <Stack>
          <Stack.Screen name="auth" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider value={NavigationDarkTheme}>
      <Stack initialRouteName="(tabs)">
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
