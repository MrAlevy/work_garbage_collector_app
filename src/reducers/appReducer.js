import { APP } from '../constants';

const initialState = {
  placeScreen: {
    suggestions: {
      isVisible: false,
      chosenId: '',
      data: [],
      takeFrom: ''
    },
    createdPoi: {
      type: 'container_place',
      address: '',
      coordinates: ''
    }
  }
};

export const appReducer = (state = initialState, action) => {
  switch (action.type) {
    case APP.PLACE_SCREEN_SET_SUGGESTIONS:
      return {
        ...state,
        placeScreen: {
          ...state.placeScreen,
          suggestions: action.payload
        }
      };
    case APP.PLACE_SCREEN_SET_CREATED_POI:
      return {
        ...state,
        placeScreen: {
          ...state.placeScreen,
          createdPoi: action.payload
        }
      };
    default:
      return state;
  }
};
