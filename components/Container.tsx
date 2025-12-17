import { View } from 'react-native';
import "../global.css"

export default function Container({ children }: { children: React.ReactNode }) {
  return (
    <View className='flex-1 mt-10'>
      {children}
    </View>
    
  );
}
