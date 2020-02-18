import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { placeScreenSetSuggestions } from '../../../../actions';
import { WayPointInputs } from '../elements/WayPointInputs';

export const AddFromDict = () => {
  const dispatch = useDispatch();

  // Implement POI dictionaries
  const poiDict = useSelector(state => state.dicts.poi); // the main dictionary
  const newPoiDict = useSelector(state => state.dicts.newPoi); // the alt dictionary from users
  const createdPoiDict = useSelector(state => state.dicts.createdPoi); // the current user's dictionary

  // Global suggestions
  const suggestions = useSelector(state => state.app.placeScreen.suggestions);

  let usingDict = {};
  suggestions.takeFrom === 'poiDict'
    ? (usingDict = poiDict)
    : suggestions.takeFrom === 'newPoiDict'
    ? (usingDict = newPoiDict)
    : suggestions.takeFrom === 'createdPoiDict'
    ? (usingDict = createdPoiDict)
    : (usingDict = {});

  // Local state
  const [inputValue, setInputValue] = useState(''); // text for filtering addresses
  const [type, setType] = useState('container_place'); // container type for searching

  // After change the cont type - get suggestions
  useEffect(() => inputChange(inputValue), [type]);

  // Fill the input after chosen the need place from suggestions
  useEffect(() => {
    if (!('items' in usingDict) || !suggestions.chosenId.length) return;
    setInputValue(usingDict.items[suggestions.chosenId].address);
  }, [suggestions.chosenId]);

  // Function for input changing and get the suggestions list
  const inputChange = text => {
    setInputValue(text);

    // Function for SEARCHing and FILLing newSuggestions
    const fillSuggestions = (takeFromString, dict) => {
      for (let idPoi in dict.items) {
        takeFrom = takeFromString;
        if (
          dict.items[idPoi].type === type &&
          dict.items[idPoi].address.includes(text)
        ) {
          newSuggestions.push(idPoi);
        }
      }
    };

    const newSuggestions = []; // suggestions array for writing in store
    let takeFrom = ''; // indicate which dict was used

    // Clearing the store
    dispatch(
      placeScreenSetSuggestions({
        isVisible: false,
        chosenId: '',
        data: [],
        takeFrom: ''
      })
    );

    if (!text.length) return;

    // First - find in poiDict, second - find in newPoiDict, third - find in createdPoiDict
    fillSuggestions('poiDict', poiDict);
    if (!newSuggestions.length) {
      fillSuggestions('newPoiDict', newPoiDict);
    }
    if (!newSuggestions.length) {
      fillSuggestions('createdPoiDict', createdPoiDict);
    }
    if (!newSuggestions.length) {
      takeFrom = '';
    }

    dispatch(
      placeScreenSetSuggestions({
        isVisible: true,
        chosenId: '',
        data: newSuggestions,
        takeFrom: takeFrom
      })
    );
  };

  return (
    <WayPointInputs
      pickerValue={type}
      handlePickerChange={text => setType(text)}
      inputValue={inputValue}
      handleInputChange={text => inputChange(text)}
      iconName='map-pin'
      handleIconPress={() => {
        console.log('press map-pin icon');
      }}
      inputPrompt='начните вводить здесь'
    />
  );
};
