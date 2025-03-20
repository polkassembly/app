import { EReaction, Post } from "@/lib/types";
import { StyleSheet, View, Image } from "react-native";
import ShareButton from "./ShareButton";
import { IconLike, IconDislike, IconComment, IconBookmark } from "../../icons/shared";
import ThemedButton from "../../ThemedButton";
import { ThemedText } from "../../ThemedText";
import { useEffect, useState } from "react";
import CommentBox from "../../feed/CommentBox";
import Toast from "react-native-toast-message";
import { useProfileStore } from "@/lib/store/profileStore";
import { AddReactionResponse, useAddReaction, useDeleteReaction, useSubscribeProposal, useUnsubscribeProposal } from "@/lib/net/queries/actions";
import { useThemeColor } from "@/lib/hooks";
import { useIsFocused } from "@react-navigation/native";

interface ProposalActionsProps {
  post: Post;
}

// FIXME: This component uses local state for reactions and comments count can be replaced with single source
function ProposalActions({ post }: ProposalActionsProps) {
  const userProfile = useProfileStore((state) => state.profile);
  const currentUserReaction = post.reactions?.find(
    (reaction) => reaction.userId === userProfile?.id
  );

  // Local state seeded with post metrics.
  const [localLikeCount, setLocalLikeCount] = useState(post.metrics.reactions.like);
  const [localDislikeCount, setLocalDislikeCount] = useState(post.metrics.reactions.dislike);
  const [localCommentCount, setLocalCommentCount] = useState(post.metrics.comments);

  // Reaction state holds the current reaction type and its id.
  const [reactionState, setReactionState] = useState<{ reaction: EReaction | null; id?: string }>(() =>
    currentUserReaction
      ? { reaction: currentUserReaction.reaction, id: currentUserReaction.id }
      : { reaction: null, id: undefined }
  );
  const [isUpdatingReaction, setIsUpdatingReaction] = useState(false);
  const [showCommentBox, setShowCommentBox] = useState(false);

  // State to show GIF animation once.
  const [showLikeGif, setShowLikeGif] = useState(false);
  const [showDislikeGif, setShowDislikeGif] = useState(false);

  const [subscribed, setSubscribed] = useState(post.userSubscriptionId ? true : false);
  const [isUpdatingSubscription, setIsUpdatingSubscription] = useState(false);

  const { mutate: addReaction } = useAddReaction();
  const { mutate: deleteReaction } = useDeleteReaction();
  const { mutate: subscribeProposal } = useSubscribeProposal();
  const { mutate: unsubscribeProposal } = useUnsubscribeProposal();

  // Ensure the gif file is correctly imported.
  const LikedGif = require("@/assets/gif/liked-colored.gif");
  const accentColor = useThemeColor({}, "accent");

  // Reset the local state when the screen is focused.
  const isfocused = useIsFocused();
  useEffect(() => {
    if (isfocused) {
      setLocalLikeCount(post.metrics.reactions.like);
      setLocalDislikeCount(post.metrics.reactions.dislike);
      setLocalCommentCount(post.metrics.comments);

      const currentUserReaction = post.reactions?.find(
        (reaction) => reaction.userId === userProfile?.id
      );

      setReactionState(() =>
        currentUserReaction
          ? { reaction: currentUserReaction.reaction, id: currentUserReaction.id }
          : { reaction: null, id: undefined }
      );

      setSubscribed(post.userSubscriptionId ? true : false);
    }
  }, [isfocused]);

  const handleLike = () => {
    if (isUpdatingReaction) return;
    setIsUpdatingReaction(true);
    // Trigger the like gif for 1500ms.
    setShowLikeGif(true);
    setTimeout(() => setShowLikeGif(false), 1500);

    if (reactionState.reaction === EReaction.like) {
      // Remove the like if already set.
      if (!reactionState.id) {
        setIsUpdatingReaction(false);
        return;
      }
      deleteReaction(
        {
          pathParams: {
            proposalType: post.proposalType,
            postIndexOrHash: post.index,
            reactionId: reactionState.id,
          },
        },
        {
          onSuccess: () => {
            setReactionState({ reaction: null, id: undefined });
            setLocalLikeCount((prev) => prev - 1);
          },
          onSettled: () => setIsUpdatingReaction(false),
        }
      );
    } else {
      // Add a like reaction.
      addReaction(
        {
          pathParams: {
            proposalType: post.proposalType,
            postIndexOrHash: post.index,
          },
          bodyParams: { reaction: EReaction.like },
        },
        {
          onSuccess: (data: AddReactionResponse) => {
            if (reactionState.reaction === EReaction.dislike) {
              setLocalDislikeCount((prev) => prev - 1);
            }
            setLocalLikeCount((prev) => prev + 1);
            // Store the reaction id for later removal.
            setReactionState({ reaction: EReaction.like, id: data.reactionId });
          },
          onSettled: () => setIsUpdatingReaction(false),
        }
      );
    }
  };

  const handleDislike = () => {
    if (isUpdatingReaction) return;
    setIsUpdatingReaction(true);
    // Trigger the dislike gif (inverted) for 1500ms.
    setShowDislikeGif(true);
    setTimeout(() => setShowDislikeGif(false), 1500);

    if (reactionState.reaction === EReaction.dislike) {
      if (!reactionState.id) {
        setIsUpdatingReaction(false);
        return;
      }
      deleteReaction(
        {
          pathParams: {
            proposalType: post.proposalType,
            postIndexOrHash: post.index,
            reactionId: reactionState.id,
          },
        },
        {
          onSuccess: () => {
            setReactionState({ reaction: null, id: undefined });
            setLocalDislikeCount((prev) => prev - 1);
          },
          onSettled: () => setIsUpdatingReaction(false),
        }
      );
    } else {
      addReaction(
        {
          pathParams: {
            proposalType: post.proposalType,
            postIndexOrHash: post.index,
          },
          bodyParams: { reaction: EReaction.dislike },
        },
        {
          onSuccess: (data: AddReactionResponse) => {
            if (reactionState.reaction === EReaction.like) {
              setLocalLikeCount((prev) => prev - 1);
            }
            setLocalDislikeCount((prev) => prev + 1);
            setReactionState({ reaction: EReaction.dislike, id: data.reactionId });
          },
          onSettled: () => setIsUpdatingReaction(false),
        }
      );
    }
  };

  const handleComment = () => {
    if (showCommentBox) {
      setShowCommentBox(false);
      return;
    }
    if (post.allowedCommentor === "none") {
      Toast.show({
        type: "error",
        text1: "Commenting is disabled",
        text2: "This post does not allow comments",
      });
      return;
    }
    if (post.allowedCommentor === "onchain_verified" && userProfile?.addresses.length === 0) {
      Toast.show({
        type: "error",
        text1: "Commenting is disabled",
        text2: "Only verified users can comment on this post",
      });
      return;
    }
    setShowCommentBox(true);
  };

  const handleBookmark = () => {
    if (isUpdatingSubscription) return;
    setIsUpdatingSubscription(true);
    if (subscribed) {
      unsubscribeProposal(
        { pathParams: { postIndexOrHash: post.index, proposalType: post.proposalType } },
        {
          onSuccess: () => setSubscribed(false),
          onSettled: () => setIsUpdatingSubscription(false),
        }
      );
    } else {
      subscribeProposal(
        { pathParams: { postIndexOrHash: post.index, proposalType: post.proposalType } },
        {
          onSuccess: (data: any) => setSubscribed(true),
          onSettled: () => setIsUpdatingSubscription(false),
        }
      );
    }
  };

  return (
    <>
      <View style={styles.flexRowJustifySpaceBetween}>
        <View style={styles.flexRowGap8}>
          <ThemedButton
            onPress={handleLike}
            buttonBgColor="selectedIcon"
            style={styles.iconButton}
            disabled={isUpdatingReaction || (reactionState.reaction === EReaction.like && !reactionState.id)}
          >
            {showLikeGif ? (
              <Image source={LikedGif} style={{ width: 20, height: 20 }} />
            ) : (
              <IconLike color={reactionState.reaction === EReaction.like ? accentColor : "white"} filled={reactionState.reaction === EReaction.like} />
            )}
            <ThemedText type="bodySmall">{localLikeCount}</ThemedText>
          </ThemedButton>
          <ThemedButton
            onPress={handleDislike}
            buttonBgColor="selectedIcon"
            style={styles.iconButton}
            disabled={isUpdatingReaction || (reactionState.reaction === EReaction.dislike && !reactionState.id)}
          >
            {showDislikeGif ? (
              <Image source={LikedGif} style={{ width: 20, height: 20, transform: [{ rotateX: "180deg" }] }} />
            ) : (
              <IconDislike color={reactionState.reaction === EReaction.dislike ? accentColor : "white"} filled={reactionState.reaction === EReaction.dislike} />
            )}
            <ThemedText type="bodySmall">{localDislikeCount}</ThemedText>
          </ThemedButton>
          <ThemedButton onPress={handleComment} buttonBgColor="selectedIcon" style={styles.iconButton}>
            <IconComment color="white" filled={false} />
            <ThemedText type="bodySmall">{localCommentCount}</ThemedText>
          </ThemedButton>
        </View>
        <View style={styles.flexRowGap8}>
          <ThemedButton
            onPress={handleBookmark}
            buttonBgColor="selectedIcon"
            style={styles.iconButton}
            disabled={isUpdatingSubscription}
          >
            <IconBookmark color="white" filled={subscribed} />
          </ThemedButton>
          <ShareButton proposalId={post.index} proposalTitle={post.title} />
        </View>
      </View>

      {showCommentBox && (
        <CommentBox
          proposalIndex={post.index}
          proposalType={post.proposalType}
          onCommentSubmitted={() => {
            setShowCommentBox(false);
            setLocalCommentCount((prev) => prev + 1);
          }}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  flexRowJustifySpaceBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  flexRowGap8: {
    flexDirection: "row",
    gap: 8,
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
  },
});

export default ProposalActions;
