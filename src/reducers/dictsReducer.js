import { DICTS } from '../constants';

const initialState = {
  // main from api
  contType: {},
  garbageGen: {},
  newGarbageGen: {},
  poi: {},
  newPoi: {},
  // additional from client only
  contTypeValues: {},
  createdGarbageGen: {},
  createdPoi: {}
};

export const dictsReducer = (state = initialState, action) => {
  // filling two things at once: contType and contTypeValues
  switch (action.type) {
    case DICTS.GET_CONT_TYPES_DICT:
      const contTypeValues = {};
      const contTypesDict = action.payload.items;

      for (type in contTypesDict) {
        if (contTypesDict[type].value in contTypeValues) {
          contTypeValues[contTypesDict[type].value].push(
            contTypesDict[type].id
          );
        } else {
          contTypeValues[contTypesDict[type].value] = [type];
        }
      }
      return {
        ...state,
        contType: action.payload,
        contTypeValues: contTypeValues
      };
    case DICTS.GET_GARBAGE_GEN_DICT:
      return { ...state, garbageGen: action.payload };
    case DICTS.GET_NEW_GARBAGE_GEN_DICT:
      return { ...state, newGarbageGen: action.payload };
    case DICTS.GET_POI_DICT:
      return { ...state, poi: action.payload };
    case DICTS.GET_NEW_POI_DICT:
      return { ...state, newPoi: action.payload };
    case DICTS.UPDATE_CREATED_GARBAGE_GEN_DICT:
      return {
        ...state,
        createdGarbageGen: {
          ...state.createdGarbageGen,
          [action.id]:
            action.id in state.createdGarbageGen
              ? {
                  ...state.createdGarbageGen[action.id],
                  ...action.newGarbageGen
                }
              : action.newGarbageGen
        }
        /*         garbageGen: {
          ...state.garbageGen,
          items: {
            ...state.garbageGen.items,
            [action.id]:
              action.id in state.garbageGen.items
                ? {
                    ...state.garbageGen.items[action.id],
                    ...action.newGarbageGen
                  }
                : action.newGarbageGen
          }
        } */
      };
    case DICTS.UPDATE_CREATED_POI_DICT:
      return {
        ...state,
        createdPoi: {
          ...state.createdPoi,
          [action.id]:
            action.id in state.createdPoi
              ? {
                  ...state.createdPoi[action.id],
                  ...action.createdPoi
                }
              : action.createdPoi
        }
      };
    default:
      return state;
  }
};
