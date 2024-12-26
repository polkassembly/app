import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import React, { PropsWithChildren, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, {
  Defs,
  Ellipse,
  RadialGradient,
  Stop,
} from "react-native-svg";
import {
  SceneMap,
  TabBar,
  TabBarIndicator,
  TabView,
} from "react-native-tab-view";
import { Actions, Activity, Badges, PointsView, ProfileHeader } from "@/components/Profile";
import { PostCard } from "@/components/timeline/postCard";

const renderScene = SceneMap({
  profile: Profile,
  timeline: Timeline,
});

const routes = [
  { key: "profile", title: "Profile" },
  { key: "timeline", title: "Timeline" },
];

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
  },

  scrollView: {
    paddingHorizontal: 16,
    marginTop: 16,
    rowGap: 20,
  }
});

function Profile() {
  return (
    <ThemedView type="background" style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={{gap: 20}}>
        <ProfileHeader />

        <PointsView />

        <Badges />

        <Actions />

        <Activity />
      </ScrollView>
    </ThemedView>
  );
}

function Timeline() {
  const posts = [
    {
      id: "260",
      title: "SubWallet Proposes to Build the Web3 Multivera Gateway for Polkad",
      description: "Based on the income to the treasuries, the amounts getting burned and the amounts going to proposals, the treasury can be utilized more : this includes",
      author: "jay_zega",
      status: "published",
      createdAt: "2024-12-25",
      metrics: {
        likes: 16,
        dislikes: 1,
        comments: 1,
      },
      interactions: {
        isBookmarked: true,
        isLiked: true,
        isDisliked: false,
      },
      connectedLikes: [
        { userId: "1", userName: "Amara", likeId: "like1" },
        { userId: "2", userName: "John", likeId: "like2" },
      ],
    },
    {
      id: "214",
      title: "SubWallet Proposes to Build the Web3 Multivera Gateway for Polkad",
      description: "Based on the income to the treasuries, the amounts getting burned and the amounts going to proposals, the treasury can be utilized more : this includes",
      author: "zay_jega",
      status: "published",
      createdAt: "2021-01-01",
      metrics: {
        likes: 12,
        dislikes: 2,
        comments: 5,
      },
      interactions: {
        isBookmarked: false,
        isLiked: false,
        isDisliked: true,
      },
      connectedLikes: [
        { userId: "1", userName: "Amara" },
        { userId: "3", userName: "Sophia" },
        { userId: "2", userName: "Amara" },
        { userId: "4", userName: "Sophia" },
      ],
    },
  ];
  
  return (
    <ThemedView type="background" style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={{gap: 20}}>
        {posts.map((post) => (
          <PostCard key={post.id} {...post} />
        ))}
      </ScrollView>
    </ThemedView>
  );
}

export default function Home() {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);

  const insets = useSafeAreaInsets();

  return (
    <TabView
      style={{
        paddingTop: insets.top,
      }}
      renderTabBar={(props) => (
        <TabViewWrapper>
          <TabBar
            {...props}
            style={{
              height: 52,
              backgroundColor: "#00000000",
            }}
            renderIndicator={(props) => (
              <TabBarIndicator
                {...props}
                width={100}
                style={StyleSheet.compose(props.style, {
                  backgroundColor: Colors.dark.ctaStroke,
                })}
              />
            )}
          />
        </TabViewWrapper>
      )}
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
    />
  );
}

function TabViewWrapper({ children }: PropsWithChildren) {
  return (
    <View style={{ height: 52 }}>
      <Svg
        viewBox="0 0 10 10"
        style={{
          zIndex: -1,
          position: "absolute",
          top: 0,
          width: "100%",
          height: "100%",
        }}
      >
        <Defs>
          <RadialGradient id="grad">
            <Stop offset="0" stopColor={Colors.dark.ctaStroke} stopOpacity={1} />
            <Stop offset="1" stopColor={Colors.dark.ctaStroke} stopOpacity={0} />
          </RadialGradient>
        </Defs>

        <Ellipse cx="5" cy="40" rx="40" ry="40" fill="url(#grad)" />
      </Svg>
      {children}
    </View>
  );
}
