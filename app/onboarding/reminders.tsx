import { View, Text, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function Reminders() {
  const router = useRouter();

  const finishOnboarding = async () => {
    await AsyncStorage.setItem('hasOnboarded', 'true');
    router.replace('/(tabs)/today');
  };

  return (
    <View className="flex-1 justify-center items-center">
      <Text className="text-xl mb-6">Enable daily reminders?</Text>

      <Pressable
        onPress={finishOnboarding}
        className="bg-primary px-6 py-3 rounded-xl"
      >
        <Text className="text-white">Finish</Text>
      </Pressable>
    </View>
  );
}
