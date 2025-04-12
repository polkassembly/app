import { router } from 'expo-router';
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { useThemeColor } from '../hooks';
import IconClose from '../components/icons/shared/icon-close';
import { ThemedButton } from '../components/shared/button';
import { ThemedText } from '../components/shared/text';
import { ThemedView } from '../components/shared/View';
import { useBottomSheet } from './bottomSheetContext';

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
  const [removeScreenFromRouter, setRemoveScreenFromRouter] = useState(false);
  const { openBottomSheet, closeBottomSheet } = useBottomSheet();
  const strokeColor = useThemeColor({}, 'stroke');

  const closeLoginModal = () => {
    closeBottomSheet();
    if (removeScreenFromRouter) router.back();
  };

  const onLogin = () => {
    closeBottomSheet();
    router.push('/auth/loginOptionsScreen');
  };

  const openLoginModal = (message: string, remove: boolean = false) => {
    setRemoveScreenFromRouter(remove);

    openBottomSheet(
      <ThemedView type='secondaryBackground' style={[styles.bottomSheetContainer, { borderColor: strokeColor }]}>
        <View style={{ marginBottom: 16, gap: 8 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <ThemedText type='titleMedium'>{message}</ThemedText>
            <TouchableOpacity onPress={closeLoginModal}><IconClose /></TouchableOpacity>
          </View>
        </View>
        <ThemedButton text='Log in' onPress={onLogin} style={{ marginTop: 10 }} />
      </ThemedView>
    );
  };

  return (
    <AuthModalContext.Provider value={{ openLoginModal, closeLoginModal }}>
      {children}
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
