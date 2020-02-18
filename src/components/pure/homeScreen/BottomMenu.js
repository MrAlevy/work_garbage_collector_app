import React from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { COLORS } from '../../../styles';

export const BottomMenu = props => {
  return (
    <View style={styles.bottomMenu}>
      <View style={styles.bottomMenuPoints}>
        <Text style={{ fontSize: 12 }}>точек закрыто</Text>
        <Text style={{ fontSize: 23 }}>0 / {props.wayPointsCount}</Text>
      </View>

      <View style={styles.bottomMenuAddWayP}>
        <TouchableOpacity onPress={props.handleAddWayPoint}>
          <Feather
            name='plus-circle'
            size={43}
            style={{ color: COLORS.iconsBlack }}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.bottomMenuEndJournal}>
        <View>
          <Button color={COLORS.buttonOK} title='ЗАВЕРШИТЬ' />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomMenu: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxHeight: 60,
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.second
  },
  bottomMenuPoints: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '33%',
    height: '100%'
  },
  bottomMenuAddWayP: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '33%',
    height: '100%'
  },
  bottomMenuEndJournal: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '33%',
    height: '100%'
  }
});
