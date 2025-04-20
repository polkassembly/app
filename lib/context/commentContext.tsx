import React, { createContext, useContext, useState, ReactNode } from "react";
import { UserProfile, EProposalType, EPostOrigin } from "@/lib/types";
import CommentSheet from "../components/proposal/comments/CommentSheet";
import { useBottomSheet } from "./bottomSheetContext";

interface CommentSheetOptions {
	author: UserProfile;
	isReply?: boolean;
	proposalTitle?: string;
	proposalType: EProposalType;
	proposalIndex: string;
	parentCommentId?: string;
	createdAt?: string;
	parentComment?: string;
	postOrigin?: EPostOrigin;
	onCommentSuccess?: ({ comment }: { comment?: string }) => void;
}

interface CommentSheetContextProps {
	openCommentSheet: (options: CommentSheetOptions) => void;
	closeCommentSheet: () => void;
}

const CommentSheetContext = createContext<CommentSheetContextProps | undefined>(undefined);

export const CommentSheetProvider = ({ children }: { children: ReactNode }) => {
  const [options, setOptions] = useState<CommentSheetOptions | null>(null);
  const { openBottomSheet, closeBottomSheet } = useBottomSheet();

  const handleComment = () => {
    if (options?.onCommentSuccess) {
      options.onCommentSuccess({ comment: options.parentComment });
    }
    closeBottomSheet();
  };

  const openCommentSheet = (opts: CommentSheetOptions) => {
    setOptions(opts);
    openBottomSheet(
      <CommentSheet
        {...opts}
        onClose={closeBottomSheet}
        onCommentSubmitted={handleComment}
      />
    );
  };

  return (
    <CommentSheetContext.Provider value={{ openCommentSheet, closeCommentSheet: closeBottomSheet }}>
      {children}
    </CommentSheetContext.Provider>
  );
};

export const useCommentSheet = () => {
	const context = useContext(CommentSheetContext);
	if (!context) {
		throw new Error("useCommentSheet must be used within a CommentSheetProvider");
	}
	return context;
};
