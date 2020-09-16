import React from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';

const Search = () => {
  return (
    <View>
      <Text style={styles.title}>
        Search
      </Text>
    </View>    
  );
};

export default Search;

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  }
})