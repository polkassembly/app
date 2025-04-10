import React, { createContext, useContext, useState, ReactNode, useRef, useEffect } from "react";
import { BackHandler, StyleSheet } from "react-native";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetModalProvider,
  BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';
import { useThemeColor } from "../hooks";

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

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  // Handle back button press
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (bottomSheetVisible) {
        closeBottomSheet();
        return true;
      }
      return false;
    });

    return () => backHandler.remove();
  }, [bottomSheetVisible]);

  const openBottomSheet = (content: ReactNode) => {
    setBottomSheetContent(content);
    bottomSheetModalRef.current?.present();
    setBottomSheetVisible(true);
  };

  const closeBottomSheet = () => {
    bottomSheetModalRef.current?.dismiss();
    setBottomSheetVisible(false);
  };

  const handleSheetChanges = (index: number) => {
    if (index === -1) {
      setBottomSheetContent(null);
      setBottomSheetVisible(false);
    }
  };

  // Custom backdrop component to handle taps outside the sheet
  const renderBackdrop = (props: any) => (
    <BottomSheetBackdrop
      {...props}
      disappearsOnIndex={-1}
      appearsOnIndex={0}
      pressBehavior="close"
    />
  );

  return (
    <BottomSheetContext.Provider
      value={{ bottomSheetVisible, bottomSheetContent, openBottomSheet, closeBottomSheet }}
    >
      {children}
      <BottomSheetModalProvider>
        <BottomSheetModal
          ref={bottomSheetModalRef}
          onChange={handleSheetChanges}
          backdropComponent={renderBackdrop}
          backgroundStyle={{ backgroundColor: "transparent" }}
          handleComponent={null}
          animationConfigs={{
            duration: 300
          }}
        >
          <BottomSheetView style={styles.contentContainer}>
              {bottomSheetContent}
          </BottomSheetView>
        </BottomSheetModal>
      </BottomSheetModalProvider>
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
  contentContainer: {
    flex: 1,
  },
});