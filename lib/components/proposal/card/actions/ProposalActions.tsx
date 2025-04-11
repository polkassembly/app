import { EReaction, UserProfile } from "@/lib/types";
import { StyleSheet, View } from "react-native";
import ShareButton from "./ShareButton";
import { IconLike, IconDislike, IconComment, IconBookmark } from "../../../icons/shared";
import { useEffect, useMemo, useState } from "react";
import Toast from "react-native-toast-message";
import { useProfileStore } from "@/lib/store/profileStore";
import { AddReactionResponse, useAddReaction, useDeleteReaction, useSubscribeProposal, useUnsubscribeProposal } from "@/lib/net/queries/actions";
import { useIsFocused } from "@react-navigation/native";
import { EAllowedCommentor, EPostOrigin, EProposalType, Reaction } from "@/lib/types/post";
import { useAuthModal } from "@/lib/context/authContext";
import { ThemedButton } from "@/lib/components/shared/button";
import { ThemedText } from "@/lib/components/shared/text";
import { useCommentSheet } from "@/lib/context/commentContext";
import { useGetUserByAddress } from "@/lib/net/queries/profile";

interface ProposalActionsProps {
  index: string;
  title: string;
  proposalType: EProposalType;
  metrics: {
    reactions: {
      like: number;
      dislike: number;
    };
    comments: number;
  };
  reactions: Reaction[];
  allowedCommentor: EAllowedCommentor;
  userSubscriptionId?: string;
  origin: EPostOrigin;
  createdAt: string;
  authorAddress: string;
}

function ProposalActions(
  {
    index,
    title,
    proposalType,
    metrics,
    reactions,
    allowedCommentor,
    userSubscriptionId,
    origin,
    createdAt,
    authorAddress,
  }: ProposalActionsProps) {
  const isfocused = useIsFocused();

  // Memoize metrics and reactions based on screen focus to avoid unnecessary reactivity.
  const memoizedMetrics = useMemo(() => metrics, [isfocused]);
  const memoizedReactions = useMemo(() => reactions, [isfocused]);
  const memoizedSubscriptionId = useMemo(() => userSubscriptionId, [isfocused]);

  // Get the user profile from the store.
  const userProfile = useProfileStore((state) => state.profile);
  const { openLoginModal } = useAuthModal();
  const { openCommentSheet } = useCommentSheet();

  const currentUserReaction = memoizedReactions?.find(
    (reaction) => reaction.userId === userProfile?.id
  );

  // Local state seeded with metrics.
  const [localLikeCount, setLocalLikeCount] = useState(() => memoizedMetrics.reactions.like);
  const [localDislikeCount, setLocalDislikeCount] = useState(() => memoizedMetrics.reactions.dislike);
  const [localCommentCount, setLocalCommentCount] = useState(() => memoizedMetrics.comments);

  // Reaction state holds the current reaction type and its id.
  const [reactionState, setReactionState] = useState<{ reaction: EReaction | null; id?: string }>(() =>
    currentUserReaction
      ? { reaction: currentUserReaction.reaction, id: currentUserReaction.id }
      : { reaction: null, id: undefined }
  );
  const [isUpdatingLike, setIsUpdatingLike] = useState(false);
  const [isUpdatingDislike, setIsUpdatingDislike] = useState(false);

  const [subscribed, setSubscribed] = useState(memoizedSubscriptionId ? true : false);
  const [isUpdatingSubscription, setIsUpdatingSubscription] = useState(false);

  const { mutate: addReaction } = useAddReaction();
  const { mutate: deleteReaction } = useDeleteReaction();
  const { mutate: subscribeProposal } = useSubscribeProposal();
  const { mutate: unsubscribeProposal } = useUnsubscribeProposal();
  const { data: author } = useGetUserByAddress(authorAddress);


  // Reset the local state when the screen is focused.
  useEffect(() => {
    if (isfocused) {
      setLocalLikeCount(() => memoizedMetrics.reactions.like);
      setLocalDislikeCount(() => memoizedMetrics.reactions.dislike);
      setLocalCommentCount(() => memoizedMetrics.comments);

      const updatedUserReaction = memoizedReactions?.find(
        (reaction) => reaction.userId === userProfile?.id
      );
      setReactionState(() =>
        updatedUserReaction
          ? { reaction: updatedUserReaction.reaction, id: updatedUserReaction.id }
          : { reaction: null, id: undefined }
      );

      setSubscribed(memoizedSubscriptionId ? true : false);
    }
  }, [isfocused, memoizedMetrics, memoizedReactions, userProfile, memoizedSubscriptionId]);

  const handleLike = () => {
    if (!userProfile) {
      openLoginModal("Login to like proposal", false);
      return;
    }
    if (isUpdatingLike) return;
    setIsUpdatingLike(true);

    if (reactionState.reaction === EReaction.like) {
      // Optimistic updates for removing the like.
      if (!reactionState.id) {
        setIsUpdatingLike(false);
        return;
      }
      setLocalLikeCount((prev) => prev - 1);
      setReactionState({ reaction: null, id: undefined });

      deleteReaction(
        {
          pathParams: {
            proposalType: proposalType,
            postIndexOrHash: index,
            reactionId: reactionState.id,
          },
        },
        {
          onSuccess: () => {
            setReactionState({ reaction: null, id: undefined });
          },
          onSettled: () => {
            setIsUpdatingDislike(false);
            setIsUpdatingLike(false);
          },
        }
      );
    } else {
      // Optimistic update for adding a like.
      if (reactionState.reaction === EReaction.dislike) {
        setLocalDislikeCount((prev) => prev - 1);
      }
      setLocalLikeCount((prev) => prev + 1);
      setReactionState({ reaction: EReaction.like, id: "temp-id" });

      addReaction(
        {
          pathParams: {
            proposalType: proposalType,
            postIndexOrHash: index,
          },
          bodyParams: { reaction: EReaction.like },
        },
        {
          onSuccess: (data: AddReactionResponse) => {
            setReactionState({ reaction: EReaction.like, id: data.reactionId });
          },
          onSettled: () => {
            setIsUpdatingDislike(false);
            setIsUpdatingLike(false);
          },
        }
      );
    }
  };

  const handleDislike = () => {
    if (!userProfile) {
      openLoginModal("Login to dislike proposal", false);
      return;
    }
    if (isUpdatingDislike) return;
    setIsUpdatingDislike(true);

    if (reactionState.reaction === EReaction.dislike) {
      // Optimistic updates for removing the dislike.
      if (!reactionState.id) {
        setIsUpdatingDislike(false);
        return;
      }
      setLocalDislikeCount((prev) => prev - 1);
      setReactionState({ reaction: null, id: undefined });

      deleteReaction(
        {
          pathParams: {
            proposalType: proposalType,
            postIndexOrHash: index,
            reactionId: reactionState.id,
          },
        },
        {
          onSuccess: () => {
            setReactionState({ reaction: null, id: undefined });
          },
          onSettled: () => {
            setIsUpdatingDislike(false);
            setIsUpdatingLike(false);
          }
        }
      );
    } else {
      // Optimistic update for adding a dislike.
      if (reactionState.reaction === EReaction.like) {
        setLocalLikeCount((prev) => prev - 1);
      }
      setLocalDislikeCount((prev) => prev + 1);
      setReactionState({ reaction: EReaction.dislike, id: "temp-id" });

      addReaction(
        {
          pathParams: {
            proposalType: proposalType,
            postIndexOrHash: index,
          },
          bodyParams: { reaction: EReaction.dislike },
        },
        {
          onSuccess: (data: AddReactionResponse) => {
            setReactionState({ reaction: EReaction.dislike, id: data.reactionId });
          },
          onSettled: () => {
            setIsUpdatingDislike(false);
            setIsUpdatingLike(false);
          },
        }
      );
    }
  };

  const handleComment = () => {
    if (!userProfile) {
      openLoginModal("Login to comment on proposal", false);
      return;
    }
    if (allowedCommentor === "none") {
      Toast.show({
        type: "error",
        text1: "Commenting is disabled",
        text2: "This post does not allow comments",
      });
      return;
    }
    if (allowedCommentor === "onchain_verified" && userProfile?.addresses.length === 0) {
      Toast.show({
        type: "error",
        text1: "Commenting is disabled",
        text2: "Only verified users can comment on this post",
      });
      return;
    }
    openCommentSheet({
      author: author as UserProfile,
      isReply: false,
      proposalTitle: title,
      proposalType: proposalType,
      proposalIndex: index,
      createdAt: createdAt,
      postOrigin: origin,
      onCommentSuccess: () => {
        setLocalCommentCount((prev) => prev + 1);
      }
    })
  };

  const handleBookmark = () => {
    if (!userProfile) {
      openLoginModal("Login to subscribe proposal", false);
      return;
    }
    if (isUpdatingSubscription) return;
    setIsUpdatingSubscription(true);
    if (subscribed) {
      setSubscribed(false);
      unsubscribeProposal(
        { pathParams: { postIndexOrHash: index, proposalType: proposalType } },
        {
          onSettled: () => setIsUpdatingSubscription(false),
        }
      );
    } else {
      setSubscribed(true);
      subscribeProposal(
        { pathParams: { postIndexOrHash: index, proposalType: proposalType } },
        {
          onSettled: () => setIsUpdatingSubscription(false),
        }
      );
    }
  };

  return (
    <View style={styles.flexRowJustifySpaceBetween}>
      <View style={styles.flexRowGap8}>
        <ThemedButton
          onPress={handleLike}
          buttonBgColor="selectedIcon"
          style={styles.iconButton}
          disabled={isUpdatingLike || (reactionState.reaction === EReaction.like && !reactionState.id)}
        >
          <IconLike key={`${reactionState.reaction}-${reactionState.id}`} color={"white"} filled={reactionState.reaction === EReaction.like} />
          <ThemedText type="bodySmall">{localLikeCount}</ThemedText>
        </ThemedButton>
        <ThemedButton
          onPress={handleDislike}
          buttonBgColor="selectedIcon"
          style={styles.iconButton}
          disabled={isUpdatingDislike || (reactionState.reaction === EReaction.dislike && !reactionState.id)}
        >
          <IconDislike key={`${reactionState.reaction}-${reactionState.id}`} color={"white"} filled={reactionState.reaction === EReaction.dislike} />
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
          <IconBookmark key={`subscribed-${subscribed}`} color={"white"} filled={subscribed} />
        </ThemedButton>
        <ShareButton proposalId={index} proposalTitle={title} />
      </View>
    </View>
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
