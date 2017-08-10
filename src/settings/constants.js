import ENV_VARIABLES from 'config/variables';

export const actions = {
  FETCH_USER_SETTINGS: 'FETCH_USER_SETTINGS',
  FETCH_USER_SETTINGS_FULFILLED: 'FETCH_USER_SETTINGS_FULFILLED',
  FETCH_USER_SETTINGS_REJECTED: 'FETCH_USER_SETTINGS_REJECTED',
  REQUEST_UPDATE_USER_SETTINGS: 'REQUEST_UPDATE_USER_SETTINGS',
  REQUEST_UPDATE_USER_SETTINGS_FULFILLED: 'REQUEST_UPDATE_USER_SETTINGS_FULFILLED',
  REQUEST_UPDATE_USER_SETTINGS_REJECTED: 'REQUEST_UPDATE_USER_SETTINGS_REJECTED'
};

export const ENDPOINT = {
  fetchUserSettings: {
    url: (uid) => `${ENV_VARIABLES.API_SERVER}user/${uid}/settings?email_status=0`,
    method: 'GET'
  },
  updateUserSettings: {
    method: 'POST',
    url: (uid) => `${ENV_VARIABLES.API_SERVER}user/${uid}/settings?`
  }
};
