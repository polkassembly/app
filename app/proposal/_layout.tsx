import { useThemeColor } from "@/lib/hooks";
import { Stack } from "expo-router";

export default function () {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}
