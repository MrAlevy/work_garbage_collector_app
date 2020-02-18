import React from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ContTypesPicker } from './ContTypesPicker';
import { COLORS } from '../../../../styles';

export const WayPointInputs = props => (
  <View style={styles.addWayPointModalView}>
    <View style={styles.addWayPointModalInner}>
      <Text style={{ color: COLORS.textSecondary }}>Тип</Text>

      <ContTypesPicker
        value={props.pickerValue}
        handleChange={text => props.handlePickerChange(text)}
      />
      <Text style={{ marginTop: 15, color: COLORS.textSecondary }}>Адрес</Text>

      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          maxHeight: 40,
          minHeight: 40
        }}
      >
        <TextInput
          style={styles.input}
          onChangeText={text => props.handleInputChange(text)}
          value={props.inputValue}
          multiline={true}
          maxLength={100}
          placeholder={props.inputPrompt}
        />

        <TouchableOpacity style={styles.icon} onPress={props.handleIconPress}>
          <Feather
            name={props.iconName}
            size={25}
            style={{ color: COLORS.iconsBlack }}
          />
        </TouchableOpacity>
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  addWayPointModalInner: {
    height: '100%',
    padding: 10
  },
  addWayPointModalView: {
    marginBottom: 20
  },
  input: {
    width: '80%',
    fontSize: 14.5,
    marginLeft: 10,
    borderBottomWidth: 1
  },
  icon: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: 60
  }
});
