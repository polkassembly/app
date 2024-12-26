import React, { useState } from "react";
import { Colors } from "@/constants/Colors";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { ThemedView } from "../ThemedView";
import { ThemedText } from "../ThemedText";
import ThemedButton from "../ThemedButton";
import { Ionicons } from "@expo/vector-icons";
import { IconBookmark, IconComment, IconDislike, IconLike, IconShare, IconViewMore } from "../icons/shared";

type PostCardProps = {
  id: string;
  title: string;
  description: string;
  author: string;
  status: string;
  createdAt: string;
  metrics: {
    likes: number;
    dislikes: number;
    comments: number;
  };
  interactions: {
    isBookmarked: boolean;
    isLiked: boolean;
    isDisliked: boolean;
  };
  connectedLikes: {
    userId: string;
    userName: string;
    likeId?: string;
    dislikeId?: string;
  }[];
};

export function PostCard(props: PostCardProps) {
  const [isLiked, setIsLiked] = useState(props.interactions.isLiked);
  const [isDisliked, setIsDisliked] = useState(props.interactions.isDisliked);
  const [isBookmarked, setIsBookmarked] = useState(props.interactions.isBookmarked);
  const [likes, setLikes] = useState(props.metrics.likes);
  const [dislikes, setDislikes] = useState(props.metrics.dislikes);
  const [comments, setComments] = useState(props.metrics.comments);

  const toggleLike = () => {
    setLikes((prev) => isLiked ? prev - 1 : prev + 1);
    setIsLiked((prev) => !prev);

    if (isDisliked) {
      setIsDisliked(false); // Reset dislike if liked
      setDislikes((prev) => prev - 1);
    }
  };

  const toggleDislike = () => {
    setDislikes((prev) => isDisliked ? prev - 1 : prev + 1);
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

  const connectedLikesText =
    props.connectedLikes.length > 1
      ? `${props.connectedLikes[0].userName} & ${props.connectedLikes.length - 1} others liked the post`
      : props.connectedLikes.length === 1
      ? `${props.connectedLikes[0].userName} liked the post`
      : "";

  return (
    <ThemedView style={styles.container} type="container">
      {/* Id, status and currency */}
      <View style={styles.flexRowJustifySpaceBetween}>
        <View style={styles.flexRowGap4}>
          <ThemedText type="bodySmall3" style={styles.idText}>
            #{props.id}
          </ThemedText>
          <ThemedText type="bodySmall3" style={styles.statusText}>
            {props.status.toUpperCase()}
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
      <View style={styles.horizontalLine} />

      <View style={{ flexDirection: "column", gap: 8 }}>
        {/* Post author name and creation time */}
        <View style={styles.flexRowJustifySpaceBetween}>
          <View style={styles.flexRowGap4}>
            <ThemedText type="bodySmall3">{props.author}</ThemedText>
          </View>
          <View style={styles.flexRowGap4}>
            <TimeDisplay createdAt={props.createdAt} />
          </View>
        </View>

        {/* Post title and description */}
        <ThemedText type="bodyMedium2" style={{ letterSpacing: 1 }}>
          {trimText(props.title, 80)}
        </ThemedText>
        <ThemedText type="bodyMedium3">{trimText(props.description, 120)}</ThemedText>
        <TouchableOpacity>
					<View style={{ flexDirection: "row", gap: 4, }}>
						<ThemedText type="bodySmall" style={styles.readMore}>
							Read More
						</ThemedText>
						<Ionicons name="chevron-down" size={16} color={Colors.dark.accent} />
					</View>
        </TouchableOpacity>
      </View>

      {/* Horizontal line full width */}
      <View style={styles.horizontalLine} />

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
            <IconBookmark color={isBookmarked ? "gold" : "gray"} filled={isBookmarked} />
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

      <ThemedButton bordered style={{ borderRadius: 5, padding: 0, height: 40, flexDirection: "row", gap: 10 }}>
        <ThemedText type="bodySmall" style={styles.viewMoreText}>
          View More
        </ThemedText>
        <IconViewMore />
      </ThemedButton>
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
  horizontalLine: {
    width: "100%",
    height: 1,
    backgroundColor: "#383838",
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
  const createdDate = new Date(createdAt);
  const currentTime = new Date();
  const diffInMillis = currentTime.getTime() - createdDate.getTime();
  const diffInHours = Math.floor(diffInMillis / (1000 * 60 * 60)); // Convert to hours

  let timeText = '';
  if (diffInMillis < 86400000) { // Less than 24 hours
    timeText = `${diffInHours}hrs ago`;
  } else {
    timeText = createdDate.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  return <ThemedText type="bodySmall3">{timeText}</ThemedText>;
}
