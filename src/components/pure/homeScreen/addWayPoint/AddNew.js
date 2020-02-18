import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { placeScreenSetCreatedPoi } from '../../../../actions';
import { WayPointInputs } from '../elements/WayPointInputs';

export const AddNew = () => {
  const dispatch = useDispatch();

  // New POI data in global store
  const createdPoi = useSelector(state => state.app.placeScreen.createdPoi);

  // Clear the old input data
  useEffect(() => {
    dispatch(
      placeScreenSetCreatedPoi({
        type: 'container_place',
        address: '',
        coordinates: ''
      })
    );
  }, []);

  // Function for dispatching new data
  const updateStore = (subj, newVal) =>
    dispatch(
      placeScreenSetCreatedPoi({
        ...createdPoi,
        [subj]: newVal
      })
    );

  return (
    <WayPointInputs
      pickerValue={createdPoi.type}
      handlePickerChange={text => updateStore('type', text)}
      inputValue={createdPoi.address}
      handleInputChange={text => updateStore('address', text)}
      iconName='crosshair'
      handleIconPress={() => {
        console.log('press crosshair icon');
      }}
      inputPrompt='введите здесь'
    />
  );
};
