import React, { Component } from 'react';
import { View } from 'react-native';
import Popup from '../modals/Popup'
import { Main as MainMap } from '../maps/Main'
import AsyncStorage from '@react-native-community/async-storage';

/**
 * Tab navigation screen for Home (map)
 */
export default class Home extends Component {
  constructor(props) {
    super(props)

    this.state = {
      promptDefaultLocation: false,
      campus: null
    }
  }

  async componentDidMount() {
    let campus = null

    // Get the default campus and if not, prompt user with the Default Campus popup
    try {
      const value = await AsyncStorage.getItem('default_campus')

      if (value !== null) {
        campus = parseInt(value)
      }
    } catch(e) {
      // do nothing
    } finally {
      if (campus === null) {
        this.setState({
          promptDefaultLocation: true
        })
      } else {
        this.setState({
          campus: campus
        })
      }
    }
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <MainMap campus={this.state.campus} navigation={this.props.navigation} />
        { this.state.promptDefaultLocation ? <Popup /> : null }
      </View>
    )
  }
}