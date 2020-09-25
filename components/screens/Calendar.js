import React, { useState } from 'react';
import {
  StyleSheet,
  SafeAreaView, 
  ScrollView, 
  TextInput,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Card, Title, Paragraph } from 'react-native-paper';


const CalendarScreen = ( {navigation} ) => {
  const [value, onChangeText] = React.useState(' ');
  const [selected, setSelected] = useState('');
  const onDayPress = (day) => {
    setSelected(day.dateString);
  };
  return (
    <SafeAreaView >
      <ScrollView >
        <TextInput
          style={styles.search}
          onChangeText={text => onChangeText(text)}
          value={value}
          />
          <Calendar
            current={'2020-09-24'}
            onDayPress={onDayPress}
            markedDates={{
              [selected]: {
                selected: true,
                disableTouchEvent: true,
                selectedColor: 'green',
                selectedTextColor: 'white',
              },
            }}
            />
          <Card 
            style={styles.card}
            onPress={() => navigation.navigate("Details")}
            >
            <Card.Cover source={{ uri: 'https://picsum.photos/700' }} />
            <Card.Content>
              <Title>Silent Disco</Title>
              <Paragraph>L-260, Building 2, Perth</Paragraph>
            </Card.Content>
          </Card>
          <Card 
            style={styles.card}
            onPress={() => navigation.navigate("Details")}
            >
            <Card.Cover source={{ uri: 'data:image/jpeg;base64,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' }} />
            <Card.Content>
              <Title>Last Man Standing</Title>
              <Paragraph>L-404, Building 2, Perth</Paragraph>
            </Card.Content>
          </Card>
      </ScrollView>
    </SafeAreaView>   
  );
};

export default CalendarScreen;

const styles = StyleSheet.create({
  text: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  search: {
    height: 40,
    borderRadius: 15,
    borderWidth: 1,
    color: 'gray',
    margin: 10,
    marginVertical: 15,
    backgroundColor: 'white' 
  },
  card: {
    borderRadius: 10,
    marginTop: 15,
    marginHorizontal: 20,
  }
})