import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Modal,
  Button,
  StyleSheet,
  Dimensions,
  Picker
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Feather } from '@expo/vector-icons';
import uuidv4 from 'uuid/v4';
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';

import { AddFromDict } from './addWayPoint/AddFromDict';
import { AddNew } from './addWayPoint/AddNew';
import { SuggestionsList } from './addWayPoint/SuggestionsList';
import {
  addJournalWaypoint,
  updateJournalWaypoint,
  updateCreatedPoiDict
} from '../../../actions';
import { COLORS, BUTTON_GROUP, USUAL_BUTTON_1 } from '../../../styles';

const initialLayout = { width: Dimensions.get('window').width };

export const AddWayPointModal = props => {
  const dispatch = useDispatch();
  const journalStore = useSelector(state => state.journal);
  const journal = journalStore.journal;

  // Implement POI dictionaries
  const poiDict = useSelector(state => state.dicts.poi); // the main dictionary
  const newPoiDict = useSelector(state => state.dicts.newPoi); // the alt dictionary from users
  const createdPoiDict = useSelector(state => state.dicts.createdPoi); // the current user's dictionary

  const createdPoiStore = useSelector(
    state => state.app.placeScreen.createdPoi
  );
  const suggestions = useSelector(state => state.app.placeScreen.suggestions);

  // Tabs settings
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'first', title: 'справочник' },
    { key: 'second', title: 'новая' }
  ]);

  // Routes for tabs
  const renderScene = SceneMap({
    first: AddFromDict,
    second: AddNew
  });

  // Customize the tab bar styles
  const renderTabBar = props => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: 'white' }}
      style={{ backgroundColor: COLORS.menu }}
    />
  );

  // FUNC: Function for adding new waypoint from POI dictionary
  const addFromDict = () => {
    // Waypoint data
    const addingData = {
      id: uuidv4(),
      idPOI: suggestions.chosenId,
      isAddedByUser: 1
    };

    // If POI is 'container_place' - copy the containers to Waypoint
    const addingPoi = poiDict.items[suggestions.chosenId]; //FIXME:any of three dicts
    if (addingPoi.type === 'container_place' && 'containers' in addingPoi)
      addingData.containerWaste = addingPoi.containers;

    // Create new Waypoint
    dispatch(addJournalWaypoint(addingData));
  };

  // FUNC: Function for creating new POI and new waypoint for it
  const addNew = () => {
    // New POI Id
    const id = uuidv4();

    // New POI data from global store
    const createdPoi = {
      id,
      ...createdPoiStore
    };

    // Create new POI
    dispatch(updateCreatedPoiDict(id, createdPoi));

    // Create new Waypoint
    dispatch(
      addJournalWaypoint({
        id: uuidv4(),
        idPOI: id,
        isAddedByUser: 1
      })
    );
  };

  return (
    <Modal animationType='fade' transparent={true} visible={props.visible}>
      <View style={styles.addWayPointOuter}>
        <View style={styles.addWayPointModalCont}>
          <Text style={styles.headerText}>Выберите точку для добавления</Text>

          <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={initialLayout}
            renderTabBar={renderTabBar}
            style={{ height: '100%' }}
          />

          <SuggestionsList />

          <View style={[BUTTON_GROUP, styles.buttons, { zIndex: 1 }]}>
            <View style={USUAL_BUTTON_1}>
              <Button
                title='добавить'
                color={COLORS.buttons}
                onPress={index === 0 ? addFromDict : addNew}
              />
            </View>
            <View style={USUAL_BUTTON_1}>
              <Button
                title='закрыть'
                color={COLORS.buttons}
                onPress={props.handleClose}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  headerText: {
    fontSize: 15,
    height: 35,
    paddingVertical: 7,
    paddingHorizontal: 10
  },
  addWayPointOuter: {
    height: '100%',
    paddingTop: 65,
    backgroundColor: 'rgba(56, 56, 56, 0.8)'
  },
  addWayPointModalInner: {
    padding: 10
  },
  addWayPointModalCont: {
    width: '100%',
    height: 320,
    backgroundColor: '#ffffff'
  },
  addWayPointModalPicker: {
    height: 20,
    marginVertical: 5
  },
  addWayPointModalView: {
    marginBottom: 20
  },
  input: {
    borderBottomWidth: 1
  }
});
