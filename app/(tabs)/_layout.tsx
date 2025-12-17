import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { CalendarAdd, EmojiHappy, Graph, Setting, Setting3 } from 'iconsax-react-nativejs';

import Container from 'components/Container';
import TabBarDemo from 'components/ButtomBar';

export default function TabsLayout() {
  return (
    <Container>
      <Tabs
        screenOptions={{
          headerShown: false,
        }}
        tabBar={(props) => <TabBarDemo {...props} />}
        
      >
        <Tabs.Screen
          name="today"
          options={{
            tabBarLabel: 'Today',
            tabBarIcon: ({ color, size }) => (
              <CalendarAdd color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="insights"
          options={{
            tabBarLabel: 'Insights',
            tabBarIcon: ({ color, size }) => (
              <Graph color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            tabBarLabel: 'Settings',
            tabBarIcon: ({ color, size }) => (
              <Setting color={color} size={size} />
            ),
          }}
        />
      </Tabs>
    </Container>
  );
}