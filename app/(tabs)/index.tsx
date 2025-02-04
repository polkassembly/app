import {
  Actions,
  Activity,
  Badges,
  PointsView,
  ProfileHeader,
} from "@/components/Profile";
import { ThemedView } from "@/components/ThemedView";
import { PostCard } from "@/components/timeline/postCard";
import { Colors } from "@/constants/Colors";
import useActivityFeed, { Post } from "@/net/queries/useActivityFeed";
import React, { PropsWithChildren, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
  Text,
} from "react-native";
import Svg, { Defs, Ellipse, RadialGradient, Stop } from "react-native-svg";
import {
  SceneMap,
  TabBar,
  TabBarIndicator,
  TabView,
} from "react-native-tab-view";
import { EmptyViewWithTabBarHeight } from "../../components/util";
import { PROFILE_DATA, storage } from "@/store";
import { ProfileData } from "@/util/jwt";

const renderScene = SceneMap({
  profile: Profile,
  feed: Feed,
});

const routes = [
  { key: "profile", title: "Profile" },
  { key: "feed", title: "Feed" },
];

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
  },

  scrollView: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
});

function Profile() {
  const [profile, setProfile] = useState({ username: "", avatarUrl: "", points: 0 });

  useEffect(() => {
    const profileData = storage.getObject(PROFILE_DATA) as ProfileData | null;
    if (profileData) {
      setProfile({
        username: profileData.username,
        avatarUrl: "",
        points: 0
      });
    }
  }, [])
  return (
    <ThemedView type="background" style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={{ gap: 20 }}>
        <ProfileHeader username={profile.username} avatarUrl={profile.avatarUrl} />

        <PointsView />

        <Badges />

        <Actions />

        <Activity />
        <EmptyViewWithTabBarHeight />
      </ScrollView>
    </ThemedView>
  );
}

function Feed() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useActivityFeed({ limit: 10 });

  const renderItem = ({ item }: { item: Post }) => (
    <>
    <PostCard key={item.index} post={item} />
    <Text style={{ color: "white"}}>{item.index}</Text>
    </>
  );

  useEffect(() => {
    if (data) {
      console.log(data.pages.length);
    }
  }, [data]);

  return (
    <ThemedView type="background" style={styles.container}>
      
      <FlatList
        data={data?.pages.flatMap((page) => page.items)} 
        renderItem={renderItem}
        keyExtractor={(item) => item.index.toString()}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isFetchingNextPage ? (
            <ActivityIndicator size="small" style={{ marginVertical: 10 }} />
          ) : null
        }
        ListEmptyComponent={<EmptyViewWithTabBarHeight />}
      />
    </ThemedView>
  );
}

export default function Home() {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);

  return (
    <TabView
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
            <Stop
              offset="0"
              stopColor={Colors.dark.ctaStroke}
              stopOpacity={1}
            />
            <Stop
              offset="1"
              stopColor={Colors.dark.ctaStroke}
              stopOpacity={0}
            />
          </RadialGradient>
        </Defs>

        <Ellipse cx="5" cy="40" rx="40" ry="40" fill="url(#grad)" />
      </Svg>
      {children}
    </View>
  );
}
