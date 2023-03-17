import React from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import About from './/About';
import Chat from './Chat';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
        name="About" 
        component={About}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
        name="Chat"
        component={Chat} 
        options={{
            headerShown: false,
        }}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}