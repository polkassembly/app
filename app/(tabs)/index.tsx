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
} from "@/lib/components/Profile";
import { ThemedView } from "@/lib/components/ThemedView";
import { Colors } from "@/lib/constants/Colors";
import { useActivityFeed } from "@/lib/net/queries/post/useActivityFeed";
import React, { PropsWithChildren, useState, useEffect } from "react";
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
import { EmptyViewWithTabBarHeight } from "@/lib/components/util";
import { usePathname, useRouter } from "expo-router";
import { Post } from "@/lib/types";
import { ThemedText } from "@/lib/components/ThemedText";
import { useThemeColor } from "@/lib/hooks/useThemeColor";
import { ProposalCard, ProposalCardSkeleton } from "@/lib/components/proposal/ProposalCard";
import { useProfileStore } from "@/lib/store/profileStore";

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
    flex: 1
  },
  scrollView: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
});

function Profile() {
  const userProfile = useProfileStore((state) => state.profile);

  if (!userProfile) {
    return <ProfileSkeleton />;
  }

  return (
    <ThemedView type="background" style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={{ gap: 20 }}>
        <ProfileHeader username={userProfile.username} avatarUrl={userProfile.profileDetails?.image} />
        <PointsView points={userProfile.profileScore} />
        <Badges />
        <Actions />
        <Activity userId={String(userProfile.id)} />
        <EmptyViewWithTabBarHeight />
      </ScrollView>
    </ThemedView>
  );
}

const ProfileSkeleton = () => (
  <ThemedView type="background" style={{ gap: 20, marginTop: 16, paddingHorizontal: 16 }}>
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
  } = useActivityFeed({ limit: 10 });

  const renderItem = ({ item }: { item: Post }) => <ProposalCard post={item} />;
  const accentColor = useThemeColor({}, "accent");

  if (isLoading || !data) {
    return (
      <ThemedView type="background" style={[styles.container, { justifyContent: "center" }]}>

        <ProposalCardSkeleton />
        <ProposalCardSkeleton />
        <ProposalCardSkeleton />
      </ThemedView>
    );
  }

  return (
    <ThemedView type="background" style={styles.container}>
      <FlatList
        contentContainerStyle={{
          gap: 8,
          paddingInline: 8,
        }}
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
          <EmptyViewWithTabBarHeight>
            {isFetchingNextPage ? <ActivityIndicator size="small" color={accentColor} style={{ marginBottom: 20 }} /> : <ThemedText></ThemedText>}
          </EmptyViewWithTabBarHeight>
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
