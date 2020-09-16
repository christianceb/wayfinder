import React from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';

const Home = () => {
  return (
    <View>
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