import React from "react";
import { StyleSheet, View, TextInput, Image } from "react-native";
import { Colors } from "@/lib/constants/Colors";
import ThemedButton from "../ThemedButton";
import { ThemedText } from "../ThemedText";
import { UserAvatar } from "../shared";

interface CommentBoxProps {
  commentText: string;
  onChangeCommentText: (text: string) => void;
  onSubmitComment: () => void;
	userAvatarUrl: string,
  isUserInfoLoading: boolean;
  isUserInfoError: boolean;
}

export default function CommentBox({
  commentText,
  onChangeCommentText,
  onSubmitComment,
  userAvatarUrl,
}: CommentBoxProps) {
  return (
    <View style={styles.commentBox}>
      {
        <UserAvatar avatarUrl={userAvatarUrl} width={25} height={25} />
    	}
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

const styles = StyleSheet.create({
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
  submitButton: {
    paddingHorizontal: 15,
    paddingVertical: 4,
    borderRadius: 0,
    height: "100%",
    backgroundColor: Colors.dark.accent,
  },
});
