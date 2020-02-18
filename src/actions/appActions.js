import { APP } from '../constants';

export const placeScreenSetSuggestions = suggestions => ({
  type: APP.PLACE_SCREEN_SET_SUGGESTIONS,
  payload: suggestions
});

export const placeScreenSetCreatedPoi = createdPoi => ({
  type: APP.PLACE_SCREEN_SET_CREATED_POI,
  payload: createdPoi
});
