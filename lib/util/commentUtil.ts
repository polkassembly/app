import { ICommentResponse } from "../types";

/**
 * Recursively extracts unique avatar URLs and addresses from a comment's children.
 * @param comment - The parent comment containing children.
 * @returns An array of objects containing avatar URLs and addresses.
 */
export function extractUniqueChildrenAvatars(comment: ICommentResponse): { avatarUrl: string | null; address: string }[] {
  const uniqueUsers = new Map<string, { avatarUrl: string; address: string }>();

  function traverse(currentComment: ICommentResponse) {
    const address = currentComment.user?.addresses.length ? currentComment.user.addresses[0] : "";
    const avatarUrl = currentComment.user?.profileDetails?.image;
    
    if (address) {
      // If we already have this address but no avatar, and now we have an avatar, update it
      if (uniqueUsers.has(address) && !uniqueUsers.get(address)?.avatarUrl && avatarUrl) {
        uniqueUsers.set(address, { avatarUrl, address });
      } 
      // If we don't have this address yet, add it
      else if (!uniqueUsers.has(address)) {
        uniqueUsers.set(address, { avatarUrl: avatarUrl || "", address });
      }
    }
    
    // Recursively traverse children
    if (currentComment.children && currentComment.children.length > 0) {
      currentComment.children.forEach(traverse);
    }
  }

  if (comment.children && comment.children.length > 0) {
    comment.children.forEach(traverse);
  }

  return Array.from(uniqueUsers.values());
}
