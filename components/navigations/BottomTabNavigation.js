import React from 'react';
import { StyleSheet } from 'react-native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import Home from '../screens/Home';
import Search from '../screens/Search';
import Calendar from '../screens/Calendar';
import Settings from '../screens/Settings';

const Tab = createMaterialBottomTabNavigator();

const MainTabScreen = () => (
    <Tab.Navigator
      initialRouteName="Home"
      activeColor="#fff"
      barStyle={styles.bar}
      >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => (
            <Icon name="md-home" color={color} size={26} />
          ),
        }}
        // add listeners to check if the tab is pressed or not https://reactnavigation.org/docs/navigation-events/#listeners-prop-on-screen
        listeners={({ navigation, route }) => ({
          tabPress: e => {
              e.preventDefault()
              navigation.navigate('Home')
              console.log('PRESS: Home bottom tab navigation is pressed')
          },
        })}
      />
      <Tab.Screen
        name="Search"
        component={Search}
        options={{
          tabBarLabel: 'Search',
          tabBarIcon: ({ color }) => (
            <Icon name="search" color={color} size={26} />
          ),
        }}
        // add listeners to check if the tab is pressed or not https://reactnavigation.org/docs/navigation-events/#listeners-prop-on-screen
        listeners={({ navigation, route }) => ({
          tabPress: e => {
              e.preventDefault()
              navigation.navigate('Search')
              console.log('PRESS: Search bottom tab navigation is pressed')
          },
        })}
      />
      <Tab.Screen
        name="Calendar"
        component={Calendar}
        options={{
          tabBarLabel: 'Calendar',
          tabBarIcon: ({ color }) => (
            <Icon name="calendar" color={color} size={26} />
          ),
        }}
        // add listeners to check if the tab is pressed or not https://reactnavigation.org/docs/navigation-events/#listeners-prop-on-screen
        listeners={({ navigation, route }) => ({
          tabPress: e => {
              e.preventDefault()
              navigation.navigate('Calendar')
              console.log('PRESS: Calendar bottom tab navigation is pressed')
          },
        })}
      />
      <Tab.Screen
        name="Settings"
        component={Settings}
        options={{
          tabBarLabel: 'Settings',
          tabBarIcon: ({ color }) => (
            <Icon name="settings" color={color} size={26} />
          ),
        }}
        // add listeners to check if the tab is pressed or not https://reactnavigation.org/docs/navigation-events/#listeners-prop-on-screen
        listeners={({ navigation, route }) => ({
          tabPress: e => {
              e.preventDefault()
              navigation.navigate('Settings')
              console.log('PRESS: Settings bottom tab navigation is pressed')
          },
        })}
      />
    </Tab.Navigator>
);

export default MainTabScreen;

const styles = StyleSheet.create({
  bar: { 
    backgroundColor: '#da272d' 
  }
})