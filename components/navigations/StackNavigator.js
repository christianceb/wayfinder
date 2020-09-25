import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import EventDetails from '../screens/EventDetails';
import BottomTabNavigation from '../navigations/BottomTabNavigation';

const Stack = createStackNavigator();

const StackNavigator = () => {
  return (
      <Stack.Navigator>
        <Stack.Screen
          options={{headerShown: false}} 
          name="Main" 
          component={BottomTabNavigation} 
          />
        <Stack.Screen 
          name="Details" 
          component={EventDetails} 
          options={{
          title: '',
          headerStyle: {
            backgroundColor: '#e3342f',
          },
          headerTintColor: '#fff',
          }} 
          />
      </Stack.Navigator>
  );
};

export default StackNavigator;