import { View, TouchableOpacity, Text } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';

export default function TabBarDemo({ state, descriptors, navigation }: BottomTabBarProps) {
  return (
    <View className="absolute bottom-0 left-0 right-0 flex-row bg-white h-20 rounded-t-3xl px-5 pb-10 shadow-lg pt-5">
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

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

        // Get icon from tabBarIcon option
        const IconComponent = options.tabBarIcon;

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            className="flex-1 justify-center items-center gap-1.5"
            activeOpacity={0.7}
          >
            {/* Render icon if provided */}
            {IconComponent && (
              <View>
                {IconComponent({
                  focused: isFocused,
                  color: isFocused ? '#1a1a1a' : '#9ca3af',
                  size: 22,
                })}
              </View>
            )}

            {/* Label */}
            <Text
              className={`text-xs ${
                isFocused ? 'text-gray-900 font-semibold' : 'text-gray-400 font-normal'
              }`}
            >
              {label.toString()}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}