import React, { Component } from 'react';
import {
  StyleSheet,
  ScrollView,
  Text,
  SafeAreaView,
  View,
  Image,
} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Paragraph } from 'react-native-paper';
import { Mini as MiniMap } from '../maps/Mini'

export default class EventDetails extends Component {
  constructor(props)
  {
    super(props)

    const params = props.route.params;
    
    this.state = {
      title: params.title,
      location_id: params.location_id,
      start: params.start,
      end: params.end,
      attachment: params.attachment?.remote_url
    }
  }

  printLocation(location_id) {
    let reached_end = false;
    const location_names = [];

    while (reached_end === false) {
      let found_location = global.locationsData.find( l => { return location_id == l.id } );
      
      if (found_location != null) {
        location_names.push(found_location.name);
      }

      if (found_location.parent_id === null) {
        reached_end = true
      } else {
        location_id = found_location.parent_id;
      }
    }

    return location_names.join(", ");
  }

  printAddress(location_id) {
    let found_building = false;
    let address = "";

    while (found_building === false) {
      let found_location = global.locationsData.find( l => { return location_id == l.id } );
      
      if (found_location != null) {
        address = found_location.address;
      }

      // If location is a building, end here;
      if (found_location.type == 1) {
        found_building = true;
      } else {
        location_id = found_location.parent_id;
      }
    }

    return address;
  }

  render() {
    return (
      <SafeAreaView>
        <ScrollView>
          { this.attachment && <View><Image style={styles.topImage} source={this.attachment} /></View> }
          <View style={styles.viewDescription}>
            <MaterialIcon name="calendar" size={50} color="#000000" />
            <View style={{ paddingLeft: 10 }}>
              <Text style={styles.event}>{this.state.title}</Text>
              <Paragraph>{this.state.start} - {this.state.end}</Paragraph>
            </View>
          </View>
          <View style={styles.viewBottom}>
            <Icon name="location-pin" size={30} color="#000000" />
            <Text style={styles.text}>
              {this.printLocation(this.state.location_id)}
            </Text>
          </View>
          <View style={styles.viewBottom}>
            <Icon name="pin-drop" size={30} color="#000000" />
            <Text style={styles.text}>
            {this.printAddress(this.state.location_id)}
            </Text>
          </View>
          <View style={{ paddingTop: 30 }}>
            <MiniMap locationId={this.state.location_id} />
          </View>
        </ScrollView>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  viewDescription: {
    paddingVertical: 30,
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
  event: {
    fontSize: 22,
    color: "black"
  },
  text: {
    fontSize: 14,
    paddingHorizontal: 10
  },
  topImage: {
    width: '100%',
    height: 250,
    backgroundColor: "#f8f2db"
  },
  bottomImage: {
    width: '100%',
    height: 400
  }
})