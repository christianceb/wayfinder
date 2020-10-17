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

  buildPickerItems() {
    const pickerItems = []

    for (const location of global.locationsData) {
      if (location.type == 0) {
        // Set first item in the list for later use in the class
        if (this.firstItem === null) {
          this.firstItem = location.id
        }

        pickerItems.push(<Picker.Item key={location.id} label={location.name} value={location.id} />)
      }
    }
  
    return pickerItems;
  }

  async setCampus() {
    try {
      await AsyncStorage.setItem('default_campus', this.state.campus.toString())
    } catch (e) {
      // Do nothing despite failing to save the selected default campus?
    } finally {
      this.setState({ visible: false });
    }
  }

  onValueChange(itemValue) {
    this.setState({campus: itemValue});
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

            <Button title="OK" onPress={this.setCampus} />
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
  }
})