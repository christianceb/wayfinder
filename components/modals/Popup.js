import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  Button,
} from 'react-native';
import { Picker } from '@react-native-community/picker'
import AsyncStorage from '@react-native-community/async-storage'
import WF_Off from '~/Wayfinder_Offline';

/**
 * Popup component for prompting user to select a default campus when it is not yet set on the device.
 */
export default class Popup extends Component {
  constructor(props) {
    super(props)

    this.firstItem = null;
    this.pickerItems = this.buildPickerItems();

    this.state = {
      visible: true,
      campus: this.firstItem
    }

    this.setCampus = this.setCampus.bind(this)
    this.onValueChange = this.onValueChange.bind(this)
  }

  /**
   * Build location components for the picker in the component
   * 
   * @returns {array} array of <Picker.Item /> components
   */
  buildPickerItems() {
    const pickerItems = []

    for (const location of WF_Off.getLocationsByType(0)) {
      // Set first item in the list for later use in the class. Used for preselecting a radio button
      if (this.firstItem === null) {
        this.firstItem = location.id
      }

      pickerItems.push(<Picker.Item key={location.id} label={location.name} value={location.id} />)
    }
  
    return pickerItems;
  }

  /**
   * Set default campus based on the selected campus in the component
   */
  async setCampus() {
    try {
      await AsyncStorage.setItem('default_campus', this.state.campus.toString())
    } catch (e) {
      // Do nothing despite failing to save the selected default campus?
    } finally {
      this.setState({ visible: false });
    }
    console.log('POPUP: The app has prompted the user to select a default campus')
    console.log('PRESS: The user set the default campus')
  }

  /**
   * Callback for whenever the picker value changes.
   * @param {integer} itemValue id of the campus
   */
  onValueChange(itemValue) {
    this.setState({campus: itemValue});
    console.log('POPUP: the user selects on of the default campus options')
  }

  render() {
    return (
      <Modal transparent={true} visible={this.state.visible}>
        <View style={styles.blur}>
          <View style={styles.modal}>
            <Text style={styles.title}>Default Campus</Text>
            
            <Picker mode="dropdown" style={{ height: 50, width: "100%" }} selectedValue={this.state.campus} onValueChange={this.onValueChange}>
              {this.pickerItems}
            </Picker>

            <Button color="#da272d" title="OK" onPress={this.setCampus} />
          </View>
        </View>
      </Modal>
    )
  }
}

const styles = StyleSheet.create({
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
  title: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    color: "#da272d"
  }
})