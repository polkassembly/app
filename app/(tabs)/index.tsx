import React from "react";
import { useThemeColor } from "@/lib/hooks";
import { SafeAreaView } from "react-native-safe-area-context";
import { FeedWithActions } from "@/lib/components/home";
import { HomeHeader } from "@/lib/components/home";

const Home = () => {
  const backgroundColor = useThemeColor({}, "secondaryBackground")
  return (
    <SafeAreaView 
      style={{ flex: 1, backgroundColor }}
      edges={['left', 'right', 'bottom']}
    >
      <HomeHeader />
      <FeedWithActions />
    </SafeAreaView>
  );
}

export default Home;