import React from "react";
import { View, StyleSheet } from "react-native";
import { ICommentResponse } from "@/lib/types";
import CommentCard from "./CommentCard";
import HorizontalSeparator from "../../shared/View/HorizontalSeparator";

interface CommentListProps {
  comments: ICommentResponse[];
}

function CommentList({ comments }: CommentListProps) {
  return (
    <View style={styles.mainContainer}>
      {comments.map((item) => (
        <View key={item.id} style={styles.commentWrapper}>
          <CommentCard comment={item} />
          <HorizontalSeparator />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    padding: 10,
		gap: 20
  },
  commentWrapper: {
		gap: 20
  },
});

export default CommentList;
