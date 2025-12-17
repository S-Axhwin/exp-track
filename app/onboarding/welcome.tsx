import { View, Text, Pressable, Animated, PanResponder } from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ArrowRight2 } from 'iconsax-react-nativejs';
import * as Haptics from 'expo-haptics';

export default function Welcome() {
  const router = useRouter();

  /** Floating Animations for Cards **/
  const floatAnim1 = useRef(new Animated.Value(0)).current;
  const floatAnim2 = useRef(new Animated.Value(0)).current;
  const floatAnim3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const createLoop = (anim: Animated.Value, toValue: number, duration: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, { toValue, duration, useNativeDriver: true }),
          Animated.timing(anim, { toValue: 0, duration, useNativeDriver: true }),
        ])
      ).start();

    createLoop(floatAnim1, -10, 2000);
    createLoop(floatAnim2, -15, 2500);
    createLoop(floatAnim3, -12, 2200);
  }, []);

  /** Swipe Gesture for CTA **/
  const swipeAnim = useRef(new Animated.Value(0)).current;
  const [swiped, setSwiped] = useState(false);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gestureState) => {
      if (gestureState.dx > 0 && gestureState.dx <= 200) {
        swipeAnim.setValue(gestureState.dx);
      }
    },
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dx > 150) {
        Haptics.selectionAsync(); // haptic feedback on start of swipe
        setSwiped(true);
        Animated.timing(swipeAnim, {
          toValue: 200,
          duration: 150,
          useNativeDriver: true,
        }).start(() => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); // haptic feedback on completion
          router.push('/onboarding/reminders');
        });
      } else {
        Animated.spring(swipeAnim, { toValue: 0, useNativeDriver: true }).start();
      }
    },
  });

  const knobStyle = {
    transform: [{ translateX: swipeAnim }],
  };

  return (
    <View className="flex-1 bg-background">
      {/* Header */}
      <View className="px-6 pt-16 pb-4 flex-row items-center justify-between">
        <View className="flex-row items-center">
          {[0.6, 0.7, 0.8, 1].map((opacity, i) => (
            <View
              key={i}
              className="w-10 h-10 rounded-full bg-accent-foreground"
              style={{ marginLeft: i === 0 ? 0 : -16, opacity }}
            />
          ))}
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

      {/* Floating Cards */}
      <View className="flex-1 px-6 relative">
        {/* Euro Card */}
        <Animated.View
          className="absolute left-6 top-0 bg-white rounded-3xl shadow-lg p-4 w-60"
          style={{ transform: [{ translateY: floatAnim1 }, { rotate: '-6deg' }] }}
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

        {/* Total Balance Card */}
        <Animated.View
          className="absolute left-6 right-6 top-20 bg-primary rounded-3xl shadow-xl p-5"
          style={{ transform: [{ translateY: floatAnim2 }] }}
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

        {/* Transaction List */}
        <Animated.View
          className="absolute left-6 right-6 bottom-56 bg-white rounded-3xl shadow-lg p-4"
          style={{ transform: [{ translateY: floatAnim1 }] }}
        >
          {[
            { label: 'Netflix', amount: '+2,374.02 EUR', color: 'bg-yellow-100', emoji: '📺' },
            { label: 'Amazon', amount: '-2,231.09 EUR', color: 'bg-green-100', emoji: '📦' },
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

        {/* Company Balance Card */}
        <Animated.View
          className="absolute right-6 bottom-40 bg-white rounded-3xl shadow-lg p-4 w-60"
          style={{ transform: [{ translateY: floatAnim3 }, { rotate: '6deg' }] }}
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

      {/* Swipeable CTA */}
      <View className="absolute bottom-10 left-0 right-0 items-center">
        <View className="w-80 h-14 bg-gray-300 rounded-2xl justify-center px-2 flex-row items-center">
          <Animated.View
            {...panResponder.panHandlers}
            style={[{ width: 56, height: 56, borderRadius: 28, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }, knobStyle]}
          >
            <ArrowRight2 size={24} color="black" />
          </Animated.View>
          {!swiped && (
            <Text className="text-black font-bold ml-4">
              Swipe to Get Started
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}
