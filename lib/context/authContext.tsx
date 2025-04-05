import { router } from 'expo-router';
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { ThemedView } from '../components/ThemedView';
import { ThemedText } from '../components/ThemedText';
import ThemedButton from '../components/ThemedButton';
import HorizontalSeparator from '../components/shared/HorizontalSeparator';

// Define the shape of the context
interface AuthModalContextType {
  openLoginModal: (message: string, removeScreenFromRouter: boolean) => void;
  closeLoginModal: () => void;
}

// Create context with default undefined
const AuthModalContext = createContext<AuthModalContextType | undefined>(undefined);

// Define props for the provider
interface AuthModalProviderProps {
  children: ReactNode;
}

export const AuthModalProvider: React.FC<AuthModalProviderProps> = ({ children }) => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalMessage, setModalMessage] = useState<string>('');
  const [removeScreenFromRouter, setRemoveScreenFromRouter] = useState<boolean>(false);

  const openLoginModal = (message: string, removeScreenFromRouter: boolean = false) => {
    setModalMessage(message);
    setRemoveScreenFromRouter(removeScreenFromRouter);
    setModalVisible(true);
  };

  const closeLoginModal = () => {
    setModalVisible(false);
    if (removeScreenFromRouter) {
      router.back();
    }
    setModalMessage('');
  };

  const onLogin = () => {
    router.push('/auth/qrAuth')
    setModalVisible(false);
  }

  return (
    <AuthModalContext.Provider value={{ openLoginModal, closeLoginModal }}>
      {children}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={closeLoginModal}
      >
        {/* When the backdrop is pressed, close the modal */}
        <TouchableWithoutFeedback onPress={closeLoginModal}>
          <View style={styles.modalOverlay}>
            {/* Prevent the inner bottom sheet from closing when tapped */}
            <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
              <ThemedView style={styles.bottomSheetContainer}>
                <ThemedText type='titleSmall' style={{ marginBottom: 16 }}>{modalMessage}</ThemedText>
                <ThemedButton text='Login' onPress={onLogin}></ThemedButton>
              </ThemedView>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </AuthModalContext.Provider>
  );
};

// Hook to use the context safely
export const useAuthModal = (): AuthModalContextType => {
  const context = useContext(AuthModalContext);
  if (!context) {
    throw new Error('useAuthModal must be used within an AuthModalProvider');
  }
  return context;
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end'
  },
  bottomSheetContainer: {
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  loginButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    borderRadius: 5,
  },
  loginButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
  },
});
