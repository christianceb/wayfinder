import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Modal,
  Button
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Card, Title, Paragraph } from 'react-native-paper';
import { RadioButton } from 'react-native-paper';
import AsyncStorage from '@react-native-community/async-storage';
import WF_Off from '~/Wayfinder_Offline';

/**
 * Tab navigation screen for Settings (map)
 */
export default class Settings extends Component {
  constructor(props) {
    super(props)

    this.state = {
      promptDefaultLocation: false,
      campus: null,
      name: null
    }

    // Build radio button items
    this.rbItems = this.buildRadioButtonItems();
  }

  /**
   * Build radio button components for when selecting a default campus
   * 
   * @returns {array} an array of <View /> components with a radio button component in it
   */
  buildRadioButtonItems() {
    const rdItems = []

    for (const location of WF_Off.getLocationsByType(0)) {
      rdItems.push(
        <View key={location.id} style={styles.items}>
          <Text>{location.name}</Text>
          <RadioButton color="#da272d" value={location.id} />
        </View>
      )
    }

    return rdItems;
  }

  async componentDidMount() {
    let campus = null

    /**
     * Retrieve stored default_campus from async storage and set it as state
     */
    try {
      const value = await AsyncStorage.getItem('default_campus')

      if (value !== null) {
        campus = parseInt(value)
      }
    } catch(e) {
      // do nothing
    } finally {
      if (campus !== null) {
        const location = WF_Off.findLocationById(campus)

        this.setState({
          campus: campus,
          name: location.name
        })
      }
    }
  }

  /**
   * Callback upon closing the default campus selection prompt. Used to save the new default
   * campus setting.
   */
  async saveDefaultCampus () {
    try {
      await AsyncStorage.setItem('default_campus', this.state.campus.toString())
    } catch (e) {
      // Do nothing despite failing to save the selected default campus?
    } finally {
      let location = WF_Off.findLocationById(this.state.campus)

      this.setState({
        promptDefaultLocation: false,
        name: location.name
      });
    }
    console.log('PRESS: Default campus is set to', this.state.name)
  }

  render() {
    return (
      <SafeAreaView>
        <ScrollView>
        <Modal
          transparent={true}
          visible={this.state.promptDefaultLocation}>
            <View style={styles.blur}>
              <View style={styles.modal}>
                <Text style={styles.head}>
                  Default Campus
                </Text>
                <RadioButton.Group onValueChange={value => this.setState({ campus: value })} value={this.state.campus}>{this.rbItems}</RadioButton.Group>
                <View style={styles.button}>
                  <Button color="#da272d" title="OK" onPress={() => { this.saveDefaultCampus() }}/>
                </View>
              </View>
            </View>
          </Modal>    
          <View style={styles.header}>
            <Text style={styles.title}>
              Settings
            </Text>
          </View>
          <View>
            <Card
              style={styles.card}
              onPress={() => { this.setState({ promptDefaultLocation: true })}}
                >
                <Card.Content>
                  <Title>Default Campus</Title>
                  <Paragraph>
                    {this.state.name}
                  </Paragraph>
                </Card.Content>
            </Card>  
          </View>    
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    textAlign: 'center',
    color: 'white',
    margin: 10,
  },
  header: {
    backgroundColor: '#da272d'
  },
  card: {
    borderRadius: 8,
    marginVertical: 25,
    marginHorizontal: 20,
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
  },
  button: {
    marginVertical: 10
  }
})