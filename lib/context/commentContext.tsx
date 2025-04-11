import React, { createContext, useContext, useState, ReactNode } from "react";
import { UserProfile, EProposalType, EPostOrigin } from "@/lib/types";
import CommentSheet from "../components/proposal/comments/CommentSheet";
import { View, Modal, TouchableWithoutFeedback, StyleSheet } from "react-native";

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
}

interface CommentSheetContextProps {
	openCommentSheet: (options: CommentSheetOptions) => void;
	closeCommentSheet: () => void;
}

const CommentSheetContext = createContext<CommentSheetContextProps | undefined>(undefined);

export const CommentSheetProvider = ({ children }: { children: ReactNode }) => {
	const [visible, setVisible] = useState(false);
	const [options, setOptions] = useState<CommentSheetOptions | null>(null);

	const openCommentSheet = (opts: CommentSheetOptions) => {
		setOptions(opts);
		setVisible(true);
	};

	const closeCommentSheet = () => {
		setVisible(false);
		setOptions(null);
	};

	return (
		<CommentSheetContext.Provider value={{ openCommentSheet, closeCommentSheet }}>
			{children}
			{visible && options && (

				<View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
					<View style={styles.sheetOverlay}>
						<Modal
							animationType="slide"
							transparent={true}
							onRequestClose={closeCommentSheet}
						>
							<TouchableWithoutFeedback onPress={closeCommentSheet}>
								<View style={{ flex: 1, justifyContent: 'flex-end' }}>
									<TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
										<CommentSheet {...options} onClose={closeCommentSheet} />
									</TouchableWithoutFeedback>
								</View>
							</TouchableWithoutFeedback>
						</Modal>
					</View>
				</View>
			)}
		</CommentSheetContext.Provider>
	);
};

const styles = StyleSheet.create({
	sheetOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end'
  },
})

export const useCommentSheet = () => {
	const context = useContext(CommentSheetContext);
	if (!context) {
		throw new Error("useCommentSheet must be used within a CommentSheetProvider");
	}
	return context;
};
