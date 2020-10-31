import React, { Component } from 'react';
import { StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { Calendar as RN_Calendar } from 'react-native-calendars';
import { Card, Title, Paragraph } from 'react-native-paper';

export default class Calendar extends Component {
  constructor(props)
  {
    super(props)

    const now = new Date();
    const nowDateISO = now.toISOString().slice(0,10)
    
    this.state = {
      date: nowDateISO,
      markedDates: this.buildSelectedMarkedDate(nowDateISO),
      events: []
    };

    this.navigation = props.navigation;
    this.onDayPress = this.onDayPress.bind(this);
  }

  async componentDidMount()
  {
    let results = await this.queryEvents(this.state.date)
    let data = [];

    if (results !== null) {
      data = results.result.data
    }

    this.setState({
      events: data
    });
  }

  buildSelectedMarkedDate(date) {
    return {
      [date]: { ...markedDatesParams },
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

  renderCards(items) {
    const cards = [];

    for (const event of items) {
      cards.push(
        <Card key={event.id} style={styles.card} onPress={() => this.navigation.navigate("EventDetails", event)}>
          { event.attachment && <Card.Cover source={{ uri: event.attachment.remote_url }} /> }
          <Card.Content>
            <Title>{event.title}</Title>
            <Paragraph>{this.printLocation(event.location_id)}</Paragraph>
          </Card.Content>
        </Card>
      )
    }

    return cards;
  }

  async queryEvents(date) {
    const response = await fetch(`https://wayfinder-laravel.herokuapp.com/api/events?after=${date}`);
    
    if (response.ok) {
      return response.json();
    }

    return null;
  }

  onDayPress(day) {
    (async () => {
      let results = await this.queryEvents(day.dateString)
      let data = [];

      if (results !== null) {
        data = results.result.data
      }

      this.setState({
        events: data
      });
    })()

    this.setState({
      date: day.dateString,
      markedDates: this.buildSelectedMarkedDate(day.dateString)
    });
  };

  render()
  {
    return (
      <SafeAreaView>
        <ScrollView>
          <RN_Calendar
            minDate="2020-01-01"
            onDayPress={this.onDayPress}
            markedDates={this.state.markedDates}
            theme={{ todayTextColor: "#da272d", arrowColor: "#da272d" }}
            />
            <>
              {this.renderCards(this.state.events)}
            </>
        </ScrollView>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    marginTop: 15,
    marginHorizontal: 20,
  }
})

const markedDatesParams = {
  selected: true,
  disableTouchEvent: true,
  selectedColor: '#da272d',
  selectedTextColor: 'white',
}