import * as SecureStore from "expo-secure-store";

// Define constants for keys
export const KEY_ACCESS_TOKEN = "auth.access";
export const KEY_REFRESH_TOKEN = "auth.refresh";
export const PROFILE_DATA = "profile";

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
  setObject: (key: string, value: object): void => {
    try {
      SecureStore.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error saving key: ${key}`, error);
    }
  },
  getObject: (key: string): object | null => {
    try {
      const result = SecureStore.getItem(key);
      return result ? JSON.parse(result) : null;
    } catch (error) {
      console.error(`Error retrieving key: ${key}`, error);
      return null;
    }
  }
};
