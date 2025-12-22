import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, TextInput, ActivityIndicator, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import MaskedView from '@react-native-masked-view/masked-view';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  Easing,
  runOnJS,
  FadeInUp,
  FadeIn
} from 'react-native-reanimated';
import { CloseCircle, TickCircle, MagicStar } from 'iconsax-react-nativejs';
import { useExpensesStore } from '../../store/useExpensesStore';
import { predictExpense, PredictionData } from '../../services/expenseService';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const MAX_RADIUS = Math.hypot(SCREEN_WIDTH, SCREEN_HEIGHT);

export default function AddExpense() {
  const router = useRouter();
  const revealAnim = useSharedValue(0);
  const addTransaction = useExpensesStore(state => state.addTransaction);

  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [prediction, setPrediction] = useState<PredictionData | null>(null);


  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    revealAnim.value = withTiming(1, {
      duration: 500,
      easing: Easing.out(Easing.quad),
    });
  }, []);

  const handleClose = () => {
    revealAnim.value = withTiming(0, {
      duration: 300,
      easing: Easing.in(Easing.quad),
    }, (finished) => {
      if (finished) {
        runOnJS(router.back)();
      }
    });
  };

  const handlePredict = async () => {
    console.log("let see");

    if (!inputText.trim()) return;
    setIsLoading(true);
    setPrediction(null);
    try {
      console.log("prditinc:::");

      const result = await predictExpense(inputText);
      console.log("result", result);
      if (result.success && !Array.isArray(result.data)) {
        const data = result.data;
        setPrediction(data);
        setAmount(data.amount || '');
        setCategory(data.category || 'Other');
        setDescription(data.description || inputText);
        setDate(data.date || new Date().toISOString().split('T')[0]);
      } else {
        Alert.alert('Error', 'Could not understand expense. Please fill manually.');
        // Fill basic
        setDescription(inputText);
        setPrediction({ confidence: 0 } as any); // Mock prediction to show form
      }
    } catch (e) {
      Alert.alert('Error', 'Prediction failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    if (!amount || !category) {
      Alert.alert('Missing Info', 'Please provide at least amount and category');
      return;
    }

    addTransaction({
      id: Date.now().toString(),
      name: description || 'Expense',
      amount: parseFloat(amount),
      date: new Date().toISOString(),
      category: category,
      icon: getIconForCategory(category),
      color: getColorForCategory(category),
    });

    handleClose();
  };

  const maskStyle = useAnimatedStyle(() => {
    const radius = interpolate(revealAnim.value, [0, 1], [0, MAX_RADIUS]);
    return {
      width: radius * 2,
      height: radius * 2,
      borderRadius: radius,
      opacity: 1,
    };
  });

  const contentStyle = useAnimatedStyle(() => ({
    opacity: interpolate(revealAnim.value, [0, 0.1, 1], [0, 1, 1]),
  }));

  const renderMask = () => (
    <View style={styles.maskWrapper} pointerEvents="none">
      <Animated.View style={[styles.maskCircle, maskStyle]} />
    </View>
  );

  return (
    <View style={styles.container}>
      <MaskedView style={styles.flex1} maskElement={renderMask()}>
        <View style={styles.contentContainer}>
          <Animated.View style={[styles.flex1, contentStyle]}>
            <SafeAreaViewWrapper>
              <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 100 }}>


                  <View className="flex-row justify-between items-center mb-8">
                    <Text className="text-3xl font-bold text-foreground">New Expense</Text>
                    <TouchableOpacity onPress={handleClose} style={{ padding: 4 }}>
                      <CloseCircle size={32} color="#000" />
                    </TouchableOpacity>
                  </View>


                  {!prediction && (
                    <Animated.View entering={FadeInUp.delay(200)}>
                      <Text className="text-lg text-muted-foreground mb-4">Describe it (e.g., "Lunch 200")</Text>
                      <View className="flex-row items-center gap-3">
                        <TextInput
                          className="flex-1 bg-gray-100 p-4 rounded-2xl text-lg text-foreground"
                          placeholder="Type here..."
                          value={inputText}
                          onChangeText={setInputText}
                          onSubmitEditing={handlePredict}
                          autoFocus
                        />
                        <TouchableOpacity
                          className="w-14 h-14 bg-black rounded-2xl items-center justify-center"
                          onPress={handlePredict}
                          disabled={isLoading}
                        >
                          {isLoading ? <ActivityIndicator color="white" /> : <MagicStar size={24} color="white" variant="Bold" />}
                        </TouchableOpacity>
                      </View>
                    </Animated.View>
                  )}


                  {(prediction || (!isLoading && prediction)) && (
                    <Animated.View entering={FadeIn.duration(400)} className="mt-8 space-y-6">


                      <View>
                        <Text className="text-sm text-gray-500 font-bold uppercase mb-2">Amount</Text>
                        <View className="flex-row items-center border-b-2 border-gray-200 pb-2">
                          <Text className="text-3xl font-bold text-gray-900 mr-2">₹</Text>
                          <TextInput
                            className="text-4xl font-bold text-gray-900 flex-1"
                            value={amount}
                            onChangeText={setAmount}
                            keyboardType="numeric"
                            placeholder="0"
                          />
                        </View>
                      </View>


                      <View>
                        <Text className="text-sm text-gray-500 font-bold uppercase mb-2">Category</Text>
                        <TextInput
                          className="bg-gray-50 p-4 rounded-xl text-lg font-semibold"
                          value={category}
                          onChangeText={setCategory}
                          placeholder="Food, Transport..."
                        />
                      </View>


                      <View>
                        <Text className="text-sm text-gray-500 font-bold uppercase mb-2">Note</Text>
                        <TextInput
                          className="bg-gray-50 p-4 rounded-xl text-lg"
                          value={description}
                          onChangeText={setDescription}
                          placeholder="Description"
                        />
                      </View>


                      <TouchableOpacity
                        className="bg-black py-4 rounded-2xl items-center mt-4 shadow-lg active:scale-95"
                        onPress={handleSave}
                      >
                        <Text className="text-white text-xl font-bold">Save Expense</Text>
                      </TouchableOpacity>

                    </Animated.View>
                  )}

                </ScrollView>
              </KeyboardAvoidingView>
            </SafeAreaViewWrapper>
          </Animated.View>
        </View>
      </MaskedView>
    </View>
  );
}


const SafeAreaViewWrapper = ({ children }: { children: React.ReactNode }) => (
  <View className="flex-1 pt-12 bg-white">{children}</View>
);

const getIconForCategory = (cat: string) => {
  const map: any = { Food: '🍔', Transport: '🚗', Shopping: '🛍️', Bills: '💡', Health: '🏥' };
  return map[cat] || '📦';
};

const getColorForCategory = (cat: string) => {
  // Tailwind classes would be better but for consistency with existing store mock:
  const map: any = { Food: 'bg-green-100', Transport: 'bg-yellow-100', Shopping: 'bg-blue-100' };
  return map[cat] || 'bg-gray-100';
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent' },
  flex1: { flex: 1 },
  maskWrapper: { flex: 1, backgroundColor: 'transparent', alignItems: 'center', justifyContent: 'flex-end' },
  maskCircle: { backgroundColor: 'black', position: 'absolute', bottom: -50 },
  contentContainer: { flex: 1, backgroundColor: 'white' },
});
