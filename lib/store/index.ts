import * as SecureStore from "expo-secure-store";

// Define constants for keys
export const KEY_ACCESS_TOKEN = "auth.access";
export const KEY_REFRESH_TOKEN = "auth.refresh";
export const KEY_ID = "auth.id";
export const KEY_COOKIE = "cookie";

// An abstraction for SecureStore
export const storage = {
  /**
   * Stores a string value in SecureStore.
   * Throws an error if the operation fails.
   * @param key - The key under which to store the value
   * @param value - The string value to store
   * @throws {Error} If storing the value fails
   */
  setString: (key: string, value: string): void => {
    try {
      SecureStore.setItem(key, value);
    } catch (error) {
      console.error(`Error saving key: ${key}`, error);
      throw error;
    }
  },

  /**
   * Retrieves a string value from SecureStore.
   * Throws an error if the operation fails.
   * @param key - The key to retrieve
   * @returns {string | null} The stored string value or null if not found
   * @throws {Error} If retrieval fails
   */
  getString: (key: string): string | null => {
    try {
      const result = SecureStore.getItem(key);
      return result;
    } catch (error) {
      console.error(`Error retrieving key: ${key}`, error);
      throw error;
    }
  },

  /**
   * Deletes a value from SecureStore.
   * Throws an error if the operation fails.
   * @param key - The key to delete
   * @throws {Error} If deletion fails
   */
  deleteString: async (key: string): Promise<void> => {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.error(`Error deleting key: ${key}`, error);
      throw error;
    }
  },

  /**
   * Stores an object as a JSON string in SecureStore.
   * Throws an error if the operation fails.
   * @param key - The key under which to store the object
   * @param value - The object to store
   * @throws {Error} If storing the value fails
   */
  setObject: (key: string, value: object): void => {
    try {
      SecureStore.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error saving key: ${key}`, error);
      throw error;
    }
  },

  /**
   * Retrieves an object from SecureStore.
   * Throws an error if the operation fails.
   * @param key - The key to retrieve
   * @returns {object | null} The stored object or null if not found
   * @throws {Error} If retrieval or parsing fails
   */
  getObject: (key: string): object | null => {
    try {
      const result = SecureStore.getItem(key);
      return result ? JSON.parse(result) : null;
    } catch (error) {
      console.error(`Error retrieving key: ${key}`, error);
      throw error;
    }
  }
};
