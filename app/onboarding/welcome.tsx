import { View, Text, Pressable, Dimensions, StyleSheet } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useEffect, useCallback } from 'react';
import { ArrowCircleRight, ArrowRight2 } from 'iconsax-react-nativejs';
import * as Haptics from 'expo-haptics';
import { BlurView } from 'expo-blur';
import MaskedView from '@react-native-masked-view/masked-view';
import Svg, { Defs, RadialGradient, Stop, Circle, Rect } from 'react-native-svg';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  runOnJS,
  withSpring,
  interpolate,
  Extrapolation,
  interpolateColor,
  SharedValue,
  Easing,
  withDelay,
} from 'react-native-reanimated';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const BUTTON_HEIGHT = 72; // Increased height for better touch target
const BUTTON_WIDTH = 320; // Fixed width matching design
const KNOB_SIZE = 56; // Slightly smaller than height for padding
const PADDING = 4;
const SWIPE_RANGE = BUTTON_WIDTH - KNOB_SIZE - PADDING * 2;
const MAX_RADIUS = Math.hypot(SCREEN_WIDTH, SCREEN_HEIGHT);

export default function Welcome() {
  const router = useRouter();

  // Floating Animations
  const floatAnim1 = useSharedValue(0);
  const floatAnim2 = useSharedValue(0);
  const floatAnim3 = useSharedValue(0);

  // Reveal Animation
  const revealAnim = useSharedValue(0);

  // Reset swipe state when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      // Reveal parameters
      revealAnim.value = withDelay(
        500, // Wait 500ms before starting reveal so user sees black screen
        withTiming(1, { duration: 800, easing: Easing.bezier(0.25, 1, 0.5, 1) })
      );

      // Small delay to ensure smooth transition if coming back with animation
      const timer = setTimeout(() => {
        isComplete.value = false;
        X.value = withSpring(0, { damping: 40, stiffness: 70 });
      }, 100);
      return () => {
        clearTimeout(timer);
        revealAnim.value = 0;
      };
    }, [])
  );

  useEffect(() => {
    const startFloating = (sv: SharedValue<number>, duration: number, offset: number) => {
      sv.value = withRepeat(
        withSequence(
          withTiming(offset, { duration: duration / 2 }),
          withTiming(0, { duration: duration / 2 })
        ),
        -1,
        true
      );
    };

    startFloating(floatAnim1, 4000, -10);
    startFloating(floatAnim2, 5000, -15);
    startFloating(floatAnim3, 4400, -12);
  }, []);

  const animatedStyle1 = useAnimatedStyle(() => ({
    transform: [{ translateY: floatAnim1.value }, { rotate: '-6deg' }],
  }));
  const animatedStyle2 = useAnimatedStyle(() => ({
    transform: [{ translateY: floatAnim2.value }],
  }));
  const animatedStyle3 = useAnimatedStyle(() => ({
    transform: [{ translateY: floatAnim3.value }, { rotate: '6deg' }],
  }));

  const maskStyle = useAnimatedStyle(() => {
    const radius = interpolate(revealAnim.value, [0, 1], [0, MAX_RADIUS]);
    return {
      width: radius * 2,
      height: radius * 2,
      borderRadius: radius,
      bottom: -radius,
      right: -radius,
    };
  });

  // Swipe Logic
  const X = useSharedValue(0);
  const isComplete = useSharedValue(false);

  const animatedKnobStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: X.value }],
    };
  });

  const animatedTrackStyle = useAnimatedStyle(() => {
    return {
      // Optional: Change background color on complete if desired
    };
  });

  const animatedTextStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        X.value,
        [0, SWIPE_RANGE / 2],
        [1, 0],
        Extrapolation.CLAMP
      ),
      transform: [
        {
          translateX: interpolate(
            X.value,
            [0, SWIPE_RANGE],
            [0, 20],
            Extrapolation.CLAMP
          ),
        },
      ],
    };
  });

  const handleComplete = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.push('/onboarding/reminders');
  };

  const gesture = Gesture.Pan()
    .onStart(() => {
      runOnJS(Haptics.selectionAsync)();
    })
    .onUpdate((e) => {
      if (isComplete.value) return;
      X.value = Math.max(0, Math.min(e.translationX, SWIPE_RANGE));
    })
    .onEnd(() => {
      if (isComplete.value) return;
      if (X.value > SWIPE_RANGE * 0.6) {
        X.value = withSpring(SWIPE_RANGE, { damping: 20, stiffness: 200 });
        isComplete.value = true;
        runOnJS(handleComplete)();
      } else {
        X.value = withSpring(0, { damping: 20, stiffness: 200 });
      }
    });

  return (
    <GestureHandlerRootView className="flex-1 bg-black">
      <MaskedView
        style={{ flex: 1 }}
        maskElement={
          <View className="flex-1 bg-transparent relative overflow-hidden">
            <Animated.View
              style={[
                { position: 'absolute', backgroundColor: 'black' },
                maskStyle,
              ]}
            />
          </View>
        }
      >
        <View className="flex-1 bg-background relative">

          {/* Background Glow */}
          <View className="absolute top-60 left-0 right-0 items-center justify-center opacity-40">
            <Svg height="500" width="500" viewBox="0 0 500 500">
              <Defs>
                <RadialGradient
                  id="grad"
                  cx="250"
                  cy="250"
                  r="250"
                  gradientUnits="userSpaceOnUse"
                >
                  <Stop offset="0" stopColor="#EAB308" stopOpacity="0.8" />
                  <Stop offset="1" stopColor="#EAB308" stopOpacity="0" />
                </RadialGradient>
              </Defs>
              <Circle cx="250" cy="250" r="250" fill="url(#grad)" />
            </Svg>
          </View>

          {/* Hero Section */}
          <View className="px-6 pt-4 mt-20">
            <Text className="text-5xl font-bold text-gray-900 leading-[1.1] mb-3">
              Track <Text className="text-primary">today</Text>. Spend better <Text className="text-primary">tomorrow</Text>.
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
              style={animatedStyle1}
            >
              <View className="flex-row items-center mb-3">
                <View className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center mr-2">
                  <Text className="text-xl">₹</Text>
                </View>
                <View>
                  <Text className="text-gray-500 text-xs">INR</Text>
                  <Text className="text-gray-400 text-xs">**** 2155</Text>
                </View>
              </View>
              <Text className="text-2xl font-bold text-gray-900">19,235.50</Text>
            </Animated.View>

            {/* Total Balance Card */}
            <Animated.View
              className="absolute left-6 bg-black p-5 right-6 top-20 rounded-3xl shadow-xl overflow-hidden"
              style={animatedStyle2}
            >

              <Text className="text-white/80 text-xs mb-2">Total Balance</Text>
              <View className="flex-row items-end mb-4">
                <Text className='text-4xl font-bold text-white'>₹ </Text>
                <Text className="text-4xl font-semibold text-white">17,000/-</Text>

              </View>

              <View className="flex-row gap-3">
                <Pressable className="flex-1 bg-white/10 rounded-2xl p-3 items-center">
                  <View className="w-6 h-6 bg-white/20 rounded-lg" />
                </Pressable>
                <Pressable className="flex-1 bg-white/10 rounded-2xl p-3 items-center">
                  <View className="w-6 h-6 bg-white/20 rounded-lg" />
                </Pressable>
              </View>

            </Animated.View>

            {/* Transaction List */}
            <Animated.View
              className="absolute left-6 right-6 bottom-56 bg-white rounded-3xl shadow-lg p-4"
              style={animatedStyle1}
            >
              {[
                { label: 'Food', amount: '₹ 2,374.02', emoji: '🍽️', color: 'bg-gray-300' },
                { label: 'Shopping', amount: '₹ 5,000.00', emoji: '🛍️', color: 'bg-gray-300' },
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
              style={animatedStyle3}
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
            <View
              className="bg-white rounded-full justify-center relative shadow-inner shadow-gray-300 border border-4 border-gray-300"
              style={{ width: BUTTON_WIDTH, height: BUTTON_HEIGHT, padding: PADDING }}
            >
              <View className="absolute inset-0 justify-center items-center z-[-1]">
                <Animated.View
                  className="flex-row items-center"
                  style={animatedTextStyle}
                >
                  <Text className="text-gray-500 font-semibold text-lg">Swipe to Get Started</Text>
                </Animated.View>
              </View>

              <GestureDetector gesture={gesture}>
                <Animated.View
                  className="items-center justify-center"
                  style={[
                    { width: KNOB_SIZE, height: KNOB_SIZE },
                    animatedKnobStyle
                  ]}
                >
                  <ArrowCircleRight size="64" color="rgb(234, 179, 8)" variant="Bold" />
                </Animated.View>
              </GestureDetector>
            </View>
          </View>
        </View>
      </MaskedView>
    </GestureHandlerRootView>
  );
}
