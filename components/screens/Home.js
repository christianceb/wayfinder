import React from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';
import Popup from '../modals/Popup'

const Home = () => {
  return (
    <View>
      <Popup/>
      <Text style={styles.title}>
        Home
      </Text>
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