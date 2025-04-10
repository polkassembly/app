import React, { useState, useEffect } from "react";
import { Animated, View } from "react-native";
import { NavigationDarkTheme } from "@/lib/constants/Colors";
import { useAuthStore } from "@/lib/store/authStore";
import getIdFromToken from "@/lib/util/jwt";
import { ThemeProvider } from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { buildUserByIdQueryKey, getUserById } from "@/lib/net/queries/profile/useGetUserById";
import { buildUserActivityQueryKey, getUserActivity } from "@/lib/net/queries/actions";
import Toast from "react-native-toast-message";
import { useThemeColor, useToastConfig } from "@/lib/hooks";
import { AuthModalProvider } from "@/lib/context/authContext";
import { BottomSheetProvider } from "@/lib/context/bottomSheetContext";
import { CommentSheetProvider } from "@/lib/context/commentContext";
import { activityFeedFunction, buildActivityFeedQueryKey } from "@/lib/net/queries/post";
import { ACTIVITY_FEED_LIMIT } from "@/lib/net/queries/post/useActivityFeed";
import { GestureHandlerRootView } from "react-native-gesture-handler";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

const fonts = {
  PoppinsRegular: require("../assets/fonts/Poppins-Regular.ttf"),
  PoppinsMedium: require("@/assets/fonts/Poppins-Medium.ttf"),
  LilitaOneRegular: require("@/assets/fonts/LilitaOne-Regular.ttf"),
  Recharge: require("@/assets/fonts/Recharge.ttf"),
  SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  PoppinsSemiBold: require("@/assets/fonts/Poppins-SemiBold.ttf"),
};

export default function RootLayout() {
  // Only load essential fonts initially
  const [fontsLoaded] = useFonts(fonts);
  const accessToken = useAuthStore((state) => state.accessToken);
  const toastConfig = useToastConfig();
  const secondaryBackgroundColor = useThemeColor({}, "secondaryBackground");

  // Animation state
  const [appIsReady, setAppIsReady] = useState(false);
  const [splashHidden, setSplashHidden] = useState(false);
  const fadeAnim = useState(new Animated.Value(1))[0];

  // Prepare initial app state
  useEffect(() => {
    async function prepare() {
      try {
        if (fontsLoaded) {
          setAppIsReady(true);
        }
      } catch (e) {
        console.warn(e);
      }
    }

    prepare();
  }, [fontsLoaded]);

  // Handle the splash screen transition
  useEffect(() => {
    if (appIsReady) {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(async () => {
        await SplashScreen.hideAsync();
        setSplashHidden(true);

        prefetchData();
      });
    }
  }, [appIsReady]);

  const prefetchData = () => {
    // Prefetch activities
    queryClient.prefetchInfiniteQuery({
      queryKey: buildActivityFeedQueryKey({ limit: ACTIVITY_FEED_LIMIT }),
      queryFn: ({ pageParam }) => activityFeedFunction({
        params: { limit: ACTIVITY_FEED_LIMIT },
        pageParam: Number(pageParam)
      }),
      initialPageParam: 1
    });

    // Prefetch user data if logged in
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
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        {!splashHidden && (
          <Animated.View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: secondaryBackgroundColor,
              opacity: fadeAnim,
              zIndex: 999,
            }}
          />
        )}
        <SafeAreaProvider>
          <BottomSheetProvider>
            <CommentSheetProvider>
              <Content />
            </CommentSheetProvider>
          </BottomSheetProvider>
          <Toast config={toastConfig} />
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}

function Content() {
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
          <Stack.Screen name="profile" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </AuthModalProvider>
  );
}