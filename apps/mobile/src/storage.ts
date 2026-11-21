import AsyncStorage from '@react-native-async-storage/async-storage';
import type { KeyValueStorage } from '@edu/core/react';

/** On-device persistence (Android SharedPreferences-backed via AsyncStorage). */
export const deviceStorage: KeyValueStorage = {
  getItem: (key) => AsyncStorage.getItem(key),
  setItem: (key, value) => AsyncStorage.setItem(key, value),
};
