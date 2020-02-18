import React from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  StyleSheet
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { placeScreenSetSuggestions } from '../../../../actions';

export const SuggestionsList = props => {
  const dispatch = useDispatch();
  const journalStore = useSelector(state => state.journal);
  const journal = journalStore.journal;

  const suggestions = useSelector(state => state.app.placeScreen.suggestions);

  // Implement POI dictionaries
  const poiDict = useSelector(state => state.dicts.poi); // the main dictionary
  const newPoiDict = useSelector(state => state.dicts.newPoi); // the alt dictionary from users
  const createdPoiDict = useSelector(state => state.dicts.createdPoi); // the current user's dictionary

  let usingDict = {};
  suggestions.takeFrom === 'poiDict'
    ? (usingDict = poiDict)
    : suggestions.takeFrom === 'newPoiDict'
    ? (usingDict = newPoiDict)
    : suggestions.takeFrom === 'createdPoiDict'
    ? (usingDict = createdPoiDict)
    : (usingDict = {});

  return (
    <View
      style={{
        position: 'absolute',
        backgroundColor: 'lightgreen',
        minHeight: 200,
        top: '80%',
        zIndex: 999
      }}
    >
      <SafeAreaView style={{ width: '95%', flex: 1 }}>
        <FlatList
          data={suggestions.data}
          renderItem={(
            { item, index } // item = idPoi
          ) => (
            <TouchableOpacity
              onPress={() => {
                dispatch(
                  placeScreenSetSuggestions({
                    isVisible: false,
                    chosenId: item,
                    data: [],
                    takeFrom: suggestions.takeFrom
                  })
                );
              }}
            >
              <View
                style={{
                  ...styles.line,
                  borderBottomWidth:
                    index === journal.waypoints.length - 1 ? 0 : 1 //FIXME:
                }}
              >
                <Text>{usingDict.items[item].address}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  addWayPointModalInner: {
    height: '100%',
    padding: 10
  },

  addWayPointModalPicker: {
    height: 20,
    marginVertical: 5
  },
  addWayPointModalView: {
    marginBottom: 20
  },
  input: {
    width: '70%',
    height: 30,
    borderBottomWidth: 1
  },
  line: {}
});
