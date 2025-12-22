import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Add } from 'iconsax-react-nativejs';
import { useRouter } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  Easing,
  interpolate,
  Extrapolation
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';

export default function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const router = useRouter();


  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);

  const animatedFABStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { rotate: `${rotation.value}deg` },
        { scale: scale.value || 1 }
      ],
    };
  });

  const handleAddPress = () => {

    rotation.value = withSpring(135, {
      damping: 15,
      stiffness: 150,
    });


    scale.value = withTiming(0.85, { duration: 100 }, () => {
      scale.value = withTiming(1, { duration: 100 });
    });


    setTimeout(() => {
      router.push('/(modals)/add-expense');

      setTimeout(() => {
        rotation.value = withSpring(0, {
          damping: 15,
          stiffness: 150,
        });
      }, 300);
    }, 150);
  };


  const visibleRoutes = state.routes.filter(
    route => route.name === 'today' || route.name === 'categoires'
  );

  const sortedRoutes = visibleRoutes.sort((a, b) => {
    if (a.name === 'today') return -1;
    if (b.name === 'today') return 1;
    return 0;
  });

  return (
    <View className="absolute bottom-0 left-0 right-0 items-center pb-8" pointerEvents="box-none">

      <View style={styles.tabBarContainer}>

        <View style={[styles.tabBarLayer, { backgroundColor: '#1a1a1a', transform: [{ translateY: 8 }] }]} />
        <View style={[styles.tabBarLayer, { backgroundColor: '#0f0f0f', transform: [{ translateY: 4 }] }]} />


        <BlurView intensity={80} tint="dark" style={styles.tabBarMain}>
          <View className="bg-black/90 flex-row items-center justify-around h-full rounded-[40px] px-6">
            {sortedRoutes.map((route, index) => {
              const { options } = descriptors[route.key];
              const isFocused = state.index === state.routes.findIndex(r => r.key === route.key);

              const onPress = () => {
                const event = navigation.emit({
                  type: 'tabPress',
                  target: route.key,
                  canPreventDefault: true,
                });

                if (!isFocused && !event.defaultPrevented) {
                  navigation.navigate(route.name);
                }
              };

              const IconComponent = options.tabBarIcon;

              return (
                <React.Fragment key={route.key}>
                  {index === 1 && (

                    <View style={{ width: 60 }} />
                  )}

                  <TabButton
                    onPress={onPress}
                    isFocused={isFocused}
                    IconComponent={IconComponent}
                    label={options.tabBarLabel || route.name}
                  />
                </React.Fragment>
              );
            })}
          </View>
        </BlurView>


        <View style={styles.fabContainer} pointerEvents="box-none">

          <View style={[styles.fabShadow, { backgroundColor: '#EAB308', opacity: 0.3, transform: [{ scale: 1.15 }] }]} />
          <View style={[styles.fabShadow, { backgroundColor: '#EAB308', opacity: 0.2, transform: [{ scale: 1.25 }] }]} />


          <Animated.View style={animatedFABStyle}>
            <TouchableOpacity
              style={styles.fab}
              onPress={handleAddPress}
              activeOpacity={0.9}
            >
              <View style={styles.fabInner}>
                <Add size={32} color="#000" variant="Linear" />
              </View>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    </View>
  );
}

const TabButton = ({ onPress, isFocused, IconComponent, label }: any) => {
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value || 1 },
        { translateY: translateY.value || 0 }
      ],
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.85, { damping: 15, stiffness: 400 });
    translateY.value = withSpring(2, { damping: 15, stiffness: 400 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
    translateY.value = withSpring(0, { damping: 15, stiffness: 400 });
  };

  return (
    <Animated.View style={animatedStyle}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        className="items-center justify-center"
        activeOpacity={1}
      >
        <View className={`w-16 h-16 items-center justify-center rounded-[20px] ${isFocused ? 'bg-yellow-500/20' : ''}`}>
          {IconComponent && (
            IconComponent({
              focused: isFocused,
              color: isFocused ? '#EAB308' : '#737373',
              size: 28,
            })
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  tabBarContainer: {
    width: '85%',
    maxWidth: 380,
    height: 72,
    position: 'relative',
  },
  tabBarLayer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 40,
  },
  tabBarMain: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
    overflow: 'hidden',
  },
  fabContainer: {
    position: 'absolute',
    top: -30,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabShadow: {
    position: 'absolute',
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  fab: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#EAB308',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#EAB308',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 12,
  },
  fabInner: {
    width: '100%',
    height: '100%',
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: 'rgba(0,0,0,0.1)',
  },
});