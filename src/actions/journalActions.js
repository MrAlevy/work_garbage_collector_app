import { JOURNAL } from '../constants';
import { useSelector } from 'react-redux';

const getJournalSuccess = journal => ({
  type: JOURNAL.GET_JOURNAL_SUCCESS,
  payload: journal
});

const getJournalIsLoading = bool => ({
  type: JOURNAL.GET_JOURNAL_IS_LOADING,
  payload: bool
});

const getJournalError = err => ({
  type: JOURNAL.GET_JOURNAL_ERROR,
  payload: err
});

export const getJournal = (api, userData) => {
  return dispatch => {
    dispatch(getJournalError(''));
    dispatch(getJournalIsLoading(true));

    fetch(`${api}/checkroutejournal`, {
      method: 'POST',
      body: JSON.stringify(userData.body),
      headers: {
        'Content-Type': 'application/json',
        ...userData.headers
      }
    })
      .then(res => {
        if (!res.ok) {
          const status = res.status;
          res.text().then(res => {
            console.log(`❌  error ${status} ❗ checkroutejournal ❗ ${res}`);
            dispatch(getJournalError(`error status ${status} ${res}`));
            dispatch(getJournalIsLoading(false));
            return;
          });
        } else {
          if (res.status === 200) {
            res.json().then(res => {
              console.log('✅  Journal received');
              dispatch(getJournalSuccess(res));
              dispatch(getJournalIsLoading(false));
            });
          }
          if (res.status === 204) {
            console.log('✅  status 204 - Journal is empty');
            dispatch(
              getJournalSuccess({
                actualizationDate: 'date!',
                updateDate: 'date',
                waypoints: [],
                closed: 0
              })
            );
          }
        }
      })
      .catch(err => {
        console.log('❌  error checkroutejournal general: ', err);
        dispatch(getJournalError(err));
        dispatch(getJournalIsLoading(false));
      });
  };
};

export const updateJournalContainer = (waypointId, container) => ({
  type: JOURNAL.UPDATE_CONTAINER,
  waypointId,
  container
});

export const updateJournalWaypoint = (waypointId, newProps) => ({
  type: JOURNAL.UPDATE_WAYPOINT,
  waypointId,
  newProps
});

export const addJournalContainer = (waypointId, newCont) => ({
  type: JOURNAL.ADD_CONTAINER,
  waypointId,
  newCont
});

export const addJournalBulky = (waypointId, bulky) => ({
  type: JOURNAL.ADD_BULKY,
  waypointId,
  bulky
});

export const addJournalWaypoint = newWaypoint => ({
  type: JOURNAL.ADD_WAYPOINT,
  newWaypoint
});

export const removeJournal = () => ({
  type: JOURNAL.REMOVE_JOURNAL
});
