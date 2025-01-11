import * as SecureStore from "expo-secure-store";

// Define constants for keys
export const KEY_ACCESS_TOKEN = "auth.access";
export const KEY_REFRESH_TOKEN = "auth.refresh";

// An abstraction for SecureStore
export const storage = {
  setString: (key: string, value: string): void => {
    try {
      SecureStore.setItem(key, value);
    } catch (error) {
      console.error(`Error saving key: ${key}`, error);
    }
  },

  getString: (key: string): string | null => {
    try {
      const result = SecureStore.getItem(key);
      return result;
    } catch (error) {
      console.error(`Error retrieving key: ${key}`, error);
      return null;
    }
  },

  deleteString: async (key: string): Promise<void> => {
    try {
      await SecureStore.deleteItemAsync(key);
      console.log(`Deleted key: ${key}`);
    } catch (error) {
      console.error(`Error deleting key: ${key}`, error);
    }
  },
};
