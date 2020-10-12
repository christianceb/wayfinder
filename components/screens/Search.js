import React from 'react';
import {
  StyleSheet,
  SafeAreaView, 
  ScrollView, 
  TextInput,
} from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';

const Search = ( {navigation} ) => {
  const [value, onChangeText] = React.useState(' ');
  const image1 = 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Tursiops_truncatus_01.jpg/330px-Tursiops_truncatus_01.jpg';
  const image2 = 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Dacelo_novaeguineae_waterworks.jpg/330px-Dacelo_novaeguineae_waterworks.jpg';
  return (
    <SafeAreaView >
      <ScrollView >
        <TextInput
          style={styles.search}
          onChangeText={text => onChangeText(text)}
          value={value}
          />
          <Card 
            style={styles.card} 
            onPress={() => navigation.navigate("EventDetails", { events: [image1, 'Silent Disco', 'Monday, 12 October 09:00-12:30', 'L-260', '30 Aberdeen St, Perth, Western Australia'] })}
            >
            <Card.Cover source={{ uri: image1 }} />
            <Card.Content>
              <Title>Silent Disco</Title>
              <Paragraph>L-260, Building 2, Perth</Paragraph>
            </Card.Content>
          </Card>
          <Card 
            style={styles.card} 
            onPress={() => navigation.navigate("EventDetails", { events: [image2, 'Last Man Standing', 'Tuesday, 25 September 09:00-12:30', 'L-404', '30 Aberdeen St, Perth, Western Australia'] })}
            >
            <Card.Cover source={{ uri: image2 }} />
              <Card.Content>
                <Title>Last Man Standing</Title>
                <Paragraph>L-404, Building 2, Perth</Paragraph>
              </Card.Content>
          </Card>
          <Card 
            style={styles.card} 
            onPress={() => navigation.navigate("LocationDetails", { locations: ['L-260', 'Building 2', '30 Aberdeen St, Perth, Western Australia'] })}
            >
              <Card.Content>
                <Title>L-260</Title>
                <Paragraph>Building 2</Paragraph>
              </Card.Content>
          </Card>
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