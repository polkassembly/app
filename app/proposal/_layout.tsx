import { useThemeColor } from "@/lib/hooks";
import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function () {
  const backgroundColor = useThemeColor({}, "secondaryBackground");
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: backgroundColor }}>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </SafeAreaView>
  );
}
