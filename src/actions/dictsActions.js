import { DICTS } from '../constants';

const getContTypesDictAction = dict => ({
  type: DICTS.GET_CONT_TYPES_DICT,
  payload: dict
});

const getGarbageGenDictAction = dict => ({
  type: DICTS.GET_GARBAGE_GEN_DICT,
  payload: dict
});

const getNewGarbageGenDictAction = dict => ({
  type: DICTS.GET_NEW_GARBAGE_GEN_DICT,
  payload: dict
});

const getPoiDictAction = dict => ({
  type: DICTS.GET_POI_DICT,
  payload: dict
});

const getNewPoiDictAction = dict => ({
  type: DICTS.GET_NEW_POI_DICT,
  payload: dict
});

export const getContTypesDict = (api, userData) => {
  return dispatch => {
    fetch(`${api}/checkconttypesdict`, {
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
          res.text().then(() => {
            console.log(`❌  error ${status} ❗ checkconttypesdict ❗ ${res}`);
            return;
          });
        } else {
          res.json().then(res => {
            console.log('✅  ContTypes dictionary received');
            dispatch(getContTypesDictAction(res));
          });
        }
      })
      .catch(err => {
        console.log('❌  error checkconttypesdict general: ', err);
      });
  };
};

export const getGarbageGenDict = (api, userData) => {
  return dispatch => {
    fetch(`${api}/checkgarbagegendict`, {
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
          res.text().then(() => {
            console.log(`❌  error ${status} ❗ checkgarbagegendict ❗ ${res}`);
            return;
          });
        } else {
          res.json().then(res => {
            console.log('✅  GarbageGen dictionary received');
            dispatch(getGarbageGenDictAction(res));
          });
        }
      })
      .catch(err => {
        console.log('❌  error checkgarbagegendict general: ', err);
      });
  };
};

export const getNewGarbageGenDict = (api, userData) => {
  return dispatch => {
    fetch(`${api}/checknewgarbagegendict`, {
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
          res.text().then(() => {
            console.log(
              `❌  error ${status} ❗ checknewgarbagegendict ❗ ${res}`
            );
            return;
          });
        } else {
          res.json().then(res => {
            console.log('✅  NewGarbageGen dictionary received');
            dispatch(getNewGarbageGenDictAction(res));
          });
        }
      })
      .catch(err => {
        console.log('❌  error checknewgarbagegendict general: ', err);
      });
  };
};

export const getPoiDict = (api, userData) => {
  return dispatch => {
    fetch(`${api}/checkpoidict`, {
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
          res.text().then(() => {
            console.log(`❌  error ${status} ❗ checkpoidict ❗ ${res}`);
            return;
          });
        } else {
          res.json().then(res => {
            console.log('✅  Poi dictionary received');
            dispatch(getPoiDictAction(res));
          });
        }
      })
      .catch(err => {
        console.log('❌  error checkpoidict general: ', err);
      });
  };
};

export const getNewPoiDict = (api, userData) => {
  return dispatch => {
    fetch(`${api}/checknewpoidict`, {
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
          res.text().then(() => {
            console.log(`❌  error ${status} ❗ checknewpoidict ❗ ${res}`);
            return;
          });
        } else {
          res.json().then(res => {
            console.log('✅  NewPoi dictionary received');
            dispatch(getNewPoiDictAction(res));
          });
        }
      })
      .catch(err => {
        console.log('❌  error checknewpoidict general: ', err);
      });
  };
};

export const updateCreatedGarbageGenDict = (id, newGarbageGen) => ({
  type: DICTS.UPDATE_CREATED_GARBAGE_GEN_DICT,
  id,
  newGarbageGen
});

export const updateCreatedPoiDict = (id, createdPoi) => ({
  type: DICTS.UPDATE_CREATED_POI_DICT,
  id,
  createdPoi
});

//DELETE:
export const updateNewGarbageGenDict = (id, newGarbageGen) => ({
  type: DICTS.UPDATE_NEW_GARBAGE_GEN_DICT,
  id,
  newGarbageGen
});
