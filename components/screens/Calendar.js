import React, { Component } from 'react';
import { StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { Calendar as RN_Calendar } from 'react-native-calendars';
import { Card, Title, Paragraph } from 'react-native-paper';
import WF_Off from '~/Wayfinder_Offline';

/**
 * Tab navigation screen for Calendar
 */
export default class Calendar extends Component {
  constructor(props)
  {
    super(props)

    // Get current date so we can make it the preselected date on the calendar
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
    // Query from API the events based on the date
    let results = await this.queryEvents(this.state.date)
    let data = [];

    // Prime data variable with results if not null
    if (results !== null) {
      data = results.result.data
    }

    // Set data as state
    this.setState({
      events: data
    });
  }

  /**
   * Create parameters for the react-native-calendars Calendar to highlight currently selected date
   * 
   * @param {string} date an ISO 8601 date that has to be highlighted
   * @return {object} parameter to be fed on markedDates prop in react-native-calendars Calendar
   */
  buildSelectedMarkedDate(date) {
    return {
      [date]: { ...markedDatesParams },
    }
  }

  /**
   * Build <Card /> components based on an array of events
   * 
   * @param {array} items event objects in an array that need to be built a card
   * @return {array} array of <Card /> components
   */
  renderCards(items) {
    const cards = [];

    for (const event of items) {
      cards.push(
        <Card key={event.id} style={styles.card} onPress={() => this.navigation.navigate("EventDetails", 
            event, 
            console.log('PRESS: Event card is pressed')
          )}>
          { event.attachment ?
          <>
            <Card.Cover source={{ uri: event.attachment.remote_url }}  />
            <Card.Content>
              <Title>{event.title}</Title>
              <Paragraph>{WF_Off.getParentName(event.location_id)}</Paragraph>
              <Paragraph>{this.nicePrintDates(event.start, event.end)}</Paragraph>
            </Card.Content>
          </> : 
          <Card.Content>
            <Title>{event.title}</Title>
            <Paragraph>{WF_Off.getParentName(event.location_id)}</Paragraph>
            <Paragraph>{this.nicePrintDates(event.start, event.end)}</Paragraph>
          </Card.Content> }
        </Card>
      )
    }
    console.log('EVENTS: Number of events =>', cards.length)
    return cards;
  }

  /**
   * Query the remote API for events
   * 
   * @param {string} date ISO 8601 to be used to query events on a specific date in API
   * @return {array|null} array of event objects if there are any. null if the query failed
   */
  async queryEvents(date) {
    const response = await fetch(`https://wayfinder-laravel.herokuapp.com/api/events?after=${date}`);
    
    if (response.ok) {
      return response.json();
    }

    return null;
  }

  /**
   * Function to print a from-to date from the API nicely
   * 
   * @param {string} from from date to be formatted to a human readable one
   * @param {string} to to date to be formatted to a human readable one
   * @return {string} nicely formatted, human readable date range
   */
  nicePrintDates(from, to) {
    from = this.nicePrintDate(from)
    to = this.nicePrintDate(to)

    let date = (from ?? "?") + " - " + (to ?? "?")

    // Omit printing same date twice if they're the same
    if (from == to) {
      date = from
    }

    return date
  }

  /**
   * Function to print a date value from the API nicely
   * 
   * @param {string} date date to be formatted to a human readable one
   * @return {string} nicely formatted, human readable date
   */
  nicePrintDate(date) {
    if (date) {
      date = new Intl.DateTimeFormat("en-AU", {dateStyle:"medium", timeStyle:"short"}).format(new Date(date))
    }

    return date
  }

  /**
   * Callback by Calendar whenever user selects a date
   * 
   * @param {Date} day date object returned by Calendar
   */
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
    console.log('PRESS: Selected date on calendar is', this.state.date)
  };

  render()
  {
    return (
      <SafeAreaView>
        <ScrollView>
          <RN_Calendar
            style={styles.calendar}
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
    borderRadius: 8,
    marginBottom: 12,
    marginHorizontal: 20,
  },
  calendar: {
    marginBottom: 15
  }
})

const markedDatesParams = {
  selected: true,
  disableTouchEvent: true,
  selectedColor: '#da272d',
  selectedTextColor: 'white',
}