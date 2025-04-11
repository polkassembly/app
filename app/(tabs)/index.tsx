import React from "react";
import { FeedWithActions } from "@/lib/components/home";
import { HomeHeader } from "@/lib/components/home";
import { ThemedView } from "@/lib/components/shared/View";

const Home = () => {
  return (
    <ThemedView type="secondaryBackground" style = {{ flex: 1}}>
      <HomeHeader />
      <FeedWithActions />
    </ThemedView>
  );
}

export default Home;