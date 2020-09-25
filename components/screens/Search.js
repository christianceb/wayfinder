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
            onPress={() => navigation.navigate("Details")}
            >
            <Card.Cover source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Tursiops_truncatus_01.jpg/330px-Tursiops_truncatus_01.jpg' }} />
            <Card.Content>
              <Title>Silent Disco</Title>
              <Paragraph>L-260, Building 2, Perth</Paragraph>
            </Card.Content>
          </Card>
          <Card 
            style={styles.card} 
            onPress={() => navigation.navigate("Details")}
            >
            <Card.Cover source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Dacelo_novaeguineae_waterworks.jpg/330px-Dacelo_novaeguineae_waterworks.jpg' }} />
              <Card.Content>
                <Title>Last Man Standing</Title>
                <Paragraph>L-404, Building 2, Perth</Paragraph>
              </Card.Content>
          </Card>
          <Card 
            style={styles.card} 
            onPress={() => navigation.navigate("Details")}
            >
            <Card.Cover source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Leucopsar_rothschildi_-Brookfield_Zoo%2C_Chicago%2C_USA-8a_%281%29.jpg/330px-Leucopsar_rothschildi_-Brookfield_Zoo%2C_Chicago%2C_USA-8a_%281%29.jpg' }} />
              <Card.Content>
                <Title>Singing Contest</Title>
                <Paragraph>Library, Building 2, Perth</Paragraph>
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
    marginVertical: 10,
    marginHorizontal: 20,
  }
})