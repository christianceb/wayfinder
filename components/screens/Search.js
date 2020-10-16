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
  const [data, setData] = useState([]);

  const getEventsFromApiAsync = async () => {
    try {
      let response = await fetch(
        'http://wayfinder-laravel.herokuapp.com/api/events'
      );
      let json = await response.json();
      setData(json.result.data)
    } catch (error) {
      console.error(error);
    }
  };

  getEventsFromApiAsync();

  return (
    <SafeAreaView >
      <ScrollView >
        <TextInput
          style={styles.search}
          onChangeText={text => onChangeText(text)}
          value={value}
          />
          <FlatList
          data={data}
          keyExtractor={({ id }, index) => id}
          renderItem={({ item }) => (
            <Card 
            style={styles.card} 
            onPress={() => navigation.navigate("EventDetails", { 
              title: item.title, 
              description: item.description,
              start: item.start,
              end: item.end,
              location: item.location.name,
              address: item.location.address 
            })}
            >
            <Card.Cover style={{ 
              backgroundColor: "#f8f2db" 
              }} 
            />
              <Card.Content>
                <Title>{item.title}</Title>
                <Paragraph>{item.description}</Paragraph>
              </Card.Content>
            </Card>
          )}
        />
      </ScrollView>
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