import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AvatarScreen from '../screens/AvatarScreen';
import SummaryScreen from '../screens/SummaryScreen';
import ChatScreen from '../screens/ChatScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Avatar"
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: 'transparent' },
          cardStyleInterpolator: ({ current: { progress } }) => ({
            cardStyle: {
              opacity: progress,
            },
          }),
        }}
      >
        <Stack.Screen name="Avatar" component={AvatarScreen} />
        <Stack.Screen name="Summary" component={SummaryScreen} />
        <Stack.Screen name="Chat" component={ChatScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
