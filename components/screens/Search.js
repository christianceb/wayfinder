import React, { useState } from 'react';
import {
  StyleSheet,
  SafeAreaView, 
  TextInput,
  FlatList,
  View,
} from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Search = ( { navigation } ) => {
  const [data, setData] = useState(global.locationsData);

  const returnParents = (parent) => {
    let parentLocation = global.locationsData.find(item => item.id == parent);
    let parentsString = parentLocation.name;

    if (parentLocation.parent_id !== null) {
      parentsString += ", " + returnParents(parentLocation.parent_id)
    }
    return parentsString
  }

  function filter(text) {
    let locArray = global.locationsData    
    const newLocation = locArray.filter(item => {      
      const itemData = `${item.name.toLowerCase()}`;
      
      const textData = text.toLowerCase();
        
      return itemData.indexOf(textData) > -1;    
    });
    setData(newLocation)
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.inputStyle}
          onChangeText={value => filter(value)}
          autoCorrect={false}
          />
        <Icon style={styles.icon} name='search' color='#000' size={25}/>
      </View>
      <FlatList
        data={data}
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
  card: {
    borderRadius: 10,
    marginBottom: 12,
    marginHorizontal: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#000',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    color: 'gray',
    margin: 10,
    marginVertical: 12,
    marginHorizontal: 20,
    backgroundColor: 'white'
  },
  inputStyle: {
    flex: 1,
    color: "black",
    marginHorizontal: 5
  },
  icon: {
    marginRight: 10
  }
})