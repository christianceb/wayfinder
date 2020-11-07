import React, { useState, useEffect } from 'react';
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
import WF_Off from '~/Wayfinder_Offline.js';

const Search = ( { navigation } ) => {
  const [data, setData] = useState([]);
  const [filterLocation, setFilterLocation] = useState(false);
  const [chipValue, _setChipValue] = useState(null)
  const [queryString, _setQueryString] = useState("")
  const TYPE_MAP = ["Campuses", "Buildings", "Rooms"];

  const returnParents = (parent_id) => {
    let parentLocation = WF_Off.findLocationById(parent_id)
    let parentsString = parentLocation.name

    if (parentLocation.parent_id) {
      parentsString += ", " + returnParents(parentLocation.parent_id)
    }

    return parentsString
  }

  const setQueryString = (value) => {
    _setQueryString(value)
    filter(value)
  }

  const filter = (text) => {
    let dataset = []
    text = toSearcheableString(text)

    if (chipValue) {
      dataset = WF_Off.getLocationsByType(chipValue)
    } else {
      dataset = WF_Off.getAllLocations(true);
    }

    if (text != "" && chipValue === null && text.length >= 3) {
      dataset = dataset.filter(item => {
        // Exit early if filter is set and item does not match filter
        if (chipValue && item.type != chipValue) {
          return false
        }

        const itemData = toSearcheableString(item.name)

        return itemData.indexOf(text) > -1;
      })
    }

    setData(dataset)
  }

  const toSearcheableString = (value) => {
    return value
      .toLowerCase()
      .replace(/\W+/g, "")
      .trim()
  }

  useEffect(() => {
    if (!filterLocation) {
      filter(queryString)
    }
  }, [chipValue, filterLocation]);


  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.inputStyle}
          value={queryString}
          onChangeText={value => { setQueryString(value) }}
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
              <RadioButton.Group onValueChange={value => _setChipValue(value)} value={chipValue}>
                <View style={styles.items}>
                  <Text>{TYPE_MAP[0]}</Text>
                  <RadioButton value="0" />
                </View>
                <View style={styles.items}>
                  <Text>{TYPE_MAP[1]}</Text>
                  <RadioButton value="1" />
                </View>
                <View style={styles.items}>
                  <Text>{TYPE_MAP[2]}</Text>
                  <RadioButton value="2" />
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
        {chipValue &&
          <Chip mode='outlined' style={styles.chip} onClose={() => _setChipValue(null)}>
            {TYPE_MAP[chipValue]}
          </Chip>
        }
      </View>
      <FlatList
        data={data}
        keyExtractor={({ id }, index) => id.toString()}
        initialNumToRender={10}
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
            <Paragraph>{item.parent_id ? returnParents(item.parent_id) : item.name}</Paragraph>
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