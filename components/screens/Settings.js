import React from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';

const Settings = () => {
  return (
    <View>
      <Text style={styles.title}>
        Settings
      </Text>
    </View>    
  );
};

export default Settings;

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  }
})