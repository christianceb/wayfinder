import React, { useState } from 'react';
import {
  StyleSheet,
  SafeAreaView, 
  ScrollView, 
  TextInput,
  FlatList,
} from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';

const Search = ( { navigation } ) => {
  const [value, onChangeText] = React.useState(' ');

  const returnParents = (parent) => {
    let parentLocation = global.locationsData.find(item => item.id == parent);
    let parentsString = parentLocation.name;

    if (parentLocation.parent_id !== null) {
      parentsString += ", " + returnParents(parentLocation.parent_id)
    }
    return parentsString
  }

  return (
    <SafeAreaView style={{flex: 1}}>
      <TextInput
        style={styles.search}
        onChangeText={text => onChangeText(text)}
        value={value}
        />
        <FlatList
          data={global.locationsData}
          keyExtractor={({ id }, index) => id.toString()}
          renderItem={({ item }) => (
          <Card 
            style={styles.card} 
            onPress={() => navigation.navigate("LocationDetails", { 
              name: item.name,
              parent: item.parent_id,
              address: item.address
            })}
            >
            <Card.Content>
            <Title>{item.name}</Title>
                {item.parent_id == null ? <Paragraph>{item.name}</Paragraph> : <Paragraph>{returnParents(item.parent_id)}</Paragraph>}
            </Card.Content>
          </Card>
        )}
      />
    </SafeAreaView>    
  );
};

export default Search;

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  search: {
    height: 40,
    borderRadius: 15,
    borderWidth: 1,
    color: 'gray',
    margin: 10,
    marginVertical: 15,
    backgroundColor: 'white' 
  },
  card: {
    borderRadius: 10,
    marginVertical: 8,
    marginHorizontal: 20,
  }
})