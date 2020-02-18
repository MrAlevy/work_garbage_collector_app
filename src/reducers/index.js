import { combineReducers } from 'redux';
import { journalReducer } from './journalReducer';
import { dictsReducer } from './dictsReducer.js';
import { settingsReducer } from './settingsReducer.js';
import { appReducer } from './appReducer';

export default combineReducers({
  journal: journalReducer,
  dicts: dictsReducer,
  settings: settingsReducer,
  app: appReducer
});
