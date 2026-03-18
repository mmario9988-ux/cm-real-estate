import 'react-native-gesture-handler';
import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { 
  Prompt_300Light, Prompt_400Regular, Prompt_500Medium, 
  Prompt_600SemiBold, Prompt_700Bold, Prompt_900Black, 
  useFonts 
} from '@expo-google-fonts/prompt';
import RootNavigator from './src/navigation/RootNavigator';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  const [fontsLoaded] = useFonts({
    Prompt_300Light,
    Prompt_400Regular,
    Prompt_500Medium,
    Prompt_600SemiBold,
    Prompt_700Bold,
    Prompt_900Black,
    'Prompt-Bold': Prompt_700Bold,
    'Prompt-Black': Prompt_900Black,
    'Prompt': Prompt_400Regular,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0F0F14' }}>
        <ActivityIndicator size="large" color="#dc2626" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <RootNavigator />
      <StatusBar style="light" />
    </View>
  );
}
