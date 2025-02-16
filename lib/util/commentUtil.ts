import { ICommentResponse } from "../types";

/**
 * Recursively extracts unique avatar URLs from a comment's children.
 * @param comment - The parent comment containing children.
 * @returns An array of unique avatar URLs.
 */
export function extractUniqueChildrenAvatars(comment: ICommentResponse): string[] {
  const uniqueAvatars = new Set<string>();

  function traverse(currentComment: ICommentResponse) {
    const avatarUrl = currentComment.user?.profileDetails?.image;
    if (avatarUrl) {
      uniqueAvatars.add(avatarUrl);
    }
  }

  if (comment.children && comment.children.length > 0) {
    comment.children.forEach(traverse);
  }

  return Array.from(uniqueAvatars);
}
