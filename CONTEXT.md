# Codebase Context & Current State

## 1. Project Overview
- **Type**: Expo / React Native Application
- **Stack**: 
  - **Framework**: `expo` (~54.0.0), `expo-router`
  - **Styling**: `nativewind` (Tailwind CSS), `global.css`
  - **State Management**: `zustand`
  - **Animations**: `react-native-reanimated`
  - **Navigation**: File-based routing via `expo-router`
- **Key Directories**:
  - `app/`: Contains routes (tabs, modals, layouts).
  - `components/`: UI components.
  - `store/`: State management logic.

## 2. Key Components Analysis

### A. Input / Logic (`app/(tabs)/today.tsx`)
- **Purpose**: Main entry point for adding expenses via text.
- **Features**:
  - **ML Integration**: Sends text input to a local Python/ML server (`http://10.151.11.169:5001/predict`) to classify expenses.
  - **UI/UX**: specialized, high-polish animations (glows, rotation) and custom category cards.
  - **Data Handling**: 
    - Currently writes **directly** to `AsyncStorage` using the key `@expenses`.
    - Does **not** use the global Zustand store for saving.

### B. Global Store (`store/useExpensesStore.ts`)
- **Purpose**: Centralized state for transactions and budget.
- **Current Status**:
  - Contains **Mock Data** (`MOCK_TRANSACTIONS`) and simulated async fetching.
  - Includes selectors for insights (Total Spent, Remaining, Daily Average, Category breakdown).
- **Issue**: There is a generic "disconnect" between the store and the actual app usage. The store is isolated and not currently being updated by the `today.tsx` input screen.

## 3. Current Observations & Inconsistencies
1.  **State Fragmentation**: Apps logic is split. Real user input goes to `AsyncStorage` in one file, while the "Store" file holds static mock data. Accessing "Insights" likely pulls from the store (mock data), preventing the user from seeing their real added expenses in any insights view.
2.  **Visuals**: The implementation in `today.tsx` is highly polished with custom animations, distinct from standard libraries.
3.  **Local API**: Relies on a specific local IP for ML predictions, which may need configuration or environment variable management for stability.
