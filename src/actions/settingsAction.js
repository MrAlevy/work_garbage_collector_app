import { SETTINGS } from '../constants';

export const setSettings = sets => ({
  type: SETTINGS.SET,
  payload: sets
});
