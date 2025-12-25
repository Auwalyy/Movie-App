import AsyncStorage from '@react-native-async-storage/async-storage';

// In-memory cache for synchronous access
const memoryCache: Record<string, string> = {};

// Initialize cache from AsyncStorage
const initializeCache = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const items = await AsyncStorage.multiGet(keys);
    items.forEach(([key, value]) => {
      if (value) memoryCache[key] = value;
    });
  } catch (error) {
    console.error('Failed to initialize cache:', error);
  }
};

// Call this on app start
initializeCache();

export const tokenStorage = {
  // Synchronous methods (read from cache)
  getString: (key: string): string | undefined => {
    return memoryCache[key];
  },
  
  // Async methods (write to both cache and AsyncStorage)
  set: async (key: string, value: string): Promise<void> => {
    memoryCache[key] = value;
    await AsyncStorage.setItem(key, value);
  },
  
  delete: async (key: string): Promise<void> => {
    delete memoryCache[key];
    await AsyncStorage.removeItem(key);
  },
  
  clearAll: async (): Promise<void> => {
    Object.keys(memoryCache).forEach(key => delete memoryCache[key]);
    await AsyncStorage.clear();
  },
  
  getStringAsync: async (key: string): Promise<string | null> => {
    return await AsyncStorage.getItem(key);
  }
};

export const storage = {
  getString: (key: string): string | undefined => {
    return memoryCache[key];
  },
  
  set: async (key: string, value: string): Promise<void> => {
    memoryCache[key] = value;
    await AsyncStorage.setItem(key, value);
  },
  
  delete: async (key: string): Promise<void> => {
    delete memoryCache[key];
    await AsyncStorage.removeItem(key);
  },
  
  clearAll: async (): Promise<void> => {
    Object.keys(memoryCache).forEach(key => delete memoryCache[key]);
    await AsyncStorage.clear();
  },
  
  getStringAsync: async (key: string): Promise<string | null> => {
    return await AsyncStorage.getItem(key);
  }
};

export const mmkvStorage = {
  setItem: async (key: string, value: string): Promise<void> => {
    memoryCache[key] = value;
    await AsyncStorage.setItem(key, value);
  },
  
  getItem: async (key: string): Promise<string | null> => {
    return await AsyncStorage.getItem(key);
  },
  
  removeItem: async (key: string): Promise<void> => {
    delete memoryCache[key];
    await AsyncStorage.removeItem(key);
  }
};