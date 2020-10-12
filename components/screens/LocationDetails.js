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

const LocationDetails = ( {navigation, route} ) => {
  return (
    <SafeAreaView>
      <ScrollView>
        <View style={styles.viewTop}>
        <Icon name="location-pin" size={50} color="#000000" />
          <Text style={styles.location}>
            {route.params.locations[0]}
          </Text>
        </View>
        <View style={styles.viewBottom}>
        <MaterialIcon name="office-building" size={30} color="#000000" />
          <Text style={styles.text}>
            {route.params.locations[1]}
          </Text>
        </View>
        <View style={styles.viewBottom}>
        <Icon name="pin-drop" size={30} color="#000000" />
          <Text style={styles.text}>
            {route.params.locations[2]}
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
    fontSize: 14
  }
})