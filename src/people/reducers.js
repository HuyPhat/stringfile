import { handleActions } from 'redux-actions';

import {
  FETCH_USER_CONNECTIONS,
  FETCH_USER_CONNECTIONS_FULFILLED,
  FETCH_USER_CONNECTIONS_REJECTED
} from './constants';

const defaultState = {
  fetching: false,
  filters: {
    showInactiveContacts: true,
    showRevokedFile: false
  }
};

const userConnectionsReducer = handleActions({
  FETCH_USER_CONNECTIONS: (s, a) => ({
    ...s,
    fetching: true
  }),
  FETCH_USER_CONNECTIONS_FULFILLED: (s, a) => ({
    fetching: false,
    payload: a.payload,
    filters: s.filters
  }),
  FETCH_USER_CONNECTIONS_REJECTED: (s, a) => ({
    fetching: false,
    error: a.payload
  })
}, defaultState);

export { userConnectionsReducer };
