import React from 'react';
import { View, Text, StyleSheet, Picker } from 'react-native';
import { COLORS } from '../../../../styles';

export const ContTypesPicker = props => (
  <View>
    <Picker
      selectedValue={props.value}
      style={styles.picker}
      onValueChange={props.handleChange}
    >
      <Picker.Item
        key={1}
        label={'Контейнерная площадка'}
        value={'container_place'}
      />
      <Picker.Item
        key={2}
        label={'Точка перегруза'}
        value={'place_reloading'}
      />
      <Picker.Item key={3} label={'Полигон'} value={'polygon'} />
    </Picker>
  </View>
);

const styles = StyleSheet.create({
  picker: {
    height: 40,
    width: 250
  }
});
