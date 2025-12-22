import { View, Text, TouchableOpacity, TextInput, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useExpensesStore } from '../../store/useExpensesStore';
import { useState } from 'react';
import { Edit2, DollarCircle, InfoCircle } from 'iconsax-react-nativejs';

export default function Settings() {
  const { budget, setBudget } = useExpensesStore();
  const [isEditing, setIsEditing] = useState(false);
  const [newBudget, setNewBudget] = useState(budget.toString());

  const handleSaveData = () => {
    const parsed = parseFloat(newBudget);
    if (isNaN(parsed) || parsed < 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid budget amount');
      return;
    }
    setBudget(parsed);
    setIsEditing(false);
  };

  return (
    <View className="flex-1 bg-background pt-12 px-6">
      <Text className="text-4xl font-bold text-foreground mb-8">Settings</Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Budget Section */}
        <View className="bg-white p-6 rounded-3xl mb-6 shadow-sm border border-gray-100">
          <View className="flex-row justify-between items-center mb-4">
            <View className="flex-row items-center gap-2">
              <View className="w-10 h-10 bg-yellow-100 rounded-full items-center justify-center">
                <DollarCircle size={20} color="#EAB308" variant="Bold" />
              </View>
              <Text className="text-lg font-bold text-gray-900">Monthly Budget</Text>
            </View>
            <TouchableOpacity onPress={() => setIsEditing(!isEditing)} className="p-2">
              <Edit2 size={24} color="#666" variant={isEditing ? "Bold" : "Linear"} />
            </TouchableOpacity>
          </View>

          {isEditing ? (
            <View className="flex-row items-center gap-3">
              <TextInput
                className="flex-1 bg-gray-50 p-4 rounded-xl text-xl font-bold border border-gray-200"
                value={newBudget}
                onChangeText={setNewBudget}
                keyboardType="numeric"
                autoFocus
              />
              <TouchableOpacity
                className="bg-black px-6 py-4 rounded-xl"
                onPress={handleSaveData}
              >
                <Text className="text-white font-bold">Save</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <Text className="text-3xl font-bold text-gray-900 mt-2">
              ₹{budget.toLocaleString()}
            </Text>
          )}

          <Text className="text-gray-400 text-sm mt-4 leading-5">
            This amount is used to calculate your remaining balance and daily spending limits.
          </Text>
        </View>

        {/* App Info */}
        <View className="bg-gray-50 p-6 rounded-3xl mb-6">
          <View className="flex-row items-center gap-3 mb-2">
            <InfoCircle size={20} color="#666" />
            <Text className="font-bold text-gray-600">About App</Text>
          </View>
          <Text className="text-gray-500">Version 1.0.0</Text>
          <Text className="text-gray-400 text-xs mt-1">Built with Expo & React Native</Text>
        </View>

      </ScrollView>
    </View>
  );
}
