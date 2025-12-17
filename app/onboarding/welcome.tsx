import { View, Text, Pressable, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { ArrowRight2, ArrowRight3, DirectRight } from 'iconsax-react-nativejs';

export default function Welcome() {
  const router = useRouter();
  const floatAnim1 = useRef(new Animated.Value(0)).current;
  const floatAnim2 = useRef(new Animated.Value(0)).current;
  const floatAnim3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Floating animations for cards
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim1, {
          toValue: -10,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim1, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim2, {
          toValue: -15,
          duration: 2500,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim2, {
          toValue: 0,
          duration: 2500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim3, {
          toValue: -12,
          duration: 2200,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim3, {
          toValue: 0,
          duration: 2200,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <View className="flex-1 bg-background">
      {/* Header */}
      <View className="px-6 pt-16 pb-4 flex-row items-center justify-between">
        <View className="flex-row items-center">
          <View className="w-10 h-10 rounded-full bg-accent-foreground " />
          <View className="w-10 h-10 rounded-full bg-accent-foreground/80 -ml-4" />
          <View className="w-10 h-10 rounded-full bg-accent-foreground/70 -ml-4" />
          <View className="w-10 h-10 rounded-full bg-accent-foreground/60 -ml-4" />
        </View>
      </View>

      {/* Hero Section */}
      <View className="px-6 pt-4">
        <Text className="text-5xl font-bold text-gray-900 leading-[1.1] mb-3">
          Track today. Spend better tomorrow.
        </Text>
        <Text className="text-base text-gray-600 mb-6">
          A simple habit for knowing what you’ve already spent today.
        </Text>
      </View>

      {/* Floating Cards Section */}
      <View className="flex-1 px-6 relative">
        {/* Euro Card - Top Left */}
        <Animated.View 
          className="absolute left-6 top-0 bg-white rounded-3xl shadow-lg p-4 w-60"
          style={{ 
            transform: [
              { translateY: floatAnim1 },
              { rotate: '-6deg' }
            ]
          }}
        >
          <View className="flex-row items-center mb-3">
            <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center mr-2">
              <Text className="text-xl">🇪🇺</Text>
            </View>
            <View>
              <Text className="text-gray-500 text-xs">Euro</Text>
              <Text className="text-gray-400 text-xs">**** 2155</Text>
            </View>
          </View>
          <Text className="text-2xl font-bold text-gray-900">19,235.50</Text>
        </Animated.View>

        {/* Total Balance Card - Center */}
        <Animated.View 
          className="absolute left-6 right-6 top-20 bg-primary rounded-3xl shadow-xl p-5"
          style={{ 
            transform: [{ translateY: floatAnim2 }]
          }}
        >
          <Text className="text-black text-xs mb-2">Total Balance</Text>
          <View className="flex-row items-end mb-4">
            <Text className="text-4xl font-bold text-white">1,125,000</Text>
            <Text className="text-gray-500 text-xl ml-2 mb-1">INR</Text>
          </View>
          
          <View className="flex-row gap-3">
            <Pressable className="flex-1 bg-gray-800 rounded-2xl p-3 items-center">
              <View className="w-6 h-6 bg-gray-700 rounded-lg" />
            </Pressable>
            <Pressable className="flex-1 bg-gray-800 rounded-2xl p-3 items-center">
              <View className="w-6 h-6 bg-gray-700 rounded-lg" />
            </Pressable>
          </View>
        </Animated.View>

        {/* Transaction List - Bottom Center */}
        <Animated.View 
          className="absolute left-6 right-6 bottom-56 bg-white rounded-3xl shadow-lg p-4"
          style={{ 
            transform: [{ translateY: floatAnim1 }]
          }}
        >
          {[
            { label: 'Netflix', amount: '+2,374.02 EUR', color: 'bg-yellow-100', emoji: '📺' },
            { label: 'Amazon', amount: '-2,231.09 EUR', color: 'bg-green-100', emoji: '📦' }
          ].map((item, i) => (
            <View key={i} className="flex-row items-center justify-between mb-2">
              <View className="flex-row items-center">
                <View className={`w-8 h-8 ${item.color} rounded-xl items-center justify-center mr-2`}>
                  <Text className="text-sm">{item.emoji}</Text>
                </View>
                <Text className="text-gray-700 text-xs font-medium">{item.label}</Text>
              </View>
              <Text className="text-gray-900 text-xs font-semibold">{item.amount}</Text>
            </View>
          ))}
        </Animated.View>

        {/* Company Balance Card - Bottom Right */}
        <Animated.View 
          className="absolute right-6 bottom-40 bg-white rounded-3xl shadow-lg p-4 w-60"
          style={{ 
            transform: [
              { translateY: floatAnim3 },
              { rotate: '6deg' }
            ]
          }}
        >
          <Text className="text-gray-500 text-xs mb-2">Company Balance</Text>
          <View className="flex-row items-end mb-3">
            <Text className="text-2xl font-bold text-gray-900">750,000</Text>
            <Text className="text-gray-500 text-base ml-2 mb-1">INR</Text>
          </View>
          
          <View className="flex-row gap-2">
            <Pressable className="flex-1 bg-gray-100 rounded-2xl p-2 items-center">
              <View className="w-5 h-5 bg-gray-300 rounded" />
            </Pressable>
            <Pressable className="flex-1 bg-gray-100 rounded-2xl p-2 items-center">
              <View className="w-5 h-5 bg-gray-300 rounded" />
            </Pressable>
          </View>
        </Animated.View>
      </View>

      {/* CTA Button */}
      <View className="absolute bottom-24 left-0 bottom-9 right-0 items-center ">
        <Pressable
          onPress={() => router.push('/onboarding/reminders')}
          className="bg-primary px-10 py-4 rounded-2xl shadow-lg active:scale-95 flex-row items-center justify-between gap-3"
        >
          <Text className="text-black font-bold text-base">
            Get Started
          </Text>
          <ArrowRight2 size="18" color="black"/>
        </Pressable>
      </View>
    </View>
  );
}