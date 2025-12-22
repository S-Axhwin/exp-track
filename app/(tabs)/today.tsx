import React, { useEffect, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Dimensions, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';

import Animated, { FadeInDown, FadeIn, useSharedValue, useAnimatedStyle, withTiming, withRepeat, withSequence, useAnimatedScrollHandler, runOnJS, interpolate, Extrapolation, useDerivedValue, scrollTo, useAnimatedRef, interpolateColor, useAnimatedReaction } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { ScreenReveal } from "../../components/ScreenReveal"
import { useExpensesStore, selectTotalSpent, selectRemaining, selectDailyAverage, selectCategories } from '../../store/useExpensesStore';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = 50;
const SPACING = 12;
const SNAP_INTERVAL = ITEM_WIDTH + SPACING;
const SIDE_SPACER = (width - ITEM_WIDTH) / 2;

const DATES = Array.from({ length: 30 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() + (i - 15));
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dateOnly = new Date(date);
  dateOnly.setHours(0, 0, 0, 0);

  const isToday = date.toDateString() === today.toDateString();
  const isFuture = dateOnly.getTime() > today.getTime();

  return {
    fullDate: date.toISOString().split('T')[0],
    dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
    dayNumber: date.getDate(),
    monthName: date.toLocaleDateString('en-US', { month: 'short' }),
    raw: date,
    isToday,
    isFuture
  };
});

const INITIAL_INDEX = DATES.findIndex(date => date.isToday) !== -1 ? DATES.findIndex(date => date.isToday) : 15;

export default function Insights() {
  const { transactions, fetchData, budget, isLoading } = useExpensesStore();
  const [selectedDate, setSelectedDate] = React.useState(new Date().toISOString().split('T')[0]);

  const scrollX = useSharedValue(1);
  const flatListRef = useAnimatedRef<Animated.FlatList<any>>();


  useAnimatedReaction(
    () => Math.round(scrollX.value / SNAP_INTERVAL),
    (currentIndex, previousIndex) => {
      if (currentIndex !== previousIndex) {
        runOnJS(Haptics.selectionAsync)();
      }
    }
  );

  const onScroll = useAnimatedScrollHandler((event) => {
    scrollX.value = event.contentOffset.x;
  });


  const filteredTransactions = useMemo(() => {
    return transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      const transactionDateString = transactionDate.getFullYear() + '-' +
        String(transactionDate.getMonth() + 1).padStart(2, '0') + '-' +
        String(transactionDate.getDate()).padStart(2, '0');

      return transactionDateString === selectedDate;
    });
  }, [transactions, selectedDate]);


  const dailyStats = useMemo(() => {
    const total = filteredTransactions.reduce((sum, t) => sum + t.amount, 0);
    const categoryBreakdown = filteredTransactions.reduce((acc, t) => {
      const category = t.category || 'Other';
      acc[category] = (acc[category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

    return {
      total,
      count: filteredTransactions.length,
      categoryBreakdown
    };
  }, [filteredTransactions]);


  const totalSpent = useExpensesStore(selectTotalSpent);
  const remaining = useExpensesStore(selectRemaining);
  const dailyAvg = useExpensesStore(selectDailyAverage);
  const categories = useMemo(() => selectCategories({ transactions } as any), [transactions]);


  const progressPercentage = Math.min(totalSpent / budget, 1);


  const selectedDateInfo = DATES.find(d => d.fullDate === selectedDate);

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) {
    return <InsightsSkeleton />;
  }

  return (
    <ScreenReveal duration={1000}>
      <View className="flex-1 bg-background">
        <SafeAreaView edges={['top']} className="flex-1">
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>


            <Animated.View
              entering={FadeInDown.duration(600).springify()}
              className="mx-4 bg-gray-900 rounded-[32px] p-6 mb-8"
            >
              <Text className="text-gray-400 text-lg mb-6">
                Count Your <Text className="text-white font-bold">Monthly Budget</Text>
              </Text>

              <View className="flex-row items-center justify-between mb-8">

                <View className="items-center">
                  <View className="h-10 justify-end mb-2">
                    <View className="flex-row h-full items-end gap-[2px]">
                      <View className="w-1 h-3 bg-gray-700 rounded-full" />
                      <View className="w-1 h-5 bg-gray-600 rounded-full" />
                      <View className="w-1 h-2 bg-gray-700 rounded-full" />
                      <View className="w-1 h-6 bg-gray-500 rounded-full" />
                    </View>
                  </View>
                  <Text className="text-gray-400 text-[10px] uppercase font-bold mb-1">SPENT</Text>
                  <Text className="text-white text-base font-bold">₹{totalSpent.toLocaleString()}</Text>
                </View>

                {/* Center Circle */}
                <View className="items-center justify-center">
                  <Svg height="140" width="140" viewBox="0 0 140 140">
                    <Circle
                      cx="70"
                      cy="70"
                      r="60"
                      stroke="#374151"
                      strokeWidth="12"
                      fill="transparent"
                    />
                    <Circle
                      cx="70"
                      cy="70"
                      r="60"
                      stroke="#EAB308"
                      strokeWidth="12"
                      fill="transparent"
                      strokeDasharray="377"
                      strokeDashoffset={377 * (1 - progressPercentage)}
                      strokeLinecap="round"
                      rotation="-90"
                      origin="70, 70"
                    />
                    <Circle cx="70" cy="70" r="50" fill="#EAB308" />
                  </Svg>
                  <View className="absolute items-center">
                    <Text className="text-gray-900 text-3xl font-extrabold">{(remaining / 1000).toFixed(1)}k</Text>
                    <Text className="text-gray-900 text-[10px] font-bold opacity-80 uppercase">RES. BUDGET</Text>
                  </View>
                </View>


                <View className="items-center">
                  <View className="h-10 justify-end mb-2">
                    <View className="flex-row h-full items-end gap-[2px]">
                      <View className="w-1 h-4 bg-gray-700 rounded-full" />
                      <View className="w-1 h-2 bg-gray-700 rounded-full" />
                      <View className="w-1 h-6 bg-gray-500 rounded-full" />
                      <View className="w-1 h-3 bg-gray-700 rounded-full" />
                    </View>
                  </View>
                  <Text className="text-gray-400 text-[10px] uppercase font-bold mb-1">DAILY AVG</Text>
                  <Text className="text-white text-base font-bold">₹{dailyAvg.toLocaleString()}</Text>
                </View>
              </View>
            </Animated.View>


            <Animated.View
              key={selectedDate}
              entering={FadeIn.duration(300)}
              className="mx-4 mb-6 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-[28px] p-6"
            >
              <View className="flex-row items-center justify-between mb-4">
                <View>
                  <Text className="text-gray-900 text-sm font-semibold opacity-70">
                    {selectedDateInfo?.isToday ? 'Today' : `${selectedDateInfo?.dayName}, ${selectedDateInfo?.monthName} ${selectedDateInfo?.dayNumber}`}
                  </Text>
                  <Text className="text-gray-900 text-3xl font-extrabold mt-1">
                    ₹{dailyStats.total.toLocaleString()}
                  </Text>
                  <Text className="text-gray-900 text-xs font-semibold opacity-60 mt-1">
                    {dailyStats.count} {dailyStats.count === 1 ? 'transaction' : 'transactions'}
                  </Text>
                </View>


                <View className="items-end">
                  <View className="bg-gray-900/20 rounded-full px-4 py-2">
                    <Text className="text-gray-900 text-xs font-bold">
                      {dailyStats.total > 0 ? `${((dailyStats.total / budget) * 100).toFixed(1)}%` : '0%'}
                    </Text>
                    <Text className="text-gray-900 text-[9px] font-semibold opacity-60">of budget</Text>
                  </View>
                </View>
              </View>


              {Object.keys(dailyStats.categoryBreakdown).length > 0 && (
                <View className="flex-row flex-wrap gap-2">
                  {Object.entries(dailyStats.categoryBreakdown).map(([category, amount]) => (
                    <View key={category} className="bg-gray-900/20 rounded-full px-3 py-1.5">
                      <Text className="text-gray-900 text-xs font-bold">
                        {category}: ₹{amount}
                      </Text>
                    </View>
                  ))}
                </View>
              )}

              {dailyStats.total === 0 && (
                <View className="items-center py-2">
                  <Text className="text-gray-900 text-sm font-semibold opacity-60">
                    No expenses recorded
                  </Text>
                </View>
              )}
            </Animated.View>


            <View className="mb-6">
              <View
                pointerEvents="none"
                className="absolute bg-yellow-500 rounded-full h-[60px] w-[50px] z-0"
                style={{
                  left: SIDE_SPACER,
                  top: 2,
                }}
              />

              <Animated.FlatList
                ref={flatListRef}
                horizontal
                data={DATES}
                keyExtractor={(item) => item.fullDate}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: SIDE_SPACER, gap: SPACING }}
                snapToInterval={SNAP_INTERVAL}
                decelerationRate="fast"
                onScroll={onScroll}
                scrollEventThrottle={16}
                initialScrollIndex={INITIAL_INDEX}
                getItemLayout={(data, index) => (
                  { length: SNAP_INTERVAL, offset: SNAP_INTERVAL * index, index }
                )}
                onMomentumScrollEnd={(event) => {
                  const index = Math.round(event.nativeEvent.contentOffset.x / SNAP_INTERVAL);
                  const item = DATES[index];
                  if (item && !item.isFuture) {
                    setSelectedDate(item.fullDate);
                  }
                }}
                renderItem={({ item, index }) => {
                  return (
                    <CalendarItem
                      item={item}
                      index={index}
                      scrollX={scrollX}
                      onPress={() => {
                        if (!item.isFuture) {
                          setSelectedDate(item.fullDate);
                          flatListRef.current?.scrollToIndex({ index, animated: true });
                        }
                      }}
                    />
                  );
                }}
              />
            </View>



            <View className="px-4 gap-4">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((item, i) => (
                  <Animated.View
                    key={item.id}
                    entering={FadeInDown.delay(50 * (i + 1)).springify()}
                    className="bg-white p-4 rounded-[20px] shadow-sm flex-row items-center border border-gray-100"
                  >
                    <View className={`w-12 h-12 rounded-full items-center justify-center mr-4 ${item.color}`}>
                      <Text className="text-xl">
                        {item.icon}
                      </Text>
                    </View>
                    <View className="flex-1">
                      <Text className="text-lg font-bold text-gray-900">{item.name}</Text>
                      <Text className="text-gray-400 text-xs">{new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                    </View>
                    <View>
                      <Text className="font-bold text-gray-900">₹{item.amount.toLocaleString()}</Text>
                    </View>
                  </Animated.View>
                ))
              ) : (
                <View className="items-center py-12">
                  <View className="w-20 h-20 rounded-full bg-gray-100 items-center justify-center mb-4">
                    <Text className="text-4xl">📭</Text>
                  </View>
                  <Text className="text-gray-900 font-bold text-lg mb-1">No transactions yet</Text>
                  <Text className="text-gray-400 text-sm">
                    {selectedDateInfo?.isFuture ? 'Future date selected' : 'No expenses recorded for this day'}
                  </Text>
                </View>
              )}
            </View>

          </ScrollView>
        </SafeAreaView>
      </View>
    </ScreenReveal>
  );
}



const CalendarItem = ({ item, index, scrollX, onPress }: any) => {
  const rAnimatedStyle = useAnimatedStyle(() => {
    const inputRange = [
      (index - 1) * SNAP_INTERVAL,
      index * SNAP_INTERVAL,
      (index + 1) * SNAP_INTERVAL,
    ];

    const scale = interpolate(
      scrollX.value,
      inputRange,
      [0.8, 1.2, 0.8],
      Extrapolation.CLAMP
    );

    return {
      transform: [{ scale }],
    };
  });

  const rTextStyle = useAnimatedStyle(() => {
    const inputRange = [
      (index - 0.5) * SNAP_INTERVAL,
      index * SNAP_INTERVAL,
      (index + 0.5) * SNAP_INTERVAL,
    ];

    const color = interpolateColor(
      scrollX.value,
      inputRange,
      ['rgb(156, 163, 175)', 'rgb(255, 255, 255)', 'rgb(156, 163, 175)']
    );

    return { color };
  });

  const rDayNumberStyle = useAnimatedStyle(() => {
    const inputRange = [
      (index - 0.5) * SNAP_INTERVAL,
      index * SNAP_INTERVAL,
      (index + 0.5) * SNAP_INTERVAL,
    ];

    const color = interpolateColor(
      scrollX.value,
      inputRange,
      ['rgb(17, 24, 39)', 'rgb(255, 255, 255)', 'rgb(17, 24, 39)']
    );

    return { color };
  });

  return (
    <TouchableOpacity onPress={onPress} disabled={item.isFuture} activeOpacity={0.7}>
      <Animated.View
        style={[rAnimatedStyle, { opacity: item.isFuture ? 0.3 : 1 }]}
        className="items-center justify-center w-[50px] py-3 rounded-full gap-1 bg-transparent"
      >
        <Animated.Text style={rTextStyle} className="text-xs font-bold">
          {item.dayName}
        </Animated.Text>
        <Animated.Text style={rDayNumberStyle} className="text-sm font-bold">
          {item.dayNumber}
        </Animated.Text>


        {item.isToday && (
          <View className="w-1 h-1 rounded-full bg-white absolute bottom-2" />
        )}
      </Animated.View>
    </TouchableOpacity>
  )
}

const Skeleton = ({ className, style }: { className?: string, style?: any }) => {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.7, { duration: 800 }),
        withTiming(0.3, { duration: 800 })
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      className={`bg-gray-300 rounded-lg ${className}`}
      style={[style, animatedStyle]}
    />
  );
};

const InsightsSkeleton = () => {
  return (
    <View className="flex-1 bg-background">
      <SafeAreaView edges={['top']} className="flex-1">
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>


          <View className="mx-4 bg-gray-900 rounded-[32px] p-6 mb-8 h-[360px]">

            <Skeleton className="w-48 h-6 bg-gray-700 mb-6" />


            <View className="flex-row justify-between items-center mb-8">
              <View>
                <Skeleton className="w-10 h-10 bg-gray-700 mb-2" />
                <Skeleton className="w-12 h-3 bg-gray-700" />
              </View>


              <View className="items-center">
                <View className="w-[140px] h-[140px] rounded-full border-[12px] border-gray-800 items-center justify-center">
                  <Skeleton className="w-20 h-8 bg-gray-700 mb-1" />
                  <Skeleton className="w-16 h-3 bg-gray-700" />
                </View>
              </View>

              <View>
                <Skeleton className="w-10 h-10 bg-gray-700 mb-2" />
                <Skeleton className="w-12 h-3 bg-gray-700" />
              </View>
            </View>


            <View className="flex-row gap-3">
              {[1, 2, 3].map(i => (
                <Skeleton key={i} className="flex-1 h-32 rounded-[24px] bg-gray-800" />
              ))}
            </View>
          </View>


          <View className="mb-6 px-4 flex-row gap-3 overflow-hidden">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Skeleton key={i} className="w-[50px] h-[70px] rounded-full" />
            ))}
          </View>


          <View className="mx-4 mb-6">
            <Skeleton className="h-32 rounded-[28px]" />
          </View>


          <View className="px-4 gap-4">
            {[1, 2, 3].map(i => (
              <View key={i} className="flex-row items-center gap-4">
                <Skeleton className="w-12 h-12 rounded-full" />
                <View className="flex-1 gap-2">
                  <Skeleton className="w-32 h-4" />
                  <Skeleton className="w-20 h-3" />
                </View>
                <Skeleton className="w-16 h-5" />
              </View>
            ))}
          </View>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
};