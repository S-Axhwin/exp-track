import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Transaction {
    id: string;
    name: string;
    amount: number;
    date: string;
    category: string;
    icon: string;
    color: string;
}

interface ExpensesState {
    transactions: Transaction[];
    budget: number;
    isLoading: boolean;
    error: string | null;


    fetchData: () => Promise<void>;
    addTransaction: (transaction: Transaction) => void;
    setBudget: (budget: number) => void;
    clearHistory: () => void;
}

export const useExpensesStore = create<ExpensesState>()(
    persist(
        (set, get) => ({
            transactions: [],
            budget: 50000,
            isLoading: false,
            error: null,

            fetchData: async () => {
                set({ isLoading: false });
            },

            addTransaction: (transaction: Transaction) => {
                set((state) => ({
                    transactions: [transaction, ...state.transactions]
                }));
            },

            setBudget: (budget: number) => {
                set({ budget });
            },

            clearHistory: () => {
                set({ transactions: [] });
            },
        }),
        {
            name: 'expenses-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);


export const selectTotalSpent = (state: ExpensesState) =>
    state.transactions
        .filter(t => t.category !== 'Income')
        .reduce((acc, t) => acc + t.amount, 0);

export const selectTotalIncome = (state: ExpensesState) =>
    state.transactions
        .filter(t => t.category === 'Income')
        .reduce((acc, t) => acc + t.amount, 0);

export const selectRemaining = (state: ExpensesState) => {
    const expenses = selectTotalSpent(state);
    const income = selectTotalIncome(state);
    return (state.budget + income) - expenses;
};

export const selectDailyAverage = (state: ExpensesState) => {
    const total = selectTotalSpent(state);
    const day = new Date().getDate();
    return day > 0 ? Math.round(total / day) : total;
};

export const selectCategories = (state: ExpensesState) => {
    const categoryMap = state.transactions.reduce((acc, t) => {
        if (t.category === 'Income') return acc;

        if (!acc[t.category]) {
            acc[t.category] = { name: t.category, spent: 0, total: state.budget, color: t.color || '#C4B5FD', bg: '#EDE9FE' };
        }
        acc[t.category].spent += t.amount;
        return acc;
    }, {} as Record<string, any>);

    return Object.values(categoryMap).map(cat => ({
        ...cat,
        percent: Math.min(cat.spent / cat.total, 1),
    }));
};