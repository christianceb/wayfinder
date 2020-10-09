import React from 'react';
import {
  StyleSheet,
  View
} from 'react-native';
import Popup from '../modals/Popup'
import { Main as MainMap } from '../maps/Main'

const Home = () => {
  return (
    <View style={{flex: 1}}>
      <Popup />
      <MainMap />
    </View>
  );
};

export default Home;


const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  }
})