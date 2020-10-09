import React, {useState} from 'react';
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

const Settings = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [value, setValue] = useState('Perth');
  return (
    <SafeAreaView>
      <ScrollView>
      <Modal
        transparent={true}
        visible={modalVisible}>
          <View style={styles.blur}>
            <View style={styles.modal}>
              <Text style={styles.head}>
                Default Campus
              </Text>
              <RadioButton.Group onValueChange={value => setValue(value)} value={value}>
                <View style={styles.items}>
                  <Text>Perth</Text>
                  <RadioButton value="Perth" />
                </View>
                <View style={styles.items}>
                  <Text>Leederville</Text>
                  <RadioButton value="Leederville" />
                </View>
                <View style={styles.items}>
                  <Text>East Perth</Text>
                  <RadioButton value="East Perth" />
                </View>
                <View style={styles.items}>
                  <Text>Midland</Text>
                  <RadioButton value="Midland" />
                </View>
                <View style={styles.items}>
                  <Text>Mount Lawley</Text>
                  <RadioButton value="Mount Lawley" />
                </View>
                <View style={styles.items}>
                  <Text>Joondalup</Text>
                  <RadioButton value="Joondalup" />
                </View>
                <View style={styles.items}>
                  <Text>Clarkson</Text>
                  <RadioButton value="Clarkson" />
                </View>
              </RadioButton.Group>
            <View style={styles.button}>
              <Button title="OK" onPress={() => {setModalVisible(false)}}/>
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
            onPress={() => {setModalVisible(true)}}
              >
              <Card.Content>
                <Title>Default Campus</Title>
                <Paragraph>
                  {value}
                </Paragraph>
              </Card.Content>
          </Card>  
        </View>    
      </ScrollView>
    </SafeAreaView>
  );
};

export default Settings;

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