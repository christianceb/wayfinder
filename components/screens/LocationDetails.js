import React from 'react';
import {
  StyleSheet,
  ScrollView,
  Text,
  SafeAreaView,
  View,
} from 'react-native';
import { Mini as MiniMap } from '../maps/Mini'
import Icon from 'react-native-vector-icons/MaterialIcons';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';

const LocationDetails = ( { navigation, route } ) => {
  
  const getParentName = (id) => {
    if (id != null) {
      let locationsParent = global.locationsData.find(item => item.id == id);
      let parentsName = locationsParent.name;

      if (locationsParent.parent_id != null) {
        parentsName += ", " + getParentName(locationsParent.parent_id)
      }
      return parentsName
    }
    return route.params.name
  }

  return (
    <SafeAreaView>
      <ScrollView>
        <View style={styles.viewTop}>
        <Icon name="location-pin" size={50} color="#000000" />
          <Text style={styles.location}>
            {route.params.name}
          </Text>
        </View>
        <View style={styles.viewBottom}>
        <MaterialIcon name="office-building" size={30} color="#000000" />
          <Text style={styles.text}>
            {getParentName(route.params.parent)}
          </Text>
        </View>
        <View style={styles.viewBottom}>
        <Icon name="pin-drop" size={30} color="#000000" />
          <Text style={styles.text}>
            {route.params.address}
          </Text>
        </View>
        <View style={{ paddingTop: 100 }}>
          <MiniMap locationId={1} />
        </View>
      </ScrollView>
    </SafeAreaView>    
  );
};

export default LocationDetails;

const styles = StyleSheet.create({
  viewTop: {
    paddingVertical: 18,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center"
  },
  viewBottom: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    flexDirection: "row",
    alignItems: "center"
  },
  location: {
    fontSize: 22,
    color: "black"
  },
  text: {
    fontSize: 14,
    paddingHorizontal: 10
  }
})