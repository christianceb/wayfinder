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
import AsyncStorage from '@react-native-community/async-storage'

export default class Settings extends Component {
  constructor(props) {
    super(props)

    this.state = {
      promptDefaultLocation: false,
      campus: null,
      name: null
    }

    this.rbItems = this.buildRadioButtonItems();
  }

  buildRadioButtonItems() {
    const rdItems = []

    for (const location of global.locationsData) {
      if (location.type === 0) {
        rdItems.push(
          <View key={location.id} style={styles.items}>
            <Text>{location.name}</Text>
            <RadioButton value={location.id} />
          </View>
        )
      }
    }

    return rdItems;
  }

  async componentDidMount() {
    let campus = null

    try {
      const value = await AsyncStorage.getItem('default_campus')

      if (value !== null) {
        campus = parseInt(value)
      }
    } catch(e) {
      // do nothing
    } finally {
      if (campus !== null) {
        name = null;

        for (const location of global.locationsData) {
          if (location.id === campus) {
            name = location.name;
            break;
          }
        }

        this.setState({
          campus: campus,
          name: name
        })
      }
    }
  }

  async saveDefaultCampus () {
    try {
      await AsyncStorage.setItem('default_campus', this.state.campus.toString())
    } catch (e) {
      // Do nothing despite failing to save the selected default campus?
    } finally {
      let location = global.locationsData.find(element => element.id == this.state.campus);

      this.setState({
        promptDefaultLocation: false,
        name: location.name
      });
    }
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
                  <Button title="OK" onPress={() => { this.saveDefaultCampus() }}/>
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
    height: 120,
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