import { router } from 'expo-router';
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { ThemedView } from '../components/ThemedView';
import { ThemedText } from '../components/ThemedText';
import ThemedButton from '../components/ThemedButton';
import { useThemeColor } from '../hooks';
import IconClose from '../components/icons/shared/icon-close';

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

  const strokeColor = useThemeColor({}, 'stroke');

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
      {
        modalVisible && (
          <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
            <View style={styles.modalOverlay}>
              <Modal
                animationType="slide"
                transparent
                onRequestClose={closeLoginModal}
              >
                {/* When the backdrop is pressed, close the modal */}
                <TouchableWithoutFeedback onPress={closeLoginModal}>
                  {/* Prevent the inner bottom sheet from closing when tapped */}
                  <View style={{ flex: 1, justifyContent: 'flex-end' }}> 
                    <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
                      <ThemedView type='secondaryBackground' style={[styles.bottomSheetContainer, { borderColor: strokeColor }]}>
                        <View style={{ marginBottom: 16, gap: 8 }}>
                          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                            <ThemedText type="titleMedium" style={{ textAlign: "center" }}>{modalMessage}</ThemedText>
                            <TouchableOpacity onPress={closeLoginModal}>
                              <IconClose />
                            </TouchableOpacity>
                          </View>
                        </View>
                        <ThemedButton text='Log in' onPress={onLogin} style={{ marginVertical: 10 }}></ThemedButton>
                      </ThemedView>
                    </TouchableWithoutFeedback>
                  </View>
                </TouchableWithoutFeedback>

              </Modal>
            </View>
          </View>
        )
      }
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
    paddingHorizontal: 16,
    paddingVertical: 24,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderTopWidth: 1,
    borderStartWidth: 1,
    borderEndWidth: 1,
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
