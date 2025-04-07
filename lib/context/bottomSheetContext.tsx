import React, { createContext, useContext, useState, ReactNode } from "react";
import { Modal, View, StyleSheet, TouchableWithoutFeedback } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

interface BottomSheetContextProps {
  bottomSheetVisible: boolean;
  bottomSheetContent: ReactNode | null;
  openBottomSheet: (content: ReactNode) => void;
  closeBottomSheet: () => void;
}

const BottomSheetContext = createContext<BottomSheetContextProps | undefined>(undefined);

export const BottomSheetProvider = ({ children }: { children: ReactNode }) => {
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [bottomSheetContent, setBottomSheetContent] = useState<ReactNode | null>(null);
  const insets = useSafeAreaInsets();

  const openBottomSheet = (content: ReactNode) => {
    setBottomSheetContent(content);
    setBottomSheetVisible(true);
  };

  const closeBottomSheet = () => {
    setBottomSheetVisible(false);
    setBottomSheetContent(null);
  };

  return (
    <BottomSheetContext.Provider
      value={{ bottomSheetVisible, bottomSheetContent, openBottomSheet, closeBottomSheet }}
    >
      {children}
      {
        bottomSheetVisible && (
          <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
            <View style={styles.bottomSheetOverlay}>
              <Modal
                animationType="slide"
                transparent={true}
                onRequestClose={closeBottomSheet}
              >
                <TouchableWithoutFeedback onPress={closeBottomSheet}>
                  <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                    <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
                      <SafeAreaView>
                        {bottomSheetContent}
                      </SafeAreaView>
                    </TouchableWithoutFeedback>
                  </View>
                </TouchableWithoutFeedback>
              </Modal>
            </View>
          </View>
        )
      }
    </BottomSheetContext.Provider>
  );
};

export const useBottomSheet = () => {
  const context = useContext(BottomSheetContext);
  if (!context) {
    throw new Error("useBottomSheet must be used within a BottomSheetProvider");
  }
  return context;
};

const styles = StyleSheet.create({
  bottomSheetOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end'
  },
});
