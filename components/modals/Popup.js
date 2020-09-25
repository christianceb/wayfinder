import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  Button,
} from 'react-native';
import { Picker } from '@react-native-community/picker';


const Popup = () => {
  const [modalVisible, setModalVisible] = useState(true);
  const [selectedValue, setSelectedValue] = useState("perth");
  return (
    <Modal
    transparent={true}
    visible={modalVisible}>
      <View style={styles.blur}>
        <View style={styles.modal}>
          <Text style={styles.title}>
            Default Campus
          </Text>
          <Picker
            mode="dropdown"
            selectedValue={selectedValue}
            style={{ height: 50, width: 150 }}
            onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
            >
            <Picker.Item label="Perth" value="perth" />
            <Picker.Item label="Joondalup" value="joondalup" />
            <Picker.Item label="East Perth" value="esp" />
            <Picker.Item label="Leederville" value="leederville" />
          </Picker>
          <Button title="OK" onPress={() => {setModalVisible(false)}}/>
        </View>
      </View>
    </Modal>    
  );
};

export default Popup;

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