import React from 'react';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';

const EventDetails = () => {
  return (
    <View style={styles.container}>
      <Text>
        DetailScreen
      </Text>
    </View>    
  );
};

export default EventDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
})