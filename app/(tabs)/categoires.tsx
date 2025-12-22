import React, { useMemo, useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    TextInput,
    Modal,
    Pressable,
    KeyboardAvoidingView,
    Platform,
    Alert,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Category, Wallet, TrendUp, ArrowDown2, Edit2, MoneyRecive, Trash } from 'iconsax-react-nativejs';
import { useExpensesStore } from '../../store/useExpensesStore';

const { width } = Dimensions.get('window');
const ACCENT_COLOR = 'rgb(234, 179, 8)';

export default function CategoriesScreen() {
    const transactions = useExpensesStore((state) => state.transactions);
    const budget = useExpensesStore((state) => state.budget);
    const setBudget = useExpensesStore((state) => state.setBudget);
    const clearHistory = useExpensesStore((state) => state.clearHistory);

    const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);
    const [showBudgetModal, setShowBudgetModal] = useState(false);
    const [budgetInput, setBudgetInput] = useState(budget.toString());


    const totalSpent = useMemo(() => {
        return transactions
            .filter(t => t.category !== 'Income')
            .reduce((acc, t) => acc + t.amount, 0);
    }, [transactions]);

    const categories = useMemo(() => {
        const categoryMap = transactions.reduce((acc, t) => {
            if (t.category === 'Income') return acc;

            if (!acc[t.category]) {
                acc[t.category] = {
                    name: t.category,
                    spent: 0,
                    total: budget,
                    color: t.color || '#C4B5FD',
                    bg: '#EDE9FE'
                };
            }
            acc[t.category].spent += t.amount;
            return acc;
        }, {} as Record<string, any>);

        return Object.values(categoryMap).map(cat => ({
            ...cat,
            percent: Math.min(cat.spent / cat.total, 1),
        }));
    }, [transactions, budget]);

    const sortedCategories = useMemo(() => {
        return [...categories].sort((a, b) => b.spent - a.spent);
    }, [categories]);

    const categoryTransactions = useMemo(() => {
        if (!selectedCategory) return [];
        return transactions
            .filter((t) => t.category === selectedCategory && t.category !== 'Income')
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [selectedCategory, transactions]);

    const handleCategoryPress = (categoryName: string) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setSelectedCategory(selectedCategory === categoryName ? null : categoryName);
    };

    const handleBudgetSave = () => {
        const newBudget = parseFloat(budgetInput);
        if (!isNaN(newBudget) && newBudget > 0) {
            setBudget(newBudget);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            setShowBudgetModal(false);
        }
    };

    const openBudgetModal = () => {
        setBudgetInput(budget.toString());
        setShowBudgetModal(true);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    };

    const handleClearHistory = () => {
        Alert.alert(
            'Clear All History',
            'Are you sure you want to delete all transactions? This action cannot be undone.',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                    onPress: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
                },
                {
                    text: 'Delete All',
                    style: 'destructive',
                    onPress: () => {
                        clearHistory();
                        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                    },
                },
            ],
            { cancelable: true }
        );
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) return 'Today';
        if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';

        return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    };

    return (
        <View className="flex-1 bg-gray-50">

            <View className="bg-white pt-14 pb-6 px-6 shadow-sm">
                <View className="flex-row items-center mb-4">
                    <View className="w-10 h-10 rounded-full items-center justify-center" style={{ backgroundColor: ACCENT_COLOR + '20' }}>
                        <Category size={22} color={ACCENT_COLOR} variant="Bold" />
                    </View>
                    <Text className="text-2xl font-bold text-gray-900 ml-3">Categories</Text>
                </View>


                <View className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                    <View className="flex-row items-center justify-between">
                        <View className="flex-1">
                            <Text className="text-sm text-gray-500 mb-1">Total Spent</Text>
                            <Text className="text-2xl font-bold text-gray-900">{formatCurrency(totalSpent)}</Text>
                        </View>
                        <View className="w-px h-12 bg-gray-200 mx-4" />
                        <View className="flex-1">
                            <Text className="text-sm text-gray-500 mb-1">Categories</Text>
                            <Text className="text-2xl font-bold" style={{ color: ACCENT_COLOR }}>
                                {sortedCategories.length}
                            </Text>
                        </View>
                    </View>


                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={openBudgetModal}
                        className="mt-4 pt-4 border-t border-gray-200"
                    >
                        <View className="flex-row items-center justify-between">
                            <View className="flex-row items-center flex-1">
                                <View
                                    className="w-8 h-8 rounded-lg items-center justify-center"
                                    style={{ backgroundColor: ACCENT_COLOR + '20' }}
                                >
                                    <MoneyRecive size={16} color={ACCENT_COLOR} variant="Bold" />
                                </View>
                                <View className="ml-3">
                                    <Text className="text-xs text-gray-500">Monthly Budget</Text>
                                    <Text className="text-lg font-bold text-gray-900">{formatCurrency(budget)}</Text>
                                </View>
                            </View>
                            <View
                                className="w-8 h-8 rounded-lg items-center justify-center bg-gray-100"
                            >
                                <Edit2 size={14} color="#6B7280" variant="Bold" />
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView
                className="flex-1 px-6"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingTop: 20, paddingBottom: 100 }}
            >
                {sortedCategories.length === 0 ? (
                    <View className="items-center justify-center py-20">
                        <View className="w-20 h-20 rounded-full bg-gray-100 items-center justify-center mb-4">
                            <Wallet size={32} color="#9CA3AF" variant="Bulk" />
                        </View>
                        <Text className="text-lg font-semibold text-gray-900 mb-2">No Expenses Yet</Text>
                        <Text className="text-sm text-gray-500 text-center">
                            Start adding transactions to see{'\n'}your spending by category
                        </Text>
                    </View>
                ) : (
                    sortedCategories.map((category, index) => (
                        <View key={category.name} className="mb-3">
                            <TouchableOpacity
                                activeOpacity={0.7}
                                onPress={() => handleCategoryPress(category.name)}
                                className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
                            >
                                <View className="flex-row items-center justify-between mb-3">
                                    <View className="flex-row items-center flex-1">
                                        <View
                                            className="w-12 h-12 rounded-xl items-center justify-center"
                                            style={{ backgroundColor: ACCENT_COLOR + '15' }}
                                        >
                                            <Text className="text-2xl">
                                                {transactions.find(t => t.category === category.name)?.icon || '📦'}
                                            </Text>
                                        </View>
                                        <View className="ml-3 flex-1">
                                            <Text className="text-base font-semibold text-gray-900">
                                                {category.name}
                                            </Text>
                                            <Text className="text-xs text-gray-500 mt-0.5">
                                                {categoryTransactions.length > 0 ? `${categoryTransactions.length} transactions` : 'No transactions'}
                                            </Text>
                                        </View>
                                    </View>
                                    <View className="items-end">
                                        <Text className="text-lg font-bold text-gray-900">
                                            {formatCurrency(category.spent)}
                                        </Text>
                                        <View className="flex-row items-center mt-1">
                                            <Text className="text-xs font-medium" style={{ color: ACCENT_COLOR }}>
                                                {(category.percent * 100).toFixed(0)}%
                                            </Text>
                                            <ArrowDown2 size={12} color={ACCENT_COLOR} className="ml-1" />
                                        </View>
                                    </View>
                                </View>


                                <View className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <View
                                        className="h-full rounded-full"
                                        style={{
                                            width: `${category.percent * 100}%`,
                                            backgroundColor: ACCENT_COLOR,
                                        }}
                                    />
                                </View>


                                <View className="flex-row items-center justify-between mt-2">
                                    <Text className="text-xs text-gray-400">
                                        of {formatCurrency(category.total)}
                                    </Text>
                                    <Text className="text-xs text-gray-400">
                                        {formatCurrency(category.total - category.spent)} left
                                    </Text>
                                </View>
                            </TouchableOpacity>


                            {selectedCategory === category.name && categoryTransactions.length > 0 && (
                                <View className="bg-white rounded-2xl mt-2 border border-gray-100 overflow-hidden">
                                    {categoryTransactions.map((transaction, txIndex) => (
                                        <View
                                            key={transaction.id}
                                            className={`px-4 py-3 flex-row items-center justify-between ${txIndex !== categoryTransactions.length - 1 ? 'border-b border-gray-50' : ''
                                                }`}
                                        >
                                            <View className="flex-row items-center flex-1">
                                                <View
                                                    className="w-10 h-10 rounded-xl items-center justify-center"
                                                    style={{ backgroundColor: ACCENT_COLOR + '10' }}
                                                >
                                                    <Text className="text-lg">{transaction.icon}</Text>
                                                </View>
                                                <View className="ml-3 flex-1">
                                                    <Text className="text-sm font-medium text-gray-900">
                                                        {transaction.name}
                                                    </Text>
                                                    <Text className="text-xs text-gray-400 mt-0.5">
                                                        {formatDate(transaction.date)}
                                                    </Text>
                                                </View>
                                            </View>
                                            <Text className="text-sm font-semibold text-gray-900">
                                                {formatCurrency(transaction.amount)}
                                            </Text>
                                        </View>
                                    ))}
                                </View>
                            )}
                        </View>
                    ))
                )}


                {sortedCategories.length > 0 && (
                    <View className="bg-white rounded-2xl p-5 mt-4 border border-gray-100">
                        <View className="flex-row items-center mb-4">
                            <TrendUp size={20} color={ACCENT_COLOR} variant="Bold" />
                            <Text className="text-base font-semibold text-gray-900 ml-2">
                                Spending Insights
                            </Text>
                        </View>

                        <View className="space-y-3">
                            <View className="bg-gray-50 rounded-xl p-3">
                                <Text className="text-xs text-gray-500 mb-1">Top Category</Text>
                                <Text className="text-sm font-semibold text-gray-900">
                                    {sortedCategories[0]?.name} • {formatCurrency(sortedCategories[0]?.spent)}
                                </Text>
                            </View>

                            <View className="bg-gray-50 rounded-xl p-3">
                                <Text className="text-xs text-gray-500 mb-1">Budget Utilization</Text>
                                <Text className="text-sm font-semibold text-gray-900">
                                    {((totalSpent / budget) * 100).toFixed(1)}% of monthly budget
                                </Text>
                            </View>
                        </View>
                    </View>
                )}


                {transactions.length > 0 && (
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={handleClearHistory}
                        className="bg-red-50 rounded-2xl p-5 mt-4 border border-red-100"
                    >
                        <View className="flex-row items-center justify-center">
                            <Trash size={20} color="#EF4444" variant="Bold" />
                            <Text className="text-base font-semibold text-red-500 ml-2">
                                Clear All History
                            </Text>
                        </View>
                        <Text className="text-xs text-red-400 text-center mt-2">
                            This will permanently delete all {transactions.length} transactions
                        </Text>
                    </TouchableOpacity>
                )}
            </ScrollView>


            <Modal
                visible={showBudgetModal}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowBudgetModal(false)}
            >
                <Pressable
                    className="flex-1 bg-black/50 justify-center items-center px-6"
                    onPress={() => setShowBudgetModal(false)}
                >
                    <Pressable
                        className="bg-white rounded-3xl p-6 w-full max-w-sm"
                        onPress={(e) => e.stopPropagation()}
                    >
                        <View className="items-center mb-6">
                            <View
                                className="w-16 h-16 rounded-2xl items-center justify-center mb-4"
                                style={{ backgroundColor: ACCENT_COLOR + '20' }}
                            >
                                <MoneyRecive size={32} color={ACCENT_COLOR} variant="Bold" />
                            </View>
                            <Text className="text-2xl font-bold text-gray-900 mb-1">Set Monthly Budget</Text>
                            <Text className="text-sm text-gray-500 text-center">
                                Define your spending limit for the month
                            </Text>
                        </View>

                        <View className="mb-6">
                            <Text className="text-sm font-medium text-gray-700 mb-2">Budget Amount</Text>
                            <View className="bg-gray-50 rounded-xl border-2 border-gray-200 px-4 py-3 flex-row items-center">
                                <Text className="text-lg font-semibold text-gray-400 mr-2">₹</Text>
                                <TextInput
                                    className="flex-1 text-xl font-bold text-gray-900"
                                    value={budgetInput}
                                    onChangeText={setBudgetInput}
                                    keyboardType="numeric"
                                    placeholder="50000"
                                    placeholderTextColor="#9CA3AF"
                                    autoFocus
                                />
                            </View>


                            <View className="flex-row mt-3 space-x-2">
                                {[25000, 50000, 75000, 100000].map((amount) => (
                                    <TouchableOpacity
                                        key={amount}
                                        activeOpacity={0.7}
                                        onPress={() => {
                                            setBudgetInput(amount.toString());
                                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                        }}
                                        className="flex-1 bg-gray-100 rounded-lg py-2 items-center"
                                    >
                                        <Text className="text-xs font-semibold text-gray-600">
                                            {amount >= 100000 ? `${amount / 1000}k` : `${amount / 1000}k`}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        <View className="flex-row space-x-3">
                            <TouchableOpacity
                                activeOpacity={0.7}
                                onPress={() => setShowBudgetModal(false)}
                                className="flex-1 bg-gray-100 rounded-xl py-4 items-center"
                            >
                                <Text className="text-base font-semibold text-gray-700">Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                activeOpacity={0.7}
                                onPress={handleBudgetSave}
                                className="flex-1 rounded-xl py-4 items-center"
                                style={{ backgroundColor: ACCENT_COLOR }}
                            >
                                <Text className="text-base font-semibold text-white">Save Budget</Text>
                            </TouchableOpacity>
                        </View>
                    </Pressable>
                </Pressable>
            </Modal>
        </View>
    );
}