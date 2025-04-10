import React, { createContext, useContext, useState, ReactNode, useRef, useEffect } from "react";
import { BackHandler, StyleSheet } from "react-native";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetModalProvider,
  BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';
import { useThemeColor } from "../hooks";
import { SafeAreaView } from "react-native-safe-area-context";

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
  const backgroundColor = useThemeColor({}, "secondaryBackground");

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
      pressBehavior="close" // This enables closing by pressing the backdrop
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
        >
          <BottomSheetView style={styles.contentContainer}>
            {/* <SafeAreaView style={{ flex: 1, backgroundColor }}> */}
              {bottomSheetContent}
            {/* </SafeAreaView> */}
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