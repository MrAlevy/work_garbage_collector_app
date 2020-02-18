import React, { useState, useEffect } from 'react';
import { View, AsyncStorage, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import * as FileSystem from 'expo-file-system';

import {
  WayPointsList,
  AddWayPointModal,
  BottomMenu
} from '../pure/homeScreen';
import { SCREEN } from '../../constants';

const HomeScreen = props => {
  const dispatch = useDispatch();

  const [phoneNumber, setPhoneNumber] = useState('');
  const [isAddWayPModalVisible, setIsAddWayPModalVisible] = useState(false);

  const _retrieveData = async () => {
    try {
      const valuePhoneNumber = await AsyncStorage.getItem(
        '@storage_PhoneNumber'
      );
      if (valuePhoneNumber !== null) {
        setPhoneNumber(valuePhoneNumber);
        console.log('getting data valid');
      } else console.log('null');
    } catch (error) {
      console.log('async storage error: ', error);
    }
  };

  const Store = useSelector(state => state); //FIXME: delete this

  const journalStore = useSelector(state => state.journal);
  const poiDict = useSelector(state => state.dicts.poi);
  const settings = useSelector(state => state.settings);
  const journal = journalStore.journal;

  const waypointsList = journal.waypoints.filter(
    waypoint => !('isDeleted' in waypoint && waypoint.isDeleted)
  );

  //journal = journalStore.journal;
  useEffect(() => {
    console.log(poiDict);
  }, []);

  // prettier-ignore
  useEffect(() => {
    if (!journalStore.isFilled) {
     props.navigation.navigate(SCREEN.SETTINGS);
     return}

    props.navigation.setParams({
      phoneNumber: `+${settings.msisdn[0]} (${settings.msisdn.slice(1, 4)}) ${settings.msisdn.slice(4, 7)}-${settings.msisdn.slice(7, 9)}-${settings.msisdn.slice(9)}`
    });
    props.navigation.setParams({ tsNumber: settings.vehicleNumber });
    props.navigation.setParams({ date: journal.actualizationDate });

    FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'images_upload/', { intermediates: true });
   
    const isdir = async () => {
      const dir = await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'images_upload/');
    };
    isdir();

  }, []);

  return (
    <View style={styles.main}>
      <WayPointsList navigation={props.navigation} />

      <AddWayPointModal
        visible={isAddWayPModalVisible}
        handleClose={() => setIsAddWayPModalVisible(false)}
      />

      <BottomMenu
        wayPointsCount={waypointsList.length}
        handleAddWayPoint={() => {
          setIsAddWayPModalVisible(true);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'space-between'
  }
});

export default HomeScreen;
