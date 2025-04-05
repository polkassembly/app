import React from "react";

import { NavigationDarkTheme } from "@/lib/constants/Colors";
import { KEY_ID, storage } from "@/lib/store";
import { useAuthStore } from "@/lib/store/authStore";
import getIdFromToken from "@/lib/util/jwt";
import { ThemeProvider } from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { buildUserByIdQueryKey, getUserById } from "@/lib/net/queries/profile/useGetUserById";
import { buildUserActivityQueryKey, getUserActivity } from "@/lib/net/queries/actions";
import Toast from "react-native-toast-message";
import { useToastConfig } from "@/lib/hooks";
import { AuthModalProvider } from "@/lib/context/authContext";

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
  const toastConfig = useToastConfig();

  // Once fonts are loaded, hide the splash screen.
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
        <Content accessToken={accessToken} />
        <Toast config={toastConfig} />
      </SafeAreaProvider>
    </QueryClientProvider>

  );
}

function Content({ accessToken }: { accessToken: string | null }) {
  // Prefetch user data and activity if user is logged in.
  useEffect(() => {
    const userId = getIdFromToken(accessToken || "")
    if (userId) {
      queryClient.prefetchQuery({
        queryKey: buildUserByIdQueryKey(userId),
        queryFn: () => getUserById(userId),
      });
      queryClient.prefetchQuery({
        queryKey: buildUserActivityQueryKey({ userId: userId }),
        queryFn: () => getUserActivity(userId),
      });
    }
  }, []);

  return (
    <AuthModalProvider>
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
    </AuthModalProvider>
  );
}
