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
import WF_Off from '~/Wayfinder_Offline';

/**
 * Screen for Location Details
 */
const LocationDetails = ( { navigation, route } ) => {
  let floor = false

  if (route.params.type == 2) {
    let location = WF_Off.findLocationById(route.params.id)

    if (location.floor_id) {
      floor = WF_Off.findFloorById(location.floor_id)
    }
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

        { floor !== false ? (
          <View style={styles.viewBottom}>
            <MaterialIcon name="floor-plan" size={30} color="#000000" />
            <Text style={styles.text}>{floor.name}</Text>
          </View>
        ) : null }
        
        <View style={styles.viewBottom}>
          <MaterialIcon name="office-building" size={30} color="#000000" />
          <Text style={styles.text}>
            {route.params.type > 0 ? WF_Off.getParentName(route.params.parent) : route.params.name}
          </Text>
        </View>
        <View style={styles.viewBottom}>
        <Icon name="pin-drop" size={30} color="#000000" />
          <Text style={styles.text}>
            {WF_Off.getAddress(route.params.id)}
          </Text>
        </View>
        <View style={{ paddingTop: 100 }}>
          <MiniMap locationId={route.params.id} />
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