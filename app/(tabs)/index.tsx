import {
  Actions,
  ActionsSkeleton,
  Activity,
  ActivitySkeleton,
  Badges,
  BadgesSkeleton,
  PointsView,
  PointsViewSkeleton,
  ProfileHeader,
  ProfileHeaderSkeleton,
} from "@/components/Profile";
import { ThemedView } from "@/components/ThemedView";
import { PostCard } from "@/components/timeline/postCard";
import { Colors } from "@/constants/Colors";
import useActivityFeed, { Post } from "@/net/queries/useActivityFeed";
import React, { PropsWithChildren, useState } from "react";
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
import { KEY_ID, storage } from "@/store";
import { useGetUserById } from "@/net/queries/profile";
import { router } from "expo-router";

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
  const id = storage.getString(KEY_ID);

  if (!id) {
    router.replace("/auth");
    return
  }

  const { data, isLoading, isError } = useGetUserById({ pathParams: { userId: id } });

  // TODO: Handle error state
  if (isError) {
    return (
      <ThemedView type="background" style={styles.container}>
        <Text>Error loading profile</Text>
      </ThemedView>
    );
  }

  if(isLoading || data === undefined) {
    return (
      <ProfileSkeleton />
    );
  }

  return (
    <ThemedView type="background" style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={{ gap: 20 }}>

        <ProfileHeader username={data.username} avatarUrl={data.profileDetails.coverImage} />
        <PointsView points={data.profileScore} />
        <Badges />
        <Actions />
        <Activity userId={id}/>
        <EmptyViewWithTabBarHeight />

      </ScrollView>
    </ThemedView>
  );
}

const ProfileSkeleton = () => (
  <ThemedView type="background" style={{ gap: 20,marginTop: 16, paddingHorizontal: 16 }}>
    <ProfileHeaderSkeleton />
    <PointsViewSkeleton />
    <BadgesSkeleton />
    <ActionsSkeleton />
    <ActivitySkeleton />
  </ThemedView>
);

function Feed() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useActivityFeed({ queryParams: { limit: 10 } });

  const renderItem = ({ item }: { item: Post }) => (
    <>
      <PostCard key={item.index} post={item} />
    </>
  );

  if (isLoading) {
    return (
      <ThemedView type="background" style={styles.container}>
        <ActivityIndicator size="large" style={{ marginTop: 20 }} />
      </ThemedView>
    );
  }

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
