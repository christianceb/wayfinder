import React, { useState } from 'react';
import {
  StyleSheet,
  SafeAreaView, 
  TextInput,
  FlatList,
  View,
  Modal,
  Button,
  Text
} from 'react-native';
import { Card, Title, Paragraph, Chip } from 'react-native-paper';
import { RadioButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Search = ( { navigation } ) => {
  const [data, setData] = useState(global.locationsData);
  const [filterLocation, setFilterLocation] = useState(false);
  const [chipValue, setChipValue] = useState('')

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
      <Modal
        transparent={true}
        visible={filterLocation}>
          <View style={styles.blur}>
            <View style={styles.modal}>
              <Text style={styles.head}>
                Add a Filter
              </Text>
              <RadioButton.Group onValueChange={value => setChipValue(value)} value={chipValue}>
                <View style={styles.items}>
                  <Text>Campuses</Text>
                  <RadioButton value="Campuses" />
                </View>
                <View style={styles.items}>
                  <Text>Buildings</Text>
                  <RadioButton value="Buildings" />
                </View>
                <View style={styles.items}>
                  <Text>Rooms</Text>
                  <RadioButton value="Rooms" />
                </View>
              </RadioButton.Group>
              <View style={styles.button}>
                <Button title="OK" onPress={() => setFilterLocation(false)}/>
              </View>
            </View>
          </View>
        </Modal>
      <View style={styles.filterContainer}>
        <Icon style={styles.filterIcon} name='filter-list' color='black' size={30}
          onPress={() => setFilterLocation(true)}
        />
        <Chip mode='outlined' style={styles.chip} onClose={() => console.log('closed')}>
          {chipValue}
        </Chip>
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
    marginTop: 12,
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
  },
  filterContainer: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    marginVertical: 5
  },
  chip: {
    backgroundColor: 'white', 
    marginLeft: 10
  },
  filterIcon: {
    marginLeft: 25,
    backgroundColor: 'transparent'
  },
  button: {
    marginVertical: 10
  },
  blur: {
    backgroundColor: '#000000aa',
    flex: 1
  },
  modal: {
    backgroundColor: '#ffffff',
    margin: 50,
    padding: 20,
    alignContent: 'center',
    borderRadius: 10
  },
  head: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  items: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  }
})