import React, { useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  TextInput,
  Image,
  Share,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import RenderHTML from "react-native-render-html";
import { Link } from "expo-router";

import { Colors } from "@/lib/constants/Colors";
import { Post, EReaction } from "@/lib/types";
import { trimText } from "@/lib/util/stringUtil";
import { formatTime } from "../util/time";
import ThemedButton from "../ThemedButton";
import { ThemedText } from "../ThemedText";
import { ContainerType, ThemedView } from "../ThemedView";
import HorizontalSeparator from "../shared/HorizontalSeparator";

import {
  IconBookmark,
  IconComment,
  IconDislike,
  IconLike,
  IconShare,
  IconViewMore,
} from "../icons/shared";

import useAddReaction from "@/lib/net/queries/actions/useAddReaction";
import useDeleteReaction from "@/lib/net/queries/actions/useDeleteReaction";
import useAddComment from "@/lib/net/queries/actions/useAddComment";
import { useGetUserByAddress, useGetUserById } from "@/lib/net/queries/profile";
import { KEY_ID, storage } from "@/lib/store";
import { formatBnBalance, getOriginBadgeStyle } from "@/lib/util";
import { NETWORKS_DETAILS } from "@/lib/constants/networks";
import { groupBeneficiariesByAsset } from "@/lib/util/groupBenificaryByAsset";
import { ENetwork, EPostOrigin } from "@/lib/types/post";
import VerticalSeprator from "../shared/VerticalSeprator";

type PostCardProps = {
  post: Post;
  withoutViewMore?: boolean;
  withoutActions?: boolean;
  containerType?: ContainerType;
  descriptionLength?: number;
  children?: React.ReactNode;
};

const formatOriginText = (text: string): string => {
  return text.replace(/([A-Z])/g, " $1").trim();
};

const defaultAvatarUri = "@/assets/images/profile/default-avatar.png";

function PostCard({
  post,
  withoutViewMore = false,
  withoutActions = false,
  containerType = "container",
  descriptionLength = 300,
  children,
}: PostCardProps) {
  const [isLiked, setIsLiked] = useState<boolean>(
    post.userReaction?.reaction === EReaction.like
  );
  const [isDisliked, setIsDisliked] = useState<boolean>(
    post.userReaction?.reaction === EReaction.dislike
  );
  const [likes, setLikes] = useState<number>(post.metrics.reactions.like);
  const [dislikes, setDislikes] = useState<number>(
    post.metrics.reactions.dislike
  );
  const [comments, setComments] = useState<number>(post.metrics.comments);
  const [showCommentBox, setShowCommentBox] = useState<boolean>(false);
  const [commentText, setCommentText] = useState<string>("");

  const { mutate: addReaction } = useAddReaction();
  const { mutate: deleteReaction } = useDeleteReaction();
  const { mutate: addComment } = useAddComment();

  const id = storage.getString(KEY_ID);
  const {
    data: userInfo,
    isLoading: isUserInfoLoading,
    isError: isUserInfoError,
  } = useGetUserById(id || "");

  const { data: proposerInfo } = useGetUserByAddress(
    post.onChainInfo?.proposer || ""
  );

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

  const handleSubmitComment = () => {
    if (!commentText.trim()) return;
    addComment({
      pathParams: {
        proposalType: post.proposalType,
        postIndexOrHash: post.index,
      },
      bodyParams: { content: commentText },
    });
    setCommentText("");
    setShowCommentBox(false);
    setComments((prev) => prev + 1);
  };

  const handleShare = async () => {
    try {
      // Update the share URL as needed for your app
      const shareUrl = `https://example.com/proposal/${post.index}?proposalType=${post.proposalType}`;
      const message = `Check out this post: "${post.title}"\n\nRead more: ${shareUrl}`;
      await Share.share({ message });
    } catch (error: any) {
      console.error("Error sharing:", error.message);
    }
  };

  return (
    <ThemedView style={styles.container} type={containerType}>
      <PostHeader index={post.index} status={post.onChainInfo?.status} post={post} />
      <HorizontalSeparator />
      <PostDetails
        title={post.title}
        htmlContent={post.htmlContent}
        createdAt={post.onChainInfo?.createdAt}
        proposerUsername={proposerInfo?.username || "User"}
        descriptionLength={descriptionLength}
        origin={post.onChainInfo?.origin}
      />
      {/* Render children between read-more and actions */}
      {children}
      <HorizontalSeparator />
      {!withoutActions && (
        <PostActions
          isLiked={isLiked}
          isDisliked={isDisliked}
          likes={likes}
          dislikes={dislikes}
          comments={comments}
          onLike={handleLike}
          onDislike={handleDislike}
          onToggleComment={() => setShowCommentBox((prev) => !prev)}
          onBookmark={toggleBookmark}
          onShare={handleShare}
        />
      )}
      {showCommentBox && (
        <CommentBox
          commentText={commentText}
          onChangeCommentText={setCommentText}
          onSubmitComment={handleSubmitComment}
          userInfo={userInfo}
          isUserInfoLoading={isUserInfoLoading}
          isUserInfoError={isUserInfoError}
        />
      )}
      {!withoutViewMore && (
        <ViewMoreButton index={post.index} proposalType={post.proposalType} />
      )}
    </ThemedView>
  );
}

function PostHeader({
  index,
  status,
  post,
}: {
  index: number | string;
  status?: string;
  post: Post;
}) {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.flexRowGap4}>
        <ThemedText type="bodySmall3" style={styles.idText}>
          #{index}
        </ThemedText>
        {status && (
          <ThemedText type="bodySmall3" style={styles.statusText}>
            {status.toUpperCase()}
          </ThemedText>
        )}
      </View>
      {post.onChainInfo?.beneficiaries?.length !== 0 && (
        <ThemedText
          type="bodySmall"
          style={{
            backgroundColor: "#FFE3BB",
            paddingHorizontal: 4,
            borderRadius: 4,
            color: "#000",
          }}
        >
          {Object.entries(
            groupBeneficiariesByAsset(
              post.onChainInfo?.beneficiaries,
              post.network as ENetwork
            )
          )
            .map(([assetId, amount]) =>
              formatBnBalance(
                amount.toString(),
                {
                  withUnit: true,
                  numberAfterComma: 2,
                  compactNotation: true,
                },
                ENetwork.POLKADOT,
                assetId === NETWORKS_DETAILS[`${ENetwork.POLKADOT}`].tokenSymbol
                  ? null
                  : assetId
              )
            )
            .join(", ")}
        </ThemedText>
      )}
    </View>
  );
}

function TimeDisplay({ createdAt }: { createdAt: string }) {
  const readableTime = formatTime(new Date(createdAt));
  return <ThemedText type="bodySmall3">{readableTime}</ThemedText>;
}

interface PostDetailsProps {
  title: string;
  htmlContent: string;
  createdAt?: string;
  proposerUsername: string;
  descriptionLength?: number;
  origin?: EPostOrigin;
}

function PostDetails({
  title,
  htmlContent,
  createdAt,
  proposerUsername,
  descriptionLength = 300,
  origin,
}: PostDetailsProps) {
  const [isReadMoreClicked, setIsReadMoreClicked] = useState(false);
  const [postDescriptionHTML, setPostDescriptionHTML] = useState(
    trimText(htmlContent, descriptionLength)
  );

  const toggleReadMore = () => {
    if (isReadMoreClicked) {
      setPostDescriptionHTML(trimText(htmlContent, descriptionLength));
    } else {
      setPostDescriptionHTML(htmlContent);
    }
    setIsReadMoreClicked(!isReadMoreClicked);
  };

  return (
    <View style={styles.detailsContainer}>
      <View style={{ flexDirection: "row", gap: 12, alignItems: "center" }}>
        <ThemedText type="bodySmall3">
          {proposerUsername || "User"}
        </ThemedText>

        {origin && <OriginBadge origin={origin} />}
        <View style={{ width: 1, height: "100%", backgroundColor: "#383838" }} />
        {createdAt && (
          <View style={styles.flexRowGap4}>
            <TimeDisplay createdAt={createdAt} />
          </View>
        )}
      </View>
      <ThemedText type="bodyMedium2" style={styles.titleText}>
        {trimText(title, 80)}
      </ThemedText>
      <RenderHTML
        source={{ html: postDescriptionHTML }}
        baseStyle={{ color: Colors.dark.text }}
        contentWidth={300}
      />
      {htmlContent.length > descriptionLength && (
        <TouchableOpacity onPress={toggleReadMore}>
          <View style={styles.readMoreContainer}>
            <ThemedText type="bodySmall" style={styles.readMore}>
              Read {isReadMoreClicked ? "Less" : "More"}
            </ThemedText>
            <Ionicons
              name={isReadMoreClicked ? "chevron-up" : "chevron-down"}
              size={16}
              color={Colors.dark.accent}
            />
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
}

function OriginBadge({ origin }: { origin: EPostOrigin }) {
  return (
    <ThemedText
      type="bodySmall3"
      style={[styles.originBadge, getOriginBadgeStyle(origin)]}
    >
      {formatOriginText(origin)}
    </ThemedText>
  );
}

interface PostActionsProps {
  isLiked: boolean;
  isDisliked: boolean;
  likes: number;
  dislikes: number;
  comments: number;
  onLike: () => void;
  onDislike: () => void;
  onToggleComment: () => void;
  onBookmark: () => void;
  onShare: () => void;
}

function PostActions({
  isLiked,
  isDisliked,
  likes,
  dislikes,
  comments,
  onLike,
  onDislike,
  onToggleComment,
  onBookmark,
  onShare,
}: PostActionsProps) {
  return (
    <View style={styles.actionsContainer}>
      <View style={styles.leftActions}>
        <ThemedButton onPress={onLike} style={styles.iconButton}>
          <IconLike color="white" filled={isLiked} />
          <ThemedText type="bodySmall">{likes}</ThemedText>
        </ThemedButton>
        <ThemedButton onPress={onDislike} style={styles.iconButton}>
          <IconDislike color="white" filled={isDisliked} />
          <ThemedText type="bodySmall">{dislikes}</ThemedText>
        </ThemedButton>
        <ThemedButton onPress={onToggleComment} style={styles.iconButton}>
          <IconComment color="white" filled={false} />
          <ThemedText type="bodySmall">{comments}</ThemedText>
        </ThemedButton>
      </View>
      <View style={styles.rightActions}>
        {/* <ThemedButton onPress={onBookmark} style={styles.iconButton}>
          <IconBookmark color="white" filled={false} />
        </ThemedButton> */}
        <ThemedButton onPress={onShare} style={styles.iconButton}>
          <IconShare color="white" />
        </ThemedButton>
      </View>
    </View>
  );
}

function CommentBox({
  commentText,
  onChangeCommentText,
  onSubmitComment,
  userInfo,
  isUserInfoLoading,
  isUserInfoError,
}: {
  commentText: string;
  onChangeCommentText: (text: string) => void;
  onSubmitComment: () => void;
  userInfo: any;
  isUserInfoLoading: boolean;
  isUserInfoError: boolean;
}) {
  return (
    <View style={styles.commentBox}>
      {isUserInfoLoading ||
      isUserInfoError ||
      !userInfo?.profileDetails?.image ? (
        <Image source={require(defaultAvatarUri)} style={styles.avatar} />
      ) : (
        <Image
          source={{ uri: userInfo.profileDetails.image }}
          style={styles.avatar}
        />
      )}
      <TextInput
        style={styles.commentInput}
        placeholder="Add a comment"
        placeholderTextColor="#FFFFFF"
        value={commentText}
        onChangeText={onChangeCommentText}
      />
      <ThemedButton onPress={onSubmitComment} style={styles.submitButton}>
        <ThemedText type="bodySmall" style={{ color: "white" }}>
          Post
        </ThemedText>
      </ThemedButton>
    </View>
  );
}

interface ViewMoreButtonProps {
  index: number | string;
  proposalType: string;
}

function ViewMoreButton({ index, proposalType }: ViewMoreButtonProps) {
  return (
    <Link href={`/proposal/${index}?proposalType=${proposalType}`} asChild>
      <ThemedButton bordered style={styles.viewMoreButton}>
        <ThemedText type="bodySmall" style={styles.viewMoreText}>
          View More
        </ThemedText>
        <IconViewMore />
      </ThemedButton>
    </Link>
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
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  detailsContainer: {
    flexDirection: "column",
    gap: 8,
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  leftActions: {
    flexDirection: "row",
    gap: 8,
  },
  rightActions: {
    flexDirection: "row",
    gap: 8,
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
  flexRowGap4: {
    flexDirection: "row",
    gap: 4,
  },
  flexRowJustifySpaceBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  titleText: {
    letterSpacing: 1,
  },
  readMore: {
    color: Colors.dark.accent,
  },
  readMoreContainer: {
    flexDirection: "row",
    gap: 4,
  },
  commentBox: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.dark.stroke,
    borderRadius: 24,
  },
  avatar: {
    width: 25,
    height: 25,
    borderRadius: 16,
    backgroundColor: Colors.dark.stroke,
    margin: 4,
    marginRight: 8,
  },
  commentInput: {
    flex: 1,
    paddingVertical: 4,
    paddingHorizontal: 8,
    fontSize: 14,
    color: Colors.dark.text,
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
  submitButton: {
    paddingHorizontal: 15,
    paddingVertical: 4,
    borderRadius: 0,
    height: "100%",
    backgroundColor: Colors.dark.accent,
  },
  viewMoreButton: {
    borderRadius: 5,
    padding: 0,
    height: 40,
    flexDirection: "row",
    gap: 10,
  },
  viewMoreText: {
    color: Colors.dark.accent,
  },
  originBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
});

export default PostCard;
