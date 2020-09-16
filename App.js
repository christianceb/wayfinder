import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import BottomTabnavigation from './components/navigations/BottomTabNavigation.js';

const App = () => {
  return (
    <NavigationContainer>
      <BottomTabnavigation/>
    </NavigationContainer>
  );
};

export default App;