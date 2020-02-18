import { JOURNAL } from '../constants';

const initialState = {
  journal: {},
  isFilled: false,
  journalIsLoading: false,
  journalError: ''
};

export const journalReducer = (state = initialState, action) => {
  switch (action.type) {
    case JOURNAL.GET_JOURNAL_SUCCESS:
      return { ...state, journal: action.payload, isFilled: true };
    case JOURNAL.GET_JOURNAL_IS_LOADING:
      return { ...state, journalIsLoading: action.payload };
    case JOURNAL.GET_JOURNAL_ERROR:
      return { ...state, journalError: action.payload };
    case JOURNAL.UPDATE_CONTAINER:
      return {
        ...state,
        journal: {
          ...state.journal,
          waypoints: state.journal.waypoints.map(waypoint => {
            if (waypoint.id === action.waypointId) {
              return {
                ...waypoint,
                containerWaste: waypoint.containerWaste.map(container => {
                  if (
                    container.containerTypeId ===
                      action.container.containerTypeId &&
                    container.garbageGeneratorId ===
                      action.container.garbageGeneratorId
                  ) {
                    return {
                      ...container,
                      ...action.container
                    };
                  } else {
                    return container;
                  }
                })
              };
            } else {
              return waypoint;
            }
          })
        }
      };
    case JOURNAL.UPDATE_WAYPOINT:
      return {
        ...state,
        journal: {
          ...state.journal,
          waypoints: state.journal.waypoints.map(waypoint => {
            if (waypoint.id === action.waypointId) {
              return {
                ...waypoint,
                ...action.newProps
              };
            } else {
              return waypoint;
            }
          })
        }
      };
    case JOURNAL.ADD_CONTAINER:
      return {
        ...state,
        journal: {
          ...state.journal,
          waypoints: state.journal.waypoints.map(waypoint => {
            if (waypoint.id === action.waypointId) {
              return {
                ...waypoint,
                containerWaste: [...waypoint.containerWaste, action.newCont]
              };
            } else {
              return waypoint;
            }
          })
        }
      };
    case JOURNAL.ADD_BULKY:
      return {
        ...state,
        journal: {
          ...state.journal,
          waypoints: state.journal.waypoints.map(waypoint => {
            if (waypoint.id === action.waypointId) {
              console.log('bulkyWaste::: ', waypoint.bulkyWaste);
              console.log('bulkyWaste.length::: ', waypoint.bulkyWaste.length);
              console.log('action.bulky::: ', action.bulky);
              let matchFound = false;
              if (
                waypoint.bulkyWaste.filter(
                  bulky =>
                    bulky.garbageGeneratorId === action.bulky.garbageGeneratorId
                ).length
              )
                matchFound = true;

              return {
                ...waypoint,
                bulkyWaste: matchFound
                  ? waypoint.bulkyWaste.map(bulky => {
                      return bulky.garbageGeneratorId ===
                        action.bulky.garbageGeneratorId
                        ? action.bulky
                        : bulky;
                    })
                  : [...waypoint.bulkyWaste, action.bulky]
              };
            } else {
              return waypoint;
            }
          })
        }
      };
    case JOURNAL.ADD_WAYPOINT:
      return {
        ...state,
        journal: {
          ...state.journal,
          waypoints: [...state.journal.waypoints, action.newWaypoint]
        }
      };
    case JOURNAL.REMOVE_JOURNAL:
      return initialState;
    default:
      return state;
  }
};
