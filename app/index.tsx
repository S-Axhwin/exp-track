import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Index() {
  const [isNewUser, setIsNewUser] = useState<boolean | null>(null);

  useEffect(() => {
    AsyncStorage.getItem('hasOnboarded').then(value => {
      setIsNewUser(value !== 'true');
    });
  }, []);

  if (isNewUser === null) return null; // splash/loading

  // if (isNewUser) {
  return <Redirect href="/onboarding/welcome" />;
  // }

  return <Redirect href="/(tabs)/today" />;
}
