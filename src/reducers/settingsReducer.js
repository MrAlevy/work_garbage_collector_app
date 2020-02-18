import { SETTINGS } from '../constants';

const initialState = {
  msisdn: '',
  vehicleNumber: '',
  api: ''
};

export const settingsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SETTINGS.SET:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};
