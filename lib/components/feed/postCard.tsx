// PostCard.tsx
import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/lib/constants/Colors";
import { Post, EReaction, EProposalType } from "@/lib/types";
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
import useAddReaction from "@/lib/net/queries/actions/useAddReaction";
import useDeleteReaction from "@/lib/net/queries/actions/useDeleteReaction";

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
  // Initialize reaction state based on the post data
  const [isLiked, setIsLiked] = useState<boolean>(post.userReaction?.reaction === EReaction.like);
  const [isDisliked, setIsDisliked] = useState<boolean>(post.userReaction?.reaction === EReaction.dislike);
  const [likes, setLikes] = useState<number>(post.metrics.reactions.like);
  const [dislikes, setDislikes] = useState<number>(post.metrics.reactions.dislike);
  const [comments] = useState<number>(post.metrics.comments);

  const { mutate: addReaction, error: addReactionError, isPending: isAddReactionPending } = useAddReaction();
  const { mutate: deleteReaction, error: deleteReactionError, isPending: isDeleteReactionPending } = useDeleteReaction();
  const handleLike = () => {

    if (isLiked) {
      deleteReaction({
        pathParams: {
          proposalType: post.proposalType,
          postIndexOrHash: post.index,
          reactionId: post.userReaction?.id || "",
        },
      });
      setLikes((prev) => prev - 1);
      setIsLiked(false);
    } else {
      addReaction({
        pathParams: {
          proposalType: post.proposalType,
          postIndexOrHash: post.index,
        },
        bodyParams: { reaction: EReaction.like },
      });
      setLikes((prev) => prev + 1);
      setIsLiked(true);

      if (isDisliked) {
        setDislikes((prev) => prev - 1);
        setIsDisliked(false);
      }
    }
  };

  const handleDislike = () => {
    if (isDisliked) {
      deleteReaction({
        pathParams: {
          proposalType: post.proposalType,
          postIndexOrHash: post.index,
          reactionId: post.userReaction?.id || "",
        },
      });
      setDislikes((prev) => prev - 1);
      setIsDisliked(false);
    } else {
      addReaction({
        pathParams: {
          proposalType: post.proposalType,
          postIndexOrHash: post.index,
        },
        bodyParams: { reaction: EReaction.dislike },
      });
      setDislikes((prev) => prev + 1);
      setIsDisliked(true);

      if (isLiked) {
        setLikes((prev) => prev - 1);
        setIsLiked(false);
      }
    }
  };


  const toggleBookmark = () => {
    // Implement bookmark toggle if needed
  };

  const trimText = (text: string, limit: number) =>
    text.length > limit ? text.slice(0, limit).trim() + "..." : text;

  // FIXME: Restore this functionality?
  //  const connectedLikesText = "";
  // post.connectedLikes.length > 1
  //   ? `${props.connectedLikes[0].userName} & ${props.connectedLikes.length - 1} others liked the post`
  //   : props.connectedLikes.length === 1
  //   ? `${props.connectedLikes[0].userName} liked the post`
  //   : "";

  return (
    <ThemedView style={styles.container} type={containerType}>
      {/* Header Section */}
      <View style={styles.flexRowJustifySpaceBetween}>
        <View style={styles.flexRowGap4}>
          <ThemedText type="bodySmall3" style={styles.idText}>
            #{post.index}
          </ThemedText>
          {post.onChainInfo?.status && (
            <ThemedText type="bodySmall3" style={styles.statusText}>
              {post.onChainInfo.status.toUpperCase()}
            </ThemedText>
          )}
        </View>
        <View style={styles.flexRowGap4}>
          <ThemedText type="bodyMedium1">2500DDOT</ThemedText>
          <ThemedText type="bodySmall3" style={styles.currencyText}>
            ~$36k
          </ThemedText>
        </View>
      </View>

      <HorizontalSeparator />

      {/* Post Details */}
      <View style={{ flexDirection: "column", gap: 8 }}>
        <View style={styles.flexRowJustifySpaceBetween}>
          <View style={styles.flexRowGap4}>
            <ThemedText type="bodySmall3">
              {post.onChainInfo?.proposer}
            </ThemedText>
          </View>
          {post.onChainInfo?.createdAt && (
            <View style={styles.flexRowGap4}>
              <TimeDisplay createdAt={post.onChainInfo.createdAt} />
            </View>
          )}
        </View>

        <ThemedText type="bodyMedium2" style={{ letterSpacing: 1 }}>
          {trimText(post.title, 80)}
        </ThemedText>

        <RenderHTML
          source={{ html: trimText(post.htmlContent, 200) }}
          baseStyle={{ color: Colors.dark.text }}
          contentWidth={300}
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

      <HorizontalSeparator />

      {/* Action Icons */}
      <View style={styles.flexRowJustifySpaceBetween}>
        <View style={{ flexDirection: "row", gap: 8 }}>
          <ThemedButton onPress={handleLike} style={styles.iconButton}>
            <IconLike color="white" filled={isLiked} />
            <ThemedText type="bodySmall">{likes}</ThemedText>
          </ThemedButton>

          <ThemedButton onPress={handleDislike} style={[styles.iconButton]}>
            <IconDislike color={"white"} filled={isDisliked} />
            <ThemedText type="bodySmall">{dislikes}</ThemedText>
          </ThemedButton>

          <ThemedButton style={styles.iconButton}>
            <IconComment color="white" filled={false} />
            <ThemedText type="bodySmall">{comments}</ThemedText>
          </ThemedButton>
        </View>

        <View style={{ flexDirection: "row", gap: 8 }}>
          <ThemedButton onPress={toggleBookmark} style={styles.iconButton}>
            <IconBookmark color="white" filled={false} />
          </ThemedButton>
          <ThemedButton style={styles.iconButton}>
            <IconShare color="white" />
          </ThemedButton>
        </View>
      </View>

      {/* View More Button */}
      {!withoutViewMore && (
        <Link
          href={`/proposal/${post.index}?proposalType=${post.proposalType}`}
          asChild
        >
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
