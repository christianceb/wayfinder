import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import BottomTabNavigation from './components/navigations/BottomTabNavigation.js';

const App = () => {
  return (
    <NavigationContainer>
      <BottomTabNavigation/>
    </NavigationContainer>
  );
};

export default App;