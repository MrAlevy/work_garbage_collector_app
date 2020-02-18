import React from 'react';
import {
  Button,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Alert
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Feather } from '@expo/vector-icons';

import { updateJournalWaypoint } from '../../../actions';

import { SCREEN } from '../../../constants';
import { COLORS } from '../../../styles';

export const WayPointsList = props => {
  const dispatch = useDispatch();
  const Store = useSelector(state => state);
  const journalStore = useSelector(state => state.journal);

  // Implement POI dictionaries
  const poiDict = useSelector(state => state.dicts.poi); // the main dictionary
  const newPoiDict = useSelector(state => state.dicts.newPoi); // the alt dictionary from users
  const createdPoiDict = useSelector(state => state.dicts.createdPoi); // the current user's dictionary

  const journal = journalStore.journal;

  const waypointsList = journal.waypoints.filter(
    waypoint => !('isDeleted' in waypoint && waypoint.isDeleted)
  );

  // Function for determine and return the dictionary for Waypoint
  const whichPoiDict = idPOI => {
    return idPOI in poiDict.items
      ? poiDict.items[idPOI]
      : idPOI in newPoiDict.items
      ? newPoiDict.items[idPOI]
      : idPOI in createdPoiDict
      ? createdPoiDict[idPOI]
      : {};
  };

  return (
    <SafeAreaView style={{ width: '95%', flex: 1 }}>
      <FlatList
        data={waypointsList}
        renderItem={(
          { item, index } // item = waypoint
        ) => (
          <View
            style={{
              ...styles.dataLine,
              borderBottomWidth: index === journal.waypoints.length - 1 ? 0 : 1 //FIXME:
            }}
          >
            {/*             <Button
              title='qqq-log'
              onPress={() =>
                console.log('+++', poiDict.items[item.idPOI], item.id)
              }
            /> */}
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center'
              }}
            >
              <View style={styles.icons}>
                <Feather style={styles.icon1} name='check-square' size={19} />
                <Feather style={styles.icon1} name='refresh-cw' size={11} />
              </View>
              <View style={styles.wayPointData}>
                <Text style={{ fontSize: 16 }}>
                  {'address' in whichPoiDict(item.idPOI) &&
                    whichPoiDict(item.idPOI).address}
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    marginLeft: 10,
                    color:
                      whichPoiDict(item.idPOI).type === 'container_place'
                        ? '#d09562'
                        : whichPoiDict(item.idPOI).type === 'place_reloading'
                        ? '#6fbdc3'
                        : '#b87ab8'
                  }}
                >
                  {whichPoiDict(item.idPOI).type === 'container_place'
                    ? 'площадка'
                    : whichPoiDict(item.idPOI).type === 'place_reloading'
                    ? 'точка перегруза'
                    : 'полигон'}
                </Text>
                {/*                     <Text>
                    кол-во контейнеров:{' '}
                    {item.containers.length &&
                      item.containers
                        .map(e => parseInt(e.containersCount, 10))
                        .reduce((sum, e) => (sum += e))}
                  </Text> */}
              </View>
            </View>

            {/* SECT: Removing waypoint */}
            <TouchableOpacity
              onPress={() => {
                Alert.alert(
                  'Удаление',
                  'Вы собираетесь удалить точку маршрута',
                  [
                    {
                      text: 'Отмена',
                      style: 'cancel'
                    },
                    {
                      text: 'OK',
                      onPress: () =>
                        dispatch(
                          updateJournalWaypoint(item.id, { isDeleted: 1 })
                        )
                    }
                  ]
                );
              }}
            >
              <Feather
                style={[styles.icon2, { color: 'gray' }]}
                name='trash-2'
                size={17}
              />
            </TouchableOpacity>

            {/* SECT: Enter waypoint */}
            <TouchableOpacity
              onPress={() => {
                Alert.alert('Вход', 'Выполнить вход в площадку?', [
                  {
                    text: 'Отмена',
                    style: 'cancel'
                  },
                  {
                    text: 'OK',
                    //prettier-ignore
                    onPress: () => {
                        props.navigation.navigate(SCREEN.PLACE, {
                          currentPlaceId: item.id,
                          currentPlaceNumber: whichPoiDict(item.idPOI).number, //FIXME: number doesn't exist for new poi
                          currentPlaceType: whichPoiDict(item.idPOI).type
                        });
                      }
                  }
                ]);
              }}
              style={{
                flex: 1,
                height: '100%',
                maxWidth: '15%',
                justifyContent: 'center',
                alignItems: 'flex-end'
              }}
            >
              <Feather style={styles.icon2} name='arrow-right' size={31} />
            </TouchableOpacity>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  dataLine: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginVertical: 7,
    paddingBottom: 13,
    borderBottomColor: COLORS.borderGray
  },
  wayPointData: {
    width: '90%',
    marginLeft: 15
  },
  icons: {
    flex: 1,
    minWidth: 20,
    maxWidth: 20,
    height: 40,
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  icon1: { color: COLORS.iconInactive },
  icon2: {
    color: COLORS.iconsBlack,
    marginLeft: 20,
    marginRight: 5
  }
});
