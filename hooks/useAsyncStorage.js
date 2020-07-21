import {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-community/async-storage';

export const useAsyncStorage = key => {
  const [storedValue, setValue] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const stringifiedValue = await AsyncStorage.getItem(key);
        const value =
          stringifiedValue != null ? JSON.parse(stringifiedValue) : null;
        setValue(value);
      } catch (error) {
        console.error('Laod error', error);
      }
    })();
  }, [key]);

  const setStoredValue = async value => {
    try {
      setValue(value);
      const stringifiedValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, stringifiedValue);
    } catch (error) {
      console.error('Store Value Error', error);
    }
  };

  return [storedValue, setStoredValue];
};

export default useAsyncStorage;
