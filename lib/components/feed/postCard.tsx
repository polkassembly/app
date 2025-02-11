import { Colors } from "@/lib/constants/Colors";
import { Post } from "@/lib/types";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import {
  IconBookmark,
  IconComment,
  IconDislike,
  IconLike,
  IconShare,
  IconViewMore,
} from "../icons/shared";
import ThemedButton from "../ThemedButton";
import { ThemedText } from "../ThemedText";
import { ContainerType, ThemedView } from "../ThemedView";
import RenderHTML from "react-native-render-html";
import { formatTime } from "../util/time";
import { Link } from "expo-router";
import HorizontalSeparator from "../shared/HorizontalSeparator";

type PostCardProps = {
  post: Post;
  withoutViewMore?: boolean;
  containerType?: ContainerType;
};

export function PostCard({
  post,
  withoutViewMore = false,
  containerType = "container",
}: PostCardProps) {
  // FIXME: determine if we have liked this post
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likes, setLikes] = useState(post.metrics.reactions.like);
  const [dislikes, setDislikes] = useState(post.metrics.reactions.dislike);
  const [comments, setComments] = useState(post.metrics.comments);

  const toggleLike = () => {
    setLikes((prev) => (isLiked ? prev - 1 : prev + 1));
    setIsLiked((prev) => !prev);

    if (isDisliked) {
      setIsDisliked(false); // Reset dislike if liked
      setDislikes((prev) => prev - 1);
    }
  };

  const toggleDislike = () => {
    setDislikes((prev) => (isDisliked ? prev - 1 : prev + 1));
    setIsDisliked((prev) => !prev);

    if (isLiked) {
      setIsLiked(false); // Reset like if disliked
      setLikes((prev) => prev - 1);
    }
  };

  const toggleBookmark = () => {
    setIsBookmarked((prev) => !prev);
  };

  const trimText = (text: string, limit: number) =>
    text.length > limit ? text.slice(0, limit).trim() + "..." : text;

  // FIXME: Restore this functionality?
  const connectedLikesText = "";
  // post.connectedLikes.length > 1
  //   ? `${props.connectedLikes[0].userName} & ${props.connectedLikes.length - 1} others liked the post`
  //   : props.connectedLikes.length === 1
  //   ? `${props.connectedLikes[0].userName} liked the post`
  //   : "";

  return (
    <ThemedView style={styles.container} type={containerType}>
      {/* Id, status and currency */}
      <View style={styles.flexRowJustifySpaceBetween}>
        <View style={styles.flexRowGap4}>
          <ThemedText type="bodySmall3" style={styles.idText}>
            #{post.index}
          </ThemedText>
          <ThemedText type="bodySmall3" style={styles.statusText}>
            {post.onChainInfo?.status?.toUpperCase()}
          </ThemedText>
        </View>
        <View style={styles.flexRowGap4}>
          <ThemedText type="bodyMedium1">2500DDOT</ThemedText>
          <ThemedText type="bodySmall3" style={styles.currencyText}>
            ~$36k
          </ThemedText>
        </View>
      </View>

      {/* Horizontal line full width */}
      <HorizontalSeparator />

      <View style={{ flexDirection: "column", gap: 8 }}>
        {/* Post author name and creation time */}
        <View style={styles.flexRowJustifySpaceBetween}>
          <View style={styles.flexRowGap4}>
            <ThemedText type="bodySmall3">
              {post?.onChainInfo?.proposer}
            </ThemedText>
          </View>
          {post?.onChainInfo?.createdAt && (
            <View style={styles.flexRowGap4}>
              <TimeDisplay createdAt={post?.onChainInfo?.createdAt} />
            </View>
          )}
        </View>

        {/* Post title and description */}
        <ThemedText type="bodyMedium2" style={{ letterSpacing: 1 }}>
          {trimText(post.title, 80)}
        </ThemedText>

        <RenderHTML
          source={{ html: trimText(post.htmlContent, 200) }}
          baseStyle={{
            color: Colors.dark.text,
          }}
        />

        <TouchableOpacity>
          <View style={{ flexDirection: "row", gap: 4 }}>
            <ThemedText type="bodySmall" style={styles.readMore}>
              Read More
            </ThemedText>
            <Ionicons
              name="chevron-down"
              size={16}
              color={Colors.dark.accent}
            />
          </View>
        </TouchableOpacity>
      </View>

      {/* Horizontal line full width */}
      <HorizontalSeparator />

      {/* Action icons */}
      <View style={styles.flexRowJustifySpaceBetween}>
        <View style={{ flexDirection: "row", gap: 8 }}>
          <ThemedButton onPress={toggleLike} style={[styles.iconButton]}>
            <IconLike color={"gray"} filled={isLiked} />
            <ThemedText type="bodySmall">{likes}</ThemedText>
          </ThemedButton>

          <ThemedButton onPress={toggleDislike} style={[styles.iconButton]}>
            <IconDislike color={"gray"} filled={isDisliked} />
            <ThemedText type="bodySmall">{dislikes}</ThemedText>
          </ThemedButton>

          <ThemedButton style={[styles.iconButton]}>
            <IconComment color="gray" filled={false} />
            <ThemedText type="bodySmall">{comments}</ThemedText>
          </ThemedButton>
        </View>

        <View style={{ flexDirection: "row", gap: 8 }}>
          <ThemedButton onPress={toggleBookmark} style={[styles.iconButton]}>
            <IconBookmark
              color={isBookmarked ? "gold" : "gray"}
              filled={isBookmarked}
            />
          </ThemedButton>

          <ThemedButton style={[styles.iconButton]}>
            <IconShare color="gray" />
          </ThemedButton>
        </View>
      </View>

      {/* Connected likes */}
      {connectedLikesText && (
        <ThemedText type="bodySmall3" style={styles.connectedLikes}>
          {connectedLikesText}
        </ThemedText>
      )}

      {!withoutViewMore && (
        <Link href={`/proposal/${post.index}`} asChild>
          <ThemedButton
            bordered
            style={{
              borderRadius: 5,
              padding: 0,
              height: 40,
              flexDirection: "row",
              gap: 10,
            }}
          >
            <ThemedText type="bodySmall" style={styles.viewMoreText}>
              View More
            </ThemedText>
            <IconViewMore />
          </ThemedButton>
        </Link>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    padding: 12,
    gap: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.dark.stroke,
    overflow: "hidden",
    flexDirection: "column",
  },
  idText: {
    paddingVertical: 2,
    paddingHorizontal: 4,
    backgroundColor: "#EAEDF0",
    color: "#000",
    borderRadius: 4,
  },
  statusText: {
    paddingVertical: 2,
    paddingHorizontal: 4,
    backgroundColor: "#2ED47A",
    color: "#fff",
    borderRadius: 4,
  },
  currencyText: {
    fontSize: 10,
    fontWeight: "500",
    padding: 2,
    backgroundColor: "#EAEDF0",
    color: "#000",
    borderRadius: 4,
  },
  iconButton: {
    height: 26,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 4,
    backgroundColor: "#1D1D1D",
  },
  readMore: {
    color: Colors.dark.accent,
  },
  viewMoreText: {
    color: Colors.dark.accent,
  },
  connectedLikes: {
    marginTop: 8,
  },
  flexRowGap4: {
    flexDirection: "row",
    gap: 4,
  },
  flexRowJustifySpaceBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

function TimeDisplay({ createdAt }: { createdAt: string }) {
  const readableTime = formatTime(new Date(createdAt));
  return <ThemedText type="bodySmall3">{readableTime}</ThemedText>;
}
