import ENV_VARIABLES from 'config/variables';

export const actions = {
  FETCH_USER_CONNECTIONS: 'FETCH_USER_CONNECTIONS',
  FETCH_USER_CONNECTIONS_FULFILLED: 'FETCH_USER_CONNECTIONS_FULFILLED',
  FETCH_USER_CONNECTIONS_REJECTED: 'FETCH_USER_CONNECTIONS_REJECTED'
};

export const END_POINT = {
  userConnections: {
    url: (uid) => `${ENV_VARIABLES.API_SERVER}user/${uid}/connections/sharing`,
    method: 'GET'
  }
};
